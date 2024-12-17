// 사업자 회원 관리 > 사업자 상세정보 (수정)
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as RC from "../../service/useData/roleCheck";
import * as UDIMAGE from "../../service/useData/image";
import * as TOA from "../../service/library/toast";
import * as MO from "../../service/library/modal";
import * as RAN from "../../service/useData/rander";
import * as FM from "../../service/useData/format";

import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";

import * as DATA from "../../action/data";
import * as CLICK from "../../action/click";

import SetImage from "../../components/services/ServicesImageSetPreview";
import ServicesImgAndImgsSetPreview from "../../components/services/ServicesImgAndImgsSetPreview";
import PieceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentSetCompany from "../../components/common/ComponentSetCompany";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";
import SetDetailComapnyPieceLink from "../../components/common/ComponentCompanyPieceLink";
import ComponentCompanySealsKeyword from "../../components/common/ComponentCompanySealsKeyword";
import ComponentFreeAddKeyword from "../../components/common/ComponentFreeAddKeyword";
// import ComponentCompanySealsKeywordHanok from "../../components/common/ComponentCompanySealsKeywordHanok";
import CustomerCounseling from "../../components/common/CustomerCounseling";
import ComponentSalesManager from "../../components/common/ComponentSalesManager";
import ComponentPayment from "../../components/common/ComponentPayment";
import ComponentTaxBill from "../../components/common/ComponentTaxBill";
import ComponentTopPageMoveButton from "../../components/common/ComponentTopPageMoveButton";
import { CustomerTypeview } from "../../components/common/ComponentCustomerTypeManualView";

export default function SetCompanyDetail() {
  const { cid } = useParams();
  const dispatch = useDispatch();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _status: "2",
      _comType: "일반",
      _isGongsa: "1",
      _contractType: "비해당",
      _combineStatus: "0",
    },
  });

  const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_4", text: "영업 관리" },
    { idName: "CompanyDetail_1", text: "회원 계정 관리" },
    { idName: "CompanyDetail_2", text: "사업자 정보 관리" },
    { idName: "CompanyDetail_5", text: "공사콕 계정 관리" },
    { idName: "CompanyDetail_6", text: " 판매키워드 관리" },
    { idName: "CompanyDetail_7", text: "결제 관리" },
  ]);

  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customerTypeview, setCustomerTypeview] = useState(false);
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const getedSummaryData = useSelector(
    (state) => state.data.getedSummaryData,
    shallowEqual
  );

  // PiceLink - 고객관리:평점
  const writeData = useSelector((state) => state.data.writeData, shallowEqual);
  // 이미지 ------------------------------------------------------------------------
  const titleImg = useSelector((state) => state.image.imgData, shallowEqual);
  const imgs = useSelector((state) => state.image.imgsData || [], shallowEqual);
  const regImgs = useSelector(
    (state) => state.image.multiImgsData || [],
    shallowEqual
  );
  // 서버에서 titleImg, imgs의 iid를 받아오기 위해 사용
  const imgsIid = [];
  const imgsRegIid = [];
  // 주소 ------------------------------------------------------------------------
  // 사업자 상세관리에서 사용하는 setCompanyDetailInfo 외 API  --------------------------------------
  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );
  // 하위컴포넌트에게 전달
  const [companyData, setCompanyData] = useState({});

  // 다음페이지, 이전페이지 이동을 위해, 현재 list의 가장 마지막 페이지 조회
  const [lastCid, setLastCid] = useState("");
  const ruid = useRef("");

  // 카테고리 실시간 입력
  const [bigCategoryCount, setBigCategoryCount] = useState(0);
  const [subCategoryCount, setSubCategoryCount] = useState(0);
  const maxBigCategoryLength = 20;
  const maxSubCategoryLength = 60;

  useEffect(() => {
    setBigCategoryCount(getValues("_bigCategory")?.length || 0);
    setSubCategoryCount(getValues("_subCategory")?.length || 0);
  }, [getedData, getValues, watch("_bigCategory"), watch("_subCategory")]);

  const handleBigCategoryChange = (e) => {
    const inputLength = e.target.value.length;
    setBigCategoryCount(inputLength);
  };

  const handleSubCategoryChange = (e) => {
    const inputLength = e.target.value.length;
    setSubCategoryCount(inputLength);
  };

  console.log("titleImg", titleImg);
  console.log("imgs", imgs);

  CUS.useMountAndCleanEffect(() => {
    // 비동기 함수를 정의합니다.
    const fetchData = async () => {
      try {
        // 상세 회사정보 불러오기 기존 값이 없다면 새로운 회원이다. 새로 작성함
        const urlGetCompanyDetailRes = await API.servicesPostData(
          APIURL.urlGetCompanyDetail,
          {
            rcid: cid,
          }
        );

        const urlGetCompanyRes = await API.servicesPostData(
          APIURL.urlGetCompany,
          {
            cid: cid,
          }
        );

        if (urlGetCompanyRes.status === "success") {
          ruid.current = urlGetCompanyRes.data.ruid || "";
          setCompanyData(urlGetCompanyRes.data);
          dispatch(DATA.serviceGetedSummaryData(urlGetCompanyRes.data));
        }

        if (urlGetCompanyDetailRes.status === "success") {
          const payload = urlGetCompanyDetailRes.data;
          dispatch(DATA.serviceGetedData(payload));

          // 근무 시간
          if (urlGetCompanyDetailRes.data.workTime) {
            const WorkTimeArr = urlGetCompanyDetailRes.data.workTime.split("~");
            setValue("_workTimeTo", WorkTimeArr[0].trim() || "");
            setValue("_workTimeFrom", WorkTimeArr[1].trim() || "");
          }

          // 대표 이미지의 iid를 확인하고 로컬 스토리지를 설정합니다.
          if (
            urlGetCompanyDetailRes.data.titleImg &&
            urlGetCompanyDetailRes.data.titleImg !== 0
          ) {
            localStorage.setItem("isTitleImageSet", "true");
          } else {
            localStorage.setItem("isTitleImageSet", "false");
          }

          // getConpany.useFlag, getCompanyDetailInfo.useFlag를 동일하게 유지하기 위한 조건
          const commonData = {
            ...companyData,
            ruid: urlGetCompanyRes.data?.ruid,
            name: urlGetCompanyDetailRes.data?.name,
            status: urlGetCompanyDetailRes.data?.status,
          };
          if (
            urlGetCompanyDetailRes.data.useFlag != urlGetCompanyRes.data.useFlag
          ) {
            const fnSetUseFlag = (flagValue) => {
              API.servicesPostData(APIURL.urlSetCompany, {
                cid: cid,
                useFlag: flagValue,
              }).then((res) => {
                if (res.status === "fail") {
                  alert(
                    `urlSetCompany.${cid}의 useFlag:${flagValue}가 저장되지 않았습니다. 관리자에게 문의해 주세요.`
                  );
                }
              });

              API.servicesPostData(APIURL.urlSetCompanyDetail, {
                rcid: cid,
                useFlag: flagValue,
              }).then((res) => {
                if (res.status === "fail") {
                  alert(
                    `urlSetCompany.${cid}의 useFlag:${flagValue}가 저장되지 않았습니다. 관리자에게 문의해 주세요.`
                  );
                }
              });
            };

            MO.servicesUseModalChooseUseFlag(
              "서버에 저장된 활성화 계정 정보가 다릅니다.",
              "해당 회원의 활성화 여부를 확인해 주세요.",
              () => {
                setCompanyData({ ...commonData, useFlag: "1" });
                fnSetUseFlag("1");
              },
              () => {
                setCompanyData({ ...commonData, useFlag: "0" });
                fnSetUseFlag("0");
              }
            );
          } else {
            setCompanyData({
              ...commonData,
              useFlag: urlGetCompanyRes.data?.useFlag,
            });
          }
        }

        const companyListRes = await API.servicesPostData(
          APIURL.urlCompanylist,
          {
            offset: 0,
            size: 1,
          }
        );

        setLastCid(companyListRes.data[0]?.cid);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    };

    // 비동기 함수를 호출합니다.
    fetchData();
  });

  useEffect(() => {
    if (getValues("_isGongsa") === "0") {
      setValue("_gongsaType", "");
    } else if (getValues("_isGongsa") === "1") {
      setValue("_gongsaType", "emer,inday,reser");
    }
  }, [watch("_isGongsa")]);

  useEffect(() => {
    setValue("_status", getedData.status);
    if (getedData.isGongsa !== undefined && getedData.isGongsa !== null) {
      setValue("_isGongsa", getedData.isGongsa || "0");
    }

    setValue("_gongsaType", getedData.gongsaType || "");
    setValue("_cid", getedData.rcid);
    setValue("_comType", getedData.comType);
    setValue("_name", getedData.name || "");
    setValue("_comment", getedData.comment || "");
    setValue("_registration", getedData.registration || "");
    setValue("_workTime", getedData.workTime || "");
    setValue("_offer", getedData.offer || "");
    setValue("_ceogreet", getedData.ceogreet || "");
    setValue("_telnum", getedData.telnum?.trim() || "");
    setValue("_fax", getedData.fax?.trim() || "");
    setValue("_mobilenum", getedData.mobilenum?.trim() || "");
    setValue("_extnum", getedData.extnum || "");
    setValue("_regName", getedData.regName || "");
    setValue("_corporationno", getedData.corporationno || "");
    setValue("_regOwner", getedData.regOwner || "");
    setValue("_age", getedData.age);
    setValue("_remarks", getedData.remarks);
    setValue("_bigCategory", getedData.bigCategory || "");
    setValue("_subCategory", getedData.subCategory || "");
    setValue("_customerType", getedData.customerType || "");

    setValue("_appRegDate", getedData.appRegDate?.slice(0, 10) || "");
    setValue("_contractDate", getedData.contractDate?.slice(0, 10) || "");
    setValue("_cancelDate", getedData.cancelDate?.slice(0, 10) || "");
    setValue("_contractType", getedData.contractType || "비해당");
    setValue("_combineStatus", getedData.combineStatus?.toString() || "");

    setValue(
      "_email_user",
      (!!getedData.email && getedData.email.split("@")[0]) || ""
    );
    if (
      getedData.email?.split("@")[1] === "gmail.com" ||
      getedData.email?.split("@")[1] === "naver.com" ||
      getedData.email?.split("@")[1] === "yahoo.com" ||
      getedData.email?.split("@")[1] === "daum.net" ||
      getedData.email?.split("@")[1] === "msn.com" ||
      getedData.email?.split("@")[1] === "nate.com" ||
      getedData.email?.split("@")[1] === "apple.com"
    ) {
      setValue(
        "_email_domain",
        getedData.email && getedData.email.split("@")[1]
      );
      setValue("_email_domain_select", getedData.email?.split("@")[1]);
    } else {
      setValue("_email_domain_select", "");
      setValue(
        "_email_domain",
        getedData.email && getedData.email.split("@")[1]
      );
    }
  }, [getedData]);

  useEffect(() => {
    if (watch("_email_domain_select") === "") {
      setIsCustomDomain(true);
      setValue("_email_domain", "");
    } else {
      setIsCustomDomain(false);
      setValue("_email_domain", watch("_email_domain_select"));
    }
  }, [watch("_email_domain_select"), setValue]);

  const handleSubmitEvent = (data, e) => {
    e.preventDefault();
    dispatch(CLICK.serviceClick(true));

    // 대표 이미지가 설정되어 있는지 확인
    const isTitleImageSet = localStorage.getItem("isTitleImageSet") === "true";

    if (!isTitleImageSet) {
      TOA.servicesUseToast("대표 이미지를 설정해주세요.", "e");
      return;
    }

    if (!getValues("_telnum") && !getValues("_mobilenum")) {
      TOA.servicesUseToast("번호를 1개 이상 입력해 주세요.", "e");
      return;
    }

    if (companyData.useFlag == 1 && getValues("_customerType") === "콕해") {
      TOA.servicesUseToast(
        "활성화 계정의 가입자 구분이 콕해 ( 공사콕 해지 ) 일 수 없습니다. 가입자 구분을 수정해 주세요.",
        "e"
      );
      return;
    }

    // 📍 가입자 구분 필수입력 조건

    // if (!getValues("_customerType")) {
    //   TOA.servicesUseToast("가입자 구분을 입력해 주세요.", "e");
    //   return;
    // }

    // 📍 데이터 수정이 모두 완료됐을 때 해당 조건 주석제거해야 함

    // if (getValues("_subCategory").length > 60) {
    //   TOA.servicesUseToast("상세정보를 60자 이내로 입력해 주세요.", "e");
    //   return;
    // }
    // if (getValues("_bigCategory").length > 20) {
    //   TOA.servicesUseToast("대표업종을 20자 이내로 입력해 주세요.", "e");
    //   return;
    // }

    // 번호와, 회원연결여부, 안심번호 입력 여부를 확인하여 상태 변경
    const STATUS = RC.serviesCheckSafeNum(
      getValues("_mobilenum"),
      getValues("_telnum"),
      !!companyData.ruid,
      getValues("_extnum")
    );

    // 서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    UDIMAGE.serviesGetImgsIid(imgsIid, imgs);
    UDIMAGE.serviesGetImgsIid(imgsRegIid, regImgs);

    const previousCustomerType = getValues("_customerType");

    if (companyData.useFlag == 0 && previousCustomerType !== "콕해") {
      const deactivationRemark = `[ 관리자 알림 ] 비활성화로 인해 가입자 구분이 "${previousCustomerType}"에서 "콕해"로 변경되었습니다.`;
      let currentRemarks = watch("_remarks") || "";

      // 기존 remark 내용에 deactivationRemark이 이미 있는지 확인
      const deactivationRegex = new RegExp(deactivationRemark, "i");

      //  없으면 추가
      if (!deactivationRegex.test(currentRemarks)) {
        currentRemarks = `${
          currentRemarks ? currentRemarks + "\n" : ""
        }${deactivationRemark}`;
      }

      setValue("_remarks", currentRemarks);
      setValue("_customerType", "콕해");
    }

    if (companyData.useFlag == 1) {
      let currentRemarks = watch("_remarks") || "";

      // 비활성화 메시지 삭제
      const deactivationRegex =
        /\[ 관리자 알림 \] 비활성화로 인해 가입자 구분이 ".*?"에서 "콕해"로 변경되었습니다\./;
      currentRemarks = currentRemarks.replace(deactivationRegex, "").trim();

      setValue("_remarks", currentRemarks);
      setValue("_customerType", previousCustomerType);
    }

    API.servicesPostData(APIURL.urlSetCompanyDetail, {
      rcid: cid,
      useFlag: companyData.useFlag,
      isGongsa: getValues("_isGongsa")?.toString(),
      gongsaType: getValues("_gongsaType").toString() || "",
      customerType:
        companyData.useFlag == 1 ? getValues("_customerType") : "콕해",
      status: STATUS,
      name: getValues("_name"),
      comment: getValues("_comment"),
      registration: getValues("_registration"),
      corporationno: getValues("_corporationno"),
      address: multilAddress?.address,
      detailaddress: multilAddress?.detailaddress,
      oldaddress: multilAddress?.oldaddress,
      zipcode: multilAddress?.zipcode,
      longitude: multilAddress?.longitude,
      latitude: multilAddress?.latitude,
      workTime: `${watch("_workTimeTo")} ~ ${watch("_workTimeFrom")}`,
      offer: getValues("_offer"),
      titleImg: titleImg,
      imgs: imgsIid.length > 0 ? imgsIid.toString() : "",
      regImgs: regImgs && regImgs.length > 0 ? imgsRegIid.toString() : "",
      telnum: getValues("_telnum"),
      fax: getValues("_fax"),
      mobilenum: getValues("_mobilenum"),
      email: !!getValues("_email_user")
        ? `${getValues("_email_user")}@${getValues("_email_domain")}`
        : "",
      ceogreet: getValues("_ceogreet"),
      regOwner: getValues("_regOwner"),
      extnum: getValues("_extnum"),
      regName: getValues("_regName"),
      age: getValues("_age"),
      remarks: getValues("_remarks"),
      comType: getValues("_comType"),
      subCategory: getValues("_subCategory"),
      bigCategory: getValues("_bigCategory"),
      cancelDate: FM.serviesDatetoISOString(watch("_cancelDate"))?.slice(0, 19),
      appRegDate: FM.serviesDatetoISOString(watch("_appRegDate"))?.slice(0, 19),
      contractDate: FM.serviesDatetoISOString(watch("_contractDate"))?.slice(
        0,
        19
      ),
      contractType: getValues("_contractType"),
      combineStatus: getValues("_combineStatus")?.toString(),
      reCount: writeData.reCount,
      okCount: writeData.okCount,
      noCount: writeData.noCount,
    })
      .then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
        }

        // setCompanyDetail이 제대로 작동했을 때
        if (res.status === "success") {
          const setData = {
            ...companyData,
            sruid: getedSummaryData.sruid,
            cid: cid,
          };
          API.servicesPostData(APIURL.urlSetCompany, setData).then((res2) => {
            console.log("11111", setData);

            if (res2.status == "fail") {
              alert("사업자 정보 입력에서 오류가 발생했습니다.");
            } else {
              dispatch(CLICK.serviceClick(true));
              TOA.servicesUseToast("완료되었습니다!", "s");
              RAN.serviesAfter1secondReload();
              return;
            }
          });
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <div className="formLayout">
          <div className="formLayout">
            <ul className="tableTopWrap tableTopBorderWrap">
              <ComponentTableTopScrollBtn
                data={tableTopScrollBtnData.current}
              />
              <LayoutTopButton idNum={cid} />

              {getedData
                ? ComponentTopPageMoveButton(cid, lastCid, "company")
                : TOA.servicesUseToast("다음 페이지가 없습니다.", "e")}

              <LayoutTopButton url="/company" text="목록으로 가기" />
              <LayoutTopButton
                text="완료"
                fn={handleSubmit(handleSubmitEvent)}
              />
            </ul>

            <div className="formWrap">
              <div className="formContainer">
                <h3>영업 관리</h3>
                <ComponentSalesManager />
              </div>

              <div className="formContainer">
                <h3>회원 계정 관리</h3>
                <fieldset id="CompanyDetail_1">
                  <h3>계약 기본 정보</h3>
                  {/* setCompany radio (계약자, 사업자활성화, 회원연결) ================================================================ */}
                  <ComponentSetCompany
                    companyData={companyData}
                    setCompanyData={setCompanyData}
                    extnum={getValues("_extnum")}
                  />

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
                        id="_contractType0"
                        {...register("_contractType")}
                      />
                      <label
                        className="listSearchRadioLabel"
                        htmlFor="_contractType0"
                      >
                        비해당
                      </label>

                      <input
                        className="listSearchRadioInput"
                        type="radio"
                        value="무약정"
                        id="contractType1"
                        {...register("_contractType")}
                      />
                      <label
                        className="listSearchRadioLabel"
                        htmlFor="contractType1"
                      >
                        무약정
                      </label>

                      <input
                        className="listSearchRadioInput"
                        type="radio"
                        value="1년약정"
                        id="contractType2"
                        {...register("_contractType")}
                      />
                      <label
                        className="listSearchRadioLabel"
                        htmlFor="contractType2"
                      >
                        1년약정
                      </label>
                      <input
                        className="listSearchRadioInput"
                        type="radio"
                        value="연장약정"
                        id="contractType3"
                        {...register("_contractType")}
                      />
                      <label
                        className="listSearchRadioLabel"
                        htmlFor="contractType3"
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
                        checked={watch("_combineStatus").toString() === "1"}
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
                        checked={watch("_combineStatus").toString() === "0"}
                      />
                      <label
                        className="listSearchRadioLabel"
                        htmlFor="combineStatus0"
                      >
                        아니오
                      </label>
                    </div>
                  </div>
                  {/* 끝 - 약정관리 ======================================== */}
                </fieldset>
                {/* 계약기본정보 필드 끝 ==================================================================== */}
              </div>

              <div className="formContainer">
                <h3>사업자 정보 관리</h3>
                {/* 고객 기본정보 필드 시작 ==================================================================== */}
                <fieldset id="CompanyDetail_2">
                  <h3>사업자 기본 정보</h3>

                  {/* 고객 기본정보  시작 ==================================================================== */}
                  <div className="formContentWrap">
                    <label htmlFor="isGongsa" className=" blockLabel">
                      <span>공사 업체</span>
                    </label>
                    <div className="formPaddingWrap">
                      <input
                        type="radio"
                        value="1"
                        checked={getValues("_isGongsa").toString() === "1"}
                        id="isGongsa1"
                        className="listSearchRadioInput"
                        {...register("_isGongsa")}
                      />
                      <label
                        htmlFor="isGongsa1"
                        className="listSearchRadioLabel"
                      >
                        예
                      </label>
                      <input
                        type="radio"
                        value="0"
                        checked={getValues("_isGongsa").toString() === "0"}
                        id="isGongsa0"
                        className="listSearchRadioInput"
                        {...register("_isGongsa")}
                      />
                      <label
                        htmlFor="isGongsa0"
                        className="listSearchRadioLabel"
                      >
                        아니요
                      </label>
                    </div>
                  </div>
                  <div className="formContentWrap">
                    <label className=" blockLabel">
                      <span>공사 유형</span>
                    </label>
                    <div
                      className={`formPaddingWrap ${
                        getValues("_isGongsa").toString() === 0
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
                        disabled={getValues("_isGongsa").toString() === "0"}
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
                        disabled={getValues("_isGongsa").toString() === "0"}
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
                        disabled={getValues("_isGongsa").toString() === "0"}
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

                  {/* setDetailUserInfo radio 끝, input(상호 ~ 키워드) ================================================================ */}

                  <div className="formContentWrap">
                    <label htmlFor="Cname" className="blockLabel">
                      <span>상호명</span>
                    </label>
                    <div>
                      <input
                        type="text"
                        id="Cname"
                        placeholder="15자 이하로 입력해 주세요."
                        maxLength="15"
                        {...register("_name")}
                      />
                    </div>
                  </div>

                  {/* 📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍📍 */}

                  <div className="formContentWrap">
                    <label
                      className="blockLabel"
                      style={{ position: "relative" }}
                    >
                      {customerTypeview && <CustomerTypeview />}
                      <span className="tipTh">
                        <span>가입자 구분</span>
                        <i
                          onClick={() => setCustomerTypeview(!customerTypeview)}
                        >
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
                      <span>대표 ( 주력 ) 업종</span>
                    </label>
                    <div style={{ position: "relative", width: "88%" }}>
                      <input
                        type="text"
                        id="bigCategory"
                        placeholder="띄어쓰기 쉼표 포함 20자 이내"
                        maxLength={maxBigCategoryLength}
                        {...register("_bigCategory", {
                          onChange: handleBigCategoryChange,
                        })}
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
                    </div>
                  </div>

                  <div className="formContentWrap" style={{ width: "100%" }}>
                    <label htmlFor="subCategory" className="blockLabel">
                      <span>상세 업종</span>
                    </label>
                    <div style={{ position: "relative", width: "88%" }}>
                      <input
                        type="text"
                        id="subCategory"
                        placeholder="띄어쓰기 쉼표 포함 60자 이내"
                        maxLength={maxSubCategoryLength}
                        {...register("_subCategory", {
                          onChange: handleSubCategoryChange,
                        })}
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
                    </div>
                  </div>
                  {/* 사업자 분류 */}
                  <div className="formContentWrap">
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
                      <label
                        className="listSearchRadioLabel"
                        htmlFor="comType0"
                      >
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
                      <label
                        className="listSearchRadioLabel"
                        htmlFor="comType01"
                      >
                        법인사업자
                      </label>
                    </div>
                  </div>
                  {/* 연령 */}
                  <div className="formContentWrap">
                    <div className="blockLabel">
                      <span>연령</span>
                    </div>
                    <div className="formPaddingWrap">
                      <input
                        className="listSearchRadioInput"
                        type="radio"
                        checked={watch("_age") == "10대"}
                        value="10대"
                        id="age10"
                        {...register("_age")}
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
                        {...register("_age")}
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
                        {...register("_age")}
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
                        {...register("_age")}
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
                        {...register("_age")}
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
                        {...register("_age")}
                      />
                      <label className="listSearchRadioLabel" htmlFor="age60">
                        60대 이상
                      </label>
                    </div>
                  </div>

                  <div className="formContentWrap">
                    <label htmlFor="registration" className="blockLabel">
                      <span>사업자 번호</span>
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
                              .replace(
                                /([0-9]{3})([0-9]{2})([0-9]+)/,
                                "$1-$2-$3"
                              )
                              .replace("--", "-")) ||
                          ""
                        }
                        {...register("_registration", {
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

                  <div className="formContentWrap">
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

                  <div className="formContentWrap">
                    <label htmlFor="regName" className="blockLabel">
                      <span>사업자 등록증 상호</span>
                    </label>
                    <div>
                      <input
                        type="text"
                        id="regName"
                        placeholder="15자 이하로 입력해 주세요."
                        maxLength="15"
                        {...register("_regName")}
                      />
                    </div>
                  </div>

                  <div className="formContentWrap">
                    <label htmlFor="regOwner" className="blockLabel">
                      <span>대표자명</span>
                    </label>
                    <div>
                      <input
                        type="text"
                        id="regOwner"
                        maxLength={8}
                        {...register("_regOwner")}
                      />
                    </div>
                  </div>

                  <SetImage id="regImgs" title="사업자 등록증 첨부" />

                  <div className="formContentWrap">
                    <label htmlFor="mobilenum" className="blockLabel">
                      <span>휴대폰</span>
                    </label>
                    <div>
                      <input
                        type="text"
                        id="mobilenum"
                        maxLength={13}
                        value={
                          (watch("_mobilenum") &&
                            FM.serviesFormatPhoneNumber(watch("_mobilenum"))) ||
                          ""
                        }
                        {...register("_mobilenum")}
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

                  <div className="formContentWrap">
                    <label htmlFor="telnum" className="blockLabel">
                      <span>일반전화</span>
                    </label>
                    <div>
                      <input
                        type="text"
                        id="telnum"
                        maxLength="13"
                        value={
                          (watch("_telnum") &&
                            FM.serviesFormatPhoneNumber(watch("_telnum"))) ||
                          ""
                        }
                        {...register("_telnum")}
                      />
                    </div>
                  </div>

                  {APIURL.urlPrefix ===
                    "https://releaseawsback.gongsacok.com" && (
                    <div className="formContentWrap">
                      <label htmlFor="extnum" className="blockLabel">
                        <span>안심번호</span>
                      </label>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          type="text"
                          id="extnum"
                          style={{ width: "85.5%" }}
                          disabled
                          value={
                            (watch("_extnum") &&
                              watch("_extnum")
                                .replace(/[^0-9]/g, "")
                                .replace(
                                  /(^[0-9]{4})([0-9]+)([0-9]{4}$)/,
                                  "$1-$2-$3"
                                )
                                .replace("--", "-")) ||
                            ""
                          }
                          {...register("_extnum")}
                        />
                        {companyData.useFlag == 0 ? (
                          <button
                            className="formContentBtn"
                            onClick={() =>
                              TOA.servicesUseToast(
                                "현재 비활성화 상태입니다",
                                "e"
                              )
                            }
                          >
                            {!!watch("_extnum") ? "관리" : "등록"}
                          </button>
                        ) : (
                          <Link
                            className="formContentBtn"
                            to={
                              !!watch("_extnum")
                                ? `safenumber/${watch("_extnum").replaceAll(
                                    "-",
                                    ""
                                  )}`
                                : "safenumber"
                            }
                          >
                            {!!watch("_extnum") ? "관리" : "등록"}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="formContentWrap">
                    <label htmlFor="fax" className="blockLabel">
                      <span>팩스</span>
                    </label>
                    <div>
                      <input
                        type="text"
                        id="fax"
                        maxLength="13"
                        value={
                          (watch("_fax") &&
                            watch("_fax")
                              .replace(/[^0-9]/g, "")
                              .replace(
                                /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                                "$1-$2-$3"
                              )
                              .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                              .replace("--", "-")) ||
                          ""
                        }
                        {...register("_fax")}
                      />
                    </div>
                  </div>

                  {/* 주소 */}
                  <PieceRegisterSearchPopUp />

                  {/* 이메일 */}
                  <div className="formContentWrap">
                    <label htmlFor="email" className="blockLabel">
                      <span>이메일</span>
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

                  {/* 업무시간 */}
                  <div className="formContentWrap">
                    <label htmlFor="workTime" className="blockLabel">
                      <span>업무시간</span>
                    </label>

                    <ul className="detailContent">
                      <li>
                        <div>
                          <span>시작</span>
                          <input
                            type="time"
                            id="workTime"
                            {...register("_workTimeTo")}
                          />
                        </div>
                      </li>
                      <li>
                        <div>
                          <span>마감</span>
                          <input
                            type="time"
                            id="workTime"
                            {...register("_workTimeFrom")}
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                </fieldset>
                {/* 고객기본정보 ============================================================================== */}

                <fieldset id="CompanyDetail_3">
                  <h3>사업자 정보</h3>
                  <ComponentFreeAddKeyword />

                  <div className="formContentWrap" style={{ width: "100%" }}>
                    <label htmlFor="offer" className="blockLabel">
                      <span>회사 소개</span>
                    </label>
                    <div>
                      <textarea
                        type="text"
                        id="offer"
                        placeholder="300자 이내로 입력해 주세요."
                        maxLength="300"
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
                        placeholder="300자 이내로 입력해 주세요."
                        maxLength="300"
                        {...register("_ceogreet")}
                      />
                    </div>
                  </div>

                  <ServicesImgAndImgsSetPreview />

                  <div className="formContentWrap" style={{ width: "100%" }}>
                    <label htmlFor="remarks" className="blockLabel">
                      <span>비고</span>
                    </label>
                    <div>
                      <textarea
                        type="text"
                        id="remarks"
                        {...register("_remarks")}
                      />
                    </div>
                  </div>

                  <div className="formContentWrap" style={{ width: "100%" }}>
                    <label className="blockLabel">
                      <span>녹취록 관리</span>
                    </label>
                    <div className="formBtnWrap">
                      <Link
                        to="record/add"
                        style={{ marginLeft: "8px", marginRight: "8px" }}
                      >
                        녹취록 업로드
                      </Link>
                      <Link to="record">녹취록 관리</Link>
                    </div>
                  </div>
                </fieldset>
                <CustomerCounseling />
              </div>

              <div className="formContainer">
                <h3 id="CompanyDetail_5">공사콕 계정 관리</h3>
                <SetDetailComapnyPieceLink />
              </div>

              <div className="formContainer" id="CompanyDetail_7">
                <h3> 판매키워드 ( 상위노출 ) 관리</h3>
                <ComponentCompanySealsKeyword />
                {/* <ComponentCompanySealsKeywordHanok /> */}
              </div>

              <div className="formContainer" id="CompanyDetail_7">
                <h3>결제 관리</h3>

                <ComponentPayment />
                <ComponentTaxBill />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
