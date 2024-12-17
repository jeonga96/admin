// 사업자 회원관리 > 사업자 추가 > ✔️ 현재 페이지(사업자 필수 페이지) > 사업자 상세페이지

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as SAFE from "../../service/useData/safenumber";
import * as UDIMAGE from "../../service/useData/image";
import * as RC from "../../service/useData/roleCheck";
import * as CUS from "../../service/customHook";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

import * as DATA from "../../action/data";

import PieceLoading from "../../components/piece/PieceLoading";
import SetImage from "../../components/services/ServicesImageSetPreview";
import ServicesImgAndImgsSetPreview from "../../components/services/ServicesImgAndImgsSetPreview";
import PieceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp";

import ComponentSalesManager from "../../components/common/ComponentSalesManager";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";

// 부모 ==============================================================================
export default function SetWaiting() {
  const { cid } = useParams();
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_1", text: "계약 기본 정보" },
    { idName: "CompanyDetail_2", text: "사업자 기본 정보" },
  ]);
  // 데이터 ------------------------------------------------------------------------
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const getedSummaryData = useSelector(
    (state) => state.data.getedSummaryData,
    shallowEqual
  );

  // 이미지 ------------------------------------------------------------------------
  // const titleImg = useSelector((state) => state.image.imgData, shallowEqual);
  const titleImg = useSelector((state) => state.image.imgData, shallowEqual);
  const imgs = useSelector((state) => state.image.imgsData || [], shallowEqual);
  const regImgs = useSelector(
    (state) => state.image.multiImgsData || [],
    shallowEqual
  );
  const imgsIid = [];
  const imgsRegIid = [];

  // 주소 ------------------------------------------------------------------------
  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );
  const IntIntegerValue = parseInt(getValues("_isGongsa"));

  // form submit 이벤트 =========================================
  const handleSubmitEvent = async (statusData) => {
    console.log(multilAddress, !multilAddress.address);

    if (statusData.target.id === "success") {
      if (!getValues("_ruid")) {
        TOA.servicesUseToast(
          "회원 관리번호가 연결되지 않으면 작업을 완료할 수 없습니다.",
          "e"
        );
        return;
      }

      if (!multilAddress.address || !multilAddress.longitude) {
        TOA.servicesUseToast("주소를 입력해 주세요.", "e");
        return; // 이미지가 충분히 업로드 되지 않았다면 함수 실행을 중단
      }

      const regImgsToSend =
        regImgs && regImgs.length > 0
          ? regImgs.map((img) => img.iid).join(",")
          : "";

      //regImgsToSend가 빈 문자열이면 오류 처리
      if (regImgsToSend === "") {
        TOA.servicesUseToast("사업자 등록증 사진을 1장 이상 올려주세요.", "e");
        return; // 이미지가 충분히 업로드 되지 않았다면 함수 실행을 중단
      }

      if (!titleImg) {
        // titleImg가 없으면 geted.titleImg를 확인
        if (!getedData.titleImg) {
          // geted.titleImg도 없으면 return
          TOA.servicesUseToast("대표 이미지를 설정해주세요.", "e");
          return;
        }
      }
    }

    setLoading(true);
    UDIMAGE.serviesGetImgsIid(imgsRegIid, regImgs);
    UDIMAGE.serviesGetImgsIid(imgsIid, imgs);

    try {
      const STATUS = RC.serviesCheckSafeNum(
        getValues("_mobilenum"),
        getValues("_telnum"),
        true
      );

      // 회사명 등 setCompany 등록
      const response1 = await API.servicesPostData(APIURL.urlSetCompany, {
        cid: cid,
        ruid: getValues("_ruid"),
        useFlag: 1,
        sruid: getedSummaryData.sruid,
      });

      // detail company 정보 등록 & 안심번호 등록
      const response2 = await API.servicesPostData(APIURL.urlSetCompanyDetail, {
        rcid: cid,
        useFlag: 1,
        status: statusData.target.id === "success" ? STATUS : 3,
        name: getValues("_Cname"),
        subCategory: getValues("_subCategory"),
        bigCategory: getValues("_bigCategory"),
        regOwner: getValues("_regOwner"),
        mobilenum: getValues("_mobilenum"),
        telnum: getValues("_telnum"),
        registration: getValues("_registration"),
        address: multilAddress.address,
        detailaddress: multilAddress.detailaddress,
        oldaddress: multilAddress.oldaddress,
        zipcode: multilAddress.zipcode,
        longitude: multilAddress.longitude,
        latitude: multilAddress.latitude,
        isGongsa: IntIntegerValue,
        gongsaType: getValues("_gongsaType").toString() || "",
        age: getValues("_age"),
        comType: getValues("_comType"),
        regName: getValues("_regName"),
        email: `${getValues("_email_user")}@${getValues("_email_domain")}`,
        regImgs: regImgs && regImgs.length > 0 ? imgsRegIid.toString() : "",
        titleImg: titleImg || getedData.titleImg,
        imgs: imgsIid.length > 0 ? imgsIid.toString() : "",
      });

      if (response1.status === "success" && response2.status === "success") {
        TOA.servicesUseToast(
          `${
            statusData.target.id === "success" ? "완료" : "거절"
          }상태로 변경되었습니다.`,
          "s"
        );

        if (statusData.target.id === "success") {
          if (STATUS === 2 || STATUS === 4) {
            SAFE.serviesSafeNumSetting(
              cid,
              watch("_mobilenum"),
              watch("_telnum"),
              watch("_Cname"),
              watch("_ruid"),
              setLoading
            );
            navigate(`/waitinglist`);
          } else {
            // routeCid();
            navigate(`/waitinglist`);
          }
        } // statusData.target.id === "success"
      } else {
        TOA.servicesUseToast("등록되지 않았습니다.", "e");
      }
    } catch (error) {
      TOA.servicesUseToast("등록되지 않았습니다.", "e");
    }
    setLoading(false);
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value._mobilenum || value._telnum) {
        clearErrors(["_mobilenum", "_telnum"]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  CUS.useCleanupEffect(() => {
    API.servicesPostData(APIURL.urlGetCompanyDetail, {
      rcid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          const payload = res.data;
          dispatch(DATA.serviceGetedData(payload));
        }
      })
      .catch((res) => console.log(res));

    API.servicesPostData(APIURL.urlGetCompany, { cid: cid }).then(
      (urlGetCompanyRes) => {
        const ruid = urlGetCompanyRes.data.ruid;
        setValue("_ruid", ruid);
        dispatch(DATA.serviceGetedSummaryData(urlGetCompanyRes.data));
      }
    );
  }, []);

  useEffect(() => {
    // setValue("_status", getedData.status);
    if (getedData.isGongsa !== undefined && getedData.isGongsa !== null) {
      setValue("_isGongsa", getedData.isGongsa || "0");
    }
    setValue("_comType", getedData.comType);
    setValue("_Cname", getedData.name || "");
    setValue("_registration", getedData.registration || "");
    setValue("_telnum", getedData.telnum || "");
    setValue("_mobilenum", getedData.mobilenum || "");
    setValue(
      "_email_user",
      (getedData.email && getedData.email.split("@")[0]) || ""
    );
    setValue(
      "_email_domain",
      (getedData.email && getedData.email.split("@")[1]) || ""
    );
    setValue("_regName", getedData.regName || "");
    setValue("_regOwner", getedData.regOwner || "");
    setValue("_age", getedData.age);
    setValue("_bigCategory", getedData.bigCategory || "");
    setValue("_subCategory", getedData.subCategory || "");
  }, [getedData]);

  // const fnSelect = (res) => {
  //   if (!res.cid) {
  //     MO.servicesUseModalLinkedUser(
  //       () => {
  //         API.servicesPostData(APIURL.urlGetUserDetail, { ruid: res.uid }).then(
  //           (res2) => {
  //             dispatch(CLICK.serviceClick(false));
  //             setValue("_ruid", res.uid);
  //             if (res2.status === "suceess") {
  //               TOKEN.serviesSetToken(cid);

  //               setValue("_regOwner", !!res2.data.name ? res2.data.name : "");
  //               setValue(
  //                 "_mobilenum",
  //                 !!res2.data.mobile ? res2.data.mobile : ""
  //               );
  //               const payload = res2.data;
  //               dispatch(DATA.serviceGetedData(payload));
  //               dispatch(CLICK.serviceModalClick(false));
  //             } else {
  //               TOA.servicesUseToast("덮어쓰기할 데이터가 없습니다.", "e");
  //             }
  //           }
  //         );
  //       },
  //       () => {
  //         TOKEN.serviesSetToken(cid);
  //         dispatch(CLICK.serviceModalClick(false));
  //         setValue("_ruid", res.uid);
  //       }
  //     );
  //   } else {
  //     dispatch(CLICK.serviceClick(false));
  //     TOA.servicesUseToast("기존에 연결된 회원 관리번호 입니다.", "e");
  //   }
  // };

  return (
    <>
      <div className="commonBox">
        <PieceLoading loading={loading} bg />
        <div className="formLayout">
          <ul className="tableTopWrap tableTopBorderWrap">
            <ComponentTableTopScrollBtn data={tableTopScrollBtnData.current} />
            <LayoutTopButton idNum={cid} />
            <LayoutTopButton url="/waitinglist" text="목록으로 가기" />
            <LayoutTopButton
              text="거절 상태로 변경"
              fn={handleSubmitEvent}
              id="fail"
            />
            <LayoutTopButton
              text="완료 상태로 변경"
              fn={handleSubmitEvent}
              id="success"
            />
          </ul>

          <div className="formWrap reqFormWrap">
            <div className="formContainer">
              <h3>영업 관리</h3>
              <ComponentSalesManager />
            </div>

            <div className="formContainer">
              <h3>회원 계정 관리</h3>
              <fieldset id="CompanyDetail_1">
                <h3>계약 기본 정보</h3>
                {/* /setCompany ============================= */}
                <div className="formContentWrap">
                  <div className="blockLabel">
                    <span>회원 관리번호 *</span>
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
                        width: "100%",
                      }}
                      // style={{
                      //   width: "calc(100% - 104px)",
                      // }}
                      disabled
                      {...register("_ruid")}
                    />

                    {/* <button
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
                    </button> */}

                    {/* <button
                      type="button"
                      onClick={() => {
                        // handleRemove().then((res) => {
                        //   if (res.status === "success") {
                        //     setValue("_ruid", "");
                        //     const payload = {
                        //       ...getedData,
                        //       status: 4,
                        //     };
                        //     dispatch(DATA.serviceGetedData(payload));
                        //   }
                        // });
                      }}
                      className="formContentBtn"
                      disabled
                      style={{
                        width: "50px",
                        backgroundColor: "#da3933",
                        color: "rgb(255, 255, 255)",
                      }}
                    >
                      해지
                    </button>
                    <ComponentModal fn={fnSelect} /> */}
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
                    <span>공사 업체 *</span>
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
                    <span>공사 유형 *</span>
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
                  <div className="blockLabel">
                    <span>사업자 분류 *</span>
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

                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="bigCategory" className="blockLabel">
                    <span>홍보용 상호 *</span>
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

                <div className="formContentWrap">
                  <label htmlFor="bigCategory" className="blockLabel">
                    <span>대표 ( 주력 ) 업종 *</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="bigCategory"
                      placeholder="띄어쓰기 쉼표 포함 20자 이내"
                      maxLength={20}
                      {...register("_bigCategory", {
                        required: "입력되지 않았습니다.",
                      })}
                    />
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
                <div className="formContentWrap">
                  <label htmlFor="subCategory" className="blockLabel">
                    <span>상세 업종 *</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="subCategory"
                      placeholder="띄어쓰기 쉼표 포함 60자 이내"
                      maxLength={60}
                      {...register("_subCategory", {
                        required: "입력되지 않았습니다.",
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="_subCategory"
                      render={({ message }) => (
                        <span className="errorMessageWrap">{message}</span>
                      )}
                    />
                  </div>
                </div>

                {/* 연령 */}
                <div className="formContentWrap">
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

                {/* 주소 */}
                <PieceRegisterSearchPopUp req />

                {/* 이메일 */}
                <div className="formContentWrap">
                  <label htmlFor="email" className="blockLabel">
                    <span>이메일 *</span>
                  </label>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <input
                      id="email"
                      {...register("_email_user")}
                      style={{ width: "60%" }}
                    />
                    <span style={{ lineHeight: "28px" }}>@</span>
                    <select
                      style={{ width: "35%" }}
                      {...register("_email_domain")}
                    >
                      <option value="gmail.com">gmail.com</option>
                      <option value="naver.com">naver.com</option>
                      <option value="yahoo.com">yahoo.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="hanmail.net">hanmail.net</option>
                      <option value="msn.com">msn.com</option>
                      <option value="nate.com">nate.com</option>
                      <option value="apple.com">apple.com</option>
                    </select>
                  </div>
                </div>

                {/* 휴대폰 */}
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
                        // required: "입력되지 않았습니다.",
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
                    <span>일반전화 *</span>
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
                      {...register("_telnum", {})}
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
                      {...register("_regName")}
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

                <SetImage id="regImgs" title="사업자 등록증" req />
                <ServicesImgAndImgsSetPreview req />
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
