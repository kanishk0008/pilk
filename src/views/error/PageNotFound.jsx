import { useScrollTop } from 'hooks';
import PropType from 'prop-types';
import React from 'react';
import { HEADLINE_OFFER } from 'constants/constants';

const PageNotFound = ({ history }) => {
  useScrollTop();

  return (
    <div className="page-not-found">
      <div className="notification-top-bar">
				<p>{HEADLINE_OFFER}</p>
			</div>
      <h1>:( Page you are looking for doesn&apos;t exists.</h1>
      <br />
      <button
        className="button"
        onClick={history.goBack}
        type="button"
      >
        Go back
      </button>
    </div>
  );
};

PageNotFound.propTypes = {
  history: PropType.shape({
    goBack: PropType.func
  }).isRequired
};

export default PageNotFound;
