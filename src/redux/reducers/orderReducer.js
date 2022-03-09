import {
  CREATE_ORDER, CREATE_ORDER_SUCCESS, SEND_EMAIL, CREATE_CHECKOUT,
  APPLY_COUPON, APPLY_COUPON_SUCCESS, CHECK_COUPON, VALID_COUPON_SUCCESS
} from 'constants/constants';

const defaultState = {
  order: {},
  mail: {}, 
  checkout : {},
  code:'',
  coupon: {},
  validCoupon: 'invalid' ,
  checkCoupon: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      return {
        ...state,
        order: action.payload
      };
    case CREATE_ORDER_SUCCESS:
        return {
          ...state,
          order: action.payload
        };
    case APPLY_COUPON:
        return {
          ...state,
          code: action.payload
        };
    case APPLY_COUPON_SUCCESS:
          return {
            ...state,
            coupon: action.payload
          };
    case CHECK_COUPON:
            return {
              ...state,
              checkCoupon: action.payload
            };
    case VALID_COUPON_SUCCESS:
              return {
                ...state,
                validCoupon: action.payload
              };
    case CREATE_CHECKOUT:
        return {
          ...state,
          checkout: action.payload
        };
    case SEND_EMAIL:
        return {
          ...state,
          mail: action.payload
        };
    
    default:
      return state;
  }
};
