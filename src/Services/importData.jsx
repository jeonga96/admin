import axios from "axios";
import { useEffect, useRef } from "react";
import { urlRefreshtoken } from "./string";

export function servicesSetStorage(name, data) {
  return sessionStorage.setItem(name, data);
}
export function servicesGetStorage(name) {
  return sessionStorage.getItem(name);
}

export function servicesRemoveStorage(name) {
  return sessionStorage.removeItem(name);
}

export function servicesGetData(url, getData) {
  return axios(url, {
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
  return axios(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    data: postData,
  })
    .then((res) => {
      console.log("importData.axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log(error));
}

export function servicesPostDataForm(url, postData) {
  return axios(url, {
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
