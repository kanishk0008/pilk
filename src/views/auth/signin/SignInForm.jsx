/* eslint-disable jsx-a11y/label-has-associated-control */
import { CustomInput, CustomMobileInput } from 'components/formik';
import { Field, useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';

const SignInForm = () => {
  const { values } = useFormikContext();
  const [show, setShow] = useState(false);

  return (
    <>
    <div className="auth-field">
                      <CustomMobileInput name="mobile" defaultValue={values.mobile} />
                        {/* <Field
                          disabled={isAuthenticating}
                          name="email"
                          type="email"
                          label="Email"
                          placeholder="test@example.com"
                          component={CustomInput}
                        /> */}
                      </div>
                      {show && <div className="auth-field">
                        <Field
                          name="otp"
                          type="number"
                          label="OTP"
                          placeholder="123456"
                          component={CustomInput}
                        />
                      </div>}
                      {/* <br /> */}
                      {/* <div className="auth-field auth-action">
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
                        >
                          {isAuthenticating ? 'Signing In' : 'Sign In'}
                          &nbsp;
                          {isAuthenticating ? <LoadingOutlined /> : <ArrowRightOutlined />}
                        </button>
                      </div> */}
                       </> 
  );
};

export default SignInForm;
