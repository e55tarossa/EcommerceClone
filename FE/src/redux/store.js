import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from '../redux/slices/productSlice'
import userReducer from '../redux/slices/userSlice'
import orderReducer from '../redux/slices/orderSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist:['product','user'] // khong luu vao store
}

const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  order: orderReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)