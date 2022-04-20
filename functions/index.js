const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

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

const getOrders = () =>
  functions.firestore
    .collection("orders")
    .where("fulfillment_ts", ">=", startOfTheDay)
    .orderBy("fulfillment_ts", "desc")
    .get();

const defaultMeasurements = {
  length: 11,
  breadth: 11,
  height: 14.5,
  weight: 1,
};

const measurements = {
  4: { length: 11, breadth: 11, height: 14.5, weight: 1 },
  8: { length: 21.5, breadth: 11, height: 14.5, weight: 1.92 },
  12: { length: 21.5, breadth: 16.5, height: 14.5, weight: 2.8 },
};

//call shiprocket function from firebase scheduled function
exports.checkOrderScheduled = functions.pubsub
  .schedule("* * * * *") // (every minute)
  .onRun((context) => {
    const todayOrders = getOrders().then((orders) =>
      orders.map((order) => ({ id: order.id, ...order.data() }))
    );

    console.log("todayOrders", todayOrders);

    if (todayOrders.length > 0) {
      todayOrders.forEach((order) => {
        const { address = "", pincode, email, name = "", product_name } = order;
        const [fname = "", lname = ""] = name.split(" ");
        const [add1, add2, city, state] = address.split(",");

        const shprkt_body = {
          order_id: data.id,
          order_date: new Intl.DateTimeFormat("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(Date.now()),
          pickup_location: "Hermes Pickup",
          channel_id: "",
          comment: "Website Order",
          billing_customer_name: fname,
          billing_last_name: lname,
          billing_address: add1,
          billing_address_2: add2,
          billing_city: city,
          billing_pincode: pincode,
          billing_state: state,
          billing_country: "India",
          billing_email: email,
          billing_phone: "9876543210",
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
              sku: "Pilk Original " + order["quantity"],
              units: order["quantity"],
              selling_price: 49,
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
          sub_total: payment_amount,
          ...(measurements[order["quantity"]] || defaultMeasurements),
        };

        fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
          method: "post",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Bearer " + process.env.SHPRKT_TKN,
          },
          body: JSON.stringify(shprkt_body),
        })
          .then((resp) => resp.json())
          .then(function (data) {})
          .catch(function (error) {
            console.log("Request failed", error);
          });
      });
    }
  });
