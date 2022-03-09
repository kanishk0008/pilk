import {
  IS_AUTHENTICATING, LOADING,
  SET_AUTH_STATUS,
  SET_REQUEST_STATUS,
  SET_ZIPCODE, 
  SET_REDIRECT
} from 'constants/constants';

const initState = {
  loading: false,
  isAuthenticating: false,
  authStatus: null,
  requestStatus: null,
  theme: 'light',
  zipcode: '',
  redirect: '',
};

export default (state = initState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case IS_AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: action.payload
      };
    case SET_REQUEST_STATUS:
      return {
        ...state,
        requestStatus: action.payload
      };
    case SET_AUTH_STATUS:
      return {
        ...state,
        authStatus: action.payload
      };
    case SET_ZIPCODE:
        return {
          ...state,
          zipcode: action.payload
        };
    case SET_REDIRECT:
          return {
            ...state,
            redirect: action.payload
          };
    
    default:
      return state;
  }
};
