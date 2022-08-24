import axios from "axios";
import { servicesGetStorage, servicesRemoveStorage } from "./importData";
import { TOKEN } from "./string";

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.request.use(
  (config) => {
    console.log("interceptors.request.use", config);
    const token = servicesGetStorage(TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    console.log("axios nterceptors.respons", error);
    const {
      config,
      response: { status },
    } = error;
    if (
      (error.response.message =
        "Request failed with status code 403" && error.response.status === 403)
    ) {
      const originalRequest = config;
      alert("회원정보 저장이 만료되었습니다. 다시 로그인 해주세요!");
      servicesRemoveStorage(TOKEN);
      window.location.href = "/login";
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosApiInstance;