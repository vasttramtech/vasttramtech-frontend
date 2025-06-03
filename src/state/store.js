import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobberMastersReducer from "./jobberMastersSlice";
import fetchDatReducer from "./fetchDataSlice";
import { persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["jobberMasters", "fetchData"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  jobberMasters: jobberMastersReducer,
  fetchData: fetchDatReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
