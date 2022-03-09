import { Preloader } from 'components/common';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css/normalize.css';
import React from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import { onAuthStateFail, onAuthStateSuccess } from 'redux/actions/authActions';
import configureStore from 'redux/store/store';
import 'styles/style.scss';
import WebFont from 'webfontloader';
import App from './App';
import firebase from './services/firebase';
import { setRedirect } from 'redux/actions/miscActions';
import { CHECKOUT_STEP_1 } from 'constants/routes';

// import './fonts/VisbyRoundCF-DemiBold.otf';

import ReactGA from 'react-ga';

const trackingId = "G-2P8PXKG1BS"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);


WebFont.load({
  google: {
    families: ['Varela Round', 'Tajawal', 'Shadows Into Light']
  },
});

const { store, persistor } = configureStore();
const root = document.getElementById('app');

// Render the preloader on initial load
render(<Preloader />, root);

firebase.auth.onAuthStateChanged((user) => {
  console.log("AUTH STATE " + user + " ")
  if (user ) {
    console.log("AUTH STATE " + user.providerData[0].providerId)
    if(user.emailVerified || user.providerData[0].providerId == 'facebook.com' || user.providerData[0].providerId == 'google.com') {
      store.dispatch(onAuthStateSuccess(user));
      // store.dispatch(setRedirect(CHECKOUT_STEP_1))
      const setRedi  = window.sessionStorage.getItem('setRedirect')
      console.log("SEETIING REDIRECT " + setRedi)
      if(setRedi == "TRUE") {
        console.log("SEETIING REDIRECT 2 " + setRedi)
        sessionStorage.setItem('redirect', CHECKOUT_STEP_1);
      } 
    } else {
      firebase.auth.signOut();
    }
  } else {
    store.dispatch(onAuthStateFail('Failed to authenticate'));
  }
  // then render the app after checking the auth state
  render(<App store={store} persistor={persistor} />, root);
});

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
