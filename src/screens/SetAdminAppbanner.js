import { useState, useLayoutEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  urlContentList,
  urlSetContent,
  urlGetImages,
} from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { useDidMountEffect } from "../Services/customHook";
import { serviesGetImgId, servicesUseToast } from "../Services/useData";

import LayoutTopButton from "../components/common/LayoutTopButton";
import SetImage from "../components/common/ServicesImageSetUrl";

function InputBox({ inputData, setinputData, item }) {
  // 상위 컴포넌트에게 전달하기 위한 함수, useState
  const [img, setImg] = useState(null);
  const fnsetinputData = (prev) => {
    setinputData(prev);
  };

  // contentDetail:랜딩 url 변경 함수
  const valueChange = (e, res) => {
    fnsetinputData({
      ...inputData,
      [item.contid]: {
        ...item,
        contentDetail: e.target.value,
        imgid:
          inputData[item.contid] !== undefined &&
          inputData[item.contid].hasOwnProperty("imgid") &&
          !!img
            ? img[0].iid
            : item.imgid,
      },
    });
  };

  // imgid:배너 이미지 수정 함수
  const imgChange = (e, res) => {
    fnsetinputData({
      ...inputData,
      [item.contid]: {
        ...item,
        imgid: res[0].iid,
        contentDetail:
          inputData[item.contid] !== undefined &&
          inputData[item.contid].hasOwnProperty("contentDetail")
            ? inputData[item.contid].contentDetail
            : item.contentDetail,
      },
    });
  };

  return (
    <>
      <h3>{item.contentString}</h3>
      <fieldset>
        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>배너이미지</span>
          </div>
          <div style={{ height: "32px" }}>
            <SetImage
              id={`titleImg${item.contid}`}
              setChangeImg={setImg}
              changeImg={img}
              onImgChange={imgChange}
            />
          </div>
        </div>
        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>랜딩 URL</span>
          </div>
          <div style={{ height: "32px" }}>
            <input
              type="text"
              id="contentDetail"
              placeholder="연결될 URL을 입력해 주세요."
              onChange={valueChange}
              defaultValue={item.contentDetail}
            />
          </div>
        </div>
      </fieldset>
    </>
  );
}

export default function SetAdminAppbanner() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  // 데이터 ------------------------------------------------------------------------
  // bannerList:배너 목록
  const [bannerList, setBannerList] = useState([]);
  const bannerReqSuccess = useRef(false);
  // inputData:수정된 내용 저장
  const [inputData, setinputData] = useState({});

  // 이미지 ------------------------------------------------------------------------
  // img:이미지 저장 / imgsIid:서버에 이미지를 보낼 때는, iid값만 필요 / changeImg: 이미지 수정 시 수정된 이미지 저장
  const [img, setImg] = useState(null);
  const imgsIid = [];

  // 카테고리별 배너 데이터 불러오기
  useLayoutEffect(() => {
    const categoryList = [
      "bannerB2B1",
      "bannerB2B2",
      "bannerB2B3",
      "bannerB2C1",
      "bannerB2C2",
      "bannerB2C3",
    ];

    for (const item of categoryList) {
      servicesPostData(urlContentList, {
        category: item,
      })
        .then((res) => {
          if (res.status === "success") {
            setBannerList((listRes) => [...listRes, ...res.data]);
          }
        })
        .catch((res) => console.log(res));
    }
    bannerReqSuccess.current = true;
  }, []);

  // 카테고리별 데이터를 모두 불러온 후 배너리스트 정렬
  useDidMountEffect(() => {
    if (bannerReqSuccess.current === true) {
      let categorySort = bannerList.sort(function (a, b) {
        let x = a.category.toLowerCase();
        let y = b.category.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      setBannerList(categorySort);
    }
  }, [bannerList]);

  // bannerlist의 데이터를 받아오면 기존 배너의 이미지 데이터를 받아온다.
  useDidMountEffect(() => {
    // serviesGetImgId(imgsIid, bannerB2B);
    serviesGetImgId(imgsIid, bannerList);
    servicesPostData(urlGetImages, {
      imgs: imgsIid.toString(),
    }).then((res) => {
      setImg(res.data);
    });
  }, [bannerList]);

  const fnSubmit = () => {
    if (inputData[Object.keys(inputData)] !== {}) {
      for (let i = 0; i < Object.keys(inputData).length; i++) {
        servicesPostData(urlSetContent, {
          contid: inputData[Object.keys(inputData)[i]].contid,
          category: inputData[Object.keys(inputData)[i]].category,
          imgid: inputData[Object.keys(inputData)[i]].imgid,
          contentDetail: inputData[Object.keys(inputData)[i]].contentDetail,
          contentString: inputData[Object.keys(inputData)[i]].contentString,
          useFlag: 1,
        })
          .then((res) => {
            if (res.status === "fail") {
              servicesUseToast("입력에 실패했습니다.", "e");
            }
            if (i === Object.keys(inputData).length - 1) {
              if (res.status === "success") {
                servicesUseToast("완료되었습니다!", "s");
                bannerReqSuccess.current = false;
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
                return;
              }
            }
          })
          .catch((error) => console.log("axios 실패", error.response));
      }
    }
  };

  // bannerlist imgid에 맞는 image storagePath 값을 전달해주는 함수
  const filterImgIid = (img, item) => {
    for (let i = 0; i < img.length; i++) {
      if (img[i].iid === item.imgid) {
        return img[i].storagePath;
      }
    }
  };

  return (
    <>
      <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
        <ul className="tableTopWrap">
          <LayoutTopButton text="완료" disabled={isSubmitting} />
        </ul>

        {/* 하단 list ---------------------------------------- */}
        <div className="commonBox">
          <table className="commonTable">
            <tbody className="commonTable">
              {bannerList &&
                bannerList.map((item) => (
                  <tr key={item.contid} style={{ height: "5.25rem" }}>
                    <td
                      style={{
                        width: "500px",
                        height: "197px",
                      }}
                    >
                      <div
                        style={
                          img && {
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url('${filterImgIid(
                              img,
                              item
                            )}')`,
                            margin: "0 auto",
                          }
                        }
                      ></div>
                    </td>
                    <td>
                      <InputBox
                        item={item}
                        inputData={inputData}
                        setinputData={setinputData}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}
