import { MessageDisplay } from 'components/common';
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from 'hooks';
import ReactGA from 'react-ga';
import React from 'react';
import { HEADLINE_OFFER } from 'constants/constants';

const ShipnRefund = () => {
  useDocumentTitle('Shipping and Refunds | Pilk');
  useScrollTop();

  ReactGA.pageview("/shipnrefund")

  return (
    <main className="content">
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      <div className='container-fluid'>
      <div className="story-title row justify-content-center">
            <h1>Shipping & Refunds</h1>
            </div>
            <div className='row story'>
              <div className='col-md-10 offset-md-1'>
              <p>Our Shipping Policy was last updated on Feb 5, 2022
<br/><br/>
<h2>Interpretation</h2>
The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
<br/><br/>
<h2>Definitions</h2>
For the purposes of this Disclaimer:
<br/>
<ul>
<li>"Company" - (referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to Vegannovative Solution Pvt Ltd</li>
<li>"Goods" - refers to the items offered for sale on the Service.</li>
<li>"Orders" - means a request by You to purchase Goods from Us.</li>
<li>"Service" - refers to the Website.</li>
<li>"Website" - refers to www.pilk.in, accessible from www.pilk.in</li>
<li>"You" - means the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
</ul>
Thank you for visiting and shopping at pilk.in. The following terms and conditions constitute our Shipping Policy.
<br/><br/>
<h2>Shipment processing times</h2>
All Orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.
<br/>If We are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of Your Order, We will contact You via email or telephone.
<br/><br/>
<h2>Shipping rates & delivery estimates</h2>
Shipping charges for your orders are included in the MRP of the product.<br/>

Delivery delays can occasionally occur.<br/>
<br/>
<h2>Shipment to P.O. boxes</h2>
Pilk.in ships to selected pincodes within the Indian states and territories.<br/><br/>
<h2>Shipment confirmation & Order tracking</h2>
You will receive a Shipment Confirmation Email once Your Order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
<br/><br/>
<h2>Damages</h2>
Pilk.in is not legally liable for any products damaged or lost during shipping. If you recieve your product damaged please send us an email with photos and if found legitimate we will replace the goods for you.<br/>
Please save all packaging materials and damaged goods before filing a claim.<br/>
<br/>
<h2>Refunds & Cancellations</h2>
We don't allow any refunds or cancellations for any purchases from our store. We can replace the product in case of any damages. <br/><br/>

<h2>Contact Us</h2>
If you have any questions about this Shipping Policy, You can contact Us:
<ul>
<li>By visiting this page on our website: www.pilk.in</li>
<li>By sending us an email: info@pilk.in</li>
</ul>
</p>
    
              </div>
            </div>
          </div>
          
    </main>
  );
};

export default ShipnRefund;
