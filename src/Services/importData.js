import axios from "axios";
import { useEffect, useRef } from "react";
import axiosApiInstance from "./axios";
import { TOKEN, urlRefreshtoken, urlGetImages, urlUpImages } from "./string";

export function servicesSetStorage(name, data) {
  return localStorage.setItem(name, data);
}
export function servicesGetStorage(name) {
  return localStorage.getItem(name);
}

export function servicesRemoveStorage(name) {
  return localStorage.removeItem(name);
}

export function servicesGetData(url, getData) {
  return axiosApiInstance(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    data: getData,
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

export function servicesPostData(url, postData) {
  return axiosApiInstance(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: postData,
  })
    .then((res) => {
      console.log("importData.axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log("importData.axiosSetData error", error));
}

export function servicesPostDataForm(url, postData) {
  return axiosApiInstance(url, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: postData,
  })
    .then((res) => {
      console.log("importData.axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log(error));
}

export function servicesGetRefreshToken() {
  servicesPostData(urlRefreshtoken, {})
    .then((res) => {
      servicesSetStorage(TOKEN, res.data.jtoken);
    })
    .catch((err) => console.log("ㅠㅠerr", err));
}