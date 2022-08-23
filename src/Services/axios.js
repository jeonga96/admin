import axios from "axios";
import { servicesGetStorage, servicesPostData } from "./importData";
import { TOKEN, RETOKEN, urlRefreshtoken } from "./string";

const instance = axios.create({
  timeout: 1000,
});

axios.interceptors.request.use(
  (config) => {
    console.log("step-1", config);
    const token = servicesGetStorage(TOKEN);
    if (!!token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    if (status === 401) {
      if (error.response.data.message === "TokenExpiredError") {
        const originalRequest = config;
        const refreshToken = await servicesGetStorage(RETOKEN);
        let newAccessToken;

        // servicesPostData(urlRefreshtoken, {}, refreshToken).then(
        //   (res) => (newAccessToken = res.data.jtoken)
        // );
        // console.log("newAccessToken", newAccessToken);
        // axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
