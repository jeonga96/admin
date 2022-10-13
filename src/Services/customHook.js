import { useEffect, useRef } from "react";
import { urlGetImages } from "./string";
import { servicesPostData } from "./importData";

export function useDidMountEffect(func, deps) {
  const didMount = useRef(false);

  return useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

export function useGetImage(setImage, companyDetail) {
  const reqImgs = useRef({ imgImg: "", totalImg: "" });

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
