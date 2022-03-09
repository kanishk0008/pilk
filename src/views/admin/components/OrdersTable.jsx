/* eslint-disable react/forbid-prop-types */
import { ProductItem } from '.';
import PropType from 'prop-types';
import React from 'react';
import { OrderItem } from '.';

const OrdersTable = ({ filteredProducts }) => (
  <div>
    {filteredProducts.length > 0 && (
      <div className="grid grid-product grid-count-8">
        
        <div className="grid-col">
          <h5>Name</h5>
        </div>
        <div className="grid-col">
          <h5>Email</h5>
        </div>
        <div className="grid-col">
          <h5>Address</h5>
        </div>
        <div className="grid-col">
          <h5>Pincode</h5>
        </div>
        <div className="grid-col">
          <h5>Phone</h5>
        </div>
        <div className="grid-col">
          <h5>Fulfillment Date</h5>
        </div>
        <div className="grid-col">
          <h5>Qty</h5>
        </div>
        <div className="grid-col">
          <h5>Coupon</h5>
        </div>
      </div>
    )}
    {filteredProducts.length === 0 ? new Array(10).fill({}).map((product, index) => (
      <OrderItem
        // eslint-disable-next-line react/no-array-index-key
        key={`product-skeleton ${index}`}
        order={product}
      />
    )) : filteredProducts.map((product) => (
      <OrderItem
        key={product.id}
        order={product}
      />
    ))}
  </div>
);

OrdersTable.propTypes = {
  filteredProducts: PropType.array.isRequired
};

export default OrdersTable;
