import axios from "axios";
import { urlRefreshtoken } from "./string/apiUrl";
import { TOKEN } from "./string/stringtoconst";
import { servicesUseToast } from "./library/toast";
import { servicesGetStorage, servicesSetStorage } from "./useData/storage";

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

export function servicesNotokenPostData(url, reqData) {
  return axios({
    url: url,
    method: "post",
    data: reqData,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log("error", error);
    });
}

/**
 * postApi를 이용한다. api를 불러오는데 실패하면 빈 배열을 반환한다.
 * @param {*} url
 * @param {*} valueName : {key:value}
 * @param {*} setData : setState
 */
export function serviesPostDataState(url, valueName, setData) {
  servicesPostData(url, valueName).then((res) => {
    if (res.status === "success") {
      setData(res.data);
      return;
    }
    if (res.status === "fail" && res.emsg === "process failed.") {
      setData([]);
      return;
    }
  });
}
