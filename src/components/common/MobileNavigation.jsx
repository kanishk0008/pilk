import { BasketToggle } from 'components/basket';
import { HOME, SIGNIN, OUR_STORY, FAQs } from 'constants/routes';
import PropType from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserNav from 'views/account/components/UserAvatar';
import Badge from './Badge';
import FiltersToggle from './FiltersToggle';
import SearchBar from './SearchBar';
import logo from 'images/logo-full.png';
import { FilterOutlined, ShoppingOutlined } from '@ant-design/icons';

const Navigation = (props) => {
  const {
    isAuthenticating, basketLength, disabledPaths, user
  } = props;
  const { pathname } = useLocation();

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };

  return (
    <nav className="mobile-navigation">
      <div className="mobile-navigation-main">
        <div className="mobile-navigation-logo">
        <Link onClick={onClickLink} to={HOME}><img alt="Logo" src={logo} /></Link>
        
          {/* <Link onClick={onClickLink} to={HOME}>
            <h2>Pilk</h2>
          </Link> */}
        </div>

        {/* <BasketToggle>
          {({ onClickToggle }) => (
            <button
              className="button-link navigation-menu-link basket-toggle"
              onClick={onClickToggle}
              disabled={disabledPaths.includes(pathname)}
              type="button"
            >

              <Badge count={basketLength}>
                
                <ShoppingOutlined style={{ fontSize: '2.4rem', color: '#000' }} />
              </Badge>
            </button>
          )}
        </BasketToggle> */}
        <ul className="mobile-navigation-menu">
        <li className="mobile-navigation-item" style= {{ paddingBottom : '0' }}>
        <Link to={OUR_STORY}>Our Story</Link>
        </li>
        <li className="mobile-navigation-item" style= {{ paddingBottom : '0' }}>
        <Link to={FAQs}>FAQs</Link>
        </li>
            <li className="mobile-navigation-item">
            <BasketToggle>
          {({ onClickToggle }) => (
            <button
              className="button-link navigation-menu-link basket-toggle"
              onClick={onClickToggle}
              disabled={disabledPaths.includes(pathname)}
              type="button"
            >

              <Badge count={basketLength}>
                {/* <i className="fa fa-shopping-bag" style={{ fontSize: '2rem' }} /> */}
                <ShoppingOutlined style={{ fontSize: '2.4rem', color: '#000' }} />
              </Badge>
            </button>
          )}
        </BasketToggle>
            </li>
          {user ? (
            <li className="mobile-navigation-item">
              <UserNav />
            </li>
          ) : (
            <>
              {pathname !== SIGNIN && (
                <li className="mobile-navigation-item">
                  <Link
                    className="navigation-menu-link"
                    onClick={onClickLink}
                    to={SIGNIN}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
      {/* <div className="mobile-navigation-sec">
        <SearchBar />
        <FiltersToggle>
          <button className="button-link button-small" type="button">
            <i className="fa fa-filter" />
          </button>
        </FiltersToggle>
      </div> */}
    </nav>
  );
};

Navigation.propTypes = {
  isAuthenticating: PropType.bool.isRequired,
  basketLength: PropType.number.isRequired,
  disabledPaths: PropType.arrayOf(PropType.string).isRequired,
  user: PropType.oneOfType([
    PropType.bool,
    PropType.object
  ]).isRequired
};

export default Navigation;
