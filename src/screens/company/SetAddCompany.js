// 사업자 회원관리 > 사업자 추가 > ✔️ 현재 페이지(사업자 필수 페이지) > 사업자 상세페이지

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as TOKEN from "../../service/useData/token";
import * as RC from "../../service/useData/roleCheck";
import * as SAFE from "../../service/useData/safenumber";
import * as UDIMAGE from "../../service/useData/image";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as MO from "../../service/library/modal";
import * as FM from "../../service/useData/format";

import * as DATA from "../../action/data";
import * as CLICK from "../../action/click";

import { CustomerTypeview } from "../../components/common/ComponentCustomerTypeManualView";
import ComponentModal from "../../components/services/ServiceModalCompanyAdd";
import PieceLoading from "../../components/piece/PieceLoading";
import ServicesImgAndImgsSetPreview from "../../components/services/ServicesImgAndImgsSetPreview";
import SetImage from "../../components/services/ServicesImageSetPreview";
import PieceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp";

import ComponentSalesManager from "../../components/common/ComponentSalesManager";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";

export default function AddCompany() {
  const TODAY = FM.serviesDatetoISOString();

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      _status: "2",
      _isGongsa: "1",
      _appRegDate: TODAY?.slice(0, 10),
      _contractType: "비해당",
      _combineStatus: "0",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitCk, setSubmitCk] = useState(false);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_1", text: "계약 기본 정보" },
    { idName: "CompanyDetail_2", text: "사업자 기본 정보" },
    { idName: "CompanyDetail_3", text: "사업자 추가 입력" },
  ]);
  // 데이터 ------------------------------------------------------------------------
  const getedSummaryData = useSelector(
    (state) => state.data.getedSummaryData,
    shallowEqual
  );
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);

  // 클릭 ------------------------------------------------------------------------
  const clickModal = useSelector(
    (state) => state.click.modalClick,
    shallowEqual
  );
  // 이미지 ------------------------------------------------------------------------
  const titleImg = useSelector((state) => state.image.imgData, shallowEqual);
  const regImgs = useSelector(
    (state) => state.image.multiImgsData || [],
    shallowEqual
  );
  const imgs = useSelector((state) => state.image.imgsData || [], shallowEqual);
  const imgsIid = [];
  const imgsRegIid = [];

  // 주소 ------------------------------------------------------------------------
  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );

  // 정수(Integer) 데이터 유형 변환
  const isGongsaValue = getValues("_isGongsa");
  const IntIntegerValue = parseInt(isGongsaValue);

  const mobileNum = watch("_mobilenum");
  const telNum = watch("_telnum");

  const [customerTypeview, setCustomerTypeview] = useState(false);
  const [bigCategoryCount, setBigCategoryCount] = useState(0);
  const [subCategoryCount, setSubCategoryCount] = useState(0);
  const maxBigCategoryLength = 20;
  const maxSubCategoryLength = 60;

  console.log("titleImg", titleImg);
  console.log("imgs", imgs);

  useEffect(() => {
    setBigCategoryCount(getValues("_bigCategory")?.length || 0);
    setSubCategoryCount(getValues("_subCategory")?.length || 0);
  }, [watch("_bigCategory"), watch("_subCategory")]);

  useEffect(() => {
    if (watch("_email_domain_select") === "") {
      setIsCustomDomain(true);
      setValue("_email_domain", "");
    } else {
      setIsCustomDomain(false);
      setValue("_email_domain", watch("_email_domain_select"));
    }
  }, [watch("_email_domain_select")]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value._mobilenum || value._telnum) {
        clearErrors(["_mobilenum", "_telnum"]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  const fnSelect = (res) => {
    if (!res.cid) {
      MO.servicesUseModalLinkedUser(
        () => {
          API.servicesPostData(APIURL.urlGetUserDetail, { ruid: res.uid }).then(
            (res2) => {
              dispatch(CLICK.serviceModalClick(false));

              setValue("_ruid", res.uid);

              if (res2.status === "success") {
                setValue("_regOwner", !!res2.data.name ? res2.data.name : "");
                setValue(
                  "_mobilenum",
                  !!res2.data.mobile ? res2.data.mobile : ""
                );
                setValue("_age", !!res2.data.age ? res2.data.age : "");
                setValue("_age", !!res2.data.address ? res2.data.age : "");

                const payload = res2.data;
                dispatch(DATA.serviceGetedData(payload));

                if (payload.titleImg && payload.titleImg !== 0) {
                  localStorage.setItem("isTitleImageSet", "true");
                } else {
                  localStorage.setItem("isTitleImageSet", "false");
                }
              } else {
                TOA.servicesUseToast("덮어쓰기할 데이터가 없습니다.", "e");
              }
            }
          );
        },
        () => {
          dispatch(CLICK.serviceModalClick(false));
          setValue("_ruid", res.uid);
        }
      );
    } else {
      dispatch(CLICK.serviceModalClick(false));
      TOA.servicesUseToast("기존에 연결된 회원 관리번호 입니다.", "e");
    }
  };

  const fnSubmit = async () => {
    if (submitCk) return;

    //일반전화, 휴대폰 번호 중 하나라도 입력되지 않았을 경우 에러메시지 출력
    if (!mobileNum && !telNum) {
      setError("_telnum", {
        type: "manual",
        message: "하나 이상의 전화번호를 입력해주세요.",
      });
      setError("_mobilenum", {
        type: "manual",
        message: "하나 이상의 전화번호를 입력해주세요.",
      });
      return;
    }
    clearErrors(["_mobilenum", "_telnum"]);

    const regImgsToSend =
      regImgs && regImgs.length > 0
        ? regImgs.map((img) => img.iid).join(",")
        : "";

    //regImgsToSend가 빈 문자열이면 오류 처리
    if (regImgsToSend === "") {
      TOA.servicesUseToast("사업자 등록증 사진을 1장 이상 올려주세요.", "e");
      return; // 이미지가 충분히 업로드 되지 않았다면 함수 실행을 중단
    }

    const isTitleImageSet = localStorage.getItem("isTitleImageSet") === "true";

    if (!isTitleImageSet) {
      TOA.servicesUseToast("대표 이미지를 설정해주세요.", "e");
      return; // 대표 이미지가 설정되지 않았으면 함수 실행을 중단
    }

    setSubmitCk(true);

    const response = await API.servicesPostData(APIURL.urlAddcompany, {});
    const CID = response.data.cid;

    setLoading(true);

    // 서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    UDIMAGE.serviesGetImgsIid(imgsIid, imgs);
    UDIMAGE.serviesGetImgsIid(imgsRegIid, regImgs);

    // 안심번호 자동 생성
    // 함수 내부에 9999-9999 임시 번호는 사용하지 못하도록 조건문 추가
    // 현재 서버 확인하여 실 서버가 아니라면 아래 함수는 동작하지 않음
    try {
      const STATUS = RC.serviesCheckSafeNum(
        getValues("_mobilenum"),
        getValues("_telnum"),
        !!getValues("_ruid")
      );

      // 회사명 등 setCompany 등록
      const response1 = await API.servicesPostData(APIURL.urlSetCompany, {
        cid: CID,
        ruid: getValues("_ruid"),
        useFlag: 1,
        sruid: getedSummaryData.sruid,
      });

      const response2Vaule = {
        rcid: CID,
        useFlag: 1,
        status: STATUS,
        name: getValues("_Cname"),
        customerType: getValues("_customerType"),
        subCategory: getValues("_subCategory"),
        bigCategory: getValues("_bigCategory"),
        regOwner: getValues("_regOwner"),
        corporationno: getValues("_corporationno"),
        mobilenum: getValues("_mobilenum"),
        telnum: getValues("_telnum"),
        fax: getValues("_fax"),
        registration: getValues("_registration"),
        address: multilAddress.address,
        detailaddress: multilAddress.detailaddress,
        oldaddress: multilAddress.oldaddress,
        zipcode: multilAddress.zipcode,
        longitude: multilAddress.longitude,
        latitude: multilAddress.latitude,
        ceogreet: getValues("_ceogreet"),
        offer: getValues("_offer"),
        titleImg: titleImg ? titleImg : getedData.titleImg,
        imgs: imgsIid.length > 0 ? imgsIid.toString() : "",
        isGongsa: IntIntegerValue,
        gongsaType: getValues("_gongsaType").toString() || "",
        regImgs: regImgsToSend,
        age: getValues("_age"),
        comType: getValues("_comType"),
        regName: getValues("_regName"),
        email: `${getValues("_email_user")}@${getValues("_email_domain")}`,
        cancelDate: FM.serviesDatetoISOString(watch("_cancelDate"))?.slice(
          0,
          19
        ),
        appRegDate: FM.serviesDatetoISOString(watch("_appRegDate"))?.slice(
          0,
          19
        ),
        contractDate: FM.serviesDatetoISOString(watch("_contractDate"))?.slice(
          0,
          19
        ),
        contractType: getValues("_contractType"),
        combineStatus: getValues("_combineStatus")?.toString(),
      };

      // detail company 정보 등록 & 안심번호 등록
      const response2 = await API.servicesPostData(
        APIURL.urlSetCompanyDetail,
        response2Vaule
      );

      // cid, uid 연결에 따른 토큰 삭제
      TOKEN.serviesSetToken(CID);

      const checkLoading = () =>
        new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!loading) {
              clearInterval(interval);
              resolve();
            }
          }, 100); // 100ms 간격으로 loading 상태를 확인합니다.
        });

      console.log(response);
      console.log(response1);
      console.log(response2.data);

      const routeCid = async () => {
        if (response1.status === "success" && response2.status === "success") {
          if (!loading) {
            // TOA.servicesUseToast("등록 성공", "s");
            if (
              !!watch("_mobilenum") &&
              watch("_mobilenum").endsWith("9999-9999")
            ) {
              MO.servicesUseModalSafeNum(
                "사업자 상세정보를 입력하시겠습니까?",
                "입력된 번호가 임시번호라 안심번호가 생성되지 않았습니다.",
                () => navigate(`/company/${CID}`),
                () => navigate(`/company`)
              );
            } else {
              MO.servicesUseModalSafeNum(
                "사업자 상세정보를 입력하시겠습니까?",
                "버튼을 누르면 해당 페이지로 이동합니다.",
                () => navigate(`/company/${CID}`),
                () => navigate(`/company`)
              );
            }
          } else {
            setSubmitCk(false);
            TOA.servicesUseToast("등록되지 않았습니다.", "e");
          }
        } //loading
      };

      if (STATUS === 2 || STATUS === 4) {
        MO.servicesUseModalAddSafeNumg(
          async () => {
            // 생성, 대기상태일 때 안심번호 추가 가능
            await SAFE.serviesSafeNumSetting(
              CID,
              watch("_mobilenum"),
              watch("_telnum"),
              watch("_Cname"),
              watch("_ruid"),
              setLoading
            );

            await checkLoading();
            await routeCid();
          },
          async () => {
            await routeCid();
          }
        );
      } else {
        await routeCid();
      }
    } catch (error) {
      setSubmitCk(false);
      TOA.servicesUseToast("등록되지 않았습니다.", "e");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="commonBox">
        <PieceLoading loading={loading} bg />
        <div className="formLayout">
          <ul className="tableTopWrap tableTopBorderWrap">
            <ComponentTableTopScrollBtn data={tableTopScrollBtnData.current} />
            <LayoutTopButton url="/company" text="목록으로 가기" />
            <LayoutTopButton text="완료" fn={handleSubmit(fnSubmit)} />
          </ul>

          <div className="formWrap ">
            <div className="formContainer">
              <h3>영업 관리</h3>
              <ComponentSalesManager />
            </div>

            <div className="formContainer">
              <h3>회원 계정 관리</h3>
              <fieldset id="CompanyDetail_1">
                <h3>계약 기본 정보</h3>
                {/* /setCompany ============================= */}
                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>회원 관리번호</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="text"
                      id="ruid"
                      style={{
                        width: "calc(100% - 104px)",
                      }}
                      disabled
                      {...register("_ruid")}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(CLICK.serviceModalClick(!clickModal))
                      }
                      className="formContentBtn"
                      style={{
                        width: "50px",
                        backgroundColor: "#757575",
                        color: "rgb(255, 255, 255)",
                      }}
                    >
                      검색
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setValue("_ruid", "");
                      }}
                      className="formContentBtn"
                      style={{
                        width: "50px",
                        backgroundColor: "#da3933",
                        color: "rgb(255, 255, 255)",
                      }}
                    >
                      해지
                    </button>
                    <ComponentModal fn={fnSelect} />
                  </div>
                </div>

                <div className="formContentWrap">
                  <div className="blockLabel">
                    <span>계약일 / 해지일</span>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="date"
                      id="contractDate"
                      {...register("_contractDate")}
                      style={{
                        marginBottom: "0",
                      }}
                    />
                    <span
                      style={{
                        width: "50px",
                        textAlign: "center",
                        lineHeight: "28px",
                        marginBottom: "0",
                      }}
                    >
                      ~
                    </span>
                    <input
                      type="date"
                      id="cancelDate"
                      {...register("_cancelDate")}
                    />
                  </div>
                </div>

                <div className="formContentWrap">
                  <div className="blockLabel">
                    <span>APP 등록일</span>
                  </div>
                  <div>
                    <input
                      type="date"
                      id="appRegDate"
                      {...register("_appRegDate")}
                    />
                  </div>
                </div>

                {/* 약정관리 ======================================== */}
                <div className="formContentWrap">
                  <div className="blockLabel">
                    <span>약정 구분</span>
                  </div>
                  <div className="formPaddingWrap">
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="비해당"
                      id="useFlag0"
                      {...register("_contractType")}
                    />
                    <label className="listSearchRadioLabel" htmlFor="useFlag0">
                      비해당
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="무약정"
                      id="contractType0"
                      {...register("_contractType")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="contractType0"
                    >
                      무약정
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="1년약정"
                      id="contractType1"
                      {...register("_contractType")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="contractType1"
                    >
                      1년약정
                    </label>
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="연장약정"
                      id="contractType2"
                      {...register("_contractType")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="contractType2"
                    >
                      연장약정
                    </label>
                  </div>
                </div>

                <div className="formContentWrap">
                  <div className="blockLabel">
                    <span>결합상품 여부</span>
                  </div>
                  <div className="formPaddingWrap">
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="1"
                      id="combineStatus1"
                      {...register("_combineStatus")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="combineStatus1"
                    >
                      예
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      value="0"
                      id="combineStatus0"
                      {...register("_combineStatus")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="combineStatus0"
                    >
                      아니오
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            {/* 계약기본정보 필드 끝 ==================================================================== */}

            <div className="formContainer">
              <h3>사업자 정보 관리</h3>
              {/* 고객 기본정보 필드 시작 ==================================================================== */}
              <fieldset id="CompanyDetail_2">
                <h3>사업자 필수 입력</h3>
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="bigCategory" className="blockLabel">
                    <span>공사 업체</span>
                  </label>
                  <div className="formPaddingWrap">
                    <input
                      type="radio"
                      value="1"
                      checked={
                        watch("_isGongsa") === 1 || IntIntegerValue === 1
                      }
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
                      checked={
                        watch("_isGongsa") === 0 || IntIntegerValue === 0
                      }
                      id="isGongsa0"
                      className="listSearchRadioInput"
                      {...register("_isGongsa")}
                    />
                    <label htmlFor="isGongsa0" className="listSearchRadioLabel">
                      아니요
                    </label>
                  </div>
                </div>
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label className=" blockLabel">
                    <span>공사 유형</span>
                  </label>
                  <div
                    className={`formPaddingWrap ${
                      IntIntegerValue === 0 || watch("_isGongsa") === 0
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
                      disabled={
                        IntIntegerValue === 0 || watch("_isGongsa") === 0
                      }
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
                      disabled={
                        IntIntegerValue === 0 || watch("_isGongsa") === 0
                      }
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
                      disabled={
                        IntIntegerValue === 0 || watch("_isGongsa") === 0
                      }
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
                      disabled={
                        IntIntegerValue === 0 || watch("_isGongsa") === 0
                      }
                    />
                    <label htmlFor="reset" className="listSearchRadioLabel">
                      일반
                    </label>
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="bigCategory" className="blockLabel">
                    <span>상호명 *</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="Cname"
                      maxLength={15}
                      {...register("_Cname", {
                        required: "입력되지 않았습니다.",
                        maxLength: {
                          value: 15,
                          message: "최대 15글자까지 입력 가능합니다.",
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="_Cname"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label
                    className="blockLabel"
                    style={{ position: "relative" }}
                  >
                    {customerTypeview && <CustomerTypeview />}
                    <span className="tipTh">
                      <span>가입자 구분</span>
                      <i onClick={() => setCustomerTypeview(!customerTypeview)}>
                        !
                      </i>
                    </span>
                  </label>
                  <div className="formPaddingWrap">
                    <input
                      type="radio"
                      value="무료"
                      id="무료"
                      className="listSearchRadioInput customerTypeview_free"
                      {...register("_customerType")}
                    />
                    <label htmlFor="무료" className="listSearchRadioLabel">
                      무료
                    </label>

                    <div
                      style={{
                        width: "1px",
                        backgroundColor: "rgba(0,0,0,0.15)",
                        height: "60%",
                        marginTop: "5px",
                      }}
                    ></div>

                    <input
                      type="radio"
                      value="와해"
                      id="와해"
                      className="listSearchRadioInput  customerTypeview_wz"
                      {...register("_customerType")}
                    />
                    <label htmlFor="와해" className="listSearchRadioLabel">
                      와해
                    </label>

                    <input
                      type="radio"
                      value="와유"
                      id="와유"
                      className="listSearchRadioInput  customerTypeview_wz"
                      {...register("_customerType")}
                    />
                    <label htmlFor="와유" className="listSearchRadioLabel">
                      와유
                    </label>

                    <input
                      type="radio"
                      value="와가"
                      id="와가"
                      className="listSearchRadioInput  customerTypeview_wz"
                      {...register("_customerType")}
                    />
                    <label htmlFor="와가" className="listSearchRadioLabel">
                      와가
                    </label>

                    <div
                      style={{
                        width: "1px",
                        backgroundColor: "rgba(0,0,0,0.15)",
                        height: "60%",
                        marginTop: "5px",
                      }}
                    ></div>

                    <input
                      type="radio"
                      value="콕해"
                      id="콕해"
                      className="listSearchRadioInput customerTypeview_cok"
                      {...register("_customerType")}
                    />
                    <label htmlFor="콕해" className="listSearchRadioLabel">
                      콕해
                    </label>

                    <input
                      type="radio"
                      value="노출"
                      id="노출"
                      className="listSearchRadioInput customerTypeview_cok"
                      {...register("_customerType")}
                    />
                    <label htmlFor="노출" className="listSearchRadioLabel">
                      노출
                    </label>

                    <input
                      type="radio"
                      value="판매"
                      id="판매"
                      className="listSearchRadioInput  customerTypeview_cok"
                      {...register("_customerType")}
                    />
                    <label htmlFor="판매" className="listSearchRadioLabel">
                      판매
                    </label>

                    <input
                      type="radio"
                      value="배너"
                      id="배너"
                      className="listSearchRadioInput customerTypeview_cok"
                      {...register("_customerType")}
                    />
                    <label htmlFor="배너" className="listSearchRadioLabel">
                      배너
                    </label>
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="bigCategory" className="blockLabel">
                    <span>대표 ( 주력 ) 업종 *</span>
                  </label>
                  <div style={{ position: "relative", width: "88%" }}>
                    <input
                      type="text"
                      id="bigCategory"
                      placeholder="띄어쓰기 쉼표 포함 20자 이내"
                      maxLength={maxBigCategoryLength}
                      {...register("_bigCategory")}
                      style={{ paddingRight: "50px" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color:
                          bigCategoryCount > maxBigCategoryLength
                            ? "red"
                            : "#167d88",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {bigCategoryCount} / {maxBigCategoryLength}
                    </span>
                    <ErrorMessage
                      errors={errors}
                      name="_bigCategory"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>

                {/* 상세 업종 */}
                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="subCategory" className="blockLabel">
                    <span>상세 업종 *</span>
                  </label>
                  <div style={{ position: "relative", width: "88%" }}>
                    <input
                      type="text"
                      id="subCategory"
                      placeholder="띄어쓰기 쉼표 포함 60자 이내"
                      maxLength={maxSubCategoryLength}
                      {...register("_subCategory")}
                      style={{ paddingRight: "50px" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color:
                          subCategoryCount > maxSubCategoryLength
                            ? "red"
                            : "#167d88",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {subCategoryCount} / {maxSubCategoryLength}
                    </span>
                    <ErrorMessage
                      errors={errors}
                      name="_subCategory"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>

                {/* 사업자 분류 */}
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <div className="blockLabel">
                    <span>사업자 분류</span>
                  </div>
                  <div className="formPaddingWrap">
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_comType") == "일반"}
                      value="일반"
                      id="comType0"
                      {...register("_comType")}
                    />
                    <label className="listSearchRadioLabel" htmlFor="comType0">
                      일반사업자
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_comType") == "법인"}
                      value="법인"
                      id="comType01"
                      {...register("_comType")}
                    />
                    <label className="listSearchRadioLabel" htmlFor="comType01">
                      법인사업자
                    </label>
                  </div>
                </div>

                {/* 연령 */}
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <div className="blockLabel">
                    <span>연령 *</span>
                  </div>
                  <div className="formPaddingWrap">
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_age") == "10대"}
                      value="10대"
                      id="age10"
                      {...register("_age", {
                        required: true,
                      })}
                    />
                    <label className="listSearchRadioLabel" htmlFor="age10">
                      10대
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_age") == "20대"}
                      value="20대"
                      id="age20"
                      {...register("_age", {
                        required: true,
                      })}
                    />
                    <label className="listSearchRadioLabel" htmlFor="age20">
                      20대
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_age") == "30대"}
                      value="30대"
                      id="age30"
                      {...register("_age", {
                        required: true,
                      })}
                    />
                    <label className="listSearchRadioLabel" htmlFor="age30">
                      30대
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_age") == "40대"}
                      value="40대"
                      id="age40"
                      {...register("_age", {
                        required: true,
                      })}
                    />
                    <label className="listSearchRadioLabel" htmlFor="age40">
                      40대
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_age") == "50대"}
                      value="50대"
                      id="age50"
                      {...register("_age", {
                        required: true,
                      })}
                    />
                    <label className="listSearchRadioLabel" htmlFor="age50">
                      50대
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_age") == "60대"}
                      value="60대"
                      id="age60"
                      {...register("_age", {
                        required: true,
                      })}
                    />
                    <label className="listSearchRadioLabel" htmlFor="age60">
                      60대 이상
                    </label>
                    <ErrorMessage
                      errors={errors}
                      name="_age"
                      render={({ message }) => (
                        <span className="errorMessageWrap">
                          입력되지 않았습니다.
                        </span>
                      )}
                    />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="registration" className="blockLabel">
                    <span>사업자 번호 *</span>
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
                    <ErrorMessage
                      errors={errors}
                      name="_registration"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>

                {/* 사업자 등록증 상호 */}
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="regName" className="blockLabel">
                    <span>사업자 등록증 상호 *</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="regName"
                      placeholder="15자 이하로 입력해 주세요."
                      maxLength="15"
                      {...register("_regName", {
                        required: "입력되지 않았습니다.",
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="_regName"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>

                <SetImage id="regImgs" title="사업자 등록증 *" />

                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="mobilenum" className="blockLabel">
                    <span>휴대폰 *</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="mobilenum"
                      maxLength={13}
                      value={
                        (watch("_mobilenum") &&
                          watch("_mobilenum")
                            .replace(/[^0-9]/g, "")
                            .replace(
                              /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                            .replace("--", "-")) ||
                        ""
                      }
                      {...register("_mobilenum", {
                        pattern: {
                          value:
                            /^(02|0505|1[0-9]{3}|0[0-9]{2})[0-9]{3,4}-[0-9]{4}|[0-9]{4}-[0-9]{4}$/,
                          message: "형식에 맞지 않습니다.",
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="_mobilenum"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>
                {/* 일반전화 */}
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="telnum" className="blockLabel">
                    <span>일반전화</span>
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
                              /(^02|^0505|^1[0-9]{4}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                            .replace("--", "-")) ||
                        ""
                      }
                      {...register("_telnum", {})}
                    />
                  </div>
                </div>

                {/* 주소 */}
                <PieceRegisterSearchPopUp company />
                {/* 이메일 */}
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="email" className="blockLabel">
                    <span>이메일 *</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      {...register("_email_user")}
                      style={{ width: "40%", marginBottom: "0" }}
                    />
                    <span style={{ lineHeight: "28px" }}>@</span>

                    <input
                      type="text"
                      {...register("_email_domain")}
                      style={{ width: "30%" }}
                      placeholder="직접 입력"
                      disabled={!isCustomDomain}
                    />
                    <select
                      style={{ width: "25%" }}
                      {...register("_email_domain_select")}
                    >
                      <option value="naver.com">naver.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="yahoo.com">yahoo.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="hanmail.net">hanmail.net</option>
                      <option value="msn.com">msn.com</option>
                      <option value="nate.com">nate.com</option>
                      <option value="apple.com">apple.com</option>
                      <option value="">직접입력</option>
                    </select>
                  </div>
                </div>
                {/* 휴대폰 */}
              </fieldset>

              <fieldset id="CompanyDetail_3">
                <h3>사업자 추가 입력</h3>

                {/* 대표자명 */}
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="regOwner" className="blockLabel">
                    <span>대표자명</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="regOwner"
                      maxLength={8}
                      {...register("_regOwner", {
                        maxLength: 8,
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="_regOwner"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>
                {/* 법인등록번호 */}
                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="corporationno" className="blockLabel">
                    <span>법인 등록 번호</span>
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
                      {...register("_corporationno", {
                        pattern: {
                          value: /^[0-9]{6}-[0-9]{7}$/,
                          message: "형식에 맞지 않습니다.",
                        },
                      })}
                    />
                  </div>
                </div>

                {/* 사업자 소개글 */}
                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="offer" className="blockLabel">
                    <span>회사 소개</span>
                  </label>
                  <div>
                    <textarea
                      type="text"
                      id="offer"
                      maxLength={300}
                      placeholder="300자 이내로 입력해 주세요."
                      {...register("_offer")}
                    />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <label htmlFor="ceogreet" className="blockLabel">
                    <span>인사말</span>
                  </label>
                  <div>
                    <textarea
                      type="text"
                      id="ceogreet"
                      maxLength={300}
                      placeholder="300자 이내로 입력해 주세요."
                      {...register("_ceogreet")}
                    />
                  </div>
                </div>

                <ServicesImgAndImgsSetPreview />
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
