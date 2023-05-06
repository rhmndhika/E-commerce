import { configureStore, combineReducers } from "@reduxjs/toolkit"
import cartReducer from './cartRedux'
import userReducer from './userRedux'
import globalReducer from './global'
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
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storageSession,
};

const rootReducer = combineReducers({ user: userReducer, cart: cartReducer, global: globalReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);
  
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store);
