import axios from "axios";
import { ISLOGIN } from "./string";

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
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

export function axiosSetData(url, postData) {
  return axios(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    data: postData,
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

export function loginEvent(loginUrl, userData) {
  return axios({
    method: "POST",
    url: loginUrl,
    data: {
      userid: userData.userid[0],
      passwd: userData.passwd[0],
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.data.status === "fail") {
        alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
        return;
      }
      if (res.data.status === "success") {
        const accessToken = res.data.data.jtoken;
        setStorage(ISLOGIN, `${accessToken}`);
        window.location.href = `${process.env.PUBLIC_URL}/`;
        return console.log(accessToken);
      }
    })
    .catch((error) => console.log(error.response));
}
