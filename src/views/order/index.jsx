import { MessageDisplay } from 'components/common';
import { ProductShowcaseGrid } from 'components/product';
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from 'hooks';
import { useSelector } from 'react-redux';
import pilkPacket from 'images/pilk-cardboards.png';
import { useHistory } from 'react-router-dom';
import { HEADLINE_OFFER } from 'constants/constants';
import React , { useEffect } from 'react';

const OrderStatus = () => {
  const history = useHistory();
  useDocumentTitle('Order | Pilk');
  useScrollTop();
  const { checkout } = useSelector((state) => ({ checkout: state.checkout }));

  console.log("order details " + checkout.order["order_id"] + " " + checkout.order.order_id)

  // checkout.order.map(([key,value])=>{
  //   console.log("KEY : " + key)
  // })


  useEffect(() => {
    () => fbq('track', 'Purchase', {
      value: checkout.order.amount,
      current: 'INR'
    });
	}, []);	
  

  if (checkout.order["order_id"] == undefined) {
    history.push('/');
  }

  return (
    <main className="content">
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      <div className='container-fluid'>
      <div className="row align-items-center justify-content-center text-center package-confirm">
        <img src={pilkPacket}/>
        <h1>Order Confirmed !!</h1>
        <p> We will notify you once your order is dispatched.</p>
      </div>
      </div>
    </main>
  );

  
};

export default OrderStatus;