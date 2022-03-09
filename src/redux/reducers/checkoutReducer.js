import {
  ORDER_CONFIRM,
  RESET_CHECKOUT, SET_CHECKOUT_PAYMENT_DETAILS, SET_CHECKOUT_SHIPPING_DETAILS
} from 'constants/constants';

const defaultState = {
  shipping: {},
  payment: {
    type: 'paypal',
    name: '',
    cardnumber: '',
    expiry: '',
    ccv: ''
  },
  order: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_CHECKOUT_SHIPPING_DETAILS:
      return {
        ...state,
        shipping: action.payload
      };
    case SET_CHECKOUT_PAYMENT_DETAILS:
      return {
        ...state,
        payment: action.payload
      };
    case ORDER_CONFIRM:
      return {
        ...state,
        order: action.payload
      };
    case RESET_CHECKOUT:
      return defaultState;
    default:
      return state;
  }
};
