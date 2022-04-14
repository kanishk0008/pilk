import { Basket } from 'components/basket';
import { Footer, Navigation } from 'components/common';
import * as ROUTES from 'constants/routes';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import * as view from 'views';
import AdminRoute from './AdminRoute';
import ClientRoute from './ClientRoute';
import PublicRoute from './PublicRoute';
import { useDispatch, useSelector } from 'react-redux';

// Revert back to history v4.10.0 because
// v5.0 breaks navigation
export const history = createBrowserHistory();

const AppRouter = () => {

  const redirect  = window.sessionStorage.getItem('redirect')

  console.log("REDIRECT 3 " + redirect )
  return (
  <Router history={history} basename="/" hashType="noslash">
    <>
      {redirect ?<Redirect to={redirect}/> : ""}
      <Navigation />
      <Basket />
      <Switch>
        <Route
          component={view.Search}
          exact
          path={ROUTES.SEARCH}
        />
        <Route
          component={view.Home}
          exact
          path={ROUTES.HOME}
        />
        {/* <Route
          component={view.Shop}
          exact
          path={ROUTES.SHOP}
        /> */}
        <Route
          component={view.FeaturedProducts}
          exact
          path={ROUTES.FEATURED_PRODUCTS}
        />
        <Route
          component={view.Story}
          exact
          path={ROUTES.OUR_STORY}
        />
        <Route
          component={view.Policy}
          exact
          path={ROUTES.POLICY}
        />
        <Route
          component={view.TnC}
          exact
          path={ROUTES.TnC}
        />
        <Route
          component={view.ShipnRefund}
          exact
          path={ROUTES.SHIPnREFUND}
        />
        <Route
          component={view.FAQs}
          exact
          path={ROUTES.FAQs}
        />
        <Route
          component={view.RecommendedProducts}
          exact
          path={ROUTES.RECOMMENDED_PRODUCTS}
        />
        <PublicRoute
          component={view.SignUp}
          path={ROUTES.SIGNUP}
        />
        <PublicRoute
          component={view.SignIn}
          exact
          path={ROUTES.SIGNIN}
        />
        <PublicRoute
          component={view.ForgotPassword}
          path={ROUTES.FORGOT_PASSWORD}
        />
        <Route
          component={view.ViewProduct}
          path={ROUTES.VIEW_PRODUCT}
        />
        <ClientRoute
          component={view.UserAccount}
          exact
          path={ROUTES.ACCOUNT}
        />
        <ClientRoute
          component={view.EditAccount}
          exact
          path={ROUTES.ACCOUNT_EDIT}
        />
        <ClientRoute
          component={view.CheckOutStep1}
          path={ROUTES.CHECKOUT_STEP_1}
        />
        <ClientRoute
          component={view.CheckOutStep2}
          path={ROUTES.CHECKOUT_STEP_2}
        />
        <ClientRoute
          component={view.CheckOutStep3}
          path={ROUTES.CHECKOUT_STEP_3}
        />
        <ClientRoute
          component={view.OrderStatus}
          path={ROUTES.ORDER_STATUS}
        />
        <ClientRoute
          component={view.ReferNEarn}
          path={ROUTES.REFER_EARN}
        />
        <AdminRoute
          component={view.Dashboard}
          exact
          path={ROUTES.ADMIN_DASHBOARD}
        />
        <AdminRoute
          component={view.Products}
          path={ROUTES.ADMIN_PRODUCTS}
        />
        <AdminRoute
          component={view.Orders}
          path={ROUTES.ADMIN_ORDERS}
        />
        <AdminRoute
          component={view.Checkouts}
          path={ROUTES.ADMIN_CHECKOUTS}
        />
        <AdminRoute
          component={view.AddProduct}
          path={ROUTES.ADD_PRODUCT}
        />
        <AdminRoute
          component={view.EditProduct}
          path={`${ROUTES.EDIT_PRODUCT}/:id`}
        />
        <PublicRoute component={view.PageNotFound} />
      </Switch>
      <Footer />
    </>
  </Router>
  );
};

export default AppRouter;
