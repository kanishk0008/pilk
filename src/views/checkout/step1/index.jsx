import { ArrowRightOutlined, ShopOutlined } from '@ant-design/icons';
import { BasketItem } from 'components/basket';
import { CHECKOUT_STEP_1, CHECKOUT_STEP_2, SIGNIN } from 'constants/routes';
import { displayMoney } from 'helpers/utils';
import { useDocumentTitle, useScrollTop } from 'hooks';
import PropType from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import { Field, Form, Formik } from 'formik';
import { CustomInput, CustomMobileInput } from 'components/formik';
import ReactGA from 'react-ga4';
import { HEADLINE_OFFER } from 'constants/constants';
import firebase from 'services/firebase';
import { Modal, Button } from "react-bootstrap";
import { setRedirect } from 'redux/actions/miscActions';
import { applyCoupon, createCheckout, checkValidCoupon, applyCouponSuccess, validCouponSuccess } from 'redux/actions/orderActions';
import * as Yup from 'yup';
import { LoadingOutlined } from '@ant-design/icons';


const FormSchema = Yup.object().shape({
  couponCode: Yup.string()
    .required('Coupon Code is required.')
    .min(2, 'Coupon Code must be at least 2 characters long.')
});

const OrderSummary = ({ basket, subtotal }) => {
  useDocumentTitle('Check Out Step 1 | Pilk');
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();
  const onClickPrevious = () => { 
    setShow(false)
    setShowCouponError(false)
    setShowCouponSuccess(false)
    setShowLoader(false)
    setLoaderShown(false)
    setLoginClosed(false)
    setCheckCoupon(false)
    setCouponApplied(false)
    setCouponModalClosed(false)
    dispatch(applyCouponSuccess({"status":""}))
    dispatch(validCouponSuccess({"status":""}))
    history.push('/'); 
  }
  const onClickNext = () => { 
    ReactGA.event({
			category: "CHECKOUT 1",
			action: "NEXT",
			label: "Next Step", 
			value: 3
		})
    history.push(CHECKOUT_STEP_2); }
  const { redirect, coupon, validCoupon } = useSelector((state) => ({
    redirect: state.app.redirect,
    coupon: state.order.coupon,
    validCoupon: state.order.validCoupon
  }));

  const [subTotal, setSubTotal] = useState('');
  const [show, setShow] = useState(false);
  const [loginClosed, setLoginClosed] = useState(false);
  const [showCouponError, setShowCouponError] = useState(false);
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  const [couponModalClosed, setCouponModalClosed] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderShown, setLoaderShown] = useState(false);
  const [checkCoupon, setCheckCoupon] = useState(false);

  const handleClose = () => { 
    setShow(false) 
    setLoginClosed(true)
  };
  const handleCloseCouponError = () => { 
    setShowCouponError(false) 
    setCouponModalClosed(true)
  };
  const handleCloseCouponSuccess = () => { 
    setShowCouponSuccess(false) 
    setCouponModalClosed(true)
  };

  const handleLogin = (event) => {
    event.preventDefault()
    sessionStorage.setItem('setRedirect', "TRUE");
    setShow(false);
    ReactGA.event({
			category: "CHECKOUT 1",
			action: "SIGNIN",
			label: "SIGNIN", 
			value: 3
		})
    history.push(SIGNIN);
		
  }

  // const keys = Object.keys(validCoupon)
  // Object.entries(validCoupon).map(([key,value])=>{
  //   console.log("KEYS " + key)
  // })

  var code;

  if (coupon["code"] != undefined) {
    code = coupon["code"]
    if(firebase.auth.currentUser) {
      if(!couponApplied && coupon["discount"] != undefined) {
        if(validCoupon["status"] == "valid") {
          if(showLoader) {
            setShowLoader(false)
          }
          if(!showCouponSuccess && !couponModalClosed) {
            setShowCouponSuccess(true)
          }
          var st = subtotal
          if(coupon["discount_type"] == "pc") {
            st = subtotal - (subtotal * coupon["discount"])/100
          }
          setSubTotal(st)
          setCouponApplied(true)
        } else if (validCoupon["status"] == "invalid"){
          if(!showCouponError && !couponModalClosed) {
            code = ''
            setShowLoader(false)
            setShowCouponError(true)
          }
        } else {
          console.log("CHECK COUPON " + checkCoupon)
          if(!checkCoupon) {
            dispatch(checkValidCoupon(coupon))
            setCheckCoupon(true)
          }
        }
      }
      if(show) {
        setShow(false)
      }

    } else {
      if(!show && !loginClosed) {
        setShowLoader(false)
        setShow(true)
      }
    }
  } else if (coupon["error"] != undefined) {
    if(!showCouponError && !couponModalClosed) {
      code = ''
      setShowLoader(false)
      setShowCouponError(true)
      
    }
  } else {
    if(subTotal == "") {
      setSubTotal(subtotal)
    }
  }

  const redirect1  = window.sessionStorage.getItem('redirect')
    if (redirect1 != "") {
      // dispatch(setRedirect(""))
      console.log("RSETTING REDIRECT")
      sessionStorage.setItem('redirect', "");
      sessionStorage.setItem('setRedirect', "FALSE");
    }

  const { profile, auth, isLoading } = useSelector((state) => ({
    profile: state.profile,
    auth: state.auth,
    isLoading: state.app.loading
  }));

  console.log("SUBTOTAL " + subtotal + " " + subTotal)

  useEffect(() => {
    // ReactGA.pageview("/checkout/step1")
    ReactGA.send({ hitType: "pageview", page: "/checkout/step1"});
    if(subTotal == "") {
      setSubTotal(subtotal)
    }
	}, []);

  const onFormSubmit = (form) => {

    if(!couponApplied) {
      const coup = {"code": form.couponCode.toUpperCase()}
      setCouponModalClosed(false)
      dispatch(applyCoupon(coup))

      ReactGA.event({
        category: "CHECKOUT 1",
        action: "APPLY COUPON",
        label: "APPLY COUPON", 
        value: 3
      })

      if(!showLoader) {
        setShowLoader(true)
      }
    }
  };

  return (
    <div className='content'>
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
    <div className="checkout">
      
      <StepTracker current={1} />
      <div className="checkout-step-1">
        <h3 className="text-center">Order Summary</h3>
        <span className="d-block text-center">Review items in your basket.</span>
        <br />
        <div className="checkout-items">
          {basket.map((product) => (
            <BasketItem
              basket={basket}
              dispatch={dispatch}
              key={product.id}
              product={product}
            />
          ))}
        </div>
        <br />
        <Formik
                initialValues={{
                  couponCode: '',
                }}
                validationSchema={FormSchema}
                validateOnChange
                onSubmit={onFormSubmit}
              >
                {() => (
                  <Form>
                    <div className="coupon-form">
                    <div className="coupon-field">
                      <Field
                        name="couponCode"
                        type="text"
                        label="Coupon Code"
                        placeholder="PILK123"
                        value={code}
                        style={{ textTransform: 'capitalize' }}
                        component={CustomInput}
                      />
                    </div>
                    <br />
                    <div className="coupon-field coupon-action coupon-action-apply">
                      <button
                        disabled={couponApplied}
                        className="button coupon-button"
                        type="submit">
                        Apply
                      </button>
                    </div>
                    </div>
                  </Form>
                )}
              </Formik>
        
        <div className="basket-total text-right">
          <p className="basket-total-title">Subtotal:</p>
          <h2 className="basket-total-amount">{displayMoney(subTotal)}</h2>
        </div>
        <br />
        <div className="checkout-shipping-action">
          <button
            className="button button-muted"
            onClick={onClickPrevious}
            type="button"
          >
            <ShopOutlined />
            &nbsp;
            Continue Shopping
          </button>
          <button
            className="button"
            onClick={onClickNext}
            type="submit"
          >
            Next Step
            &nbsp;
            <ArrowRightOutlined />
          </button>
        </div>
        <br />
      </div>
    </div>

    <Modal show={show} centered onHide={handleClose} className="text-center">
				<Modal.Header closeButton className="text-center">
          <Modal.Title>Please signin to apply coupon.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<form onSubmit={handleLogin}>
							<Button variant="primary" type="submit">Login</Button>        
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showCouponError} centered onHide={handleCloseCouponError} className="text-center">
				<Modal.Header closeButton className="text-center">
          <Modal.Title>Invalid Coupon Code. Please try a different code.</Modal.Title>
        </Modal.Header>
      </Modal>

      <Modal show={showCouponSuccess} centered onHide={handleCloseCouponSuccess} className="text-center">
				<Modal.Header closeButton className="text-center">
          <Modal.Title>YAY !! Coupon Applied Sucessfully.</Modal.Title>
        </Modal.Header>
      </Modal>

      <Modal show={showLoader} centered className="text-center" backdrop="static">
        <Modal.Body>
          <h2 className="text-center">Loading</h2>
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

OrderSummary.propTypes = {
  basket: PropType.arrayOf(PropType.object).isRequired,
  subtotal: PropType.number.isRequired
};

export default withCheckout(OrderSummary);
