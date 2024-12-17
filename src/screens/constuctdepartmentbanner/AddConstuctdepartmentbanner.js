// 공사콕 앱 관리 > 공사콕 배너관리

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";

import * as APIURL from "../../service/string/apiUrl";
import * as RAN from "../../service/useData/rander";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as CUS from "../../service/customHook";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import SetImage from "../../components/services/ServicesImageSetUrl_constuctdepartmentbanner";

export default function SetAdminAppbanner() {
  const { register, getValues, setValue, watch, reset, handleSubmit } =
    useForm();
  const navigate = useNavigate();
  const [img, setImg] = useState([]);

  const [sido, setSido] = useState([]);
  const [gungu, setGungu] = useState([]);

  CUS.useMountAndCleanEffect(() => {
    API.servicesPostData(APIURL.urlGetDepartInfo, {}).then((res) =>
      setSido(res.data)
    );
  });

  CUS.useDidMountEffect(() => {
    API.servicesPostData(APIURL.urlGetDepartInfo, {
      sido: getValues("_sido"),
    }).then((res) => setGungu(res.data));
  }, [watch("_sido")]);

  const fnAddSubmit = async () => {
    if (!getValues("_sido")) {
      return TOA.servicesUseToast("지역을 선택해 주세요.", "e");
    }

    if (!img[0]?.iid) {
      return TOA.servicesUseToast("배너이미지를 등록해주세요.", "e");
    }

    const listCK = await API.servicesPostData(APIURL.urlContentList, {
      category: "building_department",
      contentString: `${getValues("_sido")} ${getValues("_gungu")}`,
    });

    if (listCK.data[0].contentString !== "default") {
      TOA.servicesUseToast(
        "관할 지역 배너는 1개 까지만 등록 가능합니다. 등록된 정보를 수정해주세요.",
        "e"
      );
      return;
    }

    // 배너 추가
    API.servicesPostData(APIURL.urlSetContent, {
      category: "building_department",
      imgid: img[0].iid,
      contentString: `${getValues("_sido")} ${getValues("_gungu")}`.trim(),
      contentDetail: getValues("_contentDetail"),
      useFlag: 1,
    })
      .then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          TOA.servicesUseToast("완료되었습니다!", "s");
          setTimeout(() => {
            navigate(`/constuctdepartmentbanner`);
          }, 1000);
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  return (
    <form className="formLayout appbannerWrap">
      <ul className="tableTopWrap">
        <LayoutTopButton
          url={`/constuctdepartmentbanner`}
          text="목록으로 가기"
        />
        <LayoutTopButton fn={fnAddSubmit} text="저장" />
      </ul>

      <div className="commonBox">
        <table className="commonTable">
          <thead className="basicThead" style={{ border: "none" }}>
            <tr>
              <td>
                <h2 style={{ height: "40px" }}>관할지역 배너 추가</h2>
                <span style={{ fontSize: "14px" }}>
                  이미지 사이즈 ( 가로 990 * 세로 1100 )
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="appbannerAddWrap">
              <td className="tableAppbannerImg">
                <div
                  style={{
                    backgroundImage: `url('${
                      !!img?.length > 0
                        ? img[0].storagePath
                        : "/data/noimage.png"
                    }')`,
                  }}
                ></div>
              </td>
              <td className="tableAppbannerContent">
                <div className="listSearchWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>지역 선택</span>
                  </div>
                  <div style={{ height: "32px" }}>
                    <select {...register("_sido")}>
                      <option value="">추가할 지역 선택</option>
                      {sido.map((item, key) => (
                        <option key={key + 1} value={item.sido}>
                          {item.sido}
                        </option>
                      ))}
                    </select>
                    {gungu?.length > 0 && (
                      <select {...register("_gungu")}>
                        <option value="">전체</option>
                        {gungu.map((item, key) => (
                          <option key={key} value={item.gungu}>
                            {item.gungu}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="listSearchWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>배너이미지</span>
                  </div>
                  <div style={{ height: "32px" }}>
                    <SetImage id={`TitleImg`} setChangeImg={setImg} add />
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
                      {...register("_contentDetail", {})}
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
          </tbody>
        </table>
      </div>
    </form>
  );
}
