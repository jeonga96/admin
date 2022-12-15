import axios from "axios";
import { servicesGetStorage, servicesRemoveStorage } from "./importData";
import { TOKEN } from "./string";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.request.use(
  (config) => {
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
      toast.warn(
        "회원정보 저장이 만료되었습니다. 다시 로그인 해주세요! & 권한이 없습니다.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      servicesRemoveStorage(TOKEN);
      window.location.href = "/login";
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosApiInstance;
