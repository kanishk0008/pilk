import { ArrowRightOutlined, FastForwardFilled } from '@ant-design/icons';
import { MessageDisplay } from 'components/common';
import { ProductShowcaseGrid } from 'components/product';
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP } from 'constants/routes';
import {
  useDocumentTitle, useFeaturedProducts, useRecommendedProducts, useScrollTop
} from 'hooks';
import React , { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link, useHistory, useLocation } from 'react-router-dom';
import { Modal, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import CountdownTimer from 'components/common/CountdownTimer';

import { sendEmail } from 'redux/actions/orderActions';

import crops from 'images/pilk-crops.png';
import pot from 'images/pilk-pot.png';
import plastic from 'images/pilk-recycle.png';
// import natural from 'images/pilk-natural.png';


import yummy1 from 'images/pilk-man-yummy.png';
import coffee1 from 'images/pilk-tasty-coffee.png';
import healthy1 from 'images/pilk-healthy-lifestyle.png';
import natural1 from 'images/pilk-natural-garden.png';

import attributes from 'images/pilk-bottle-attributes.png';
import rejuvenating from 'images/pilk-rejuvenating.png';

import puzzle from 'images/pilk-puzzle.png';
import logo from 'images/logo-full.png';

import sugars from 'images/added-sugars.png';
import cholesterol from 'images/cholesterol-icon.png';
import gluten from 'images/gluten.png';
import ecoFriendly from 'images/eco-friendly.png';

import { ZIPCODES, smallEmails, trackingIds, emails, HEADLINE_OFFER } from 'constants/constants';

import firebase from "services/firebase";
import ReactGA from 'react-ga4';
import { setZipcode } from 'redux/actions/miscActions';
import copy from "copy-to-clipboard";

function calculateTimeLeft() {
  const year = new Date().getFullYear();
  const difference = +new Date(`01/31/2022`) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

const Home = () => {
  useDocumentTitle('Pilk | Home');
  useScrollTop();
	const history = useHistory();
	const location = useLocation()
	const dispatch = useDispatch();

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
		
	const [show, setShow] = useState(false);

	const [showLabel, setShowLabel] = useState(false);

	const [showLabel1, setShowLabel1] = useState(false);
	const [codeTooltip, setCodeTooltip] = useState('Click to Copy Code');

	const offerModal = window.sessionStorage.getItem('offerModal')

	const handleClose = () => {
		sessionStorage.setItem('offerModal', "closed");
		setShow(false) };

	const { zipcode } = useSelector((state) => ({
    zipcode: state.app.zipcode
  }));

	const handleCodeClick = () =>  {
		setCodeTooltip("Code Copied")
		copy("HELLOPILK")
		sessionStorage.setItem('offerModal', "closed");
		if (show) {
    	setTimeout(() => setShow(false), 1000);
		}
	}

	const handleSubmit = (event) => {
    event.preventDefault()

		if (ZIPCODES.includes(parseInt(event.target[0].value))) {
			dispatch(setZipcode(event.target[0].value))
			setShowLabel(true)
			setShowLabel1(false)
			setTimeout(() => setShow(false), 5000);
		} else {
			setShowLabel(false)
			setShowLabel1(true)
		}

		

		// var i = 0;
		// for(i=0; i< smallEmails.length; i++ ){
		// 	const email = smallEmails[i]
		// 	const msg = {"subject": "Track your Pilk Order"}
		// 	msg["text"] = getEmailTemplate(trackingIds[i])
		// 	msg["html"] = getEmailTemplate(trackingIds[i])
		// 	const mail = {"to": email}
		// 	mail["message"] = msg

		// 	dispatch(sendEmail(mail))
		// }

		// emails.map(email=>{
		// 	const msg = {"subject": "Launching Pilk"}
		// 	msg["text"] = getLaunchEmail()
		// 	msg["html"] = getLaunchEmail()
		// 	const mail = {"to": email}
		// 	mail["message"] = msg

		// 	dispatch(sendEmail(mail))
		// })
		// setShow(false)
		
  }

	const onClickBuy = (e) => {
		ReactGA.event({
			category: "HOME",
			action: "Order Now",
			label: "Order Now", 
			value: 1
		})
		history.push(`/product/pilk-original`);
		
	}


	useEffect(() => {
		if ((offerModal == "" || offerModal == undefined) && !show) {
    	setTimeout(() => setShow(true), 1000);
		}
		// ReactGA.pageview("/")
		ReactGA.send({ hitType: "pageview", page: "/"});

		const redirect  = window.sessionStorage.getItem('redirect')
		if (redirect != "") {
			console.log("REDIRECT 2 " + redirect )
			return <Redirect to={redirect} />;
		}
  	
		
	}, []);	

	const getEmailTemplate = (trackingId) => {
		return '<style type=text/css> @media screen { @font-face { font-family: "Source Sans Pro"; font-style: normal; font-weight: 400; src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");}' + 
		 ' @font-face { font-family: "Source Sans Pro"; font-style: normal; font-weight: 700; src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");}}' +
			'body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }' + 
			' table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt;} img { -ms-interpolation-mode: bicubic;}' +
			' a[x-apple-data-detectors] { font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important; }' +
			' a {text-decoration: none !important; } div[style*="margin: 16px 0;"] { margin: 0 !important; } body { width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; } table { border-collapse: collapse !important; } ' +
		 ' a { color: #1a82e2; } img { height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none; }' +
			'</style></head> <body><div class=preheader style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> Your Pilk order is confirmed, please find the details below. </div> <table border=0 cellpadding=0 cellspacing=0 width=100%><tr> <td align=center> ' +
			'<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
						'<tr> ' +
						'<td align="center" valign="top" width="600"> ' + 
						'<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"> ' + 
						'<tr> ' + 
						'<td align=center valign=top style="border-top: 3px solid #5780E5;border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <a href=https://www.pilk.in target=_blank style="display: inline-block;"> <img src=https://firebasestorage.googleapis.com/v0/b/pilk-1.appspot.com/o/Pilk_tm_pilk%20blue.png?alt=media&token=f8008e29-1f7c-46f4-bcc6-819ae217b405 alt=Logo border=0 width=48 style="display: block; width: 125px; max-width: 125px; min-width: 48px;"> </a>' + 
						'</td>' + 
						' </tr> ' +  
						'</table> '+ 
						' </td>' +
						'</tr>' +
						'</table>' +
						'</td> </tr> <tr> <td align=center>' +
						'<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
						'<tr>' +
						'<td align="center" valign="top" width="600">' +
						'<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"> <tr> <td align=center style="font-family: ' + "'Source Sans Pro'" + ' Helvetica, Arial, sans-serif; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <img src=https://firebasestorage.googleapis.com/v0/b/pilk-1.appspot.com/o/track-shipment.png?alt=media&token=39735b17-1bcd-45ee-acc8-a5a1e8a62027 alt=Pilk-confirmed border=0 style="display: block; max-width: 590px;"> </td> </tr> </table> ' +
						'</td>' +
						'</tr>' +
						'</table>' +
						'</td> </tr> <tr> <td align=center> ' +
						'<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
						'<tr>' +
						'<td align="center" valign="top" width="600">' +
						'<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"> <tr> <td align=left style="padding: 36px 24px 0; font-family: '+ " 'Source Sans Pro'" + ' Helvetica, Arial, sans-serif; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5;"> <h1 style="margin: 0; font-size: 25px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Tracking Id : ' + trackingId + '</h1> </td> </tr> </table> ' +
						'</td>' +
						'</tr>' +
						'</table>' + 
						'</td> </tr>  <tr> <td align=center> ' + 
						'<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' + 
						'<tr>' + 
						'<td align="center" valign="top" width="600">' + 
						' <table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;" bgcolor=" #fff5c4"><tr> <td align=left style="padding: 24px; font-family: ' + "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-left: 3px solid #5780E5; border-right: 3px solid #5780E5; border-bottom: 3px solid #5780E5"> <p style="margin: 0;">Track your order easily by filling tracking ID in the below link: <br/> https://www.shreemaruticourier.com/track-your-shipment/ </p> </td> </tr> </table> ' + 
						'</td>' + 
						'</tr>' + 
						'</table>' + 
						' </td> </tr>  <tr> <td align=center style="padding: 24px; "> ' +
						'<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
						'<tr>' +
						'<td align="center" valign="top" width="600">' +
						'<table border=0 cellpadding=0 cellspacing=0 width=100% style="max-width: 600px;"> <tr> <td align=center style="padding: 12px 24px; font-family: ' + " 'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">You received this email because we received an order from your account. If you didn not order you can safely delete this email.</p> </td> </tr> '+
						'<tr> <td align=center style="padding: 12px 24px; font-family: '+ "'Source Sans Pro'" + ', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <a href=https://www.pilk.in>www.pilk.in</a> </td> </tr>  </table> ' +
						'</td> </tr> </table> </td> </tr> </table> </body> </html>' 
}

	const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    return (
      <span>
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });

  const {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useFeaturedProducts(6);
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingRecommended,
    error: errorRecommended
  } = useRecommendedProducts(6);

  return (
    <main className="content">
			<div className="notification-top-bar">
				<p>{HEADLINE_OFFER}</p>
			</div>
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
						<p>
              Oats + Cowpeas + Moongs
            </p> 
						<hr/>
            <h1 className="text-thin">
              <strong>Pilk - Plant M!lk</strong>
            </h1>
						<hr/>
            <p>
              Complete Protein, Rich in Calcium, Vitamins A, D, B12
            </p>
						<p>
						Dairy & Lactose free
            </p>
						 
						<br/>
            {/* <Link className="button"> */}
						<Link onClick={onClickBuy} className="button">
              Order Now
            </Link>
						
          </div>
          {/* <div className="banner-img"><img src={bannerImg} alt="" /></div> */}
        </div>
        <section className="features">
    	<div className="container-fluid">
    		<div className = "row justify-content-center">
    			<h1>Let's walk down the road and discover more about Pilk !</h1>
    		</div>
    				<div className="row align-items-center yummy">
							<div className="col-md-6 offset-md-1">
								{/* <h3 className='text-mobile'>First thing first!! It tastes delicious, the yummy mouthfeel will just tempt you to drink it in one sip.<br/>Drink it in relax mode as it is free from soya, nuts or any allergens. Sip it. Lick it. Chill it. You are gonna love it.</h3> */}
    						<h3>First things first !! <br/>It tastes delicious, the yummy mouthfeel will just tempt you to drink it in one gulp. 🥛<br/>Pilk takes you to a worry free zone where you dive into a world totally free from soya, nuts or any allergens. <br/>Sip it. Lick it. Chill it.<br/> You are gonna love it. 😍</h3>
    					</div>
						{/* <img src={yummy1} style={{visibility: 'hidden'}} /> */}
    					{/* <div className="col-md-5">
    						<img src={yummy} className="img-responsive mx-auto d-block " alt="Pilk tastes delicious" title="pilk - plant milk taste delicious"/>
    					</div> */}
    					
    				</div>
    				
    				<div className="row align-items-center coffee">
						<div className="col-md-7 offset-md-4">
    						{/* <h3 className='text-mobile'>Have it in your preferred way as it goes best in tea, coffee, cereals & smoothies.</h3> */}
								<h3>You might have thought that only dairy milk can work for your morning coffees or teas. ☕<br/> But Pilk is here to change your mind !<br/> You can use it in all of your favourite dishes and homely recipes. 🍲<br/> We promise it won't let you miss dairy again. Ever.</h3>
    					</div>
    					
    				</div>
    				<div className="row align-items-center healthy">
    					<div className="col-md-7 offset-md-1">
							{/* Calcium and Vit. D will boost your bone health and Vits A, B12 will support your immunity in these tough times. */}
    						{/* <h3>Let Pilk be thy medicine! <br/> Pilk is where taste meets nutrition <br/> </h3> */}
								{/* We also got you covered on essential vitamins and minerals. */}
								<h3>So far so good, huh?<br/> What about the nutrition? 💪<br/> Pilk gives you the best of this world as well. You will get high quality complete protein, good fats and healthy fibres.<br/>Cheers to your bone health! Calcium & Vit. D are there for you. And, another round for immunity! Boost it with Vit. A & B12. 🩺 </h3>
    					</div>
    				</div>
    				
    				<div className="row align-items-center natural">
						<div className="col-md-6 offset-md-5">
    						<h3>We are not done yet! <br/>We all love being natural, so does Pilk. 🌿 <br/>Gone are the scarier days of artificial additives. All Pilk has to offer is an organic fusion of 100% natural ingredients. Free from any artificial colors, flavours & preservatives.<br/> Just pure love from nature. 💚</h3>
    					</div>
    					
    				</div>
    				

    	</div>
		{/* <img src={"images/pilk_drops.png"} height="120px" alt="Pilk drops"/> */}
    </section>

		{/* <section className='pilk-process'>
			<div className="container">
			<div className = "row text-center align-items-center">
    			<h1>Simple process which brings Pilk to you :)</h1>
    		</div>
    		<div className = "row justify-content-center">

					<div className='col-md-3 text-center align-items-center'>
								<img src={crops} height="180px" />
								<p>It starts with the selection of base materials. Pilk is a blend of oats, cowpeas and moongs which are selected very precisely and brought with utmost care to our facility.</p>
					</div>
					<div className='col-md-3 text-center align-items-center'>
								<img src={pot} height="180px"/>
								<p>With same precision and care a solution is created with same organic processes which you can perform in your kitchen. </p>
					</div>
					<div className='col-md-3 text-center align-items-center'>
								<img src={natural} height="180px"/>
								<p>Then comes the part where we are fortifying it with minerals and vitamins. All ingredients used are natural and also derived from natural processes.</p>
					</div>
					<div className='col-md-3 justify-content-center text-center align-items-center'>
								<img src={plastic} height="180px"/>
								<p>The last step and one of the most important one is packaging of the milk. We are using recyclable plastic bottles and working towards shifting to a more sustainable option.</p>
					</div>
				</div>
			</div>
		</section> */}

<section className='pilk-attributes'>
			<div className="container">
			{/* <div className = "row text-center align-items-center justify-content-center">
					<img src={attributes} className = " text-center align-items-center "/>
    		</div> */}
    		<div className = "row align-items-center justify-content-center">

					<div className='col-md-8'>
						<img src={attributes} className = " text-center align-items-center "/>
					</div>

					<div className='col-md-4 text-center align-items-center'>
								<img src={logo} className="pilk-logo"/>
								<br/>
								<h2>100% Plant Based Drink</h2>
								<span>a <br/>magical fusion of <br/> oats, cowpeas and moongs.</span>
								<br/>
								<br/>
								<Link onClick={onClickBuy} className="button">
									Order Now !!!
								</Link>
					</div>
					
				</div>
				<div className = "row align-items-center  justify-content-center">

					<div className='col-md-3 col-6 text-center align-items-center'>
						<img src={sugars} className = "attributes text-center align-items-center "/>
						<h3>Zero Added Sugars</h3>
					</div>

					<div className='col-md-3 col-6 text-center align-items-center'>
						<img src={cholesterol} className = "attributes text-center align-items-center "/>
						<h3>Cholesterol Free</h3>
					</div>

					<div className='col-md-3 col-6 text-center align-items-center'>
						<img src={gluten} className = "attributes text-center align-items-center "/>
						<h3>Gluten Free</h3>
					</div>

					<div className='col-md-3 col-6 text-center align-items-center'>
						<img src={ecoFriendly} className = "attributes text-center align-items-center "/>
						<h3>Eco Friendly</h3>
					</div>

					
				</div>
			</div>
		</section>
		<section className='pilk-moto'>
			<div className="container">
			<div className = "row text-center align-items-center justify-content-center">
					<img src={puzzle} width="60%" className = " text-center align-items-center "/>
    		</div>
    		<div className = "row justify-content-center">

					<div className='col-md-6 text-center align-items-center'>
								
							<p>Pilk is born not just to provide a dairy alternative but to create a synnergy between all the elements on this earth. It is aimed to create a sustainable ecosystem where human needs are fulfilled without harming the earth or other species living on it.</p>
					</div>
					
				</div>
			</div>
		</section>

    {/* <section className="rejuvenating_humans">
    	<div className="container">
    		<div className="row">
    			<div className="col-md-5 col-xs-5">
    				<img src={rejuvenating} width="90%" alt="Pilk is made with oats and peas"/>
    			</div>
    			<div className="col-md-7 col-xs-7">
    				<div className="row ">
    					<div className="col-md-12">
    						<h2>Rejuvenating the Ecosystem</h2>
    						<h4> We are providing the best of the plant world to make you as healthy as you should be.</h4>

    						<ul>
							    <li>
							      <p><span >Complete</span> <span >source of protein from Plants. </span><br/>
							      	<span > Experience wholesomeness of protein, providing you all the essential parts.</span></p>
							    </li>
							    <li>
							      <p><span >50% </span> <span > more Calcium.</span> <br/>
							      	<span >No weaker bones now. Have your all calcium requirements fulfilled here.</span></p>
							      
							    </li>
							    <li>
							      <p><span >Lactose <span > - Free</span>  milk. </span> <br/>
							      <span >Get rid of unwanted bloating, diarrhea, stomach aches and fatigue.</span></p>
							    </li>
							    <li>
							      <p><span >Zero</span>  <span >cholesterol</span> <br/>
							      <span >And a lot of plant-based fibers that make your Heart says Wow.</span></p>
							    </li>
							    <li>
							      <p><span > 90%  </span> <span >less Saturated fat</span> <br/>
							      <span >Give you veins space and cheer them up by removing bad fat blockages.</span></p>
							    </li>    
							  </ul>
    					</div>
    				</div>
    			</div>
    		</div>
    	</div>
    	
    </section> */}

    {/* <section className="rejuvenating_earth">
    	<div className="container-fluid">
    		<div className="row">
    			<div className="col-md-1 col-xs-1"></div>
    			<div className="col-md-4 col-xs-4 order-sm-12" >
    				<img src="images/plant_in_hand.png" alt="Pilk saves environment"/>
    			</div>
    			<div className="col-md-7 col-xs-7 order-sm-1 ">
    				<div className="row">
    					<div className="col-md-12">
    					<h2 >& Rejuvenating Earth</h2>
    					<h4>We are helping you to easily reduce your environmental footprint by just switching to PILK.</h4>

    					<ul>
							    <li>
							      <div className="bullet">
							        <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><circle stroke="none" cx="16" cy="16" r="10"></circle></svg>
							      </div>
							      <p><span >90%</span> <span >lesser GHG emissions </span> <br/>
							      <span >Embrace the coolest way to cool down the earth.</span></p>
							    </li>
							    <li>
							      <div className="bullet">
							        <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><circle stroke="none" cx="16" cy="16" r="10"></circle></svg>
							      </div>
							      <p><span >95%</span> <span >less water consumption </span><br/>
							      <span >Just by drinking 1 Lt of Pilk over dairy will save 900 Lt of water</span></p>
							    </li>
							    <li>
							      <div className="bullet">
							        <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><circle stroke="none" cx="16" cy="16" r="10"></circle></svg>
							      </div>
							      <p><span >85%</span> <span >less land footprint</span> <br/>
							      <span > Let’s make more space for nature to accommodate and flourish.</span></p>
							    </li>
							    <li>
							      <div className="bullet">
							        <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><circle stroke="none" cx="16" cy="16" r="10"></circle></svg>
							      </div>
							      <p><span >This gives us and our coming generation a better world to live in.</span></p>
							    </li>   
							  </ul>
    					</div>
    				</div>
    			</div>
    			
    			
    		</div>
    	</div>
    	
    </section> */}
		{/* <Modal show={show} centered onHide={handleClose} className="text-center">
				<Modal.Header closeButton className="text-center">
          <Modal.Title>Check Pincode</Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<form onSubmit={handleSubmit}>
              <Form.Label>We are shipping at selected locations. Check your pincode for availability.</Form.Label>
              <Form.Control type="number" placeholder="Enter Pincode" className="modal-input"/>    
							{showLabel && <Form.Label show={showLabel} className="label-modal">Yay !!! We are shipping at your location.<br/> Start Shopping.</Form.Label> }
							{showLabel1 && <Form.Label show={showLabel1} className="label-modal label-error">Sorry. We are not shipping at your location as of now. <br/> Stay tuned</Form.Label> }
							<br/>
							<Button variant="primary" type="submit">Check</Button>        
          </form>
        </Modal.Body>
      </Modal> */}

			<Modal show={show} centered onHide={handleClose} className="text-center offer-modal">
				<Modal.Header closeButton className="text-center">
        </Modal.Header>
				<Modal.Body>
					<h1 className="text-center">Get 20% OFF on <br/>your first order!!</h1>
					<span>Delivering all over Maharashtra</span><br/>
					{/* <form onSubmit={handleCodeClick}> */}
					<OverlayTrigger
						delay={{ hide: 450, show: 200 }}
						overlay={(props) => (
							<Tooltip {...props}>
								{codeTooltip}
							</Tooltip>
						)}
						placement="bottom"
					><Button variant="primary" type="button" onClick={handleCodeClick}> <span className="offer-btn">Use Code : HELLOPILK </span></Button>
					</OverlayTrigger>
					<span className='tooltip-mobile'>{codeTooltip}</span>
					{/* </form> */}
				</Modal.Body>
      </Modal>
      </div>
    </main>
  );
};

export default Home;
