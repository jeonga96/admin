import axios from "axios";
import {
  servicesGetStorage,
  servicesSetStorage,
  servicesPostData,
} from "./importData";
import { TOKEN, RETOKEN, urlRefreshtoken } from "./string";

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.request.use(
  (config) => {
    console.log("interceptors step-1", config);
    const token = servicesGetStorage(TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // const reToken = servicesGetStorage(RETOKEN);
    //   console.log("no reToken");
    // axios({
    //   url: urlRefreshtoken,
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   data: {},
    // })
    //   .then((res) => {
    //     console.log("ㅎㅎㅎㅎes.data.jtoken", res.data.data.jtoken);
    //     servicesSetStorage(RETOKEN, res.data.data.jtoken);
    //   })
    //   .catch((err) => console.log("ㅠㅠerror", err));
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("errorerror!!!", error);
    const {
      config,
      response: { status },
    } = error;
    if (error.response && error.response.status === 401) {
      const originalRequest = config;
      console.log("eee~");
      const refreshToken = await servicesGetStorage(RETOKEN);
      let newAccessToken;
      console.log("newAccessToken", newAccessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    }
    // else if (!validateTimeRefreshtoken()){
    // 	localStorage.clear();
    // 	window.location.href = "/login";
    // 	alert("세션 만료 다시 로그인 해주세요.");
    // }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
