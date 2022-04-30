import axios from "axios";

const shprkt_axios = axios.create();

/* eslint-disable no-nested-ternary */
export const displayDate = (timestamp) => {
  const date = new Date(timestamp);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // return day + ' ' + monthNames[monthIndex] + ' ' + year;
  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

export const displayMoney = (n) => {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });

  // or use toLocaleString()
  return format.format(n);
};

export const calculateTotal = (arr) => {
  if (!arr || arr?.length === 0) return 0;

  const total = arr.reduce((acc, val) => acc + val, 0);

  return total.toFixed(2);
};

export const displayActionMessage = (msg, status = "info") => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.className = `toast ${
    status === "info"
      ? "toast-info"
      : status === "success"
      ? "toast-success"
      : "toast-error"
    // eslint-disable-next-line indent
  }`;
  span.className = "toast-msg";
  span.textContent = msg;
  div.appendChild(span);

  if (document.querySelector(".toast")) {
    document.body.removeChild(document.querySelector(".toast"));
    document.body.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  setTimeout(() => {
    try {
      document.body.removeChild(div);
    } catch (e) {
      console.log(e);
    }
  }, 3000);
};

export async function loginToShiprocket() {
  await shprkt_axios
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
      const { token } = response.data;
      shprkt_axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      console.log("token", token);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function shprktHttp(method, url, data, isRetry = false) {
  return new Promise((resolve, reject) => {
    shprkt_axios({
      method,
      url,
      data,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        if (err.response.status === 401 && !isRetry) {
          loginToShiprocket();
          const retry = http(method, url, data, true);
          resolve(retry);
        } else {
          reject(err.response);
        }
      });
  });
}
