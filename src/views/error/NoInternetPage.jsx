import { useScrollTop } from 'hooks';
import React from 'react';
import { HEADLINE_OFFER } from 'constants/constants';

const NoInternet = () => {
  useScrollTop();

  return (
    <div className="page-not-found">
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      <h1>:( No Internet Connection.</h1>
      <p>Please check you network connectivity and try again.</p>
      <br />
      <button
        className="button"
        onClick={() => window.location.reload(true)}
        type="button"
      >
        Try Again
      </button>
    </div>

  );
};

export default NoInternet;
