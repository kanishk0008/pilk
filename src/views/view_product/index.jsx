import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColorChooser, ImageLoader, MessageDisplay } from 'components/common';
import { ProductShowcaseGrid } from 'components/product';
import { RECOMMENDED_PRODUCTS, SHOP, HOME, CHECKOUT_STEP_1 } from 'constants/routes';
import { displayMoney } from 'helpers/utils';
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop
} from 'hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import Select from 'react-select';
import { select } from 'redux-saga/effects';
import ReactGA from 'react-ga4';
import { Home } from 'views';
import CountdownTimer from 'components/common/CountdownTimer';

import sugars from 'images/zero-added-sugars.png';
import cholesterol from 'images/cholesterol-free.png';
import gluten from 'images/gluten-free.png';
import naturalIng from 'images/natural-ingredients.png';
import preservatives from 'images/preservatives-free.png';
import soynNut from 'images/soy-nut-free.png';

import chaiHome from 'images/chai-home.png';
import chaiPark from 'images/chai-park.png';
import hotChocolate from 'images/hot-chocolate.png';
import coffeeRachel from 'images/coffee-rachel.png';

import { HEADLINE_OFFER } from 'constants/constants';
import { Button } from 'react-bootstrap';


var productPrice = 0
var saveAmount = 0
const ViewProduct = () => {
  const history = useHistory();
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || 'Item'}`);

  

  var showDel = false
  
  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [offer1Checked, setoffer1Checked] = useState('');
  const [offer2Checked, setoffer2Checked] = useState('');
  const [offer3Checked, setoffer3Checked] = useState('');
  
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useRecommendedProducts(6);
  const colorOverlay = useRef(null);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/product/pilk-original"});
    setSelectedImage(product?.image);
    setSelectedSize(12);
    if (productPrice === 0 && product?.price != undefined) {
      productPrice = product?.price
    }

  }, [product]);

  const onSelectedSizeChange = (newValue) => {
    
    if (productPrice === 0) {
      productPrice = product.price
    }
    if(newValue.value < 24) {
      setoffer1Checked(false)
      setoffer2Checked(false)
      setoffer3Checked(false)
    }
    console.log("PRODUCT PRICE 2 " + productPrice + " " + product.price)
    // product.price = productPrice * newValue.value
    setSelectedSize(newValue.value);
  };

  const onSizeChange = (newValue) => {
    
    if (productPrice === 0) {
      productPrice = product.price
    }
    if(newValue.target.value < 24) {
      setoffer1Checked(false)
      setoffer2Checked(false)
      setoffer3Checked(false)
    }
    console.log("PRODUCT PRICE 2 " + productPrice + " " + product.price)
    // product.price = productPrice * newValue.value
    setSelectedSize(newValue.target.value);
  };

  const onSelectedColorChange = (color) => {
    setSelectedColor(color);
    if (colorOverlay.current) {
      colorOverlay.current.value = color;
    }
  };

  const onsubsChange = (newValue) => {
    if (!selectedSize) {
      
      // product.price = productPrice * product.sizes[0]
      console.log("PRODUCT PRICE 3 " + productPrice + " " + product.price)
    }
    console.log("PRODUCT PRICE 3 " + newValue.target.value + " " + product.price)
    // addToBasket({ ...product, selectedColor, selectedSize: selectedSize || product.sizes[0] });
  };

  const handleAddToBasket = () => {
    if (productPrice == 0) {
      productPrice = product.price
    }
    if (!selectedSize) {
      
      product.price = productPrice * product.sizes[0]
      console.log("PRODUCT PRICE 3 " + productPrice + " " + product.price)
    }
    if (!isItemOnBasket(product.id)) {
      addToBasket({ ...product, selectedColor, selectedSize: selectedSize || product.sizes[0] });
    }
    
    ReactGA.event({
			category: "VIEW PRODUCT",
			action: "Buy Now",
			label: "Buy Now", 
			value: 2
		})

    history.push(CHECKOUT_STEP_1);
    
  };

  const handleInput = (el) => {
    console.log("INPUT " + el.target.value);
  }

  if (product != undefined) {
    showDel = false
    if (product?.subscriptions["offer1"]["size"] == selectedSize && product?.subscriptions["offer1"]["amount"] != undefined){
      showDel = true
      productPrice = product?.subscriptions["offer1"]["amount"]
      saveAmount = product?.subscriptions["offer1"]["size"] * product.price - productPrice
    } else if (product?.subscriptions["offer2"]["size"] == selectedSize && product?.subscriptions["offer2"]["amount"] != undefined){
      showDel = true
      productPrice = product?.subscriptions["offer2"]["amount"]
      saveAmount = product?.subscriptions["offer2"]["size"] * product.price - productPrice
      } else if (product?.subscriptions["offer3"]["size"] == selectedSize && product?.subscriptions["offer3"]["amount"] != undefined){
        showDel = true
        productPrice = product?.subscriptions["offer3"]["amount"]
        saveAmount = product?.subscriptions["offer3"]["size"] * product.price - productPrice
        } else {
          productPrice = product.price * selectedSize
        }
   
}

  return (
    

    <main className="content">
      <div className="notification-top-bar">
				<p>{HEADLINE_OFFER}</p>
			</div>
      {isLoading && (
        <div className="loader">
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: '3rem' }} />
        </div>
      )}
      {error && (
        <MessageDisplay message={error} />
      )}
      {(product && !isLoading) && (
        <div className="product-view">
          <Link to={HOME}>
            <h3 className="button-link d-inline-flex">
              <ArrowLeftOutlined />
              &nbsp; Back to home
            </h3>
          </Link>
          <div className="product-modal">
            {product.imageCollection.length !== 0 && (
              <div className="product-modal-image-collection">
                {product.imageCollection.map((image) => (
                  <div
                    className="product-modal-image-collection-wrapper"
                    key={image.id}
                    onClick={() => setSelectedImage(image.url)}
                    role="presentation"
                  >
                    <ImageLoader
                      className="product-modal-image-collection-img"
                      src={image.url}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="product-modal-image-wrapper">
              {selectedColor && <input type="color" disabled ref={colorOverlay} id="color-overlay" />}
              <ImageLoader
                alt={product.name}
                className="product-modal-image"
                src={selectedImage}
              />
            </div>
            <div className="product-modal-details">
              <span className="text-subtle">{product.brand}</span>
              <h1 className="margin-0">{product.name}</h1>
              <p dangerouslySetInnerHTML={{ __html: product.description }} />
              <div className="divider" />
              <br/>
              {/* <CountdownTimer />
              <br/>
              <br /> */}
              <div>
                <span className="text-subtle"><h2>Select a Pack</h2></span>
                {product.sizes.map((size) => (
                  <Button  type="button" className={`pack-btn ${selectedSize==size ? 'pack-selected':''}`} onClick={onSizeChange} value={size}>SET of - {size}</Button>
                ))}
                {/* <Select
                  placeholder="--Select Size--"
                  onChange={onSelectedSizeChange}
                  options={product.sizes.sort((a, b) => (a < b ? -1 : 1)).map((size) => ({ label: `${size}`, value: size }))}
                  value={{ label: `${selectedSize}`, value: selectedSize }}
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 10 }) }}
                /> */}
              </div>
              <br />
              <div>
                <span className="text-subtle"><h2>OR, Subscribe & Save upto ₹ 350/month! </h2></span>
                
              <div onChange={onsubsChange}>
                <input
                    id="offer1"
                    name="type"
                    checked={offer1Checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // setValues({ ...values, type: 'paypal' });
                        setoffer1Checked(true)
                        setoffer2Checked(false)
                        setoffer3Checked(false)
                        setSelectedSize(product?.subscriptions["offer1"]["size"]);
                      }
                    }}
                    type="radio"
                  />
                  <label
                    className="d-flex w-100"
                    htmlFor="offer1"
                  >
                    <div className="d-flex-grow-1 margin-left-s">
                      <h4 className="margin-0">{product?.subscriptions["offer1"]["title"]}</h4>
                      <h5>Box size - 12 bottles</h5>
                    </div>
                  </label>

                  <input
                    id="offer2"
                    name="type"
                    checked={offer2Checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // setValues({ ...values, type: 'paypal' });
                        setoffer2Checked(true)
                        setoffer1Checked(false)
                        setoffer3Checked(false)
                        setSelectedSize(product?.subscriptions["offer2"]["size"]);
                      }
                    }}
                    type="radio"
                  />
                  <label
                    className="d-flex w-100"
                    htmlFor="offer2"
                  >
                    <div className="d-flex-grow-1 margin-left-s">
                      <h4 className="margin-0">{product?.subscriptions["offer2"]["title"]}</h4>
                      <h5>Box size - 12 bottles</h5>
                    </div>
                  </label>

                  <input
                    id="offer3"
                    name="type"
                    checked={offer3Checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // setValues({ ...values, type: 'paypal' });
                        setoffer3Checked(true)
                        setoffer2Checked(false)
                        setoffer1Checked(false)
                        setSelectedSize(product?.subscriptions["offer3"]["size"]);
                      }
                    }}
                    type="radio"
                  />
                  <label
                    className="d-flex w-100"
                    htmlFor="offer3"
                  >
                    <div className="d-flex-grow-1 margin-left-s">
                      <h4 className="margin-0">{product?.subscriptions["offer3"]["title"]}</h4>
                      <h5>Box size - 12 bottles</h5>
                    </div>
                  </label>
              </div>
              </div>
              <span className="text-subtle"><br/><h3>FREE Delivery within 3 days!</h3></span>
              <h1><ins>{ displayMoney(productPrice)}</ins> {showDel && <del>{ displayMoney(selectedSize * product.price)}</del> } <br/> {showDel && <span>(Save {displayMoney(saveAmount)})</span>}</h1>
              <div className="product-modal-action">
                <button
                  className={`button button-small }`}
                  onClick={handleAddToBasket}
                  type="button"
                >
                  Buy Now !!!
                  {/* ${isItemOnBasket(product.id) ? 'button-border button-border-gray' : '' */}
                  {/* {isItemOnBasket(product.id) ? 'Remove From Basket' : 'Add To Basket'} */}
                </button>
              </div>
            </div>
          </div>
          <section className='pilk-product-attributes'>
			<div className="container">
				<div className = "row align-items-center  justify-content-center">

        <div className='col-md-2 col-4 text-center align-items-center'>
						<img src={soynNut} className = "attributes text-center align-items-center "/>
						<h3>Soy & Nut free</h3>
					</div>

          <div className='col-md-2 col-4 text-center align-items-center'>
						<img src={preservatives} className = "attributes text-center align-items-center "/>
						<h3>Preservatives Free</h3>
					</div>

					<div className='col-md-2 col-4 text-center align-items-center'>
						<img src={sugars} className = "attributes text-center align-items-center "/>
						<h3>Zero Added Sugars</h3>
					</div>

					<div className='col-md-2 col-4 text-center align-items-center'>
						<img src={cholesterol} className = "attributes text-center align-items-center "/>
						<h3>Cholesterol Free</h3>
					</div>

					<div className='col-md-2 col-4 text-center align-items-center'>
						<img src={gluten} className = "attributes text-center align-items-center "/>
						<h3>Gluten Free</h3>
					</div>

					<div className='col-md-2 col-4 text-center align-items-center'>
						<img src={naturalIng} className = "attributes text-center align-items-center "/>
						<h3>100% Natural Ingredients</h3>
					</div>

					
				</div>
			</div>
		</section>

    <section className='pilk-description'>
    <h2>Why you will love it !!</h2>
<ul>

<li>The tastiest plant milk in town.</li>
<li>It’s smooth and creamy texture goes great with teas & coffees.</li>
<li>Wholesome nutrition. Rich source of complete protein, calcium, Vit. A, D & B12</li>
<li>No added sugar, no artificial color or flavors, no preservatives. All 100% natural.</li>
<li>Free from soya, nuts, glutens & dairy.</li>

</ul>


</section>
<section className='pilk-customers'>
			<div className="container">
      <div className = "row align-items-center  justify-content-center">
        <h2><br/>Love from our customers</h2>
        </div>
				<div className = "row align-items-center  justify-content-center">



					<div className='col-md-3 col-6 text-center align-items-center'>
            <a href='https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODc3NDQ4MzYxNTYwNTcz?utm_medium=copy_link' target="_blank">
						<img src={chaiHome} className = "attributes text-center align-items-center "/>
            </a>
					</div>

					<div className='col-md-3 col-6 text-center align-items-center'>
          <a href='https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODc3NDQ4MzYxNTYwNTcz?utm_medium=copy_link' target="_blank">
						<img src={coffeeRachel} className = "attributes text-center align-items-center "/>
            </a>
					</div>

					<div className='col-md-3 col-6 text-center align-items-center'>
          <a href='https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODc3NDQ4MzYxNTYwNTcz?utm_medium=copy_link' target="_blank">
						<img src={chaiPark} className = "attributes text-center align-items-center "/>
            </a>
					</div>

					<div className='col-md-3 col-6 text-center align-items-center'>
          <a href='https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODc3NDQ4MzYxNTYwNTcz?utm_medium=copy_link' target="_blank">
						<img src={hotChocolate} className = "attributes text-center align-items-center "/>
            </a>
					</div>

					
				</div>
			</div>
		</section>
<section className='pilk-description'>

<h2>What’s inside the Pilk? </h2>
<p>Water, Base 11% (Oats, Cowpeas & Moongs), Sunflower oil, Calcium carbonate, Sunflower lecithin, Gellan gum, Dipotassium phosphate, Salt, Vitamins (A, D, B12), Natural flavors.</p>


<h2>Why SHAKE IT ?</h2>
<p>It’s made up of 100% plant-based ingredients and fortified with a natural source of Calcium. To properly mix the calcium and other nutrients throughout the milk, we advise you to shake it before consumption.</p>

<h2>Shelf Life</h2>
<p>Six months from the date of manufacture at room temperature condition. </p>

<h2>Storage</h2>
<p>It can be stored at room temperature. Refrigerate after opening and consume within 3-4 days. Avoid freezing the product.</p>

    </section>

    
          {/* <div style={{ marginTop: '10rem' }}>
            <div className="display-header">
              <h1>Recommended</h1>
              <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={error}
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid products={recommendedProducts} skeletonCount={3} />
            )}
          </div> */}
        </div>
      )}
    </main>
  );
};

export default ViewProduct;
