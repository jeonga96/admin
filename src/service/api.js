import axios from "axios";
import { TOKEN, urlRefreshtoken } from "./string";
import { servicesUseToast } from "./useData";
import { servicesGetStorage, servicesSetStorage } from "./storage";

export {servicesGetStorage} from "./storage"
const storageGetToken = servicesGetStorage(TOKEN);

export function servicesGetRefreshToken() {
  servicesPostData(urlRefreshtoken, {})
    .then((res) => {
      servicesSetStorage(TOKEN, res.data.jtoken);
    })
    .catch((err) => console.log("리프래시 토큰 오류", err));
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
      console.log("error", error);
      if (error.message === "Request failed with status code 403") {
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
      console.log("error", error);
      if (error.message === "Request failed with status code 403") {
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

export function servicesPostDataForm(url, reqData) {
  return axios
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
      console.log("error", error);
      if (error.message === "Request failed with status code 403") {
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

export function servicesGetFile(url, reqData) {
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
      responseType: "stream",
    }
    // { headers }
  )
    .then((res) => res.data)
    .catch((error) => {
      console.log("error", error);
      if (error.message === "Request failed with status code 403") {
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
