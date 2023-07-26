// 공사콕 앱 관리 > 공사콕 배너관리

import { useState, useLayoutEffect, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as STR from "../../service/string";
import * as API from "../../service/api";
import * as CH from "../../service/customHook";
import * as UD from "../../service/useData";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import SetImage from "../../components/services/ServicesImageSetUrl";

function InputBox({ inputData, setinputData, title, allItem, image }) {
  // 상위 컴포넌트에게 전달하기 위한 함수, useState
  const [img, setImg] = useState(null);
  const [clickTab, setClickTab] = useState(0);

  const [addClicked, setAddClicked] = useState(false);
  const [addImg, setAddImg] = useState({});
  const [useFlagClickd, setUseFlagClicked] = useState("1");

  const { register, setValue, watch } = useForm({
    defaultValues: {
      _contentDetail: allItem[clickTab].contentDetail,
    },
  });

  useEffect(() => {
    setUseFlagClicked(allItem[clickTab].useFlag);
    setValue("_contentDetail", allItem[clickTab].contentDetail);
  }, [clickTab]);

  const fnsetinputData = (prev) => {
    setinputData(prev);
  };

  // contentDetail:랜딩 url 변경 함수

  const valueChange = (e, res) => {
    fnsetinputData({
      ...inputData,
      [allItem[clickTab].contid]: {
        ...allItem[clickTab],
        contentDetail: e.target.value,
        useFlag: useFlagClickd,
        imgid:
          inputData[allItem[clickTab].contid] !== undefined &&
          inputData[allItem[clickTab].contid].hasOwnProperty("imgid") &&
          !!img
            ? img[0].iid
            : allItem[clickTab].imgid,
      },
    });
  };

  const RadioChange = (e, res) => {
    setUseFlagClicked(e.target.value);
    fnsetinputData({
      ...inputData,
      [allItem[clickTab].contid]: {
        ...allItem[clickTab],
        useFlag: e.target.value,
        contentDetail:
          inputData[allItem[clickTab].contid] !== undefined &&
          inputData[allItem[clickTab].contid].hasOwnProperty("contentDetail")
            ? inputData[allItem[clickTab].contid].contentDetail
            : allItem[clickTab].contentDetail,
        imgid:
          inputData[allItem[clickTab].contid] !== undefined &&
          inputData[allItem[clickTab].contid].hasOwnProperty("imgid") &&
          !!img
            ? img[0].iid
            : allItem[clickTab].imgid,
      },
    });
  };

  // imgid:배너 이미지 수정 함수
  const imgChange = (e, res) => {
    if (addImg.imgid !== "") {
      fnsetinputData({
        ...inputData,
        [allItem[clickTab].contid]: {
          ...allItem[clickTab],
          imgid: res[0].iid,
          useFlag: useFlagClickd,
          contentDetail:
            inputData[allItem[clickTab].contid] !== undefined &&
            inputData[allItem[clickTab].contid].hasOwnProperty("contentDetail")
              ? inputData[allItem[clickTab].contid].contentDetail
              : allItem[clickTab].contentDetail,
        },
      });
    } else {
      setAddImg({
        imgid: res[0].iid,
      });
    }
  };

  const filterImage = (img, item) => {
    for (let i = 0; i < img.length; i++) {
      if (img[i].iid === item.imgid) {
        return img[i].storagePath;
      }
    }
  };

  const fnFormAdd = () => {
    setAddClicked(!addClicked);
    if (addClicked === true) {
      API.servicesPostData(STR.urlSetContent, {
        category: allItem[0].category,
        contentString: allItem[0].contentString,
        contentDetail: watch("_contentDetail"),
        imgid: addImg.imgid,
        useFlag: useFlagClickd,
      })
        .then((res) => {
          if (res.status === "fail") {
            UD.servicesUseToast("입력에 실패했습니다.", "e");
          }

          if (res.status === "success") {
            UD.servicesUseToast("완료되었습니다!", "s");
            setAddImg(null);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            return;
          }
        })
        .catch((error) => console.log("axios 실패", error.response));
    } else {
      setValue("_contentDetail", "");
      setImg(null);
      setAddImg({ imgid: "" });
    }
  };

  return (
    <tr style={{ height: "5.25rem" }}>
      <td className="tableAppbannerTd">
        <div
          style={
            image && {
              backgroundImage: `url('${filterImage(
                image,
                allItem[clickTab]
              )}')`,
            }
          }
        >
          {allItem[clickTab].useFlag == 0 && <div className="dasableTag"></div>}
        </div>
      </td>
      <td>
        <h3>{title}</h3>
        <ul style={{ height: "32px" }} className="submenuWrap">
          {allItem.map((el, index) => (
            <button
              type="button"
              key={el.contid}
              className={
                index === clickTab && addClicked === false
                  ? "submenu focused"
                  : "submenu"
              }
              onClick={() => setClickTab(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            className={
              addClicked === true ? "submenu add focused" : "submenu add"
            }
            onClick={fnFormAdd}
          >
            {addClicked ? "저장" : "배너추가"}
          </button>
        </ul>
        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>활성화</span>
          </div>

          <div className="formPaddingWrap" style={{ height: "32px" }}>
            <input
              className="listSearchRadioInput"
              type="radio"
              checked={useFlagClickd == "1"}
              value="1"
              id={allItem[clickTab].contid + "useFlag1"}
              onChange={RadioChange}
            />
            <label
              className="listSearchRadioLabel"
              htmlFor={allItem[clickTab].contid + "useFlag1"}
            >
              활성화
            </label>
            <input
              className="listSearchRadioInput"
              type="radio"
              checked={useFlagClickd == "0"}
              value="0"
              id={allItem[clickTab].contid + "useFlag0"}
              onChange={RadioChange}
            />
            <label
              className="listSearchRadioLabel"
              htmlFor={allItem[clickTab].contid + "useFlag0"}
            >
              비활성화
            </label>
          </div>
        </div>

        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>배너이미지</span>
          </div>
          <div style={{ height: "32px" }}>
            <SetImage
              add={addClicked ? true : false}
              id={`titleImg${allItem[clickTab].contid}`}
              setChangeImg={setImg}
              changeImg={img}
              onImgChange={imgChange}
            />
          </div>
        </div>

        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>URL 연결</span>
          </div>
          <div style={{ height: "32px" }} className="flexBox">
            <input
              type="text"
              id="contentDetail"
              placeholder="연결될 URL을 입력해 주세요."
              {...register("_contentDetail", {
                onChange: valueChange,
              })}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.open("about:blank").location.href =
                  watch("_contentDetail");
              }}
              className="formButton"
              style={{ width: "200px", marginLeft: "4px" }}
            >
              해당 페이지로 이동
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function SetAdminAppbanner() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  // 데이터 ------------------------------------------------------------------------
  // bannerList:배너 목록

  const [bannerB2B1, setbannerB2B1] = useState([]);
  const [bannerB2B2, setbannerB2B2] = useState([]);
  const [bannerB2B3, setbannerB2B3] = useState([]);
  const [bannerB2C1, setbannerB2C1] = useState([]);
  const [bannerB2C2, setbannerB2C2] = useState([]);
  const [bannerB2C3, setbannerB2C3] = useState([]);
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
      API.servicesPostData(STR.urlContentList, {
        category: item,
      })
        .then((res) => {
          if (res.status === "success") {
            for (let i = 0; i < res.data.length; i++) {
              switch (res.data[i].category) {
                case "bannerB2B1":
                  setbannerB2B1(res.data);
                  break;

                case "bannerB2B2":
                  setbannerB2B2(res.data);
                  break;

                case "bannerB2B3":
                  setbannerB2B3(res.data);
                  break;

                case "bannerB2C1":
                  setbannerB2C1(res.data);
                  break;

                case "bannerB2C2":
                  setbannerB2C2(res.data);
                  break;

                default:
                  setbannerB2C3(res.data);
              }
            }
          }
        })
        .catch((res) => console.log(res));
    }
  }, []);

  // bannerlist의 데이터를 받아오면 기존 배너의 이미지 데이터를 받아온다.
  CH.useDidMountEffect(() => {
    // const arrImgsIid = [];
    const array = [
      bannerB2C1,
      bannerB2C2,
      bannerB2C3,
      bannerB2B1,
      bannerB2B2,
      bannerB2B3,
    ];
    for (const item of array) {
      UD.serviesGetImgId(imgsIid, item);
    }
    API.servicesPostData(STR.urlGetImages, {
      imgs: imgsIid.toString(),
    }).then((res) => {
      setImg(res.data);
    });
  }, [
    imgsIid,
    bannerB2B1,
    bannerB2B2,
    bannerB2B3,
    bannerB2C1,
    bannerB2C2,
    bannerB2C3,
  ]);

  const fnSubmit = () => {
    if (inputData[Object.keys(inputData)] !== {}) {
      for (let i = 0; i < Object.keys(inputData).length; i++) {
        API.servicesPostData(STR.urlSetContent, {
          contid: inputData[Object.keys(inputData)[i]].contid,
          category: inputData[Object.keys(inputData)[i]].category,
          imgid: inputData[Object.keys(inputData)[i]].imgid,
          contentDetail: inputData[Object.keys(inputData)[i]].contentDetail,
          contentString: inputData[Object.keys(inputData)[i]].contentString,
          useFlag: inputData[Object.keys(inputData)[i]].useFlag,
        })
          .then((res) => {
            if (res.status === "fail") {
              UD.servicesUseToast("입력에 실패했습니다.", "e");
            }
            if (i === Object.keys(inputData).length - 1) {
              if (res.status === "success") {
                UD.servicesUseToast("완료되었습니다!", "s");
                // setBannerReqSuccess(false);
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

  return (
    <>
      <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
        <ul className="tableTopWrap">
          <LayoutTopButton text="완료" disabled={isSubmitting} />
        </ul>

        {/* 하단 list ---------------------------------------- */}
        <div className="commonBox">
          <table className="commonTable">
            <thead className="basicThead" style={{ border: "none" }}>
              <tr>
                <td>
                  <h2>B2C 배너 관리</h2>
                </td>
              </tr>
            </thead>
            <tbody>
              {bannerB2C1.length > 0 && (
                <InputBox
                  allItem={bannerB2C1}
                  title="B2C 첫번째 배너"
                  inputData={inputData}
                  setinputData={setinputData}
                  image={img}
                />
              )}

              {bannerB2C2.length > 0 && (
                <InputBox
                  allItem={bannerB2C2}
                  title="B2C 두번째 배너"
                  inputData={inputData}
                  setinputData={setinputData}
                  image={img}
                />
              )}

              {bannerB2C3.length > 0 && (
                <InputBox
                  allItem={bannerB2C3}
                  title="B2C 세번째 배너"
                  inputData={inputData}
                  setinputData={setinputData}
                  image={img}
                />
              )}
            </tbody>
          </table>
        </div>
        <div className="commonBox">
          <table className="commonTable">
            <thead className="basicThead" style={{ border: "none" }}>
              <tr>
                <td>
                  <h2>B2B 배너 관리</h2>
                </td>
              </tr>
            </thead>
            <tbody>
              {bannerB2B1.length > 0 && (
                <InputBox
                  allItem={bannerB2B1}
                  title="B2B 첫번째 배너"
                  inputData={inputData}
                  setinputData={setinputData}
                  image={img}
                />
              )}

              {bannerB2B2.length > 0 && (
                <InputBox
                  allItem={bannerB2B2}
                  title="B2B 두번째 배너"
                  inputData={inputData}
                  setinputData={setinputData}
                  image={img}
                />
              )}

              {bannerB2B3.length > 0 && (
                <InputBox
                  allItem={bannerB2B3}
                  title="B2B 세번째 배너"
                  inputData={inputData}
                  setinputData={setinputData}
                  image={img}
                />
              )}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}
