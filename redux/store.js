import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import newsSlice from './features/newsSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { newsApi } from './features/newsApi';
import authReducer from './features/auth/authSlice';

const rootReducer = combineReducers({
  newsFeed: newsSlice,
  userAuth: authReducer,
  [newsApi.reducerPath]: newsApi.reducer,
});

const persistConfig = {
  key: 'base',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['newsFeed', 'userAuth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(newsApi.middleware),
});

setupListeners(store.dispatch);
