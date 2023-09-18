import { useEffect, useRef } from "react";
import { urlGetImages } from "./string";
import { servicesPostData } from "./api";

export function useDidMountEffect(func, deps) {
  const didMount = useRef(false);

  // eslint-disable-next-line
  return useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

export function useGetImage(setImage, companyDetail) {
  const reqImgs = useRef({ imgImg: "", totalImg: "", regimgs: "" });

  // eslint-disable-next-line
  useEffect(() => {
    if (companyDetail.titleImg && companyDetail.imgs) {
      reqImgs.current.totalImg =
        companyDetail.titleImg + "," + companyDetail.imgs;

      servicesPostData(urlGetImages, {
        imgs: reqImgs.current.totalImg,
      }).then((res) => {
        setImage(res.data);
        console.log(res.data);
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

export function useGetContentImgs(setImage, companyDetail) {
  const reqImgs = useRef({ imgImg: "", totalImg: "" });

  // eslint-disable-next-line
  useEffect(() => {
    reqImgs.current.totalImg =
      companyDetail.titleImg + "," + companyDetail.imgs;

    servicesPostData(urlGetImages, {
      imgs: reqImgs.current.totalImg,
    }).then((res) => {
      setImage(res.data);
      console.log(res.data);
    });
  }, [companyDetail]);
}

export function useGetimgStringImgs(setImage, companyDetail) {
  // eslint-disable-next-line
  useEffect(() => {
    servicesPostData(urlGetImages, {
      imgs: companyDetail.imgString,
    }).then((res) => {
      setImage(res.data);
    });
  }, [companyDetail.imgString]);
}
