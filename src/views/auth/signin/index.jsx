import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { SocialLogin } from 'components/common';
import { CustomInput, CustomMobileInput } from 'components/formik';
import { FORGOT_PASSWORD, SIGNUP } from 'constants/routes';
import { Field, Form, Formik } from 'formik';
import { useFormikContext } from 'formik';
import { useDocumentTitle, useScrollTop } from 'hooks';
import PropType from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signIn } from 'redux/actions/authActions';
import { setAuthenticating, setAuthStatus } from 'redux/actions/miscActions';
import * as Yup from 'yup';
import { HEADLINE_OFFER } from 'constants/constants';
import SignInForm from './SignInForm';
import firebase from 'services/firebase';
import ReactGA from 'react-ga';
import Condition from 'yup/lib/Condition';

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is not valid.')
    .required('Email is required.'),
  password: Yup.string()
    .required("Password is required.")
  // mobile: Yup.object()
  //   .shape({
  //     country: Yup.string(),
  //     countryCode: Yup.string(),
  //     dialCode: Yup.string().required('Mobile number is required'),
  //     value: Yup.string().min(10, "Minimum 10 digits are required").required('Mobile number is required')
  //   })
  //   .required('Mobile number is required.'),
});

const SignIn = ({ history }) => {
  const { authStatus, isAuthenticating } = useSelector((state) => ({
    authStatus: state.app.authStatus,
    isAuthenticating: state.app.isAuthenticating
  }));

  // const { values } = useFormikContext();

  // const auth = firebase.auth
  // window.recaptchaVerifier = new firebase.RecaptchaVerifier('sign-in-button', {
  //   'size': 'invisible',
  //   'callback': (response) => {
  //     // reCAPTCHA solved, allow signInWithPhoneNumber.
  //     // onSignInSubmit();
  //   }
  // }, auth);

  const dispatch = useDispatch();
  

  useScrollTop();
  useDocumentTitle('Sign In | Pilk');

  useEffect(() => () => {
    dispatch(setAuthStatus(null));

    // firebase.auth.signOut();
    ReactGA.pageview("/signin")
    // firebase.auth.signOut();
    dispatch(setAuthenticating(false));
  }, []);

  const onSignUp = () => history.push(SIGNUP);

  const onSubmitForm = (form) => {
    dispatch(signIn(form.email, form.password));
    // const signin = () => {
  
      // if (mynumber === "" || mynumber.length < 10) return;

    //   console.log("MOBILE " + form.mobile.value)

    //   var mynumber = "+"+form.mobile.value
    //   // let verify = new firebase.auth.ApplicationVerifier;
    //   const auth = firebase.auth
    //   window.recaptchaVerifier = new auth.RecaptchaVerifier('get-otp', {
    //     'size': 'invisible'
    // });
    //   auth.signInWithPhoneNumber(mynumber, window.recaptchaVerifier).then((result) => {
    //       setfinal(result);
    //       alert("code sent")
    //       setshow(true);
    //   })
    //       .catch((err) => {
    //           alert(err);
    //           window.location.reload()
    //       });
  // }
  };

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };

  return (
    <div className="auth-content">
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      {authStatus?.success && (
        <div className="loader">
          <h3 className="toast-success auth-success">
            {authStatus.message}
            <LoadingOutlined />
          </h3>
        </div>
      )}
      {!authStatus?.success && (
        <>
          {authStatus?.message && (
            <h5 className="text-center toast-error">
              {authStatus?.message}
            </h5>
          )}
          <div className={`auth ${authStatus?.message && (!authStatus?.success && 'input-error')}`}>
            <div className="auth-main">
              <h3>Sign in to Pilk</h3>
              {/* <br /> */}
              <div className="auth-wrapper">
                {/* <Formik
                  initialValues={{
                    email: '',
                    password: ''
                  }}
                  validateOnChange
                  validationSchema={SignInSchema}
                  onSubmit={onSubmitForm}
                >
                  {() => (
                    <Form>
                      <div className="auth-field">
                        <Field
                          disabled={isAuthenticating}
                          name="email"
                          type="email"
                          label="Email"
                          placeholder="test@example.com"
                          component={CustomInput}
                        />
                      </div>
                      <div className="auth-field">
                        <Field
                          disabled={isAuthenticating}
                          name="password"
                          type="password"
                          label="Password"
                          placeholder="Your Password"
                          component={CustomInput}
                        />
                      </div>
                      <br />
                      <div className="auth-field auth-action">
                        <Link
                          onClick={onClickLink}
                          style={{ textDecoration: 'underline' }}
                          to={FORGOT_PASSWORD}
                        >
                          <span>Forgot password?</span>
                        </Link>
                        <button
                          className="button auth-button"
                          disabled={isAuthenticating}
                          type="submit"
                          id="get-otp"
                        >
                          {isAuthenticating ? 'Signing In' : 'Sign In'}
                          &nbsp;
                          {isAuthenticating ? <LoadingOutlined /> : <ArrowRightOutlined />}
                        </button>
                      </div> 
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="auth-divider">
              <h6>OR</h6>
            </div> */}
            <SocialLogin isLoading={isAuthenticating} />
            </div>
             </div> 
          </div>
          <div className="auth-message">
            <span className="auth-info">
              <strong>Don&apos;t have an account?</strong>
            </span>
            <button
              className="button button-small button-border button-border-gray button-icon"
              disabled={isAuthenticating}
              onClick={onSignUp}
              type="button">
              Sign Up
            </button>
          </div>
        </>
      )}
    </div>
  );
};

SignIn.propTypes = {
  history: PropType.shape({
    push: PropType.func
  }).isRequired
};

export default SignIn;
