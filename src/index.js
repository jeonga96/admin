import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore } from "redux";

import App from "./App";
import rootReducer from "./reducer";

const store = createStore(rootReducer);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
