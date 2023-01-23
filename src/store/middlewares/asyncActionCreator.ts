import { AnyAction, Dispatch } from "redux";

const asyncActionCreator =
  ({ dispatch }: { dispatch: Dispatch }) =>
  (next: (action: AnyAction) => AnyAction) =>
  async (action: AnyAction) => {
    const {
      type,
      asyncCall,
      payload = {},
      onSuccess = () => {},
      onFailure = () => {},
    } = action;

    if (!asyncCall) {
      return next(action);
    }

    if (typeof asyncCall !== "function") {
      throw new Error("Expected asyncCall to be a function.");
    }

    try {
      dispatch({
        type: `${type}`,
        meta: {
          payload,
          lifecycle: "request",
        },
      });
      const response = await asyncCall(dispatch);

      if (response.status) {
        dispatch({
          type: `${type}`,
          payload: response,
          meta: {
            payload,
            lifecycle: "success",
          },
        });
        onSuccess(dispatch, response);
      } else {
        dispatch({
          type: `${type}`,
          payload: response,
          meta: {
            payload,
            lifecycle: "failure",
          },
        });
        onFailure(dispatch, response);
      }
      return response;
    } catch (error) {
      dispatch({
        type: `${type}`,
        payload: error,
        meta: {
          payload,
          lifecycle: "failure",
        },
      });
      onFailure(dispatch, error);
      return error;
    }
  };

export default asyncActionCreator;
