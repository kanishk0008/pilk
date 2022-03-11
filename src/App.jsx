/* eslint-disable react/forbid-prop-types */
import { Preloader } from 'components/common';
import PropType from 'prop-types';
import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppRouter from 'routers/AppRouter';
import { useDispatch, useSelector } from 'react-redux';

// import ReactGA from 'react-ga';
import reactGA from 'react-ga4';

// const trackingId = "UA-183232535-1"; // Replace with your Google Analytics tracking ID
// ReactGA.initialize(trackingId);


const ga4Id = "G-SHRL8TCM2X"; // Replace with your Google Analytics tracking ID
reactGA.initialize(ga4Id);


const App = ({ store, persistor }) => {

  return(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={<Preloader />} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </Provider>
    </StrictMode>
  )
};

App.propTypes = {
  store: PropType.any.isRequired,
  persistor: PropType.any.isRequired
};

export default App;
