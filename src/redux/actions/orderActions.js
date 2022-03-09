import {
  CREATE_ORDER, CREATE_ORDER_SUCCESS, SEND_EMAIL, CREATE_CHECKOUT, APPLY_COUPON, APPLY_COUPON_SUCCESS,
  CHECK_COUPON, VALID_COUPON_SUCCESS
} from 'constants/constants';


export const createOrder = (details) => ({
  type: CREATE_ORDER,
  payload: details
});

export const createCheckout = (details) => ({
  type: CREATE_CHECKOUT,
  payload: details
});

export const createOrderSuccess = (details) => ({
  type: CREATE_ORDER_SUCCESS,
  payload: details
});

export const applyCoupon = (details) => ({
  type: APPLY_COUPON,
  payload: details
});

export const applyCouponSuccess = (details) => ({
  type: APPLY_COUPON_SUCCESS,
  payload: details
});

export const checkValidCoupon = (details) => ({
  type: CHECK_COUPON,
  payload: details
});

export const validCouponSuccess = (details) => ({
  type: VALID_COUPON_SUCCESS,
  payload: details
});

export const sendEmail = (details) => ({
  type: SEND_EMAIL,
  payload: details
});

