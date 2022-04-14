import { CHECKOUT_STEP_1, ORDER_STATUS } from 'constants/routes';
import { Form, Formik } from 'formik';
import { displayActionMessage } from 'helpers/utils';
import { useDocumentTitle, useScrollTop } from 'hooks';
import PropType from 'prop-types';
import React , { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import CreditPayment from './CreditPayment';
import RazorPayPayment from './RazorPayPayment';
import Total from './Total';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmOrder } from 'redux/actions/checkoutActions';
import { createOrder, sendEmail, applyCoupon, applyCouponSuccess, validCouponSuccess } from 'redux/actions/orderActions';
import { LoadingOutlined } from '@ant-design/icons';
import { MessageDisplay } from 'components/common';
import { displayMoney } from 'helpers/utils';
import { HEADLINE_OFFER } from 'constants/constants'
import { Modal, Button } from "react-bootstrap";
import firebase from 'services/firebase';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { clearBasket } from 'redux/actions/basketActions';
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import ReactGA from 'react-ga4';
// import Razorpay from 'razorpay';

const FormSchema = Yup.object().shape({
  type: Yup.string().required('Please select payment mode')
});

const Payment = ({ basket, shipping, payment, subtotal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useDocumentTitle('Check Out Payment | Pilk');
  useScrollTop();

  const rzrpy = useRazorpay();

  const [show, setShow] = useState(false);
  const projectId = process.env.FIREBASE_PROJECT_ID
  const rzp_key = process.env.RZP_KEY

  const sevenDayInterval = 604800000
  const tenDayInterval = 864000000
  const frtenDayInterval = sevenDayInterval * 2
  const twntDayInterval = tenDayInterval * 2
  const twnt1DayInterval = sevenDayInterval * 3

  var prod;

  basket.map((product) => {
    prod = product
  })

  const handleClose = () => { setShow(false) };

  const initFormikValues = {
    name: payment.name || '',
    cardnumber: payment.cardnumber || '',
    expiry: payment.expiry || '',
    ccv: payment.ccv || '',
    type: payment.type || 'paypal'
  };

  useEffect(() => {
    setTimeout(() => onConfirm(), 100);
    // ReactGA.pageview("/checkout/step3")
    ReactGA.send({ hitType: "pageview", page: "/checkout/step3"});
	}, []);	

  const { coupon, validCoupon } = useSelector((state) => ({
    coupon: state.order.coupon,
    validCoupon: state.order.validCoupon
  }));

  const onConfirm = () => {
    setShow(true)
    var discount = 0
    var bypasPayment = false
    if(coupon["code"] != undefined && coupon["discount"] != undefined && validCoupon["status"] == "valid") {
      if(coupon["discount_type"] == "pc") {
        discount = (subtotal * coupon["discount"])/100
      }
      console.log("BYPAS PAYMNT " + bypasPayment + " " + coupon["code"])
      if(coupon["code"] == "PILK100X") {
        bypasPayment = true
        setShow(false)
      }

    }
    const payment_amount = Math.round(((subtotal - discount) * 100) * 100) / 100;
    const self = this;

    const url = "https://us-central1-"+projectId+".cloudfunctions.net/rzp-create-order";
    
    const body = {'amount': payment_amount}

    console.log("BYPAS PAYMNT " + bypasPayment + " " + coupon["code"])

    if (bypasPayment) {
      const order = {"payment_id": "100xpayment"}
          order["name"] = shipping.fullname
          order["email"] = shipping.email
          order["address"] = shipping.flat + ", " + shipping.area + ", " + shipping.city + ", " + shipping.state
          order["pincode"] = shipping.pincode
          order["phone"] = "+"+shipping.mobile.value
          order["product_id"] = prod.id
          order["product_name"] = prod.name
          order["created_date"] = Date.now()
          order["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())
          order["fulfillment_ts"] = Date.now()
          order["order_id"] = "100xorder"
          order["total_quantity"] = prod.selectedSize
          order["quantity"] = prod.selectedSize
          if (coupon["code"] != undefined && coupon["discount"] != undefined && validCoupon["status"] == "valid") {
            order["coupon_id"] = coupon["id"]
            order["coupon"] = coupon["code"]
            order["discount"] = coupon["discount"]

            if(firebase.auth.currentUser) {
              firebase.setCouponForUser(coupon["id"], coupon)
            }
          }
          if (prod.selectedSize == 24) {
            order["quantity"] = 12
            const order2 = Object.assign({}, order)
            order2["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + frtenDayInterval)
            order2["fulfillment_ts"] = Date.now() + frtenDayInterval
            dispatch(createOrder(order2));
          } else if (prod.selectedSize == 36) {
            order["quantity"] = 12
            const order2 = Object.assign({}, order)
            order2["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + tenDayInterval)
            order2["fulfillment_ts"] = Date.now() + tenDayInterval
            dispatch(createOrder(order2));

            const order3 = Object.assign({}, order)
            order3["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + twntDayInterval)
            order3["fulfillment_ts"] = Date.now() + twntDayInterval
            dispatch(createOrder(order3));
          } else if (prod.selectedSize == 48) {
            order["quantity"] = 12
            const order2 = Object.assign({}, order)
            order2["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + sevenDayInterval)
            order2["fulfillment_ts"] = Date.now() + sevenDayInterval
            dispatch(createOrder(order2));

            const order3 = Object.assign({}, order)
            order3["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + frtenDayInterval)
            order3["fulfillment_ts"] = Date.now() + frtenDayInterval
            dispatch(createOrder(order3));

            const order4 = Object.assign({}, order)
            order4["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + twnt1DayInterval)
            order4["fulfillment_ts"] = Date.now() + twnt1DayInterval
            dispatch(createOrder(order4));
          }

          const msg = {"subject": "Pilk Order Confirmed"}
          msg["text"] = getEmailTemplate("100X Order")
          msg["html"] = getEmailTemplate("100X Order")
          const mail = {"to": shipping.email}
          mail["message"] = msg

          ReactGA.event({
            category: "CHECKOUT 3",
            action: "PAYMENT SUCCESS",
            label: "ORDER CONFIRMED", 
            value: 5
          })

          dispatch(createOrder(order));
          dispatch(confirmOrder(order))
          dispatch(sendEmail(mail))
          dispatch(applyCoupon({}))
          dispatch(applyCouponSuccess({"status":"invalid"}))
          dispatch(validCouponSuccess({"status":"invalid"}))
          dispatch(clearBasket())

          history.push(ORDER_STATUS)
    } else {

    fetch(url, {
      method: 'post',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body)
    })
    .then(resp =>  resp.json())
    .then(function (data) {
      console.log('Request succeeded with JSON response', data);
      setShow(false)
      const options = {
        key: rzp_key,
        amount: payment_amount,
        order_id: data.id,
        name: 'Pilk - Payments',
        description: 'The Plant Milk',
  
        handler(response) {
          const paymentId = response.razorpay_payment_id;
          // const url = process.env.URL+'/api/v1/rzp_capture/'+paymentId+'/'+payment_amount;
          const order = {"payment_id": paymentId}
          order["name"] = shipping.fullname
          order["email"] = shipping.email
          order["address"] = shipping.flat + ", " + shipping.area + ", " + shipping.city + ", " + shipping.state
          order["pincode"] = shipping.pincode
          order["phone"] = "+"+shipping.mobile.value
          order["product_id"] = prod.id
          order["product_name"] = prod.name
          order["created_date"] = Date.now()
          order["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now())
          order["fulfillment_ts"] = Date.now()
          order["order_id"] = data.id
          order["total_quantity"] = prod.selectedSize
          order["quantity"] = prod.selectedSize
          if (coupon["code"] != undefined && coupon["discount"] != undefined && validCoupon["status"] == "valid") {
            order["coupon_id"] = coupon["id"]
            order["coupon"] = coupon["code"]
            order["discount"] = coupon["discount"]

            if(firebase.auth.currentUser) {
              firebase.setCouponForUser(coupon["id"], coupon)
            }
          }
          if (prod.selectedSize == 24) {
            order["quantity"] = 12
            const order2 = Object.assign({}, order)
            order2["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + frtenDayInterval)
            order2["fulfillment_ts"] = Date.now() + frtenDayInterval
            dispatch(createOrder(order2));
          } else if (prod.selectedSize == 36) {
            order["quantity"] = 12
            const order2 = Object.assign({}, order)
            order2["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + tenDayInterval)
            order2["fulfillment_ts"] = Date.now() + tenDayInterval
            dispatch(createOrder(order2));

            const order3 = Object.assign({}, order)
            order3["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + twntDayInterval)
            order3["fulfillment_ts"] = Date.now() + twntDayInterval
            dispatch(createOrder(order3));
          } else if (prod.selectedSize == 48) {
            order["quantity"] = 12
            const order2 = Object.assign({}, order)
            order2["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + sevenDayInterval)
            order2["fulfillment_ts"] = Date.now() + sevenDayInterval
            dispatch(createOrder(order2));

            const order3 = Object.assign({}, order)
            order3["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + frtenDayInterval)
            order3["fulfillment_ts"] = Date.now() + frtenDayInterval
            dispatch(createOrder(order3));

            const order4 = Object.assign({}, order)
            order4["fulfillment_date"] = new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now() + twnt1DayInterval)
            order4["fulfillment_ts"] = Date.now() + twnt1DayInterval
            dispatch(createOrder(order4));
          }

          const msg = {"subject": "Pilk Order Confirmed"}
          msg["text"] = getEmailTemplate(data.id)
          msg["html"] = getEmailTemplate(data.id)
          const mail = {"to": shipping.email}
          mail["message"] = msg

          ReactGA.event({
            category: "CHECKOUT 3",
            action: "PAYMENT SUCCESS",
            label: "ORDER CONFIRMED", 
            value: 5
          })

          const fname = shipping.fullname.split(' ')[0]

          var lname = "."
          if (shipping.fullname.split(' ').count > 0) {
            lname = shipping.fullname.split(' ')[1]
          }

          const shprkt_body = { "order_id": data.id,
          "order_date": new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now()),
          "pickup_location": "Hermes Pickup",
          "channel_id": "",
          "comment": "Website Order",
          "billing_customer_name": fname,
          "billing_last_name": lname,
          "billing_address": shipping.flat,
          "billing_address_2": shipping.area,
          "billing_city": shipping.city,
          "billing_pincode": shipping.pincode,
          "billing_state": shipping.state,
          "billing_country": "India",
          "billing_email": shipping.email,
          "billing_phone": "9876543210",
          "shipping_is_billing": true,
          "shipping_customer_name": "",
          "shipping_last_name": "",
          "shipping_address": "",
          "shipping_address_2": "",
          "shipping_city": "",
          "shipping_pincode": "",
          "shipping_country": "",
          "shipping_state": "",
          "shipping_email": "",
          "shipping_phone": "",
          "order_items": [
            {
              "name": prod.name,
              "sku": "Pilk Original " + order["quantity"],
              "units": order["quantity"],
              "selling_price": payment_amount,
              "discount": "",
              "tax": "",
              "hsn": 22029990
            }
          ],
          "payment_method": "Prepaid",
          "shipping_charges": 0,
          "giftwrap_charges": 0,
          "transaction_charges": 0,
          "total_discount": 0,
          "sub_total": 9000,
          "length": 10,
          "breadth": 15,
          "height": 20,
          "weight": 2.5}
          fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: 'post',
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": "Bearer " + process.env.SHPRKT_TKN
            },
            body: JSON.stringify(body)
          })
          .then(resp =>  resp.json())
          .then(function (data) {

          })
          .catch(function (error) {
            console.log('Request failed', error);
          });

          dispatch(createOrder(order));
          dispatch(confirmOrder(order))
          dispatch(sendEmail(mail))
          dispatch(applyCoupon({}))
          dispatch(applyCouponSuccess({"status":"invalid"}))
          dispatch(validCouponSuccess({"status":"invalid"}))
          dispatch(clearBasket())

          history.push(ORDER_STATUS)
        },
  
        prefill: {
          name: shipping.fullname,
          email: shipping.email,
          contact: "+"+shipping.mobile.value
        },
        notes: {
          address: shipping.city,
        },
        theme: {
          color: '#5780e5',
        },
      };
      const rzp1 = new rzrpy(options);
      
      rzp1.open();
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
  }

  };

  const getEmailTemplate = (orderId) => {
      return '<style type=text/css> @media screen { @font-face { font-family: "Source Sans Pro"; font-style: normal; font-weight: 400; src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");}' + 
       ' @font-face { font-family: "Source Sans Pro"; font-style: normal; font-weight: 700; src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");}}' +
        'body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }' + 
        ' table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt;} img { -ms-interpolation-mode: bicubic;}' +
        ' a[x-apple-data-detectors] { font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important; }' +
        ' a {text-decoration: none !important; } div[style*="margin: 16px 0;"] { margin: 0 !important; } body { width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; } table { border-collapse: collapse !important; } ' +
       ' a { color: #1a82e2; } img { height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none; }' +
        '</style></head> <body><div class=preheader style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> Your Pilk order is confirmed, please find the details below. </div> <table border=0 cellpadding=0 cellspacing=0 width=100%><tr> <td align=center> ' +
        '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '<tr> ' +
              '<td align="center" valign="top" width="600"> ' + 
              '<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"> ' + 
              '<tr> ' + 
              '<td align=center valign=top style="border-top: 3px solid #5780E5;border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <a href=https://www.pilk.in target=_blank style="display: inline-block;"> <img src=https://firebasestorage.googleapis.com/v0/b/pilk-1.appspot.com/o/Pilk_tm_pilk%20blue.png?alt=media&token=f8008e29-1f7c-46f4-bcc6-819ae217b405 alt=Logo border=0 width=48 style="display: block; width: 125px; max-width: 125px; min-width: 48px;"> </a>' + 
              '</td>' + 
              ' </tr> ' +  
              '</table> '+ 
              ' </td>' +
              '</tr>' +
              '</table>' +
              '</td> </tr> <tr> <td align=center>' +
              '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '<tr>' +
              '<td align="center" valign="top" width="600">' +
              '<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"> <tr> <td align=center style="font-family: ' + "'Source Sans Pro'" + ' Helvetica, Arial, sans-serif; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <img src=https://firebasestorage.googleapis.com/v0/b/pilk-1.appspot.com/o/order-confirmed.png?alt=media&amp;token=5ba06a7b-cca8-4322-9453-f88d64d37f25 alt=Pilk-confirmed border=0 style="display: block; max-width: 590px;"> </td> </tr> </table> ' +
              '</td>' +
              '</tr>' +
              '</table>' +
              '</td> </tr> <tr> <td align=center> ' +
              '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '<tr>' +
              '<td align="center" valign="top" width="600">' +
              '<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"> <tr> <td align=left style="padding: 36px 24px 0; font-family: '+ " 'Source Sans Pro'" + ' Helvetica, Arial, sans-serif; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Thank you for your order!</h1> </td> </tr> </table> ' +
              '</td>' +
              '</tr>' +
              '</table>' + 
              '</td> </tr>  <tr> <td align=center> ' + 
              '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' + 
              '<tr>' + 
              '<td align="center" valign="top" width="600">' + 
              ' <table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"><tr> <td align=left style="padding: 24px; font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <p style="margin: 0;">Your order will be delivered within 3-4 days. Here is a summary of your recent order. If you have any questions or concerns about your order, please reply.</p> </td> </tr>  <tr> <td align=left style="padding: 24px; font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <table border=0 cellpadding=0 cellspacing=0 width=100%> <tr> <td align=left bgcolor=#5780E5 width=75% style="padding: 12px;font-family: ' + "'Source Sans Pro'"  + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Order Id</strong></td> <td align=left bgcolor=#5780E5 width=25% style="padding: 12px;font-family: '+ "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>'+ orderId + '</strong></td> </tr> <tr> <td align=left width=75% style="padding: 6px 12px;font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">'+ "Pilk Original - "+ prod.selectedSize + ' bottles' + '</td> <td align=left width=25% style="padding: 6px 12px;font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> ' + displayMoney(subtotal) + '</td> </tr> <tr> <td align=left width=75% style="padding: 6px 12px;font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">Shipping</td> <td align=left width=25% style="padding: 6px 12px;font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">0.00</td> </tr> <tr> <td align=left width=75% style="padding: 12px; font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>Total</strong></td> <td align=left width=25% style="padding: 12px; font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #D2C7BA; border-bottom: 2px dashed #D2C7BA;"><strong>' + displayMoney(subtotal) +' </strong></td> </tr> </table> </td> </tr>  </table> ' + 
              '</td>' + 
              '</tr>' + 
              '</table>' + 
              ' </td> </tr>  <tr> <td align=center valign=top width=100%>' + 
              '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' + 
              '<tr>' + 
              '<td align="center" valign="top" width="600">' + 
              '<table align=center border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;" bgcolor=" #fff5c4"> <tr> <td align=center valign=top style="font-size: 0; border-bottom: 3px solid #5780E5"> ' + 
              '<table align="center" border="0" cellpadding="0" cellspacing="0" width="590">' + 
                    '<tr>' + 
                    '<td align="left" valign="top" width="295">' + 
                    '<div style="display: inline-block; width: 100%; max-width: 50%; min-width: 240px; vertical-align: top;"> <table align=left border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 300px;"> <tr> <td align=left valign=top style="padding-bottom: 36px; padding-left: 36px; font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p><strong>Delivery Address</strong></p> <p>' + shipping.flat + ", " + shipping.area + ",<br/> " + shipping.city + ", " + shipping.state + "<br/>" + shipping.pincode + '</p> </td> </tr> </table> </div> ' + 
                    '</td>' +  
                    '<td align=""left" valign="top" width="295">' +  
                    '"<div style="display: inline-block; width: 100%; max-width: 50%; min-width: 240px; vertical-align: top;"> <table align=left border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 300px;"> <tr> <td align=left valign=top style="padding-bottom: 36px; padding-left: 36px; font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p><strong>Billing Address</strong></p> <p>'  + shipping.flat + ", " + shipping.area + ",<br/> " + shipping.city + ", " + shipping.state + "<br/>" + shipping.pincode + '</p> </td> </tr> </table> </div> ' + 
                    '</td>' + 
                    '</tr>' + 
                    '</table>' + 
                    '</td> </tr> </table> ' + 
              '</td>' +
              '</tr>' +
              '</table>' +
              '</td> </tr>  <tr> <td align=center style="padding: 24px; "> ' +
              '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
              '<tr>' +
              '<td align="center" valign="top" width="600">' +
              '<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;"> <tr> <td align=center style="padding: 12px 24px; font-family: ' + " 'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">You received this email because we received an order from your account. If you didn not order you can safely delete this email.</p> </td> </tr> '+
              '<tr> <td align=center style="padding: 12px 24px; font-family: '+ "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <a href=https://www.pilk.in>www.pilk.in</a> </td> </tr>  </table> ' +
              '</td> </tr> </table> </td> </tr> </table> </body> </html>' 
  }

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className='content'>
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
    <div className="checkout">
      {/* <LoadingOutlined style={{ fontSize: '3rem' }} />
      <MessageDisplay
                message="Loading"
                buttonLabel="Try Again"
              /> */}
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        validate={(form) => {
          
        }}
        onSubmit={onConfirm}
      >
        {() => (
          <Form className="checkout-step-3">
            {/* <CreditPayment /> */}
            <RazorPayPayment />
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>

      <Modal show={show} centered className="text-center" backdrop="static">
        <Modal.Body>
          <h2 className="text-center">Loading</h2>
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string
  }).isRequired,
  subtotal: PropType.number.isRequired
};

export default withCheckout(Payment);


// if (form.type === 'paypal') {
//   displayActionMessage('Feature not ready yet :)', 'info');
// }

// name: Yup.string()
//     .min(4, 'Name should be at least 4 characters.')
//     .required('Name is required'),
//   cardnumber: Yup.string()
//     .min(13, 'Card number should be 13-19 digits long')
//     .max(19, 'Card number should only be 13-19 digits long')
//     .required('Card number is required.'),
//   expiry: Yup.date()
//     .required('Credit card expiry is required.'),
//   ccv: Yup.string()
//     .min(3, 'CCV length should be 3-4 digit')
//     .max(4, 'CCV length should only be 3-4 digit')
//     .required('CCV is required.'),