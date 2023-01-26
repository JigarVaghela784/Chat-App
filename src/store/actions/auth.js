import { Dispatch } from "redux";

import { loginUser } from "../../api/login";
import Types from "../types/auth";

// interface User {
//   email?: string;
//   password?: string;
// }

export const setUser = (user) => (dispatch) => {
  console.log('user', user)
  dispatch({
    payload: user,
    type: Types.SET_USER_DATA,
    asyncCall: () => loginUser(user),
    onSuccess: () => {},
  });
};

export const logOutUser = () => (dispatch) => {
  dispatch({
    type: Types.LOG_OUT_USER,
  });
};
