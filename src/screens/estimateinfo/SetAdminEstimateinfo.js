// 사업자 회원 관리 > 견적의뢰서 관리 > 공사콕 견적의뢰서 상세 관리 (!!esid)

import { useDispatch, shallowEqual, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as IDFN from "../../service/useData/idFunction";
import * as CLEAN from "../../service/useData/cleanup";
import * as UDIMAGE from "../../service/useData/image";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

import * as DATA from "../../action/data";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ImageSet from "../../components/services/ServicesImageSetPreview";
import ServiceModalGetUid from "../../components/services/ServiceModalGetUid";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";

export default function SetAdminEstimateinfo() {
  const { esid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitCk, setSubmitCk] = useState(false);

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (getValues("_isGongsa") === "0") {
      setValue("_gongsaType", "");
    } else if (getValues("_isGongsa") === "1") {
      setValue("_gongsaType", "emer,inday,reser");
    }
  }, [watch("_isGongsa")]);

  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_1", text: "견적의뢰서 관리" },
  ]);

  // 견적 요청 모달에서 관리 번호 선택 이벤트
  const fnSelectFrom = (res) =>
    IDFN.selectCompanyManagementNumber(res, setValue, setFromClick, "_fromUid");
  // 견적 수신 모달에서 관리 번호 선택 이벤트
  const fnSelectTo = (res) =>
    IDFN.selectCompanyManagementNumber(res, setValue, setToClick, "_toUid");

  // 견적요청/견적수형 검색 기능 모달
  const [fromClick, setFromClick] = useState(false);
  const [toClick, setToClick] = useState(false);

  // 비활성화/활성화 버튼
  const [useFlag, setUseFlag] = useState("");

  // 이미지 ------------------------------------------------------------------------
  const multiImgs = useSelector(
    (state) => state.image.multiImgsData,
    shallowEqual
  );
  const imgsIid = [];

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    // 추가 시 라디오&체크박스 기본 값
    setValue("_reqEstimate", "1");
    setValue("_reqBill", "1");
    setValue("_useFlag", "1");
    setValue("_canCard", "1");
    setValue("_canCashBill", "1");
    setValue("_isGongsa", 1);
    setValue("_gongsaType", "norm");

    // 해당 esid의 견적의뢰서 가지고 오기
    API.servicesPostData(APIURL.urlGetEstimateInfo, {
      esid: esid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 이미지 iid를 가지고 오기 위해 (imgs, titleImg) 사용
          dispatch(DATA.serviceGetedData(res.data));

          setUseFlag(res.data.useFlag);
          // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
          setValue("_fromUid", res.data.fromUid || "");
          setValue("_toUid", res.data.toUid || "");
          setValue("_reqDetail", res.data.reqDetail || "");
          setValue("_reqPrice", res.data.reqPrice || "");
          setValue(
            "_reqVisitDate",
            (res.data.reqVisit && res.data.reqVisit.slice(0, 10)) || ""
          );
          setValue(
            "_reqVisitTime",
            (res.data.reqVisit && res.data.reqVisit.slice(11, 19)) || ""
          );
          setValue("_addInfo", res.data.addInfo || "");
          setValue("_proDetail", res.data.proDetail || "");
          setValue("_proPrice", res.data.proPrice || "");
          setValue(
            "_proVisit",
            (res.data.proVisit && res.data.proVisit.slice(0, 10)) || ""
          );

          setValue(
            "_reqEstimate",
            res.data.reqEstimate && res.data.reqEstimate.toString()
          );
          setValue("_reqBill", res.data.reqBill && res.data.reqBill.toString());
          setValue("_useFlag", res.data.useFlag && res.data.useFlag.toString());
          setValue("_canCard", res.data.canCard && res.data.canCard.toString());

          setValue(
            "_canCashBill",
            res.data.canCashBill && res.data.canCashBill.toString()
          );
          setValue("_isGongsa", res.data.isGongsa);
          setValue(
            "_gongsaType",
            res.data.gongsaType && res.data.gongsaType.toString()
          );

          setValue("_readFlag", res.data.readFlag || "0");
          setValue("_siteAddress", res.data.siteAddress);
        }
      })
      .catch((res) => console.log(res));
    return () => {
      CLEAN.serviesCleanup(dispatch);
    };
  }, []);

  // 완료 이벤트
  function fnSubmit(e) {
    if (submitCk) return;
    setSubmitCk(true);

    UDIMAGE.serviesGetImgsIid(imgsIid, multiImgs);

    const reqDate = getValues("_reqVisitDate")
      ? `${getValues("_reqVisitDate")}T${getValues("_reqVisitTime")}`
      : "";

    const proDate = getValues("_proVisit")
      ? new Date(getValues("_proVisit")).toISOString().slice(0, 19)
      : "";

    // 공통된 데이터 분리
    const commonData = {
      toUid: getValues("_toUid"),
      fromUid: getValues("_fromUid"),
      isGongsa: getValues("_isGongsa"),
      gongsaType: getValues("_gongsaType")?.toString(),
      canCard: getValues("_canCard").toString(),
      canCashBill: getValues("_canCashBill").toString(),
      reqDetail: getValues("_reqDetail"),
      reqPrice:
        (getValues("_reqPrice") && getValues("_reqPrice").replace(",", "")) ||
        "",
      siteAddress: getValues("_siteAddress"),
      reqVisit: reqDate,
      reqEstimate: getValues("_reqEstimate"),
      reqBill: getValues("_reqBill"),
      addInfo: getValues("_addInfo"),
      addImgs: multiImgs && multiImgs.length > 0 ? imgsIid.toString() : "",
    };

    const proResponseData = {
      proDetail: getValues("_proDetail"),
      proPrice:
        (getValues("_proPrice") && getValues("_proPrice").replace(",", "")) ||
        "",
      proVisit: proDate,
    };

    // 요청서만 작성했을 때
    const requestData = {
      ...commonData,
      ...(getValues("_proVisit") ? proResponseData : {}),
    };

    const url = APIURL.urlSetEstimateInfo;

    // 요청서 생성 또는 수정
    API.servicesPostData(url, esid ? { esid, ...requestData } : requestData)
      .then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
          setSubmitCk(false);
          return;
        }

        if (res.status === "success") {
          TOA.servicesUseToast("완료되었습니다!", "s");

          if (!esid) {
            setTimeout(() => {
              window.location.href = `/estimateinfo/${res.data.esid}`;
            }, 2000);
          }
        }
      })
      .catch((error) => {
        setSubmitCk(false);
        console.log("axios 실패", error.response);
      });
  }

  // 견적요청 관리번호가 입력된 경우 해당 관리번호와 사업자 연결 여부를 파악한 후 사업자 명을 가지고 온다.
  useEffect(() => {
    if (!!getValues("_fromUid")) {
      API.servicesPostData(APIURL.urlGetUserCid, {
        uid: getValues("_fromUid"),
      })
        .then((res) => {
          if (res.status === "success") {
            API.servicesPostData(APIURL.urlGetCompanyDetail, {
              rcid: res.data.cid,
            }).then((res2) => {
              if (res2.status === "success" && !!res2.data.name) {
                setValue("_fromCname", res2.data.name);
              }
            });
          }
        })
        .catch((res) => console.log(res));
    }
  }, [getValues("_fromUid")]);

  // 견적수령 관리번호가 입력된 경우 해당 관리번호와 사업자 연결 여부를 파악한 후 사업자 명을 가지고 온다.
  useEffect(() => {
    if (!!getValues("_toUid")) {
      API.servicesPostData(APIURL.urlGetUserCid, {
        uid: getValues("_toUid"),
      })
        .then((res) => {
          if (res.status === "success") {
            API.servicesPostData(APIURL.urlGetCompanyDetail, {
              rcid: res.data.cid,
            }).then((res2) => {
              if (res2.status === "success" && !!res2.data.name) {
                setValue("_toCname", res2.data.name);
              }
            });
          }
        })
        .catch((res) => console.log(res));
    }
  }, [getValues("_toUid")]);

  // 비활성화, 활성화 버튼 이벤트
  const fnUseFlag = () => {
    const reqDate = getValues("_reqVisit")
      ? new Date(getValues("_reqVisit")).toISOString().slice(0, 19)
      : "";

    API.servicesPostData(APIURL.urlSetEstimateInfo, {
      esid: esid,
      useFlag: useFlag == 1 ? 0 : 1,
      toUid: getValues("_toUid"),
      fromUid: getValues("_fromUid"),
      isGongsa: getValues("_isGongsa"),
      gongsaType: getValues("_gongsaType").toString() || "",
      canCard: getValues("_canCard") || "",
      canCashBill: getValues("_canCashBill") || "",
      reqDetail: getValues("_reqDetail"),
      reqPrice:
        (getValues("_reqPrice") && getValues("_reqPrice").replace(",", "")) ||
        "",
      siteAddress: getValues("_siteAddress"),
      reqVisit: reqDate || "",
      reqEstimate: getValues("_reqEstimate"),
      reqBill: getValues("_reqBill"),
      addInfo: getValues("_addInfo"),
      addImgs: multiImgs && multiImgs.length > 0 ? imgsIid.toString() : "",
    }).then((res) => {
      console.log(res);
      if (res.status === "success") {
        TOA.servicesUseToast(
          `${useFlag == 1 ? "비활성화" : "활성화"} 작업이 완료되었습니다.`,
          "s"
        );
      } else {
        TOA.servicesUseToast(
          `${useFlag == 1 ? "비활성화" : "활성화"} 작업이 완료되지 못했습니다.`,
          "e"
        );
      }
      setTimeout(() => {
        navigate("/estimateinfo");
      }, 2000);
    });
  };

  return (
    <>
      <div className="commonBox">
        <div className="formLayout">
          <ul className="tableTopWrap tableTopBorderWrap">
            <ComponentTableTopScrollBtn data={tableTopScrollBtnData.current} />
            {/* 삭제버튼 */}
            {!!esid && (
              <LayoutTopButton
                fn={fnUseFlag}
                text={useFlag == "1" ? "비활성화" : "활성화"}
              />
            )}
            {/* 상단 앵커 버튼 */}
            {!!esid && (
              <LayoutTopButton
                url={`/estimateinfo/${esid}/proposalInfo/${getValues(
                  "_fromUid"
                )}/${getValues("_toUid")}`}
                text="견적서 작성"
              />
            )}
            <LayoutTopButton fn={goBack} text="목록으로 가기" />
            <LayoutTopButton text="완료" fn={handleSubmit(fnSubmit)} />
          </ul>

          <div className="formWrap">
            {/* 갼적서 요청 내용  ================================================================ */}
            <div className="formContainer" id="CompanyDetail_1">
              <h3>견적의뢰서 관리</h3>
              <fieldset>
                <h3>견적의뢰서 작성</h3>

                {/* 공사 견적의뢰서 작성 */}
                <div className="formContentWrap">
                  <label htmlFor="name" className=" blockLabel">
                    <span>공사 견적의뢰서 작성</span>
                  </label>
                  <div className="formPaddingWrap">
                    <input
                      type="radio"
                      value="1"
                      checked={watch("_isGongsa") == "1"}
                      id="isGongsa1"
                      className="listSearchRadioInput"
                      {...register("_isGongsa")}
                    />
                    <label htmlFor="isGongsa1" className="listSearchRadioLabel">
                      예
                    </label>

                    <input
                      type="radio"
                      value="0"
                      checked={watch("_isGongsa") == "0"}
                      id="isGongsa0"
                      className="listSearchRadioInput"
                      {...register("_isGongsa")}
                    />
                    <label htmlFor="isGongsa0" className="listSearchRadioLabel">
                      아니요 ( 기타 )
                    </label>
                  </div>
                </div>

                {/* 공사 타입 */}
                <div className="formContentWrap">
                  <label htmlFor="name" className=" blockLabel">
                    <span>공사 유형 선택</span>
                  </label>
                  <div
                    className={`formPaddingWrap ${
                      watch("_isGongsa") == 0 ? "isGongsa0" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      value="emer"
                      id="emer"
                      className="listSearchRadioInput"
                      checked={
                        (watch("_gongsaType") &&
                          watch("_gongsaType").includes("emer")) ||
                        false
                      }
                      {...register("_gongsaType")}
                      disabled={watch("_isGongsa") == 0}
                    />
                    <label htmlFor="emer" className="listSearchRadioLabel">
                      긴급
                    </label>
                    <input
                      type="checkbox"
                      value="inday"
                      id="inday"
                      className="listSearchRadioInput"
                      checked={
                        (watch("_gongsaType") &&
                          watch("_gongsaType").includes("inday")) ||
                        false
                      }
                      {...register("_gongsaType")}
                      disabled={watch("_isGongsa") == 0}
                    />
                    <label htmlFor="inday" className="listSearchRadioLabel">
                      당일
                    </label>

                    <input
                      type="checkbox"
                      value="reser"
                      id="reser"
                      className="listSearchRadioInput"
                      checked={
                        watch("_gongsaType") &&
                        watch("_gongsaType").includes("reser")
                          ? true
                          : false
                      }
                      {...register("_gongsaType")}
                      disabled={watch("_isGongsa") == 0}
                    />
                    <label htmlFor="reser" className="listSearchRadioLabel">
                      예약
                    </label>

                    <input
                      type="checkbox"
                      value=""
                      id="reset"
                      className="listSearchRadioInput"
                      checked={
                        watch("_gongsaType") == "" || !watch("_gongsaType")
                          ? true
                          : false
                      }
                      {...register("_gongsaType", {
                        onChange: (e) => {
                          if (!!watch("_gongsaType") && !e.target.value) {
                            setValue("_gongsaType", "");
                          }
                        },
                      })}
                      disabled={watch("_isGongsa") == 0}
                    />
                    <label htmlFor="reset" className="listSearchRadioLabel">
                      일반
                    </label>
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="fromUid" className=" blockLabel">
                    <span>작성자 *</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      style={{ width: "40%", marginBottom: "0px" }}
                      type="text"
                      id="fromUid"
                      name="_fromUid"
                      {...register("_fromUid", {
                        required: "입력되지 않았습니다.",
                      })}
                    />

                    <input
                      style={{ width: "45%" }}
                      type="text"
                      disabled
                      placeholder={
                        getValues("_fromUid") && "사업자 회원이 아닙니다."
                      }
                      {...register("_fromCname")}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setFromClick(true);
                      }}
                      className="formContentBtn"
                      style={{
                        width: "15%",
                        backgroundColor: "#757575",
                        color: "rgb(255, 255, 255)",
                      }}
                    >
                      검색
                    </button>

                    {fromClick && (
                      <ServiceModalGetUid
                        click={fromClick}
                        setClick={setFromClick}
                        fn={fnSelectFrom}
                      />
                    )}
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="toUid" className=" blockLabel">
                    <span>수령자 *</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      style={{ width: "40%", marginBottom: "0px" }}
                      type="text"
                      id="toUid"
                      {...register("_toUid", {
                        required: "입력되지 않았습니다.",
                      })}
                    />
                    <input
                      style={{ width: "45%" }}
                      type="text"
                      disabled
                      {...register("_toCname")}
                      placeholder={
                        getValues("_toUid") && "사업자 회원이 아닙니다."
                      }
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setToClick(true);
                      }}
                      className="formContentBtn"
                      style={{
                        width: "15%",
                        backgroundColor: "#757575",
                        color: "rgb(255, 255, 255)",
                      }}
                    >
                      검색
                    </button>

                    {toClick && (
                      <ServiceModalGetUid
                        click={toClick}
                        setClick={setToClick}
                        fn={fnSelectTo}
                      />
                    )}
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="reqDetail" className=" blockLabel">
                    <span>
                      원하는 공사 또는 <br />
                      기타 입력
                    </span>
                  </label>
                  <div>
                    <textarea
                      type="textara"
                      id="reqDetail"
                      placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
                      {...register("_reqDetail")}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="_reqDetail"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="reqPriceEsti" className=" blockLabel">
                    <span>견적의뢰 책정 금액</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      id="reqPriceEsti"
                      className="textAlineRight"
                      {...register("_reqPrice")}
                      value={
                        (watch("_reqPrice") &&
                          watch("_reqPrice")
                            .replace(/[^0-9]/g, "")
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                        ""
                      }
                      style={{ marginBottom: 0 }}
                    />
                    <span
                      style={{
                        width: "38px",
                        textAlign: "center",
                        lineHeight: "30px",
                      }}
                    >
                      원 이내
                    </span>
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="reqVisit" className=" blockLabel">
                    <span>방문 일정 선택</span>
                  </label>
                  <div>
                    <input
                      type="date"
                      id="reqVisit"
                      {...register("_reqVisitDate")}
                      style={{ width: "50%", marginBottom: 0 }}
                    />
                    <input
                      type="time"
                      id="reqVisit"
                      {...register("_reqVisitTime")}
                      style={{ width: "50%" }}
                    />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="address" className=" blockLabel">
                    <span>결제 관련</span>
                  </label>
                  <ul className="detailContent">
                    {/* 견적서 */}
                    <li style={{ width: "25%" }}>
                      <div>
                        <span>견적서 요청</span>
                        <div className="detailContentInputWrap">
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_reqEstimate") == "1"}
                            value="1"
                            id="reqEstimate1"
                            {...register("_reqEstimate")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="reqEstimate1"
                          >
                            필요
                          </label>

                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_reqEstimate") == "0"}
                            value="0"
                            id="reqEstimate0"
                            {...register("_reqEstimate")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="reqEstimate0"
                          >
                            불필요
                          </label>
                        </div>
                      </div>
                    </li>

                    {/* 세금 계산서 요청 */}
                    <li style={{ width: "25%" }}>
                      <div>
                        <span>세금계산서</span>
                        <div className="detailContentInputWrap">
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_reqBill") == "1"}
                            value="1"
                            id="DetailReqBill1"
                            {...register("_reqBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="DetailReqBill1"
                          >
                            필요
                          </label>

                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_reqBill") == "0"}
                            value="0"
                            id="DetailReqBill0"
                            {...register("_reqBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="DetailReqBill0"
                          >
                            불필요
                          </label>
                        </div>
                      </div>
                    </li>

                    {/* 카드 결제 */}
                    <li style={{ width: "25%" }}>
                      <div className="detailContentCheck">
                        <span style={{ width: "100px" }}>카드 결제</span>
                        <div className="detailContentInputWrap">
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canCard") == "1"}
                            value="1"
                            id="canCard1"
                            {...register("_canCard")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCard1"
                          >
                            예
                          </label>

                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canCard") == "0"}
                            value="0"
                            id="canCard0"
                            {...register("_canCard")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCard0"
                          >
                            아니오
                          </label>
                        </div>
                      </div>
                    </li>

                    {/* 현금영수증 */}
                    <li style={{ width: "25%" }}>
                      <div className="detailContentCheck">
                        <span style={{ width: "150px" }}>현금영수증</span>
                        <div className="detailContentInputWrap">
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canCashBill") == "1"}
                            value="1"
                            id="canCashBill1"
                            {...register("_canCashBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCashBill1"
                          >
                            필요
                          </label>
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canCashBill") == "0"}
                            value="0"
                            id="canCashBill0"
                            {...register("_canCashBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCashBill0"
                          >
                            불필요
                          </label>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="siteAddress" className=" blockLabel">
                    <span>공사 현장 장소</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="siteAddress"
                      name="_siteAddress"
                      placeholder="간단 입력"
                      {...register("_siteAddress")}
                    />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="addInfo" className=" blockLabel">
                    <span>전달 사항</span>
                  </label>
                  <div>
                    <textarea
                      id="addInfo"
                      placeholder="50자 이내로 입력해주세요."
                      {...register("_addInfo")}
                      maxLength={50}
                    />
                  </div>
                </div>

                <ImageSet id="addImgs" title="참고 이미지" />
              </fieldset>
            </div>

            {/* 갼적서 응답 내용  ================================================================ */}
            {/* <fieldset id="CompanyDetail_2">
              <h3>견적서 제출 내용</h3>

              <div className="formContentWrap">
                <label htmlFor="proVisit" className=" blockLabel">
                  <span>방문 제안일</span>
                </label>
                <div>
                  <input type="date" id="proVisit" {...register("_proVisit")} />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="proPrice" className=" blockLabel">
                  <span>공사 제안 금액</span>
                </label>
                <div>
                  <input
                    placeholder="견적 응답이 돌아오지 않았습니다."
                    id="proPrice"
                    value={
                      (watch("_proPrice") &&
                        watch("_proPrice")
                          .replace(/[^0-9]/g, "")
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                      ""
                    }
                    {...register("_proPrice")}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="proDetail" className=" blockLabel">
                  <span>제출 내용</span>
                </label>
                <div>
                  <textarea
                    id="proDetail"
                    placeholder="견적 응답이 돌아오지 않았습니다."
                    disabled={!!esid ? false : true}
                    {...register("_proDetail")}
                  />
                </div>
              </div>
            </fieldset> */}
          </div>
        </div>
      </div>
    </>
  );
}
