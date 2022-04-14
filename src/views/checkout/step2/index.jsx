/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Boundary } from 'components/common';
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from 'constants/routes';
import { Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from 'hooks';
import PropType from 'prop-types';
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setShippingDetails } from 'redux/actions/checkoutActions';
import { createCheckout } from 'redux/actions/orderActions';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import ShippingForm from './ShippingForm';
import ShippingTotal from './ShippingTotal';
import { ZIPCODES } from 'constants/constants';
import { Modal, Button } from "react-bootstrap";
import ReactGA from 'react-ga4';
import { HEADLINE_OFFER } from 'constants/constants';
import { setZipcode } from 'redux/actions/miscActions';

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .required('Full name is required.')
    .min(2, 'Full name must be at least 2 characters long.')
    .max(60, 'Full name must only be less than 60 characters.'),
  email: Yup.string()
    .email('Email is not valid.')
    .required('Email is required.'),
  flat: Yup.string()
    .required('Flat no./ Plot no. is required.'),
  area: Yup.string()
    .required('Area is required.'),
  city: Yup.string()
    .required('City is required.'),
  state: Yup.string()
    .required('State is required.'),
  pincode: Yup.string()
    .required('Pin Code is required.'),
  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required('Mobile number is required'),
      value: Yup.string().min(10, "Minimum 10 digits are required").required('Mobile number is required')
    })
    .required('Mobile number is required.'),
  isInternational: Yup.boolean(),
  isDone: Yup.boolean()
});

const ShippingDetails = ({ profile, shipping, subtotal }) => {
  useDocumentTitle('Check Out Step 2 | Pilk');
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(false);

  const handleClose = () => { setShow(false) };

  const { coupon, validCoupon } = useSelector((state) => ({
    coupon: state.order.coupon,
    validCoupon: state.order.validCoupon
  }));

  useEffect(() => {
    console.log("AUTH ")
    // ReactGA.pageview("/checkout/step2")
    ReactGA.send({ hitType: "pageview", page: "/checkout/step2"});
	}, []);

  const initFormikValues = {
    fullname: shipping.fullname || profile.fullname || '',
    email: shipping.email || profile.email || '',
    flat: shipping.flat || profile.flat || '',
    state: shipping.state || profile.state || '',
    area: shipping.area || profile.area || '',
    city: shipping.city || profile.city || '',
    pincode: shipping.pincode || profile.pincode || '',
    mobile: shipping.mobile || profile.mobile || {},
    isInternational: shipping.isInternational || false,
    isDone: shipping.isDone || false
  };

  const onSubmitForm = (form) => {
    const order = {"name": form.fullname}
    order["email"] = form.email
    order["address"] = form.flat + ", " + form.area + ", " + form.city + ", " + form.state + ", " + form.pincode
    order["mobile"] = form.mobile.value
    order["price"] = subtotal
    order["created_date"] = Date.now()
    dispatch(createCheckout(order))
    console.log("COUPN " + coupon["code"] + " " + coupon["discount"] + " " + validCoupon["status"])
    if (ZIPCODES.includes(parseInt(form.pincode)) || (coupon["code"] == "PILK100X" && coupon["discount"] != undefined && validCoupon["status"] == "valid") ) {

      ReactGA.event({
        category: "CHECKOUT 2",
        action: "NEXT STEP",
        label: "PAYMENT", 
        value: 4
      })

    dispatch(setShippingDetails({
      fullname: form.fullname,
      email: form.email,
      flat: form.flat,
      area: form.area,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      mobile: form.mobile,
      isInternational: form.isInternational,
      isDone: true
    }));

    
    dispatch(setZipcode(form.pincode))

    history.push(CHECKOUT_STEP_3);
  } else {
    setShow(true)
  }
  };

  return (
    <Boundary>
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h3 className="text-center">Shipping Details</h3>
          <Formik
            initialValues={initFormikValues}
            validateOnChange
            validationSchema={FormSchema}
            onSubmit={onSubmitForm}
          >
            {() => (
              <Form>
                <ShippingForm />
                <br />
                {/*  ---- TOTAL --------- */}
                <ShippingTotal subtotal={subtotal} />
                <br />
                {/*  ----- NEXT/PREV BUTTONS --------- */}
                <div className="checkout-shipping-action">
                  <button
                    className="button button-muted"
                    onClick={() => history.push(CHECKOUT_STEP_1)}
                    type="button"
                  >
                    <ArrowLeftOutlined />
                    &nbsp;
                    Go Back
                  </button>
                  <button
                    className="button button-icon"
                    type="submit"
                  >
                    Payment
                    &nbsp;
                    <ArrowRightOutlined />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Modal show={show} centered onHide={handleClose} className="text-center" >
        <Modal.Header closeButton className="text-center">
          <Modal.Title><h3>Thanks for reaching here but we are not yet available at your location.</h3></Modal.Title>
        </Modal.Header>
      </Modal>
    </Boundary>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    flat: PropType.string,
    area: PropType.string,
    city: PropType.string,
    state: PropType.string,
    pincode: PropType.number,
    mobile: PropType.object
  }).isRequired,
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    flat: PropType.string,
    area: PropType.string,
    city: PropType.string,
    mobile: PropType.object,
    state: PropType.string,
    pincode: PropType.number,
    isInternational: PropType.bool,
    isDone: PropType.bool
  }).isRequired
};

export default withCheckout(ShippingDetails);
