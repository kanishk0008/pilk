const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { default: axios } = require("axios");

admin.initializeApp();

//get token from firestore
const getToken = async () => {
  return admin
    .firestore()
    .collection("shiprocket")
    .doc("token")
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data().token;
      } else {
        return "";
      }
    });
};

async function loginToShiprocket() {
  await axios
    .post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: "info@pilk.in",
        password: "Vsplpilk@2022",
      },
      {
        headers: {
          Authorization: "",
        },
      }
    )
    .then((response) => {
      const token = response.data.token;
      admin.firestore().collection("shiprocket").doc("token").set({ token });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    })
    .catch((error) => {
      console.log(error);
    });
}

function http(method, url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      data,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          loginToShiprocket();
          const retry = http(method, url, data);
          resolve(retry);
        } else {
          reject(err.response);
        }
      });
  });
}

exports.lowercaseProductName = functions.firestore
  .document("/products/{documentId}")
  .onCreate((snap, context) => {
    const name = snap.data().name;

    functions.logger.log(
      "Lowercasing product name",
      context.params.documentId,
      name
    );

    const lowercaseName = name.toLowerCase();

    return snap.ref.set({ name_lower: lowercaseName }, { merge: true });
  });

let startOfTheDay = new Date().setHours(0, 0, 0, 0).valueOf();
let endOfTheDay = new Date().setHours(23, 59, 59, 999).valueOf();

//difference of the day in milliseconds
const dayInMilliseconds = 86400000;

const getOrders = () => {
  return admin
    .firestore()
    .collection("orders")
    .where("fulfillment_ts", ">=", startOfTheDay)
    .where("fulfillment_ts", "<=", endOfTheDay)
    .orderBy("fulfillment_ts", "desc")
    .get();
  navigator;
};

const defaultMeasurements = {
  length: 21.5,
  breadth: 16.5,
  height: 14.5,
  weight: 2.8,
};

const differenceInTs = (ts1, ts2, days = 7) => {
  return Math.abs(ts1 - ts2) >= days * dayInMilliseconds;
};

//call shiprocket function from firebase scheduled function
exports.checkOrderScheduled = functions.pubsub
  .schedule("0 11 * * *") // 11:00 AM
  .timeZone("Asia/Kolkata")
  .onRun((context) => {
    const token = getToken();
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    getOrders()
      .then((orderSnapshot) => {
        let todayOrders = [];
        const units = 12,
          selling_price = 49;
        todayOrders = orderSnapshot.docs.map((order) => {
          return {
            orderId: order.id,
            ...order.data(),
          };
        });

        console.log("todayOrders::", todayOrders.length);
        if (todayOrders.length > 0) {
          todayOrders.forEach((order) => {
            const { total_quantity, created_date, fulfillment_ts } = order;
            if (
              !(fulfillment_ts <= endOfTheDay) ||
              !differenceInTs(fulfillment_ts, created_date, 7) ||
              !(total_quantity > 12)
            ) {
              console.log(
                `${order.orderId} is not eligible for shipment. fulfillment: ${fulfillment_ts} created: ${created_date} total_quantity: ${total_quantity}`
              );
              return;
            }
            const {
              orderId,
              address = "",
              pincode,
              email,
              name = "",
              phone,
              product_name,
            } = order;
            console.log("Order-Id::", orderId);
            const [fname = "", lname = ""] = name.split(" ");
            const fullAddress = address.split(",");
            const state = fullAddress.pop() || "";
            const city = fullAddress.pop() || "";
            let [add1 = "", ...add2] = fullAddress;
            const mobile = phone.slice(3);
            add2 = add2.join(",");

            const shprkt_body = {
              order_id: orderId,
              order_date: new Intl.DateTimeFormat("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(created_date),
              pickup_location: "Hermes Pickup",
              channel_id: "",
              comment: "Website Order",
              billing_customer_name: fname,
              billing_last_name: lname,
              billing_address: add1,
              billing_address_2: add2 || "",
              billing_city: city,
              billing_pincode: pincode,
              billing_state: state,
              billing_country: "India",
              billing_email: email,
              billing_phone: mobile,
              shipping_is_billing: true,
              shipping_customer_name: "",
              shipping_last_name: "",
              shipping_address: "",
              shipping_address_2: "",
              shipping_city: "",
              shipping_pincode: "",
              shipping_country: "",
              shipping_state: "",
              shipping_email: "",
              shipping_phone: "",
              order_items: [
                {
                  name: product_name,
                  sku: "Pilk Original " + 12,
                  units,
                  selling_price,
                  discount: "",
                  tax: 18,
                  hsn: 22029990,
                },
              ],
              payment_method: "Prepaid",
              shipping_charges: 0,
              giftwrap_charges: 0,
              transaction_charges: 0,
              total_discount: 0,
              sub_total: units * selling_price,
              ...defaultMeasurements,
            };

            http(
              "POST",
              "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
              shprkt_body
            )
              .then((resp) => console.log("response-->", resp.data))
              // .then(function (data) {})
              .catch(function (error) {
                console.log("Request failed", error.response);
              });
          });
        }
      })
      .catch((error) => {
        functions.logger.log("Error getting orders", error);
      });

    return 0;
  });

exports.generateShiprocketToken = functions.pubsub
  .schedule("0 0 * * 1") // Every Monday at 12:00 AM
  .timeZone("Asia/Kolkata")
  .onRun((context) => {
    loginToShiprocket();
    return 0;
  });
