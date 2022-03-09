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

const Orders = () => {
  useDocumentTitle('Orders | Pilk Admin');
  useScrollTop();

  const [orders, setOrders] = useState([]);

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
