// 공사콕 앱 관리 > 공사콕 배너관리

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as APIURL from "../../service/string/apiUrl";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as CUS from "../../service/customHook";

import SetImage from "../../components/services/ServicesImageSetUrl";

function InputBox({ title, category, noLink }) {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  const [list, setList] = useState([]);
  const [img, setImg] = useState([]);
  const [chooseInputBox, setChooseInputBox] = useState(0);
  const [clickedAdd, setClickedAdd] = useState(false);
  const [highestBannerNumber, setHighestBannerNumber] = useState(0);

  // 카테고리별 list get
  CUS.useCleanupEffect(() => {
    // 카테고리는 부모 컴포넌트에서 지정해서 전달
    API.servicesPostData(APIURL.urlContentList, {
      category: category,
    }).then((res) => {
      console.log(res);
      if (res.status === "success") {
        setList(res.data);
      }
    });
  }, []);

  const filteredList = list.filter((item) => item.useFlag === 1);
  // list 값이 변경될 때 실행
  // useEffect(() => {
  //   // console.log("useEffect, [list]");
  //   // list get이 완료된 후 & 배너 추가로 인한 list 변동이 아닐 때 실행
  //   if (list.length > 0 && clickedAdd === false) {
  //     setValue("_contentDetail", list[chooseInputBox].contentDetail);
  //     setValue(`_${category}UseFlag`, list[chooseInputBox].useFlag);

  //     const fetchImages = async (item) => {
  //       const res = await API.servicesPostData(APIURL.urlGetImages, {
  //         imgs: item.imgid,
  //       });

  //       // 이미지를 setImg 함수를 사용하여 추가 & list가 변경될 때마다 실해되기 때문에 중복값 제거 Set 추가
  //       const uniqueImages = new Set([...img, ...res.data]);
  //       const uniqueImageArray = Array.from(uniqueImages);
  //       // console.log("img", img);
  //       // 이미지를 설정한 후에 다음 이미지를 가져오도록 Promise 반환

  //       setImg(uniqueImageArray);
  //       console.log("res.data", res.data);
  //       console.log("img", img);
  //       return;
  //     };

  //     const fetchAllImages = async () => {
  //       // Promise.all에 매핑된 모든 프라미스를 실행하고 기다린 다음에 다음 단계로 진행
  //       await Promise.all(list.map((item) => fetchImages(item)));
  //     };

  //     fetchAllImages();
  //   }
  // }, [list]);

  useEffect(() => {
    if (list.length > 0 && clickedAdd === false) {
      setValue("_contentDetail", list[chooseInputBox].contentDetail);
      setValue(`_${category}UseFlag`, list[chooseInputBox].useFlag);

      // 이미지 가져오는 함수 정의
      const fetchImages = async (item) => {
        const res = await API.servicesPostData(APIURL.urlGetImages, {
          imgs: item.imgid,
        });
        return res.data;
      }; //fetchImages

      // 모든 이미지 가져오는 Promise 배열 생성
      const promises = list.map((item) => fetchImages(item));

      // Promise.all을 사용하여 모든 이미지 가져오기
      Promise.all(promises)
        .then((imageData) => {
          // 이미지 데이터를 합치고 중복 제거
          const combinedImageData = [].concat(...imageData);
          const uniqueImages = Array.from(new Set(combinedImageData));
          // 이미지 설정
          setImg(uniqueImages);
        })
        .catch((error) => {
          console.error("이미지 가져오기 오류:", error);
        }); //Promise
    }
    setHighestBannerNumber(list.length);
  }, [list]);

  const fnFormAdd = () => {
    TOA.servicesUseToast(
      "배너는 최대 1개까지 표시됩니다. 2개 이상의 배너를 올리고 싶으시면 관리자에게 문의해 주세요.",
      "e"
    );

    // setClickedAdd(true);
    // const newBannerNumber = highestBannerNumber + 1;
    // const newBanner = {
    //   category: category,
    //   contentString: list.length > 0 ? list[0].contentString || "" : "",
    //   contentDetail: list.length > 0 ? list[0].contentDetail || "" : "",
    //   imgid: "",
    //   useFlag: 1,
    // };
    // API.servicesPostData(APIURL.urlSetContent, newBanner)
    //   .then((res) => {
    //     if (res.status === "success") {
    //       const newList = [...list, newBanner];
    //       setList(newList);
    //       setChooseInputBox(newList.length - 1);
    //       setHighestBannerNumber(newBannerNumber);
    //       fnSubmit();
    //     }
    //   })
    //   .catch((error) => console.log("axios failed", error.response));
  };

  /** 배너 버튼 선책 이벤트 */
  const fnChooseButton = (index) => {
    setChooseInputBox(index);
    setValue(`_${category}UseFlag`, list[index].useFlag);
    setValue(`_contid`, list[index].contid);
    setValue(`_contentDetail`, list[index].contentDetail);
    setValue(`_contecontentStringntDetail`, list[index].contentString);
    setValue(`_category`, list[index].category);

    // imgid가 빈칸이 아닐 때 서버에서 iid를 통해 이미지를 가지고 온다.
    if (list[index].imgid !== "") {
      const imgid = list[index].imgid;
      const isImageAdded = img.some((item) => item && item.iid === imgid);
      // 버튼 클릭 시마다 추가되는 걸 방지하기 위한 조건
      if (!isImageAdded) {
        API.servicesPostData(APIURL.urlGetImages, {
          imgs: list[index].imgid,
        }).then((res) => {
          if (res.data && res.data.length > 0) {
            setImg([...img, res.data[0]]);
          }
        });
      }
    }
  };

  const fnSubmit = () => {
    if (!!list[chooseInputBox].contid) {
      // 배너 수정
      API.servicesPostData(APIURL.urlSetContent, {
        contid: list[chooseInputBox].contid,
        category: list[chooseInputBox].category,
        imgid: list[chooseInputBox].imgid,
        contentDetail: getValues("_contentDetail") || title,
        contentString: getValues("_contentString") || "",
        useFlag: getValues(`_${category}UseFlag`),
      })
        .then((res) => {
          if (res.status === "fail") {
            TOA.servicesUseToast("입력에 실패했습니다.", "e");
          }
          if (res.status === "success") {
            TOA.servicesUseToast("완료되었습니다!", "s");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            return;
          }
        })
        .catch((error) => console.log("axios 실패", error.response));
    } else {
      // 배너 추가
      API.servicesPostData(APIURL.urlSetContent, {
        category: list[chooseInputBox].category,
        imgid: list[chooseInputBox].imgid,
        contentDetail: getValues("_contentDetail") || title,
        contentString: getValues("_contentString") || "",
        useFlag: getValues(`_${category}UseFlag`),
      })
        .then((res) => {
          if (res.status === "fail") {
            TOA.servicesUseToast("입력에 실패했습니다.", "e");
          }
          if (res.status === "success") {
            TOA.servicesUseToast("완료되었습니다!", "s");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            return;
          }
        })
        .catch((error) => console.log("axios 실패", error.response));
    }
  };
  const fnDeleteBanner = () => {
    const updatedList = [...list];
    updatedList[chooseInputBox].useFlag = 0;
    setList(updatedList);

    // Optionally, you can send an API request to update the useFlag in the database
    API.servicesPostData(APIURL.urlSetContent, {
      contid: updatedList[chooseInputBox].contid,
      useFlag: 0,
    })
      .then((res) => {
        if (res.status === "success") {
          TOA.servicesUseToast("배너가 정상적으로 삭제되었습니다!", "s");

          // Logic to update focus to nearby number
          if (chooseInputBox > 0) {
            setChooseInputBox(chooseInputBox - 1); // Move focus to the previous item if possible
          } else if (filteredList.length > 1) {
            setChooseInputBox(chooseInputBox + 1); // Move focus to the next item if the first one was deleted
          } else {
            setChooseInputBox(0); // Reset to the first item, if the list becomes empty, it won't matter
          }
        } else {
          TOA.servicesUseToast("배너 삭제에 실패하였습니다!", "e");
        }
      })
      .catch((error) => console.log("axios failed", error.response));
  };

  console.log(
    "Keys: ",
    filteredList.map((el) => el.contid)
  );

  return (
    filteredList &&
    filteredList.length > 0 && (
      <tr>
        <td className="tableAppbannerImg">
          {img &&
          img.length > 0 &&
          filteredList[chooseInputBox]?.useFlag === 1 ? (
            <div
              style={{
                backgroundImage: `url('${
                  !!filteredList[chooseInputBox].imgid && img[chooseInputBox]
                    ? img[chooseInputBox].storagePath
                    : "/data/noimage.png"
                }')`,
              }}
            ></div>
          ) : null}
        </td>
        <td className="tableAppbannerContent">
          <h3>{title}</h3>
          <div style={{ height: "32px" }} className="submenuWrap">
            <div>
              {filteredList.length > 0 &&
                filteredList.map((el, index) => (
                  <button
                    key={el.contid || `default-${index}`}
                    type="button"
                    // key={el.contid}
                    className={
                      index === chooseInputBox ? "submenu focused " : "submenu"
                    }
                    onClick={() => fnChooseButton(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              {!noLink && (
                <button type="button" className="submenu" onClick={fnFormAdd}>
                  배너추가
                </button>
              )}
            </div>
            <div>
              <button
                type="button"
                className="submenu"
                style={{ backgroundColor: "#757575", color: "white" }}
                onClick={fnDeleteBanner}
              >
                삭제
              </button>
              <button
                type="button"
                className="submenu focused"
                style={{ backgroundColor: "#757575" }}
                onClick={fnSubmit}
                isSubmitting={isSubmitting}
              >
                저장
              </button>
            </div>
          </div>

          {/* 
          <div className="listSearchWrap" style={{ width: "100%" }}>
            <div className="blockLabel">
              <span>활성화</span>
            </div>

            <div className="formPaddingWrap" style={{ height: "32px" }}>
              <input
                className="listSearchRadioInput"
                type="radio"
                checked={watch(`_${category}UseFlag`) == "1"}
                value="1"
                id={`${category}UseFlag1`}
                {...register(`_${category}UseFlag`)}
              />
              <label
                className="listSearchRadioLabel"
                htmlFor={`${category}UseFlag1`}
              >
                활성화
              </label>
              <input
                className="listSearchRadioInput"
                type="radio"
                checked={watch(`_${category}UseFlag`) == "0"}
                value="0"
                id={`${category}UseFlag0`}
                {...register(`_${category}UseFlag`)}
              />
              <label
                className="listSearchRadioLabel"
                htmlFor={`${category}UseFlag0`}
              >
                비활성화
              </label>
            </div>
          </div> 
          */}

          <div className="listSearchWrap" style={{ width: "100%" }}>
            <div className="blockLabel">
              <span>배너이미지</span>
            </div>
            <div style={{ height: "32px" }}>
              <SetImage
                id={`${category}TitleImg`}
                setChangeImg={setImg}
                changeImg={img}
                chooseInputBox={chooseInputBox}
                setList={setList}
              />
            </div>
          </div>

          {!noLink && (
            <div className="listSearchWrap" style={{ width: "100%" }}>
              <div className="blockLabel">
                <span>URL 연결</span>
              </div>
              <div style={{ height: "32px" }} className="flexBox">
                <input
                  type="text"
                  id="contentDetail"
                  placeholder="연결될 URL을 입력해 주세요."
                  // {...register("_contentDetail")}
                  {...register("_contentDetail", {
                    pattern: {
                      value: /^http:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}/i,
                      message: "http / https로 시작해야 합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_mail"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
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
          )}
        </td>
      </tr>
    )
  );
}

export default function SetAdminAppbanner() {
  return (
    <>
      <form className="formLayout appbannerWrap">
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
              <InputBox category="bannerB2C1" title="B2C 첫번째 배너" />
              <InputBox category="bannerB2C2" title="B2C 두번째 배너" />
              <InputBox category="bannerB2C3" title="B2C 세번째 배너" />
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
              <InputBox category="bannerB2B1" title="B2B 첫번째 배너" />
              <InputBox category="bannerB2B2" title="B2B 두번째 배너" />
              <InputBox category="bannerB2B3" title="B2B 세번째 배너" />
              {/* <InputBox category="bannerB2B4" title="테스트용 배너" /> */}
            </tbody>
          </table>
        </div>

        <div className="commonBox">
          <table className="commonTable">
            <thead className="basicThead" style={{ border: "none" }}>
              <tr>
                <td>
                  <h2>공사콕 페이지 내 배너</h2>
                </td>
              </tr>
            </thead>
            <tbody>
              <InputBox
                category="bannerHanok"
                title="한옥/사찰/문화재 상단 배너"
                noLink
              />
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}
