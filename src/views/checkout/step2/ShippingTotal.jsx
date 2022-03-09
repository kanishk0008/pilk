import { useFormikContext } from 'formik';
import { displayMoney } from 'helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ShippingTotal = ({ subtotal }) => {
  const { values } = useFormikContext();
  const { coupon, validCoupon } = useSelector((state) => ({
    coupon: state.order.coupon,
    validCoupon: state.order.validCoupon
  }));

  var sub = subtotal
  if(coupon["code"] != undefined && coupon["discount"] != undefined && validCoupon["status"] == "valid") {
    if(coupon["discount_type"] == "pc") {
      sub = subtotal - (subtotal * coupon["discount"])/100
    }
  }

  return (
    <div className="checkout-total d-flex-end padding-right-m">
      <table>
        <tbody>
          {/* <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                International Shipping: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-subtle text-right margin-0 ">
                {values.isInternational ? '$50.00' : '$0.00'}
              </h4>
            </td>
          </tr> */}
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Subtotal: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-subtle text-right margin-0">
                {displayMoney(sub)}
              </h4>
            </td>
          </tr>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Total: &nbsp;
              </span>
            </td>
            <td>
              <h2 className="basket-total-amount text-right">
                {displayMoney(Number(sub) + (values.isInternational ? 50 : 0))}
              </h2>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ShippingTotal.propTypes = {
  subtotal: PropType.number.isRequired
};

export default ShippingTotal;
