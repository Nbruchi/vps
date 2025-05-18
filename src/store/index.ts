import {type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { userApiSlice } from "./slices/userApiSlice";
import { vehicleApiSlice } from "./slices/vehiclesApiSlice";
import { parkingSlotApiSlice } from "./slices/parkingSlotApiSlice";
import { slotRequestApiSlice } from "./slices/slotRequestApiSlice";
import { logApiSlice } from "./slices/logApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [vehicleApiSlice.reducerPath]: vehicleApiSlice.reducer,
    [parkingSlotApiSlice.reducerPath]: parkingSlotApiSlice.reducer,
    [slotRequestApiSlice.reducerPath]: slotRequestApiSlice.reducer,
    [logApiSlice.reducerPath]: logApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(vehicleApiSlice.middleware)
      .concat(parkingSlotApiSlice.middleware)
      .concat(slotRequestApiSlice.middleware)
      .concat(logApiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;

// Typed hooks for useDispatch and useSelector

type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
