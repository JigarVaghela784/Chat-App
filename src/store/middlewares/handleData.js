import { AnyAction } from "redux";
import { AppHandler, RootState } from "../index";

const LIFECYCLE = {
  REQUEST: "request",
  SUCCESS: "success",
  FAILURE: "failure",
};

function safeMap(
  state,
  fn,
  action
) {
  switch (typeof fn) {
    case "function": {
      return fn(state, action);
    }
    case "undefined":
      return state;
    default:
      return state;
  }
}

export const handleData = (
  state,
  action,
  handlers
) => {
  const { meta } = action;

  const lifecycle = meta ? meta["lifecycle"] : null;

  if (lifecycle === null) {
    return state;
  }

  switch (lifecycle) {
    case LIFECYCLE.REQUEST:
      state = safeMap(state, handlers.request, action);
      break;
    case LIFECYCLE.SUCCESS:
      state = safeMap(state, handlers.success, action);
      break;
    case LIFECYCLE.FAILURE:
      state = safeMap(state, handlers.failure, action);
      break;
    default:
      // do nothing
      break;
  }
  return state;
};
