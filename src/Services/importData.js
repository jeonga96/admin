import axios from "axios";
import { TOKEN, urlRefreshtoken } from "./string";
import { servicesUseToast } from "./useData";

const storageGetToken = servicesGetStorage(TOKEN);

export function servicesSetStorage(name, data) {
  return localStorage.setItem(name, data);
}
export function servicesGetStorage(name) {
  return localStorage.getItem(name);
}

export function servicesRemoveStorage(name) {
  return localStorage.removeItem(name);
}

export function servicesGetData(url, reqData) {
  let headers = {
    "Content-Type": "application/json",
  };
  if (storageGetToken) {
    headers.Authorization = `Bearer ${storageGetToken}`;
  }

  return axios(
    {
      url: url,
      method: "get",
      data: reqData,
    },
    { headers }
  )
    .then((res) => res.data)
    .catch((error) => {
      console.log("importData.axiosSetData", error);
      if (error.response.status === 403) {
        servicesUseToast(
          "로그인 정보가 만료되었습니다. 다시 로그인해주십시오.",
          "e"
        );
        setTimeout(() => {
          document.location.href = "/login";
        }, 2000);
      }
    });
}

export function servicesPostData(url, reqData) {
  return axios
    .post(url, reqData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storageGetToken}`,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.log("importData.axiosSetData", error);
      servicesUseToast(
        "로그인 정보가 만료되었습니다. 다시 로그인해주십시오.",
        "e"
      );
      setTimeout(() => {
        document.location.href = "/login";
      }, 2000);
    });
}

export function servicesPostDataForm(url, reqData) {
  axios
    .post(url, reqData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${storageGetToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      servicesUseToast(
        "로그인 정보가 만료되었습니다. 다시 로그인해주십시오.",
        "e"
      );
      setTimeout(() => {
        document.location.href = "/login";
      }, 2000);
    });
}

export function servicesPost050biz(url, reqData) {
  const TOKEN = "";
  return axios
    .post(url, reqData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
    .then((res) => res.data)
    .catch((error) => console.log("importData.axiosSetData", error));
}

export function servicesGetRefreshToken() {
  servicesPostData(urlRefreshtoken, {})
    .then((res) => {
      servicesSetStorage(TOKEN, res.data.jtoken);
    })
    .catch((err) => console.log("리프래시 토큰 오류", err));
}
