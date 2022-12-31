import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import newsSlice from './features/newsSlice';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {newsApi2} from './features/newsApi2';

const rootReducer = combineReducers({
  userAuth: authSlice,
  newsFeed: newsSlice,
  [newsApi2.reducerPath]: newsApi2.reducer,
});

const persistConfig = {
  key: 'base',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['userAuth', 'newsFeed'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(newsApi2.middleware),
});

setupListeners(store.dispatch);
