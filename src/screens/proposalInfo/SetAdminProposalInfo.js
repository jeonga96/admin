// 사업자 회원 관리 > 공사콕 견적서 > 공사콕 견적서 상세 관리 (prid 여부 확인)

import { useDispatch, shallowEqual, useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as CLEAN from "../../service/useData/cleanup";
import * as UDIMAGE from "../../service/useData/image";
import * as IDFN from "../../service/useData/idFunction";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

import * as DATA from "../../action/data";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentEstimateinfo from "../../components/common/ComponentEstimateinfo";
import ServicesImageSetPreview from "../../components/services/ServicesImageSetPreview";
import ServiceModalGetUid from "../../components/services/ServiceModalGetUid";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";

export default function SetAdminProposalInfo() {
  const location = useLocation();
  const { esid, prid, fromUid, toUid } = useParams();
  const [submitCk, setSubmitCk] = useState(false);
  const estiScreen = location.pathname?.includes("/estimateinfo");

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const dispatch = useDispatch();
  // react-hook-form 라이브러리
  const { handleSubmit, register, setValue, getValues, watch } = useForm({
    defaultValues: {
      _isGongsa: "1",
      _useFlag: "1",
      _gongsaType: "emer,inday,reser",
      _canNego: "1",
      _contMethod: "msg",
      _canTaxBill: "1",
      _canCard: "1",
      _canCashBill: "1",
      _canExtraProp: "1",
    },
  });

  // 견적 요청 모달에서 관리 번호 선택 이벤트
  const fnSelectFrom = (res) =>
    IDFN.selectCompanyManagementNumber(res, setValue, setFromClick, "_fromUid");
  // 견적 수신 모달에서 관리 번호 선택 이벤트
  const fnSelectTo = (res) =>
    IDFN.selectCompanyManagementNumber(res, setValue, setToClick, "_toUid");

  // 견적서 수정 시 앵커
  const tableTopScrollBtnDataSet = useRef([
    { idName: "CompanyDetail_1", text: "견적서 분류" },
    { idName: "CompanyDetail_2", text: "견적의뢰서 작성" },
    { idName: "CompanyDetail_3", text: "견적서 세부 내용" },
  ]);

  // 견적서 추가 시 앵커
  const tableTopScrollBtnDataAdd = useRef([
    { idName: "CompanyDetail_1", text: "견적서 분류" },
    { idName: "CompanyDetail_3", text: "견적서 세부 내용" },
  ]);

  // 견적요청/견적수형 검색 기능 모달
  const [toClick, setToClick] = useState(false);
  const [fromClick, setFromClick] = useState(false);

  // 비활성화/활성화 버튼
  const [useFlag, setUseFlag] = useState("");

  // get을 위한 데이터 저장
  const [fromData, setFromData] = useState([]);

  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  // 이미지 ------------------------------------------------------------------------
  // imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const multiImgs = useSelector(
    (state) => state.image.multiImgsData,
    shallowEqual
  );
  const imgsIid = [];

  useEffect(() => {
    if (getValues("_isGongsa") === "0") {
      setValue("_gongsaType", "");
    } else if (getValues("_isGongsa") === "1") {
      setValue("_gongsaType", "emer,inday,reser");
    }
  }, [watch("_isGongsa")]);

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    // 추가 시 기본 값

    // 수정 시 url에 prid를 확인하여 데이터 받아옴
    if (!estiScreen) {
      API.servicesPostData(APIURL.urlGetProposalInfo, {
        prid: prid,
      })
        .then((res) => {
          if (res.status === "success") {
            // 이미지 iid를 가지고 오기 위해 (imgs, titleImg) 사용
            dispatch(DATA.serviceGetedData(res.data));

            setUseFlag(res.data.useFlag);

            // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
            // setValue("_garea", res.data.garea || "");

            setValue("_fromUid", res.data.fromUid || "");
            setValue("_toUid", res.data.toUid || "");
            setValue("_gname", res.data.gname || "");
            setValue("_cname", res.data.cname || "");
            setValue("_cceo", res.data.cceo || "");
            setValue("_registration", res.data.registration || "");
            setValue("_corporationno", res.data.corporationno || "");
            setValue("_telnum", res.data.telnum || "");
            setValue("_price", res.data.price || "");
            setValue("_extraCon", res.data.extraCon || "");
            setValue("_caddr", res.data.caddr || "");
            setValue("_gaddr", res.data.gaddr || "");
            setValue("_useFlag", res.data.useFlag.toString() || "1");
            setValue("_canNego", res.data.canNego.toString() || "1");
            setValue("_contMethod", res.data.contMethod.toString() || "msg");
            setValue("_canTaxBill", res.data.canTaxBill.toString() || "1");
            setValue("_canCard", res.data.canCard.toString() || "1");
            setValue("_canCashBill", res.data.canCashBill.toString() || "1");
            setValue("_canExtraProp", res.data.canExtraProp.toString() || "1");
            setValue("_isGongsa", res.data.isGongsa);
            setValue("_gongsaType", res.data.gongsaType || "");
          }
        })
        .catch((res) => console.log(res));

      // 해당 esid의 견적의뢰서 가지고 오기
      API.servicesPostData(APIURL.urlGetEstimateInfo, {
        esid: esid,
      })
        .then((res) => {
          if (res.status === "success") {
            setValue("_isGongsa", res.data.isGongsa);
            setValue("_gongsaType", res.data.gongsaType || "");
            console.log(res.data.isGongsa);
            console.log(res.data.gongsaType && res.data.gongsaType.toString());
          }
        })
        .catch((res) => console.log(res));

      return () => {
        CLEAN.serviesCleanup(dispatch);
      };
    }
  }, []);

  // 견적의뢰서의 견적서 작성 페이지
  // fromUid를 확인하여 고객 정보 세팅
  useEffect(() => {
    if (fromUid && toUid) {
      // 견적수령
      setValue("_toUid", toUid);
      // 견적요청
      setValue("_fromUid", fromUid);

      // companyDetailInfo 입력

      setValue("_cceo", fromData.regOwner || "");
      setValue("_caddr", fromData.address || "");
      setValue("_telnum", fromData.extnum || fromData.mobilenum);
      setValue("_registration", fromData.registration);
      setValue("_cname", fromData.name);
      setValue(
        "_telnum",
        fromData.extnum || fromData.telnum || fromData.mobilenum
      );
      setValue("_corporationno", fromData.corporationno);

      // 해당 esid의 견적의뢰서 가지고 오기
      API.servicesPostData(APIURL.urlGetEstimateInfo, {
        esid: esid,
      })
        .then((res) => {
          console.log(res, esid);
          if (res.status === "success") {
            setValue("_isGongsa", res.data.isGongsa);
            setValue("_gongsaType", res.data.gongsaType || "");
          }
        })
        .catch((res) => console.log(res));
    }
  }, [fromData]);

  function fnSubmit(e) {
    if (submitCk) return;

    setSubmitCk(true);

    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    UDIMAGE.serviesGetImgsIid(imgsIid, multiImgs);
    // setUserDetailInfo 수정
    API.servicesPostData(
      APIURL.urlSetProposalInfo,
      // 견적서 응답 없음을 방문 제안일 기준으로 판단
      !estiScreen
        ? // 수정
          {
            prid: prid,
            fromUid: getValues("_fromUid"),
            toUid: getValues("_toUid"),
            isGongsa: getValues("_isGongsa")?.toString(),
            gongsaType: getValues("_gongsaType").toString() || "",
            gname: getValues("_gname"),
            // garea:
            //   typeof getValues("_garea") === "string"
            //     ? getValues("_garea").replace(",", "")
            //     : "",
            cname: getValues("_cname"),
            cceo: getValues("_cceo"),
            registration: getValues("_registration"),
            corporationno: getValues("_corporationno"),
            caddr: getValues("_caddr"),
            telnum: getValues("_telnum"),
            price:
              typeof getValues("_price") === "string"
                ? getValues("_price").replace(",", "")
                : "",
            canNego: getValues("_canNego").toString() || "",
            contMethod: getValues("_contMethod"),
            canTaxBill: getValues("_canTaxBill"),
            canCard: getValues("_canCard"),
            canCashBill: getValues("_canCashBill"),
            canExtraProp: getValues("_canExtraProp"),
            extraCon: getValues("_extraCon"),
            addImgs: imgsIid.toString() || "",
            useFlag: getValues("_useFlag"),
            gaddr: getValues("_gaddr"),
            resid: esid,
          }
        : // 추가
          {
            fromUid: getValues("_fromUid"),
            toUid: getValues("_toUid"),
            isGongsa: getValues("_isGongsa")?.toString(),
            gongsaType: getValues("_gongsaType").toString() || "",
            gname: getValues("_gname"),
            // garea: getValues("_garea").replace(",", ""),
            cname: getValues("_cname"),
            cceo: getValues("_cceo"),
            registration: getValues("_registration"),
            corporationno: getValues("_corporationno"),
            caddr: getValues("_caddr"),
            telnum: getValues("_telnum"),
            price:
              (getValues("_price") && getValues("_price").replace(",", "")) ||
              "",
            canNego: getValues("_canNego").toString() || "",
            contMethod: getValues("_contMethod"),
            canTaxBill: getValues("_canTaxBill"),
            canCard: getValues("_canCard"),
            canCashBill: getValues("_canCashBill"),
            canExtraProp: getValues("_canExtraProp"),
            extraCon: getValues("_extraCon"),
            gaddr: getValues("_gaddr"),
            addImgs: imgsIid.toString() || "",
            useFlag: getValues("_useFlag"),
          }
    )
      .then((res) => {
        console.log(res);
        if (res.status === "fail") {
          setSubmitCk(false);
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          TOA.servicesUseToast("완료되었습니다!", "s");
          setTimeout(() => {
            window.location.href = `/proposalInfo/${res.data.prid}`;
          }, 2000);

          return;
        }
      })
      .catch((error) => {
        setSubmitCk(false);
        console.log("axios 실패", error.response);
      });
  }

  // 견적요청 관리번호가 입력된 경우 해당 관리번호와 사업자 연결 여부를 파악한 후 사업자 명을 가지고 온다.
  useEffect(() => {
    if (!!getValues("_toUid")) {
      API.servicesPostData(APIURL.urlGetUserCid, {
        uid: getValues("_toUid"),
      }).then((res) => {
        if (res.status === "success") {
          API.servicesPostData(APIURL.urlGetCompanyDetail, {
            rcid: res.data.cid,
          }).then((res2) => {
            setFromData(res2.data);
            if (res2.status === "success" && !!res2.data.name) {
              setValue("_toCname", res2.data.name);
            }
          });
        }
      });
    }
  }, [getValues("_toUid")]);

  // 견적수령 관리번호가 입력된 경우 해당 관리번호와 사업자 연결 여부를 파악한 후 사업자 명을 가지고 온다.
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
              if (res2.data !== undefined && !!res2.data.name) {
                setValue("_fromCname", res2.data.name);
              }
            });
          }
        })
        .catch((res) => console.log(res));
    }
  }, [getValues("_fromUid")]);

  const fnUseFlag = () => {
    const reqDate = getValues("_reqVisit")
      ? new Date(getValues("_reqVisit")).toISOString().slice(0, 19)
      : "";

    API.servicesPostData(APIURL.urlSetProposalInfo, {
      prid: prid,
      useFlag: useFlag == 1 ? 0 : 1,
      toUid: getValues("_toUid"),
      fromUid: getValues("_fromUid"),
      isGongsa: getValues("_isGongsa")?.toString(),
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
      addImgs: multiImgs.length > 0 ? imgsIid.toString() : "",
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
        navigate("/proposalInfo");
      }, 2000);
    });
  };

  return (
    <>
      <div className="commonBox">
        <div className="formLayout">
          <ul className="tableTopWrap tableTopBorderWrap">
            {/* 삭제버튼 */}
            {!estiScreen && (
              <LayoutTopButton
                fn={fnUseFlag}
                text={useFlag == "1" ? "비활성화" : "활성화"}
              />
            )}

            {/* 상단 앵커 버튼 */}
            <ComponentTableTopScrollBtn
              data={
                !estiScreen
                  ? tableTopScrollBtnDataSet.current
                  : tableTopScrollBtnDataAdd.current
              }
            />
            <LayoutTopButton fn={goBack} text="목록으로 가기" />
            <LayoutTopButton text="완료" fn={handleSubmit(fnSubmit)} />
          </ul>

          <div className="formWrap">
            {/* 갼적서 요청 내용  ================================================================ */}
            <div className="formContainer">
              <h3>견적 기본 정보</h3>
              <fieldset id="CompanyDetail_1">
                <h3>견적서 분류</h3>

                {/* 공사 업체 */}
                <div className="formContentWrap">
                  <label htmlFor="name" className=" blockLabel">
                    <span>공사 업체</span>
                  </label>
                  <div className="formPaddingWrap">
                    <input
                      type="radio"
                      value="1"
                      checked={getValues("_isGongsa")?.toString() === "1"}
                      id="isGongsa1"
                      className="listSearchRadioInput"
                      {...register("_isGongsa", {
                        onChange: (e) => setValue("_isGongsa", e.target.value), // 변경 사항을 저장
                      })}
                    />
                    <label htmlFor="isGongsa1" className="listSearchRadioLabel">
                      예
                    </label>

                    <input
                      type="radio"
                      value="0"
                      checked={getValues("_isGongsa")?.toString() === "0"}
                      id="isGongsa0"
                      className="listSearchRadioInput"
                      {...register("_isGongsa", {
                        onChange: (e) => setValue("_isGongsa", e.target.value), // 변경 사항을 저장
                      })}
                    />
                    <label htmlFor="isGongsa0" className="listSearchRadioLabel">
                      아니요 ( 기타 )
                    </label>
                  </div>
                </div>

                {/* 공사 타입 */}
                <div className="formContentWrap">
                  <label htmlFor="name" className=" blockLabel">
                    <span>공사 유형</span>
                  </label>
                  <div
                    className={`formPaddingWrap ${
                      getValues("_isGongsa")?.toString() === 0
                        ? "isGongsa0"
                        : ""
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
                      disabled={getValues("_isGongsa")?.toString() === "0"}
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
                      disabled={getValues("_isGongsa")?.toString() === "0"}
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
                      disabled={getValues("_isGongsa")?.toString() === "0"}
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
                      disabled={getValues("_isGongsa")?.toString() === "0"}
                    />
                    <label htmlFor="reset" className="listSearchRadioLabel">
                      일반
                    </label>
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="fromUid" className=" blockLabel">
                    <span>견적서 작성자</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      style={{ width: "40%", marginBottom: "0px" }}
                      type="text"
                      id="fromUid"
                      name="_fromUid"
                      required
                      {...register("_fromUid")}
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
                    <span>견적서 수령자</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      style={{ width: "40%", marginBottom: "0px" }}
                      type="text"
                      id="toUid"
                      required
                      {...register("_toUid")}
                    />
                    <input
                      style={{ width: "45%" }}
                      type="text"
                      disabled
                      placeholder={
                        getValues("_toUid") && "사업자 회원이 아닙니다."
                      }
                      {...register("_toCname")}
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
              </fieldset>
            </div>

            <div className="formContainer">
              <h3>견적 내용 관리</h3>
              {/* CompanyDetail_2 ============================================================ */}
              {getedData.resid !== undefined && !estiScreen && (
                <ComponentEstimateinfo />
              )}

              {/* CompanyDetail_3 ============================================================ */}
              <fieldset id="CompanyDetail_3">
                <h3>
                  견적서 세부 내용
                  {getedData.readFlag == "1" ? (
                    <span>열람</span>
                  ) : (
                    <span>미열람</span>
                  )}
                </h3>

                <div className="formContentWrap">
                  <label htmlFor="gname" className=" blockLabel">
                    <span>공사명 ( 기타 )</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="gname"
                      {...register("_gname", {
                        required: "입력되지 않았습니다.",
                      })}
                    />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="cname" className=" blockLabel">
                    <span>상호명</span>
                  </label>
                  <div>
                    <input type="text" id="cname" {...register("_cname")} />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="cceo" className=" blockLabel">
                    <span>대표자</span>
                  </label>
                  <div>
                    <input type="text" id="cceo" {...register("_cceo")} />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="registration" className="blockLabel">
                    <span>사업자등록번호</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="registration"
                      maxLength="12"
                      value={
                        (watch("_registration") &&
                          watch("_registration")
                            .replace(/[^0-9]/g, "")
                            .replace(/([0-9]{3})([0-9]{2})([0-9]+)/, "$1-$2-$3")
                            .replace("--", "-")) ||
                        ""
                      }
                      {...register("_registration", {
                        required: "입력되지 않았습니다.",
                        pattern: {
                          value: /^[0-9]{3}-[0-9]{2}-[0-9]{5}/,
                          message: "형식에 맞지 않습니다.",
                        },
                      })}
                    />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="corporationno" className=" blockLabel">
                    <span>법인등록번호</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="corporationno"
                      maxLength="14"
                      value={
                        (watch("_corporationno") &&
                          watch("_corporationno")
                            .replace(/^(\d{0,6})(\d{0,7})$/g, "$1-$2")
                            .replace(/\-{1}$/g, "")) ||
                        ""
                      }
                      {...register("_corporationno")}
                    />
                  </div>
                </div>

                {/* 주소 */}
                <div className="formContentWrap">
                  <label htmlFor="caddr" className=" blockLabel">
                    <span>사업자 주소</span>
                  </label>
                  <div>
                    <input type="text" id="caddr" {...register("_caddr")} />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="telnum" className=" blockLabel">
                    <span>안심번호 ( 연락처 )</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="telnum"
                      maxLength={13}
                      value={
                        (watch("_telnum") &&
                          watch("_telnum")
                            .replace(/[^0-9]/g, "")
                            .replace(
                              /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                            .replace("--", "-")) ||
                        ""
                      }
                      {...register("_telnum", {
                        required: true,
                      })}
                    />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="gaddr" className=" blockLabel">
                    <span>공사 장소</span>
                  </label>
                  <div>
                    <input type="text" id="gaddr" {...register("_gaddr")} />
                  </div>
                </div>

                <div className="formContentWrap">
                  <div className="blockLabel">
                    <span>견적 금액</span>
                  </div>
                  <ul className="detailContent">
                    <li>
                      <div>
                        <span style={{ width: "100px" }}>견적금액</span>
                        <div
                          className="formPaddingWrap"
                          style={{ display: "flex" }}
                        >
                          <input
                            type="text"
                            id="price"
                            className="textAlineRight"
                            value={
                              (watch("_price") &&
                                watch("_price")
                                  .replace(/[^0-9]/g, "")
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                              ""
                            }
                            {...register("_price")}
                          />
                          <div
                            style={{
                              width: "45px",
                              textAlign: "center",
                              lineHeight: "30px",
                            }}
                          >
                            원
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="detailContentCheck">
                        <span style={{ width: "80px" }}>금액 조정</span>
                        <div className="detailContentInputWrap">
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canNego") == "1"}
                            value="1"
                            id="canNego1"
                            {...register("_canNego")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canNego1"
                          >
                            가능
                          </label>
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canNego") == "0"}
                            value="0"
                            id="canNego0"
                            {...register("_canNego")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canNego0"
                          >
                            불가능
                          </label>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="formContentWrap">
                  <div className="blockLabel">
                    <span>소통 방법</span>
                  </div>
                  <div className="formPaddingWrap">
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_contMethod") == "msg"}
                      value="msg"
                      id="contMethod1"
                      {...register("_contMethod")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="contMethod1"
                    >
                      채팅
                    </label>
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_contMethod") == "tel"}
                      value="tel"
                      id="contMethod0"
                      {...register("_contMethod")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="contMethod0"
                    >
                      전화통화
                    </label>
                  </div>
                </div>

                {/* <div className="formContentWrap">
                  <label htmlFor="garea" className=" blockLabel">
                    <span>공사면적 *</span>
                  </label>
                  <div style={{ display: "flex" }} className="proposal-garea">
                    <input
                      id="garea"
                      {...register("_garea", {
                        required: "입력되지 않았습니다.",
                      })}
                    />

                    <div> ㎡</div>
                  </div>
                </div> */}

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
                            checked={watch("_canExtraProp") == "1"}
                            value="1"
                            id="canExtraProp1"
                            {...register("_canExtraProp")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canExtraProp1"
                          >
                            필요
                          </label>

                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canExtraProp") == "0"}
                            value="0"
                            id="canExtraProp0"
                            {...register("_canExtraProp")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canExtraProp0"
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
                            checked={watch("_canTaxBill") == "1"}
                            value="1"
                            id="canTaxBillProp1"
                            {...register("_canTaxBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canTaxBillProp1"
                          >
                            발행
                          </label>

                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canTaxBill") == "0"}
                            value="0"
                            id="canTaxBillProp0"
                            {...register("_canTaxBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canTaxBillProp0"
                          >
                            미발행
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
                            id="canCardProp1"
                            {...register("_canCard")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCardProp1"
                          >
                            예
                          </label>

                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canCard") == "0"}
                            value="0"
                            id="canCardProp0"
                            {...register("_canCard")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCardProp0"
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
                            id="canCashBillProp1"
                            {...register("_canCashBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCashBillProp1"
                          >
                            필요
                          </label>
                          <input
                            className="listSearchRadioInput"
                            type="radio"
                            checked={watch("_canCashBill") == "0"}
                            value="0"
                            id="canCashBillProp0"
                            {...register("_canCashBill")}
                          />
                          <label
                            className="listSearchRadioLabel"
                            htmlFor="canCashBillProp0"
                          >
                            불필요
                          </label>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="extraCon" className=" blockLabel">
                    <span>전달사항</span>
                  </label>
                  <div>
                    <textarea
                      maxLength={50}
                      id="extraCon"
                      placeholder="50자 이내로 작성해주세요."
                      {...register("_extraCon")}
                    />
                  </div>
                </div>

                <ServicesImageSetPreview id="addImgs" title="참고 이미지" />
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
