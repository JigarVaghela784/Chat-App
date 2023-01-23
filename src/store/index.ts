import { useMemo } from "react";
import {
  AnyAction,
  Middleware,
  Store,
  applyMiddleware,
  compose,
  createStore,
} from "redux";
import { createLogger } from "redux-logger";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import asyncActionCreator from "./middlewares/asyncActionCreator";
import rootReducer from "./reducers";

const logger = createLogger({
  collapsed: true,
});

const emptyMiddleWare: Middleware = function fn1() {
  return function fun2(next: (action: AnyAction) => AnyAction) {
    return function fun3(action: AnyAction) {
      return next(action);
    };
  };
};

let loggerMiddleWare = emptyMiddleWare;

if (global.window) {
  loggerMiddleWare = logger;
}

let store: Store;

const persistConfig = {
  key: "next",
  storage: storage,
  timeout: undefined,
};

const pReducer = persistReducer(persistConfig, rootReducer);

function initStore(initialState: RootState) {
  return createStore(
    pReducer,
    initialState,
    compose(applyMiddleware(asyncActionCreator, thunk, loggerMiddleWare))
  );
}

export const initializeStore = (preloadedState: RootState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined as unknown as Store;
  }

  if (!store) store = _store;
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppHandler = {
  request: (state: RootState) => RootState;
  success: (state: RootState) => RootState;
  failure: (state: RootState) => RootState;
};

export function useStore(initialState: RootState) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}
