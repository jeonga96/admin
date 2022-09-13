import axios from "axios";
import { useEffect, useRef } from "react";
import axiosApiInstance from "./axios";
import { TOKEN, urlRefreshtoken, urlGetImages } from "./string";

export function servicesSetStorage(name, data) {
  return localStorage.setItem(name, data);
}
export function servicesGetStorage(name) {
  return localStorage.getItem(name);
}

export function servicesRemoveStorage(name) {
  return localStorage.removeItem(name);
}

export function servicesGetData(url, getData) {
  return axiosApiInstance(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    data: getData,
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

export function servicesPostData(url, postData) {
  return axiosApiInstance(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: postData,
  })
    .then((res) => {
      console.log("importData.axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log("importData.axiosSetData error", error));
}

export function servicesPostDataForm(url, postData) {
  return axiosApiInstance(url, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: postData,
  })
    .then((res) => {
      console.log("importData.axiosSetData", res);
      return res.data;
    })
    .catch((error) => console.log(error));
}

export function servicesGetRefreshToken() {
  servicesPostData(urlRefreshtoken, {})
    .then((res) => {
      servicesSetStorage(TOKEN, res.data.jtoken);
    })
    .catch((err) => console.log("ㅠㅠerr", err));
}

export function useDidMountEffect(func, deps) {
  const didMount = useRef(false);

  return useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

export function useGetImage(setImage, companyDetail) {
  const reqImgs = useRef({ imgImg: "", totalImg: "" });

  useDidMountEffect(() => {
    if (companyDetail.titleImg && companyDetail.imgs) {
      reqImgs.current.totalImg =
        companyDetail.titleImg + "," + companyDetail.imgs;

      servicesPostData(urlGetImages, {
        imgs: reqImgs.current.totalImg,
      }).then((res) => {
        return setImage(res.data);
      });
    } else if (companyDetail.titleImg || companyDetail.imgs) {
      companyDetail.titleImg
        ? (reqImgs.current.imgImg = companyDetail.titleImg)
        : (reqImgs.current.imgImg = companyDetail.imgs);

      servicesPostData(urlGetImages, {
        imgs: reqImgs.current.imgImg,
      }).then((res) => {
        return setImage(res.data);
      });
    }
  }, [companyDetail]);
}

// export function useSetImage(setImage, companyDetail) {
//   const reqImgs = useRef({ titleImg: "", imgsImg: "", totalImg: "" });

//   useDidMountEffect(() => {
//     if (companyDetail.titleImg && companyDetail.imgs) {
//       reqImgs.current.totalImg =
//         companyDetail.titleImg + "," + companyDetail.imgs;
//       servicesPostData(urlGetImages, {
//         imgs: reqImgs.current.totalImg,
//       }).then((res) => {
//         return setImage(res.data);
//       });
//     } else if (companyDetail.titleImg || companyDetail.imgs) {
//       reqImgs.current.titleImg = companyDetail.titleImg;
//       reqImgs.current.imgsImg = companyDetail.imgs;

//       servicesPostData(urlGetImages, {
//         imgs: companyDetail.titleImg
//           ? reqImgs.current.titleImg
//           : reqImgs.current.imgsImg,
//       }).then((res) => {
//         return setImage(res.data);
//       });
//     }
//   }, [companyDetail]);
// }
