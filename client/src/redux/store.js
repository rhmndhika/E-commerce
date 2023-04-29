import { configureStore, combineReducers } from "@reduxjs/toolkit"
import cartReducer from './cartRedux'
import userReducer from './userRedux'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storageSession,
};

const rootReducer = combineReducers({ user: userReducer, cart: cartReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);
// const persistedReducer = persistReducer(persistConfig, userReducer);
  
export const store = configureStore({
    reducer: persistedReducer,
    // reducer: {
    //   cart: cartReducer,
    //   user: persistedReducer
    // },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store);
