import axios from "axios";
import axiosApiInstance from "./axios";
import { TOKEN, urlRefreshtoken } from "./string";

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
    .catch((error) => console.log("importData.servicesGetData", error));
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
    .catch((error) => console.log("importData.servicesPostDataForm ", error));
}

export function servicesGetRefreshToken() {
  servicesPostData(urlRefreshtoken, {})
    .then((res) => {
      servicesSetStorage(TOKEN, res.data.jtoken);
    })
    .catch((err) => console.log("리프래시 토큰 오류", err));
}

export function serviesPostDataCompany(url, cid, setData) {
  servicesPostData(url, { rcid: cid }).then((res) => {
    if (res.status === "success") {
      setData(res.data);
      console.log("serviesPostDataCompany 데이터를 저장합니다.", res.data);
      return;
    }
    if (res.status === "fail" && res.emsg === "process failed.") {
      setData([]);
      console.log("작성된 내용이 없습니다.", res);
      return;
    }
  });
}
