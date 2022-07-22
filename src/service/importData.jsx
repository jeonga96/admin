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

export function axiosPostData(url, postData, headerAdd) {
  return axios(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      headerAdd,
    },
    data: postData,
  })
    .then((res) => {
      console.log("axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log(error));
}

export function loginEvent(loginUrl, userData) {
  console.log(userData.userid[0], userData.passwd[0]);
  return axiosPostData(loginUrl, {
    userid: userData.userid[0],
    passwd: userData.passwd[0],
  })
    .then((res) => {
      if (res.status === "fail") {
        alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
        return;
      }
      if (res.status === "success") {
        const accessToken = res.data.jtoken;
        setStorage(ISLOGIN, `${accessToken}`);
        window.location.href = `${process.env.PUBLIC_URL}/`;
        return console.log(accessToken);
      }
    })
    .catch((error) => console.log(error.response));
}

// export function setAuthToken(token) {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else delete axios.defaults.headers.common["Authorization"];
// }
