import { MessageDisplay } from 'components/common';
import { useDocumentTitle } from 'hooks';
import ReactGA from 'react-ga4';
import React from 'react';
import { HEADLINE_OFFER } from 'constants/constants';

const TnC = () => {
  useDocumentTitle('Terms and Conditions | Pilk');
  // useScrollTop();

  ReactGA.send({ hitType: "pageview", page: "/terms-conditions"});
  // ReactGA.pageview("")

  return (
    <main className="content">
      <div className="notification-top-bar">
      <p>{HEADLINE_OFFER}</p>
			</div>
      <div className='container-fluid'>
      <div className="story-title row justify-content-center">
            <h1>Terms and Conditions</h1>
            </div>
            <div className='row story'>
              <div className='col-md-10 offset-md-1'><p>
Welcome to Pilk!! These terms and conditions outline the rules and regulations for the use of Pilk’s Website.
<br/>
Pilk is located at: Sarjapura Road, Bangalore, Karnataka, India.
<br/>
By accessing this website we assume you accept these terms and conditions in full. Do not continue to use Pilk’s website if you do not accept all of the terms and conditions stated on this page.
<br/>
The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and any or all Agreements: Client, You and Your refers to you, the person accessing this website and accepting the Company’s terms and conditions. The Company, Ourselves, We, Our and Us, refers to our Company. Party, Parties, or Us, refers to both the Client and ourselves, or either the Client or ourselves.
<br/>
All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a fixed duration, or any other means, for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services/products, in accordance with and subject to, prevailing law of Karnataka, India.
<br/>
Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.
<br/><br/>
<h2>Cookies</h2>

We employ the use of cookies. By using Pilk’s website you consent to the use of cookies in accordance with Pilk’s privacy policy. Most of the modern day interactive websites use cookies to enable us to retrieve user details for each visit.
<br/>
Cookies are used in some areas of our site to enable the functionality of this area and ease of use for those people visiting. Some of our affiliate / advertising partners may also use cookies.
<br/><br/>
<h2>License</h2>

Unless otherwise stated, Pilk and/or its licensors own the intellectual property rights for all material on Pilk.

All intellectual property rights are reserved. You may view and/or print pages from www.pilk.in for your own personal use subject to restrictions set in these terms and conditions.

You must not:
<ul>
<li>Republish material from www.pilk.in.</li>
<li>Sell, rent or sub-license material from www.pilk.in.</li>
<li>Reproduce, duplicate or copy material from www.pilk.in.</li>
<li>Redistribute content from Pilk (unless content is specifically made for redistribution).</li>
</ul>
<br/>
<h2>Disclaimer</h2>

To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill).

Nothing in this disclaimer will:

Limit or exclude our or your liability for death or personal injury resulting from negligence. <br/>
Limit or exclude our or your liability for fraud or fraudulent misrepresentation.<br/>
Limit any of our or your liabilities in any way that is not permitted under applicable law.<br/>
Or exclude any of our or your liabilities that may not be excluded under applicable law.<br/>
The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer:<br/>

are subject to the preceding paragraph; and <br/>
govern all liabilities arising under the disclaimer or in relation to the subject matter of this disclaimer, including liabilities that arise in contract, tort (including negligence) and for breach of statutory duty.<br/>
To the extent that the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
              </div>
            </div>
          </div>
          
    </main>
  );
};

export default TnC;
