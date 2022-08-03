import axios from "axios";

export function setStorage(name, data) {
  // localStorage.setItem(name, data);
  return sessionStorage.setItem(name, data);
}
export function getStorage(name) {
  // localStorage.getItem(name);
  return sessionStorage.getItem(name);
}

export function removeStorage(name) {
  return sessionStorage.removeItem(name);
}

export function axiosGetData(url, getData) {
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
export function axiosGetToken(url, getData, token) {
  return axios(url, {
    method: "GET",
    data: getData,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.data)
    .catch((error) => console.log("에러가 났어욥", error));
}

export function axiosPostData(url, postData) {
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

export function axiosPostToken(url, postData, token) {
  return axios({
    baseURL: url,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: postData,
  })
    .then((res) => {
      console.log("importData.axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log(error));
}
