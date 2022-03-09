/* eslint-disable indent */
import create from '@ant-design/icons/lib/components/IconFont';
import {
  CREATE_ORDER, SEND_EMAIL, CREATE_CHECKOUT, APPLY_COUPON, CHECK_COUPON
} from 'constants/constants';
import { ADMIN_PRODUCTS } from 'constants/routes';
import { displayActionMessage } from 'helpers/utils';
import {
  all, call, put, select
} from 'redux-saga/effects';
import { setLoading, setRequestStatus } from 'redux/actions/miscActions';
import { history } from 'routers/AppRouter';
import firebase from 'services/firebase';
import {
  createOrder, createOrderSuccess, sendEmail, createCheckout, applyCoupon, applyCouponSuccess, validCouponSuccess
} from '../actions/orderActions';

function* initRequest() {
  yield put(setLoading(true));
  yield put(setRequestStatus(null));
}

function* handleError(e) {
  yield put(setLoading(false));
  yield put(setRequestStatus(e?.message || 'Failed to fetch products'));
  console.log('ERROR: ', e);
}

function* handleAction(location, message, status) {
  if (location) yield call(history.push, location);
  yield call(displayActionMessage, message, status);
}

function* orderSaga({ type, payload }) {
  switch (type) {
    
    case CREATE_ORDER: {
      try {
        yield initRequest();

        const key = yield call(firebase.generateKey);
        
        const product = {
          ...payload
        };
        console.log("CREATING ORDER EMAIL")

        yield call(firebase.createOrder, key, product);
        yield put(createOrderSuccess({
          id: key,
          ...product
        }));
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }

    case APPLY_COUPON: {
      try {
        yield initRequest();
        
        const coupon = {
          ...payload
        };

        const result = yield call(firebase.applyCoupon, coupon);
        if(result != null) {
          yield put(applyCouponSuccess({
            ...result
          }));
        } else {
          const result = {"error": "Invalid Coupon Code"}
          yield put(applyCouponSuccess({
            ...result
          }));
        }
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }

    case CHECK_COUPON: {
      try {
        yield initRequest();
        
        const coupon = {
          ...payload
        };

        const result = yield call(firebase.checkValidCoupon, coupon);
        console.log("ORDER SAGA COUPON " + result)
        yield put(validCouponSuccess({
          ...result
        }));
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }

    case CREATE_CHECKOUT: {
      try {
        yield initRequest();

        const key = yield call(firebase.generateKey);
        
        const product = {
          ...payload
        };
        console.log("CREATING ORDER EMAIL")

        yield call(firebase.createCheckout, key, product);
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }

    case SEND_EMAIL: {
      try {
        yield initRequest();

        const key = yield call(firebase.generateKey);
        
        const email = {
          ...payload
        };

        console.log("SENDING EMAIL")

        yield call(firebase.sendEmail, key, email);
        yield put(setLoading(false));
      } catch (e) {
        yield handleError(e);
        yield handleAction(undefined, `Item failed to add: ${e?.message}`, 'error');
      }
      break;
    }
    default: {
      throw new Error(`Unexpected action type ${type}`);
    }
  }
}

export default orderSaga;
