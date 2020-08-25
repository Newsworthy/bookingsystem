import { 
  GET_ERRORS, 
  CLEAR_ERRORS,
  REGISTER_FAIL,
  RESET_FAIL,
  LOGIN_FAIL,
 } from '../actions/types';

const initialState = {
  msg: {},
  status: null,
  id: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id
      };
    case CLEAR_ERRORS:
      return {
        msg: {},
        status: null,
        id: null
      };
    case RESET_FAIL:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  };
}
