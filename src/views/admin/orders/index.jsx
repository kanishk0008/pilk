/* eslint-disable react/jsx-props-no-spreading */
import { Boundary } from 'components/common';
import { AppliedFilters, ProductList } from 'components/product';
import { useDocumentTitle, useScrollTop } from 'hooks';
import React , {useState , useEffect} from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectFilter } from 'selectors/selector';
import { ProductsNavbar } from '../components';
import OrdersTable from '../components/OrdersTable';
import ProductsTable from '../components/ProductsTable';
import firebase from 'services/firebase';
import { CSVLink, CSVDownload } from "react-csv";
import { Button } from 'react-bootstrap';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

const Orders = () => {
  useDocumentTitle('Orders | Pilk Admin');
  useScrollTop();

  const [orders, setOrders] = useState([]);
  const [updateOrders, setUpdateOrders] = useState(false);

  const [dateValue, onDateChange] = useState([new Date(), new Date()]);

  console.log("ADTE RAGE " + dateValue + " " + dateValue[1].getTime())
  if(dateValue[0] != dateValue[1]) {
    console.log("dates changed")
  }

  useEffect(() => {
    (async () => {
      try {
        if(orders.length === 0) {
          
          const snap = await firebase.getOrders()

          const orders = [];
            snap.forEach((doc) =>
            
              orders.push({ id: doc.id, ...doc.data() })
              
            );
            console.log("ORDERS " + orders[0].name)
        
          setOrders(orders)
        }
      
        
      } catch (err) {
        console.log("orders not fetched")
      }
    })();
  }, []);

  const getDateData = () => {
        (async () => {
          try {
            if(dateValue[0] != dateValue[1]) {
              const snap = await firebase.getDateOrders(dateValue[0].getTime(), dateValue[1].getTime())
      
              const orders = [];
                  snap.forEach((doc) =>
                  
                    orders.push({ id: doc.id, ...doc.data() })
                    
                  );
                  console.log("ORDERS " + orders[0].name)
              
              setOrders(orders)
            }
            
          } catch (err) {
            console.log("orders not fetched")
          }
        })();
  }

  const getSubsData = () =>  {
		(async () => {
      try {
        const snap = await firebase.getSubsOrders()

        const orders = [];
            snap.forEach((doc) =>
            
              orders.push({ id: doc.id, ...doc.data() })
              
            );
            console.log("ORDERS " + orders[0].name)
        
        setOrders(orders)
      } catch (err) {
        console.log("orders not fetched")
      }
    })();
	}

  // useEffect(() => {
    
  //   (async () => {
  //   //   console.log("ORDERS fetch 1")
  //     try {
  //   //     console.log("ORDERS fetch")
  //   //     if (orders) {
          
  //         // setOrders(orders)
  //   //     }
  //     } catch (err) {
  //       console.log("orders not fetched")
  //     }
  //   })

  //   // const ordersRef = firestore.collection('orders');
  //   // const unsubscribe = ordersRef.onSnapshot((querySnapshot) => {
  //   //   const orders = querySnapshot.docs.map((doc) => doc.data());
  //   //   setUsers(orders);
  //   // });
  //   // return unsubscribe;
  // }, []);

  return (
    <Boundary>
      {/* <ProductsNavbar
        productsCount={store.products.items.length}
        totalProductsCount={store.products.total}
      /> */}

      <CSVLink data={orders}>Download Data</CSVLink>

      {/* <Button variant="primary" type="button" onClick={getSubsData}> Get Subscription data</Button> */}

      <DateRangePicker onChange={onDateChange} value={dateValue} />
      <Button variant="primary" type="button" onClick={getDateData}>Get Data</Button>
      
      <div className="product-admin-items">
        {/* <ProductList {...store}> */}
          {/* <AppliedFilters filter={store.filter} /> */}
          <OrdersTable filteredProducts={orders} />
        {/* </ProductList> */}
      </div>
    </Boundary>
  );
};

export default withRouter(Orders);
