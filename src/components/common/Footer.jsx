import * as Route from 'constants/routes';
import logo from 'images/logo-full.png';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useParams, useHistory } from 'react-router-dom';
import { FacebookOutlined, LinkedinOutlined, InstagramOutlined, LineOutlined } from '@ant-design/icons';

import * as ROUTE from 'constants/routes';

const Footer = () => {
  const { pathname } = useLocation();

  const visibleOnlyPath = [
    Route.HOME,
    Route.SHOP,
    Route.VIEW_PRODUCT
  ];

  return  (
    <footer className="footer">
      <div className="container-fluid">
    		<div className="row">
    			<div className="col-md-4 col-xs-4  order-sm-12">
    				<h3>About Us</h3>
    				<p >We are a team of curated, passionate entrepreneurs working towards changing the way we consume milk. Our researchers have undergone endless trials to obtain the plant magic which is just perfect for you. Switch to PILK and become a part of our global mission of spreading <em>love, happiness & sustainability.</em></p>
            <br></br>
          </div>
          <div className="col-md-3 col-xs-3  order-sm-12">
    				<h3>Address</h3>
    				<p >Ittina Soupernika Apt, Sarjapura Road, <br/> Kaikondrahally, Bangalore,<br/> Karnataka, 560035</p>
            <br></br>
          </div>
          <div className="col-md-2 col-xs-2 align-items-center order-sm-12">
          <h3>Contact us</h3>
          <p>info@pilk.in <br/> +91 9372701695</p>
            <div className='social-media-icons'>
            <button
            className="button button-social"
            onClick={event =>  window.open('https://www.facebook.com/pilk.india',"_blank")}
            type="button"
          >
            <FacebookOutlined/>
            </button>
            <button
            className="button button-social"
            type="button"
            onClick={event =>  window.open('https://www.linkedin.com/company/p1lk',"_blank")}
          >
            <LinkedinOutlined/>
            </button>
            <button
            className="button button-social"
            type="button"
            onClick={event =>  window.open('https://www.instagram.com/pilk.in',"_blank")}
          >
            <InstagramOutlined/>
            </button>
    				{/* <a href="https://www.facebook.com/pilk.india" target="_blank" ></a>
    				<a href="https://www.linkedin.com/company/p1lk" target="_blank" ><LinkedinOutlined/></a>
    				<a href="https://www.instagram.com/pilk.in" target="_blank"><InstagramOutlined/></a> */}
    			</div>
          </div>
          <div className="col-md-3 col-xs-3 align-items-center order-sm-12">
          <h3>Links</h3>
    				<a href="/privacy-policy" >Privacy Policy</a><br/>
    				<a href="/terms-conditions" >Terms & Conditions</a><br/>
    				<a href="/shipping-refund" >Shipping & Refunds</a><br/>
    			</div>
          <br/>
    			
    		</div>
        <div className='row'>
        <small className="block">&copy; 2022   <strong className="text-black">&nbsp;  Pilk &nbsp; </strong>   All Rights Reserved.</small> 
        </div>
		</div>
      {/* <div className="footer-col-1">
        <strong>
          <span>
            Developed by
            {' '}
            <a href="https://github.com/jgudo">JULIUS GUEVARRA</a>
          </span>
        </strong>
      </div>
      <div className="footer-col-2">
        <img alt="Footer logo" className="footer-logo" src={logo} />
        <h5>
          &copy;&nbsp;
          {new Date().getFullYear()}
        </h5>
      </div>
      <div className="footer-col-3">
        <strong>
          <span>
            Fork this project &nbsp;
            <a href="https://github.com/jgudo/ecommerce-react">HERE</a>
          </span>
        </strong>
      </div> */}
    </footer>
  );
};

export default Footer;


// !visibleOnlyPath.includes(pathname) ? null :