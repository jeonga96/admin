// 공사콕 앱 관리 > 공사콕 배너관리

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as APIURL from "../../service/string/apiUrl";
import * as RAN from "../../service/useData/rander";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as CUS from "../../service/customHook";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import SetImage from "../../components/services/ServicesImageSetUrl_constuctdepartmentbanner";

function InputBox({ title, list, defaultCK }) {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  const [img, setImg] = useState([]);
  const [submitCk, setSubmitCk] = useState(false);

  CUS.useMountEffect(() => {
    // 값 설정
    setValue("_contentDetail", list.contentDetail);
    setValue("_useFlag", list.useFlag);

    // 이미지 가져오는 함수 정의
    const fetchImages = async (item) => {
      const res = await API.servicesPostData(APIURL.urlGetImages, {
        imgs: item.imgid,
      });
      return res.data;
    };

    // 이미지 가져오기
    fetchImages(list)
      .then((imageData) => {
        // 이미지 데이터를 설정
        setImg(imageData);
      })
      .catch((error) => {
        console.error("이미지 가져오기 오류:", error);
      });
  }, [list]);

  const fnSubmit = () => {
    if (submitCk) return;
    setSubmitCk(true);

    // 배너 수정
    API.servicesPostData(APIURL.urlSetContent, {
      contid: list.contid,
      category: list.category,
      imgid: img[0].iid,
      contentDetail: getValues("_contentDetail"),
      contentString: defaultCK ? "default" : title,
      useFlag: 1,
    })
      .then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
          setSubmitCk(false);
        }
        if (res.status === "success") {
          TOA.servicesUseToast("완료되었습니다!", "s");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          return;
        }
      })
      .catch((error) => {
        setSubmitCk(true);
        console.log("axios 실패", error.response);
      });
  };

  const fnDeleteBanner = () => {
    if (defaultCK) {
      TOA.servicesUseToast("전국구 배너는 삭제할 수 없습니다.", "e");
      return;
    }

    // Optionally, you can send an API request to update the useFlag in the database
    API.servicesPostData(APIURL.urlSetContent, {
      contid: list.contid,
      useFlag: 0,
    })
      .then((res) => {
        if (res.status === "success") {
          TOA.servicesUseToast("배너가 정상적으로 삭제되었습니다!", "s");
          RAN.serviesAfter1secondReload();
        } else {
          TOA.servicesUseToast("배너 삭제에 실패하였습니다!", "e");
        }
      })
      .catch((error) => console.log("axios failed", error.response));
  };

  return (
    <tr>
      <td className="tableAppbannerImg">
        <div
          style={{
            backgroundImage: `url('${
              !!img?.length > 0 ? img[0].storagePath : "/data/noimage.png"
            }')`,
          }}
        ></div>
      </td>
      <td className="tableAppbannerContent">
        <h3>{title} 배너 수정</h3>
        <div style={{ height: "32px" }} className="submenuWrap">
          <div>
            <button
              type="button"
              className="submenu"
              style={{ backgroundColor: "rgb(218, 57, 51)", color: "white" }}
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

        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>배너이미지</span>
          </div>
          <div style={{ height: "32px" }}>
            <SetImage id={`titleImg_${list.contid}`} setChangeImg={setImg} />
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
      </td>
    </tr>
  );
}

export default function SetAdminAppbanner() {
  const [list, setList] = useState([]);
  const [defaultList, setDefaultList] = useState("");

  CUS.useMountAndCleanEffect(() => {
    // 카테고리는 부모 컴포넌트에서 지정해서 전달
    API.servicesPostData(APIURL.urlContentList, {
      category: "building_department",
    }).then((res) => {
      console.log(APIURL.urlContentList, " : ", res);
      if (res.status === "success") {
        const allData = res.data;
        console.log(allData);
        const defaultItem = allData.find(
          (item) => item.contentString === "default"
        );
        const nonDefaultItems = allData.filter(
          (item) => item.contentString !== "default"
        );

        if (defaultItem) {
          setDefaultList(defaultItem);
        }
        setList(nonDefaultItems);
      }
    });
  });

  return (
    // defaultList.length > 0 && (
    <form className="formLayout appbannerWrap">
      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="지역 배너 추가" />
      </ul>
      <div className="commonBox">
        <table className="commonTable">
          <thead className="basicThead" style={{ border: "none" }}>
            <tr>
              <td>
                <h2 style={{ height: "40px" }}>전국구 배너</h2>
                <span style={{ fontSize: "14px" }}>
                  이미지 사이즈 ( 가로 990 * 세로 1100 )
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            {!!defaultList && (
              <InputBox list={defaultList} title="전국구" defaultCK />
            )}
          </tbody>
        </table>
      </div>
      {list.length > 0 && (
        <div className="commonBox">
          <table className="commonTable">
            <thead className="basicThead" style={{ border: "none" }}>
              <tr>
                <td>
                  <h2 style={{ height: "40px" }}>관할 지역 배너</h2>
                  <span style={{ fontSize: "14px" }}>
                    이미지 사이즈 ( 가로 990 * 세로 1100 )
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <InputBox
                  key={item.contid}
                  list={item}
                  title={item.contentString}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </form>
    // )
  );
}
