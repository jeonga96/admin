import { useSelector, shallowEqual } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import PieceLoading from "../piece/PieceLoading";
import ServiceModalUseSafeNumber from "../services/ServiceModalUseSafeNumber";

import * as API from "../../service/api";
import * as MO from "../../service/library/modal";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as UD from "../../service/userData";

export default function ChildSafeNum() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const { handleSubmit, register, setValue, getValues, watch } = useForm({});

  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(false);

  // 안심번호 검색 & 사용할 수 있는 안심번호 리스트 중 가장 앞 작은 안심번호 사지고 오기
  const fnSelectSafeNum = (selectNum, e) => {
    if (e !== undefined) {
      setClick(false);
    }
    setValue("_vno", selectNum);
  };

  const fnSafeNumSubmit = () => {
    // const VNO = getValues("_vno").replaceAll("-", "").toString();
    // const RCVNO1 = getValues("_rcvNo1").replaceAll("-", "").toString();
    // setLoading(true);
    // return API.servicesPostData(APIURL.urlCreate050, {
    //   channelId: "wazzang",
    //   vno: VNO,
    //   vnoName: getValues("_vnoName"),
    //   status: "Y",
    //   rcvNo1: RCVNO1,
    //   rcvNo2: "",
    //   bizStartTime: "0000",
    //   bizEndTime: "2359",
    //   colorringIdx: 119158,
    //   rcvMentIdx: 119159,
    //   bizEndMentIdx: 119160,
    //   holiMentIdx: 119161,
    //   holiWeek: "11111",
    //   holiDay: "1111111",
    //   holidaySet: "N",
    //   recType: "0",
    // })
    //   .then((res) => {
    //     if (res.status === "success") {
    //       API.servicesPostData(APIURL.urlSetCompanyDetail, {
    //         rcid: cid,
    //         extnum: getValues("_vno"),
    //       }).then((res) => {
    //         if (res.status === "success") {
    //           setLoading(false);
    //           MO.servicesUseModalSafeNum(
    //             "사업자 상세정보를 입력하시겠습니까?",
    //             "상세정보 입력을 끝내시려면 목록으로 가기를 클릭하십시오.",
    //             () => {
    //               navigate(`/company/${cid}`);
    //             },
    //             () => {
    //               navigate(`/company`);
    //             }
    //           );
    //         }
    //       });
    //     } else {
    //       console.log("urlCreate050 API 오류");
    //       TOA.servicesUseToast(res.emsg, "e");
    //     }
    //   })
    //   .catch((error) => {
    //     // urlCreate050 작업중 네트워크 오류
    //     console.log("urlCreate050 작업중 네트워크 오류", error);
    //     TOA.servicesUseToast("작업이 완료되지 않았습니다.", "e");
    //   });
  };

  useEffect(() => {
    if (!!getedData) {
      setValue("_rcvNo1", getedData.mobile);
      setValue("_vnoName", getedData.cname);
    }
    if (!!getedData.extnum) {
      const VNO = getedData.extnum.replaceAll("-", "").toString();
      API.servicesPostData(APIURL.urlGet050, { vno: VNO }).then((res) => {
        setValue("_vno", res.data.vno);
        setValue("_vnoName", res.data.vnoName);
        setValue("_rcvNo1", res.data.rcvNo1);
      });
    }
  }, [getedData]);

  return (
    <form className="formLayout" onSubmit={handleSubmit(fnSafeNumSubmit)}>
      <PieceLoading loading={loading} bg />
      <div className="formWrap">
        <fieldset id="CompanyDetail_3">
          <h3>
            기본 안심번호 정보
            <button type="submit">번호 등록</button>
          </h3>

          {click && (
            <ServiceModalUseSafeNumber
              click={click}
              setClick={setClick}
              fn={fnSelectSafeNum}
            />
          )}

          {/* setDetailUserInfo  ================================================================ */}
          <div className="formContentWrap" style={{ width: "100%" }}>
            <label htmlFor="vno" className=" blockLabel">
              <span>안심번호</span>
            </label>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                id="vno"
                maxLength="14"
                value={
                  (watch("_vno") &&
                    watch("_vno")
                      .replace(/[^0-9]/g, "")
                      .replace(/(^[0-9]{4})([0-9]+)([0-9]{4}$)/, "$1-$2-$3")
                      .replace("--", "-")) ||
                  ""
                }
                {...register("_vno")}
              />
              <button
                type="button"
                className="formContentBtn"
                onClick={() => setClick(!click)}
              >
                안심번호 검색
              </button>
            </div>
          </div>

          <div className="formContentWrap" style={{ width: "50%" }}>
            <label htmlFor="vnoName" className="blockLabel">
              <span>별칭</span>
            </label>
            <div>
              <input
                type="text"
                id="vnoName"
                maxLength={20}
                {...register("_vnoName")}
              />
            </div>
          </div>

          <div className="formContentWrap" style={{ width: "50%" }}>
            <label htmlFor="rcvNo1" className="blockLabel">
              <span>착신번호</span>
            </label>
            <div>
              <input
                type="text"
                id="rcvNo1"
                maxLength={13}
                value={
                  (watch("_rcvNo1") &&
                    watch("_rcvNo1")
                      .replace(/[^0-9]/g, "")
                      .replace(
                        /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                        "$1-$2-$3"
                      )
                      .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                      .replace("--", "-")) ||
                  ""
                }
                {...register("_rcvNo1")}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </form>
  );
}
