/* eslint-disable no-nested-ternary */
import { SIGNIN } from 'constants/routes';
import { calculateTotal } from 'helpers/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

const withCheckout = (Component) => withRouter((props) => {
  const state = useSelector((store) => ({
    // isAuth: !!store.auth.id && !!store.auth.role,
    isAuth: true,
    basket: store.basket,
    shipping: store.checkout.shipping,
    payment: store.checkout.payment,
    profile: store.profile
  }));

  const shippingFee = state.shipping.isInternational ? 50 : 0;
  var product;

  state.basket.map((prod) => product = prod)

  var subtotal = 0
  if (product != undefined) {
    
    if (product?.subscriptions["offer1"]["size"] == product.selectedSize && product?.subscriptions["offer1"]["amount"] != undefined){
      
      subtotal = product?.subscriptions["offer1"]["amount"]
      
    } else if (product?.subscriptions["offer2"]["size"] == product.selectedSize && product?.subscriptions["offer2"]["amount"] != undefined){
      
      subtotal = product?.subscriptions["offer2"]["amount"]
      
      } else if (product?.subscriptions["offer3"]["size"] == product.selectedSize && product?.subscriptions["offer3"]["amount"] != undefined){
        
        subtotal = product?.subscriptions["offer3"]["amount"]
        
        } else {
          subtotal = product.price * product.selectedSize
        }
   
  }
  // const subtotal = calculateTotal(state.basket.map((product) => product.price * product.selectedSize));

  console.log("checkout checking " + subtotal)
  // if (!state.isAuth) {
  //   return <Redirect to={SIGNIN} />;
  // } 
  if (state.basket.length === 0) {
    return <Redirect to="/" />;
  } if ( state.basket.length !== 0) {
    return (
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        basket={state.basket}
        payment={state.payment}
        profile={state.profile}
        shipping={state.shipping}
        subtotal={Number(subtotal + shippingFee)}
      />
    );
  }
  return null;
});

export default withCheckout;
