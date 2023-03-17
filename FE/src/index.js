import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistGate } from "redux-persist/integration/react";


const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient()
// persistor.purge().then(() => {
//   console.log('Persisted value removed successfully!');
// }).catch((error) => {
//   console.error('Error removing persisted value:', error);
// });
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <App />
      </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
