import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore } from "redux";
import reportWebVitals from "./reportWebVitals";

// import { configureStore } from "@reduxjs/toolkit";
// import storage from "redux-persist/lib/storage";
// import { persistReducer, persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";
// import thunk from "redux-thunk";

import App from "./App";
import reducer from "./reducer";

// const persistConfig = {
//   key: "root",
//   storage,
// };
// const persistedReducer = persistReducer(persistConfig, reducer);
// const store = configureStore({
//   reducer: persistedReducer,
//   devTools: process.env.NODE_ENV !== "production",
//   middleware: [thunk],
// });
// let persistor = persistStore(store);

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <Router>
      <App />
    </Router>
    {/* </PersistGate> */}
  </Provider>
);

reportWebVitals();
