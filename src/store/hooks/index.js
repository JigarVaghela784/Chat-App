import { useMemo } from "react";
import {
  FixTypeLater,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { bindActionCreators } from "redux";

import { AppDispatch, RootState } from "..";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;

// type ReducerName = keyof RootState;

const useReducerData = (
  reducerName,
  attr,
  defaultValue
) => {
  return useSelector(
    (state) => state?.[reducerName]?.[attr] || defaultValue
  );
};

const useStoreActions = (actions) => {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(actions || {}, dispatch) ,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actions]
  );
};

export { useStoreActions, useReducerData, useAppSelector, useAppDispatch };
