// reducer.js

import click from "./module/click";
import data from "./module/data";
import image from "./module/image";
import page from "./module/page";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
  click,
  data,
  image,
  page,
});

export default rootReducer;
