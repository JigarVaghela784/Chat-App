import Cookies from "js-cookie";
import { Reducer } from "redux";
import { handleData } from "../middlewares/handleData";
import Types from "../types/auth";

const initialState = {
  user: null,
};

const AuthReducer = (state = initialState, action) => {
  const { type, payload, meta } = action;
  
  switch (type) {
    case Types.SET_USER_DATA:
      if (meta?.lifecycle === "success") {
        Cookies.set("token", payload.email);
      }
      return handleData(state, action, {
        request: (prevState) => ({ ...prevState }),
        success: (prevState) => ({
          ...prevState,
          user: payload,
        }),
        failure: (prevState) => ({ ...prevState }),
      });
    case Types.LOG_OUT_USER: {
      Cookies.remove("token");
      return {
        ...state,
        user: null,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
