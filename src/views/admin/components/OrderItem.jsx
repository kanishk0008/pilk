import { ImageLoader } from 'components/common';
import { EDIT_PRODUCT } from 'constants/routes';
import { displayActionMessage, displayDate, displayMoney } from 'helpers/utils';
import PropType from 'prop-types';
import React, { useRef } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { removeProduct } from 'redux/actions/productActions';

const OrderItem = ({ order }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const productRef = useRef(null);

  console.log("ORDER ID " + order)
  // ${!order.id && 'item-loading'}

  return (
    <SkeletonTheme
      color="#e1e1e1"
      highlightColor="#f2f2f2"
    >
      <div
        className={`item item-products `}
        ref={productRef}
      >
        <div className="grid grid-count-8">
          <div className="grid-col">
            <span>{order.name || <Skeleton width={30} />}</span>
          </div>
          <div className="grid-col">
            <span >{order.email || <Skeleton width={30} />}</span>
          </div>
          <div className="grid-col">
            <span>{order.address || <Skeleton width={30} />}</span>
          </div>
          <div className="grid-col">
            <span>{order.pincode || <Skeleton width={30} />}</span>
          </div>
          <div className="grid-col">
            <span>
              {order.phone}
            </span>
          </div>
          <div className="grid-col">
            <span>
              {order.fulfillment_date}
            </span>
          </div>
          <div className="grid-col">
            <span>{order.quantity || <Skeleton width={20} />}</span>
          </div>
          <div className="grid-col">
            <span>{order.id || "--" }</span>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

OrderItem.propTypes = {
  order: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    email: PropType.string,
    address: PropType.string,
    pincode: PropType.number,
    quantity: PropType.number,
    phone: PropType.string,
    code: PropType.string
  }).isRequired
};

export default withRouter(OrderItem);
