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
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type ReducerName = keyof RootState;

const useReducerData = (
  reducerName: ReducerName,
  attr: string,
  defaultValue: FixTypeLater
) => {
  return useSelector(
    (state: RootState) => state?.[reducerName]?.[attr] || defaultValue
  );
};

const useStoreActions = <T>(actions: T) => {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(actions || {}, dispatch) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actions]
  );
};

export { useStoreActions, useReducerData, useAppSelector, useAppDispatch };
