import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { urlGetImages } from "./string/apiUrl";
import { servicesPostData } from "./api";
import { serviesCleanup } from "./useData/cleanup";

/**
 * 처음 마운트될 때 제외, deps 값이 변경될 때마다 함수 실행
 * @param {*} func
 * @param {*} deps
 * @returns
 */
export function useDidMountEffect(func, deps) {
  const didMount = useRef(false);

  return useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}

/**
 * 처음 마운트 될 때만 함수 실행
 * @param {*} func
 */
export function useMountEffect(func) {
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      func();
      didMount.current = true;
    }
  }, []); // deps 배열을 비워 두어 처음 마운트될 때만 실행되도록 함
}

/**
 * 컴포넌트가 언마운트되거나 deps가 변경될 때 serviesCleanup (click, data 초기화) 함수를 호출
 * @param {*} func
 * @param {*} deps
 * @returns
 */
export function useCleanupEffect(func, deps) {
  const dispatch = useDispatch();
  return useEffect(() => {
    func();
    return () => {
      serviesCleanup(dispatch);
    };
  }, deps);
}

/**
 * 처음 마운트 될 때만 함수 실행
 * @param {*} func
 */
export function useMountAndCleanEffect(func) {
  const didMount = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!didMount.current) {
      func();
      didMount.current = true;
      return () => {
        serviesCleanup(dispatch);
      };
    }
  }, []); // deps 배열을 비워 두어 처음 마운트될 때만 실행되도록 함
}

/**
 * 컴포넌트가 마운트되거나 companyDetail이 변경될 때 이미지 데이터를 가져와 상태 업데이트
 * useRef 훅을 사용하여 요청할 이미지 정보를 저장합니다.
 * @param {*} setImage
 * @param {*} companyDetail
 */
export function useGetImage(setImage, companyDetail) {
  const reqImgs = useRef({ imgImg: "", totalImg: "", regimgs: "" });

  useEffect(() => {
    // companyDetail의 titleImg와 imgs를 검사
    if (companyDetail.titleImg && companyDetail.imgs) {
      reqImgs.current.totalImg =
        companyDetail.titleImg + "," + companyDetail.imgs;

      // totalImg로 이미지 요청
      servicesPostData(urlGetImages, {
        imgs: reqImgs.current.totalImg,
      }).then((res) => {
        setImage(res.data); // 이미지 상태 업데이트
        console.log(res.data);
      });
    } else if (companyDetail.titleImg || companyDetail.imgs) {
      // titleImg 또는 imgs가 하나만 있는 경우
      reqImgs.current.imgImg = companyDetail.titleImg || companyDetail.imgs;

      // imgImg로 이미지 요청
      servicesPostData(urlGetImages, {
        imgs: reqImgs.current.imgImg,
      }).then((res) => {
        setImage(res.data); // 이미지 상태 업데이트
      });
    }
  }, [companyDetail, setImage]); // companyDetail과 setImage가 변경될 때 useEffect 재실행
}

/**
 * ompanyDetail이 변경될 때마다 이미지를 가져옴
 * @param {*} setImage
 * @param {*} companyDetail
 */
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

/**
 * companyDetail.imgString이 변경될 때마다 이미지를 가져옴
 * @param {*} setImage
 * @param {*} companyDetail
 */
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

/**
 * 2초 뒤에 새로고침 하기
 */
export function useUrlMove(url) {
  const navigate = useNavigate();

  // 네비게이션 함수를 반환
  return (url) => {
    navigate(url);
  };
}
