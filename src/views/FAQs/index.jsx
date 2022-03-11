import { MessageDisplay } from 'components/common';
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from 'hooks';
import ReactGA from 'react-ga4';
import React from 'react';
import { HEADLINE_OFFER } from 'constants/constants'

const FAQs = () => {
  useDocumentTitle('FAQs | Pilk');
  useScrollTop();
  // ReactGA.pageview("/faqs")
  ReactGA.send({ hitType: "pageview", page: "/faqs"});

  return (
    <main className="content">
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      <div className='container-fluid'>
      <div className="story-title row justify-content-center">
        
            <h1>FAQs</h1>
            </div>
            <div className='row faqs'>
              <ul>
            <li> 
              <h3>What is Pilk ?</h3>
              <p>Pilk is Plant milk. It is made of a unique blend of grains and legume in order to provide the best of both worlds- taste & nutrition. </p>
            
            </li>

            <li>
              <h3>What is a complete protein profile and why is it important?</h3>
              <p>Protein is made up of amino acids and there are 9 essential amino acids which our body needs to survive and fulfill their need from outside food sources. Most plant-based protein sources are incomplete in the sense that they lack one or more essential amino acids in the required amount. For example, grains like rice, wheat, oats, millets ,etc lack an essential amino acid called Lysine, whereas legumes like pea, moong, cowpea, chickpeas, etc lack another essential amino acid called Methionine. When combining them in an appropriate amount we can obtain all the required essential amino acids converting them into a complete source of protein.</p></li>
            
            <li><h3>Does pilk compare to dairy in terms of Calcium?</h3>
            <p>Yes, Pilk provides an equivalent amount of Calcium as dairy, i.e. 120 mg/ 100 ml serving. </p></li>

            <li><h3>Is it safe for infants/ toddlers/ children?</h3>
            <p>Pilk is made of 100% natural ingredients which are approved by regulations for infants, so there should not be any problems for infants & toddlers, but we suggest you consult your paediatrician before giving it to them.
            Pilk is absolutely safe for children.</p></li>

            <li> <h3>How to use Pilk?</h3>
            <p>Basically, the same way you use dairy milk! <br/>
            Drink it directly from the bottle.<br/>
            Use it for making great tea & coffees and smoothies.<br/>
            Make curd by using the bacterial culture.<br/>
            Use for all cooking & baking purposes.</p> </li>
            </ul>

            </div>
          </div>
          
    </main>
  );
};

export default FAQs;
