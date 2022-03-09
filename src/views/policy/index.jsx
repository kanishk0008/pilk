import { MessageDisplay } from 'components/common';
import { useDocumentTitle } from 'hooks';
import ReactGA from 'react-ga';
import React from 'react';
import { HEADLINE_OFFER } from 'constants/constants';

const Policy = () => {
  useDocumentTitle('Privacy Policy | Pilk');
  // useScrollTop();

  ReactGA.pageview("/privacy-policy")

  return (
    <main className="content">
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      <div className='container-fluid'>
      <div className="story-title row justify-content-center">
            <h1>Privacy Policy</h1>
            </div>
            <div className='row story'>
              <div className='col-md-10 offset-md-1'><p>
                
              <h2>What information does the website obtain and how is it used?</h2>

              User Provided Information

              The website obtains the information you provide when you download and register the website. Registration with us is optional. However, please keep in mind that you may not be able to use some of the features offered by the website unless you register with us.
              <br/>
              When you register with us and use the website, you generally provide (a) your name, email address, password and other registration information; (b) transaction-related information, such as when you make purchases, respond to any offers; (c) information you provide us when you contact us for help; (d) credit card information for purchase and use of the website, and; (e) information you enter into our system when using the website, such as contact information and project management information.
              <br/>
              We may also use the information you provided us to contact your from time to time to provide you with important information, required notices and marketing promotions.
              <br/><br/>
              <h2>Automatically Collected Information</h2>

              In addition, the website may collect certain information automatically, including, but not limited to, the type of device you use, the IP address of your device, your operating system, the type of mobile Internet browsers you use, and information about the way you use the website.
              <br/><br/>
              <h2>Does the website collect precise real time location information of the device?</h2>

              This website does not collect precise information about the location of your device.
              <br/><br/>
              <h2>Do third parties see and/or have access to information obtained by the website?</h2>

              Only aggregated, anonymized data is periodically transmitted to external services to help us improve the website and our service. We will share your information with third parties only in the ways that are described in this privacy statement.
              <br/><br/>
              <h2>We may disclose User Provided and Automatically Collected Information: </h2>

              as required by law, such as to comply with a subpoena, or similar legal process;
              when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;
              with our trusted services providers who work on our behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.
              If Razorpay India Pvt. Ltd is involved in a merger, acquisition, or sale of all or a portion of its assets, you will be notified via email and/or a prominent notice on our Web site of any change in ownership or uses of this information, as well as any choices you may have regarding this information.
              <br/><br/>
              <h2>What are my opt-out rights?</h2>

              You can stop all collection of information by the website easily by closing website tab from your browser.
              <br/><br/>
              <h2>Data Retention Policy, Managing Your Information</h2>

              We will retain User Provided data for as long as you use the website and for a reasonable time thereafter. We will retain Automatically Collected information for up to 24 months and thereafter may store it in aggregate. If you'd like us to delete User Provided Data that you have provided via the website, please contact us at info@pilk.in and we will respond in a reasonable time. Please note that some or all of the User Provided Data may be required in order for the website to function properly.
              <br/><br/>
              <h2>Children</h2>

              We do not use the website to knowingly solicit data from or market to children under the age of 13. If a parent or guardian becomes aware that his or her child has provided us with information without their consent, he or she should contact us at info@pilk.in. We will delete such information from our files within a reasonable time.
              <br/><br/>
              <h2>Security</h2>

              We are concerned about safeguarding the confidentiality of your information. We provide physical, electronic, and procedural safeguards to protect information we process and maintain. For example, we limit access to this information to authorized employees and contractors who need to know that information in order to operate, develop or improve our website. Please be aware that, although we endeavor provide reasonable security for information we process and maintain, no security system can prevent all potential security breaches.
              <br/><br/>
              <h2>Changes</h2>

              This Privacy Policy may be updated from time to time for any reason. We will notify you of any changes to our Privacy Policy by posting the new Privacy Policy here and informing you via email or text message. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.
              <br/><br/>
              <h2>Your Consent</h2>
              By using the website, you are consenting to our processing of your information as set forth in this Privacy Policy now and as amended by us. "Processing, means using cookies on a computer/hand held device or using or touching information in any way, including, but not limited to, collecting, storing, deleting, using, combining and disclosing information, all of which activities will take place in the India. If you reside outside the United States your information will be transferred, processed and stored there under India privacy standards.
              <br/><br/>
              <h2>Contact us</h2>

              If you have any questions regarding privacy while using the website, or have questions about our practices, please contact us via email at info@pilk.in.
              </p>
              </div>
            </div>
          </div>
          
    </main>
  );
};

export default Policy;
