import axios from "axios";
import { useEffect, useRef } from "react";
import axiosApiInstance from "./axios";

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
    data: getData,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

export function servicesPostData(url, postData) {
  return axiosApiInstance(url, {
    method: "POST",
    data: postData,
  })
    .then((res) => {
      console.log("importData.axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log("importData.axiosSetData", error));
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

export const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};
