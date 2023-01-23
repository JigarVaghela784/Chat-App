import { Dispatch } from "redux";

import { loginUser } from "src/api/login";
import Types from "../types/auth";

interface User {
  email?: string;
  password?: string;
}

export const setUser = (user: User) => (dispatch: Dispatch) => {
  dispatch({
    payload: user,
    type: Types.SET_USER_DATA,
    asyncCall: () => loginUser(user),
    onSuccess: () => {},
  });
};

export const logOutUser = () => (dispatch: Dispatch) => {
  dispatch({
    type: Types.LOG_OUT_USER,
  });
};
