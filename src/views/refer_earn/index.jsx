import { MessageDisplay } from 'components/common';
import { ProductShowcaseGrid } from 'components/product';
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from 'hooks';
import pilkPacket from 'images/pilk-cardboards.png';
import { useHistory } from 'react-router-dom';
import { HEADLINE_OFFER } from 'constants/constants';
import React , { useEffect, useState } from 'react';
import firebase from 'services/firebase';
import { Button, Modal } from 'react-bootstrap';
import ReactGA from 'react-ga4';
import { useDispatch, useSelector } from 'react-redux';
import { generateCode } from 'redux/actions/profileActions';

const ReferNEarn = () => {
  const history = useHistory();
  useDocumentTitle('Refer & Earn | Pilk');
  useScrollTop();

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [loginClosed, setLoginClosed] = useState(false);
  const { referral_code } = useSelector((state) => ({
    referral_code: state.profile.referral_code,
  }));

  const handleLogin = (event) => {
    event.preventDefault()
    sessionStorage.setItem('setRedirect', "TRUE");
    setShow(false);
    ReactGA.event({
			category: "REFER & EARN",
			action: "SIGNIN",
			label: "SIGNIN", 
			value: 3
		})
    history.push(SIGNIN);
		
  }

  const handleClose = () => { 
    setShow(false) 
    setLoginClosed(true)
  };

  useEffect(() => {
    if(firebase.auth.currentUser) {

    }
	}, []);	

  const genCode = () => {
    if(firebase.auth.currentUser) {
      dispatch(generateCode())
    } else {
      setShow(true)
    }
  }

  return (
    <main className="content">
      <div className="notification-top-bar">
				<p>{ HEADLINE_OFFER }</p>
			</div>
      <div className='container-fluid'>
      <div className="row align-items-center justify-content-center text-center package-confirm">
        
        <img src={pilkPacket}/>
        <div className='col-sm-6'>
        <h1>Refer & Earn !!</h1>
        <p>Refer your friends and 20% discount on your next order.</p>
        <Button variant="primary" onClick={genCode}>Generate Code</Button>
        <br/>
        </div>
      </div>
      </div>

      <Modal show={show} centered onHide={handleClose} className="text-center">
				
        <Modal.Header closeButton className="text-center">
        </Modal.Header>
        <Modal.Body>
					<h2 className="text-center">Please signin to generate a unique code for you.</h2>
          <br/>
					<form onSubmit={handleLogin}>
							<Button variant="primary" type="submit">Login</Button>        
          </form>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default ReferNEarn;