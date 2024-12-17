// 유통망관리 > 자사(총판)관리

import { useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as CLICK from "../../action/click";
import * as DATA from "../../action/data";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";
import * as UDIMAGE from "../../service/useData/image";
import * as RC from "../../service/useData/roleCheck";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ServiceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp";
import ComponentModal from "../../components/services/ServiceModalAgentem";
import SetImage from "../../components/services/ServicesImageSetPreview";

export default function SetAgentSd() {
  const { daid } = useParams();
  const UID_VAL = useRef("");
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      _afflname: "",
      _cname: "",
      _corporationno: "",
      _email: "",
      _fax: "",
      _name: "",
      _registration: "",
      _phonenum: "",
      _situation: "",
      _sepphonenum: "",
      _useFlag: "1",
    },
  });

  const imgsRegIid = [];
  const regImgs = useSelector(
    (state) => state.image.multiImgsData || [],
    shallowEqual
  );

  const clickModal = useSelector((state) => state.click.click, shallowEqual);
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );

  // 수정 시에만 동작
  CUS.useCleanupEffect(() => {
    dispatch(CLICK.serviceClick(false));
    if (daid) {
      fnGetDaid();
    }
  }, []);

  // ComponentModalAgentem에서 동작하는 함수
  const fnSelectAgent = (item) => {
    console.log("item :", item);

    setValue("_afflname", `[ 총 ] ${item.cname}`);
    setValue("_name", item.name);
    setValue("_registration", item.registration);
    setValue("_corporationno", item.corporationno);
    setValue("_phonenum", item.phonenum);
    setValue("_sepphonenum", item.sepphonenum);
    setValue("_email", item.email);
    setValue("_fax", item.fax);
    setValue("_remarks", item.remarks);

    dispatch(CLICK.serviceClick(!clickModal));
  };

  async function fnGetDaid() {
    const DAID_RES = await API.servicesPostData(APIURL.urlGetDistribution, {
      daid: daid,
    });

    if (DAID_RES.status === "success") {
      UID_VAL.current = DAID_RES.data.ruid;

      const USER_RES = await API.servicesPostData(APIURL.urlGetUser, {
        uid: DAID_RES.data.ruid,
      });
      setValue("_userid", USER_RES.data.userid || "");

      const USERDETAIL_RES = await API.servicesPostData(
        APIURL.urlGetUserDetail,
        {
          ruid: DAID_RES.data.ruid,
        }
      );
      dispatch(
        DATA.serviceGetedData({ ...USERDETAIL_RES.data, ...DAID_RES.data })
      );
      console.log(getedData);

      // getUserDetail에도 들어가는 값
      setValue("_name", DAID_RES.data.name || "");
      setValue("_phonenum", DAID_RES.data.phonenum || "");

      // urlGetDistribution에만 있는 값
      setValue("_afflname", DAID_RES.data.afflname || "");
      setValue("_situation", DAID_RES.data.situation || "");
      setValue("_cname", DAID_RES.data.cname || "");
      setValue("_registration", DAID_RES.data.registration || "");
      setValue("_corporationno", DAID_RES.data.corporationno || "");
      setValue("_phonenum", DAID_RES.data.phonenum || "");
      setValue("_sepphonenum", DAID_RES.data.sepphonenum || "");
      setValue("_email", DAID_RES.data.email || "");
      setValue("_fax", DAID_RES.data.fax || "");
      setValue("_remarks", DAID_RES.data.remarks || "");
      // 사업자 등록증 이미지
      // setValue("_remarks", DAID_RES.data.remarks || "");

      // 운영자 ( 관리자 ) 정보
      setValue("_adname", DAID_RES.data.adname || "");
      setValue("_adregistration", DAID_RES.data.adregistration || "");
      setValue("_adphonenum", DAID_RES.data.adphonenum || "");
      setValue("_adsepphonenum", DAID_RES.data.adsepphonenum || "");
      setValue("_ademail", DAID_RES.data.ademail || "");
      setValue("_adfax", DAID_RES.data.adfax || "");
      setValue("_prodcost", DAID_RES.data.prodcost || "");
      setValue("_prodcostvalue", DAID_RES.data.prodcostvalue || "");
      setValue("_usagefeevalue", DAID_RES.data.usagefeevalue || "");
    }
  }

  function fnPasswordSubmit() {
    if (!RC.serviesPasswdCheck(watch("_userid"), watch("_passwd"))) {
      return;
    }

    API.servicesPostData(APIURL.urlSetUser, {
      uid: UID_VAL.current,
      passwd: watch("_passwd"),
    }).then((res) => {
      if (res.status === "success") {
        TOA.servicesUseToast("비밀번호 변경이 완료되었습니다.", "s");
      }
    });
  }

  async function fnsetuserAndDist(uid) {
    UDIMAGE.serviesGetImgsIid(imgsRegIid, regImgs);

    const SETUSER = await API.servicesPostData(APIURL.urlSetUser, {
      uid: uid,
      userrole: "ROLE_USER,ROLE_ADMIN",
      useFlag: getValues("_situation") === "stop" ? "0" : "1",
    });

    const SETUSERDETAIL = await API.servicesPostData(APIURL.urlSetUserDetail, {
      ruid: uid,
      name: getValues("_name"),
      mobile: getValues("_phonenum"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
    });

    const CNAMEVALUE = daid
      ? getValues("_cname")
      : `[ 대 ] ${getValues("_cname")}`;

    const SETDISRTRI = await API.servicesPostData(
      daid ? APIURL.urlSetDistribution : APIURL.urlAddDistribution,
      {
        daid: daid ? daid : "",
        // const SETDISRTRI = await API.servicesPostData(APIURL.urlSetDistribution, {
        ruid: uid,
        // 사업장 정보
        afflname: getValues("_afflname"),
        situation: getValues("_situation") === "stop" ? "stop" : "approval",
        name: getValues("_name"),
        cname: CNAMEVALUE,
        registration: getValues("_registration"),
        corporationno: getValues("_corporationno"),
        phonenum: getValues("_phonenum"),
        sepphonenum: getValues("_sepphonenum"),
        email: getValues("_email"),
        fax: getValues("_fax"),
        remarks: getValues("_remarks"),
        adress: multilAddress.address,
        detailAdress: multilAddress.detailaddress,
        // 사업자 등록증 이미지
        regimgs: regImgs && regImgs.length > 0 ? imgsRegIid.toString() : "",
        // 운영자 ( 관리자 ) 정보
        adname: getValues("_adname"),
        adregistration: getValues("_adregistration"),
        adphonenum: getValues("_adphonenum"),
        adsepphonenum: getValues("_adsepphonenum"),
        ademail: getValues("_ademail"),
        adfax: getValues("_adfax"),
        prodcost: getValues("_prodcost"),
        prodcostvalue: getValues("_prodcostvalue") * 1,
        usagefeevalue: getValues("_usagefeevalue") * 1,
        managetype: "AG",
      }
    );

    if (
      SETDISRTRI.status === "success" &&
      SETUSER.status === "success" &&
      SETUSERDETAIL.status === "success"
    ) {
      TOA.servicesUseToast("완료되었습니다.", "s");
    } else {
      TOA.servicesUseToast("작업에 실패했습니다.", "e");
    }
  }

  // 추가할 때 실행되는 함수
  async function fnAddSubmit() {
    if (!multilAddress.address) {
      TOA.servicesUseToast("주소를 입력해 주세요.", "e");
      return;
    }

    if (!RC.serviesPasswdCheck(watch("_userid"), watch("_passwd"))) {
      return;
    }

    const ADDUSER_RES = await API.servicesPostData(APIURL.urlAdduser, {
      userid: watch("_userid"),
      passwd: watch("_passwd"),
    });

    // 이미 사용된 아이디 오류 알림
    if (
      ADDUSER_RES.emsg === "Database update failure. check duplicate userid"
    ) {
      TOA.servicesUseToast("이미 사용된 아이디 입니다.", "e");
    }

    // 아이디 생성 후 코드
    if (ADDUSER_RES.status === "success") {
      const UAPI = await API.servicesPostData(APIURL.urlUserlist, {
        offset: 0,
        size: 2,
        userid: watch("_userid"),
      }).then((res) => {
        if (res.status === "success") {
          return res.data[0].uid;
        }
      });
      fnsetuserAndDist(UAPI);
    }
  }

  // 수정 & 추가 버튼 클릭 이벤트
  function fnSubmit(e) {
    if (!!daid) {
      fnsetuserAndDist(UID_VAL.current);
    } else {
      fnAddSubmit();
    }
  }

  function fnSameBtn(e) {
    e.preventDefault();
    setValue("_adname", getValues("_name"));
    setValue("_adregistration", getValues("_registration"));
    setValue("_adphonenum", getValues("_phonenum"));
    setValue("_adsepphonenum", getValues("_sepphonenum"));
    setValue("_ademail", getValues("_email"));
    setValue("_adfax", getValues("_fax"));
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            <LayoutTopButton url="/agentag" text="목록으로 가기" />
            <LayoutTopButton text="완료" isSubmitting={isSubmitting} />
          </ul>
          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>지사 총판 수정</h3>
              <div
                className="formContentWrap"
                style={{
                  width: "100%",
                }}
              >
                {/* /setCompany */}
                <label htmlFor="Cname" className="blockLabel">
                  <span>소속</span>
                </label>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <input
                    type="text"
                    id="afflname"
                    disabled
                    {...register("_afflname")}
                    style={{ width: "75%" }}
                  />

                  <button
                    type="button"
                    className="formContentBtn"
                    onClick={() => dispatch(CLICK.serviceClick(!clickModal))}
                  >
                    유통망 조회
                  </button>
                  {clickModal && <ComponentModal fn={fnSelectAgent} />}

                  <button
                    className="formContentBtn"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("_afflname", "[ 본사 ] 와짱 ( 주 )");
                    }}
                  >
                    본사 직영점
                  </button>

                  <button
                    className="formContentBtn"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("_afflname", "-");
                    }}
                  >
                    단독 대리점
                  </button>
                </div>
              </div>

              {daid && (
                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>상태</span>
                  </div>
                  <div className="formPaddingWrap">
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_situation") == "approval"}
                      value="approval"
                      id="approval"
                      {...register("_situation")}
                    />
                    <label className="listSearchRadioLabel" htmlFor="approval">
                      승인
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_situation") == "stop"}
                      value="stop"
                      id="stop"
                      {...register("_situation")}
                    />
                    <label className="listSearchRadioLabel" htmlFor="stop">
                      중지
                    </label>

                    {/* 미사용으로 인한 주석 처리 ================================ */}
                    {/* <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_situation") == "requestforapproval"}
                    value="requestforapproval"
                    id="requestforapproval"
                    {...register("_situation")}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="requestforapproval"
                  >
                    승인 요청
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_situation") == "requesttostop"}
                    value="requesttostop"
                    id="requesttostop"
                    {...register("_situation")}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="requesttostop"
                  >
                    중지 요청
                  </label> */}
                  </div>
                </div>
              )}

              {/* setDetailUserInfo  ================================================================ */}
              <div className="formContentWrap">
                <label htmlFor="name" className=" blockLabel">
                  <span>대표자명 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="name"
                    placeholder="대표자명을 입력해 주세요."
                    maxLength={8}
                    required
                    {...register("_name", {
                      maxLength: {
                        value: 8,
                        message: "8자 이하로 입력해주세요.",
                      },
                    })}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="cname" className=" blockLabel">
                  <span>상호명 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="cname"
                    required
                    placeholder="상호명을 입력해 주세요."
                    {...register("_cname")}
                  />
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
                    placeholder="사업자 번호를 입력해 주세요. (예시 000-00-00000)"
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
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="corporationno" className="blockLabel">
                  <span>주민 ( 법인 ) 번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="corporationno"
                    placeholder="법인 등록 번호를 입력해 주세요. (예시 000000-0000000)"
                    maxLength="14"
                    {...register("_corporationno")}
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
                <label htmlFor="phonenum" className="blockLabel">
                  <span>휴대폰 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="phonenum"
                    placeholder="휴대폰 번호를 입력해 주세요."
                    required
                    maxLength={13}
                    value={
                      (watch("_phonenum") &&
                        watch("_phonenum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_phonenum")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_phonenum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                {/* /setComapny */}
                <label htmlFor="sepphonenum" className="blockLabel">
                  <span>별도전화</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="sepphonenum"
                    placeholder="전화번호를 입력해 주세요."
                    maxLength={13}
                    value={
                      (watch("_sepphonenum") &&
                        watch("_sepphonenum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{4}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_sepphonenum", {
                      pattern: {
                        value:
                          /^(02|0505|1[0-9]{3}|0[0-9]{2})[0-9]{3,4}-[0-9]{4}|[0-9]{4}-[0-9]{4}$/,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_sepphonenum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="email" className=" blockLabel">
                  <span>이메일</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="email"
                    placeholder="이메일을 입력해 주세요."
                    value={
                      (watch("_email") &&
                        watch("_email").replace(/[^\\!-z]/gi, "")) ||
                      ""
                    }
                    {...register("_email", {
                      pattern: {
                        value:
                          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_email"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="fax" className=" blockLabel">
                  <span>팩스</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="fax"
                    placeholder="팩스번호를 입력해 주세요."
                    value={
                      (watch("_fax") &&
                        watch("_fax")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{4}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_fax", {
                      // pattern: {
                      //   value: /^\d{2,3}-\d{3,4}-\d{4}$/,
                      //   message: "형식에 맞지 않습니다.",
                      // },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_fax"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              {/* 주소 */}
              <ServiceRegisterSearchPopUp simpleValue req />

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
            </fieldset>

            {/*  ============================================================================================================== */}
            <fieldset id="CompanyDetail_2">
              <h3>
                운영자 ( 관리자 ) 정보
                <button onClick={fnSameBtn}>사업장 정보와 동일</button>
              </h3>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="adname" className=" blockLabel">
                  <span>이름 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="adname"
                    required
                    maxLength={8}
                    {...register("_adname")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_adname"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>
              <div className="formContentWrap">
                <label htmlFor="adregistration" className=" blockLabel">
                  <span>주민번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="adregistration"
                    maxLength="14"
                    {...register("_adregistration")}
                    value={
                      (watch("_adregistration") &&
                        watch("_adregistration")
                          .replace(/^(\d{0,6})(\d{0,7})$/g, "$1-$2")
                          .replace(/\-{1}$/g, "")) ||
                      ""
                    }
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_adregistration"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>계정관리 *</span>
                </label>
                <ul className="detailContent">
                  <li style={{ width: "50%" }}>
                    <div>
                      <span>아이디</span>
                      <input
                        type="text"
                        id="userid"
                        disabled={daid ? true : false}
                        required={!!daid ? false : true}
                        {...register("_userid")}
                      />
                    </div>
                  </li>
                  <li style={{ width: "50%" }}>
                    <div>
                      <span>비밀번호</span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          type="text"
                          id="passwd"
                          maxLength={16}
                          minLength={6}
                          required={!!daid ? false : true}
                          style={
                            !!daid
                              ? {
                                  width: "86%",
                                }
                              : { width: "100%" }
                          }
                          {...register("_passwd")}
                        />
                        {!!daid && (
                          <button
                            type="button"
                            onClick={fnPasswordSubmit}
                            className="formContentBtn"
                          >
                            변경
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="formContentWrap">
                <label htmlFor="adphonenum" className="blockLabel">
                  <span>휴대폰 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="adphonenum"
                    maxLength={13}
                    required
                    value={
                      (watch("_adphonenum") &&
                        watch("_adphonenum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_adphonenum")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_adphonenum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                {/* /setComapny */}
                <label htmlFor="adsepphonenum" className="blockLabel">
                  <span>별도전화</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="adsepphonenum"
                    maxLength={13}
                    value={
                      (watch("_adsepphonenum") &&
                        watch("_adsepphonenum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{4}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_adsepphonenum", {
                      pattern: {
                        value:
                          /^(02|0505|1[0-9]{3}|0[0-9]{2})[0-9]{3,4}-[0-9]{4}|[0-9]{4}-[0-9]{4}$/,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_adsepphonenum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>
              <div className="formContentWrap">
                <label htmlFor="ademail" className=" blockLabel">
                  <span>이메일</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="ademail"
                    value={
                      (watch("_ademail") &&
                        watch("_ademail").replace(/[^\\!-z]/gi, "")) ||
                      ""
                    }
                    {...register("_ademail", {
                      pattern: {
                        value:
                          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_ademail"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>
              <div className="formContentWrap">
                <label htmlFor="adfax" className=" blockLabel">
                  <span>팩스</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="adfax"
                    maxLength={13}
                    value={
                      (watch("_adfax") &&
                        watch("_adfax")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{4}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_adfax", {})}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_adfax"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>
              <SetImage id="regImgs" title="사업자 등록증" />
            </fieldset>
            <fieldset id="CompanyDetail_3">
              <h3>정산 정보</h3>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr className="agent_tr">
                      <th className="agent_th">요금구분</th>
                      <th className="agent_th">정산방법</th>
                      <th className="agent_th">적용 값</th>
                    </tr>
                  </thead>
                  <tbody className="agent_tbody">
                    <tr>
                      <td className="agent_tbody_td">제작비</td>
                      <td>
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_prodcost") == "1"}
                          value="1"
                          id="prodcost1"
                          {...register("_prodcost")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="prodcost1"
                          style={{
                            padding: "4px 8px",
                          }}
                        >
                          백분율(%)
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_prodcost") == "0"}
                          value="0"
                          id="prodcost0"
                          {...register("_prodcost")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="prodcost0"
                          style={{
                            padding: "4px 8px",
                          }}
                        >
                          수당
                        </label>
                      </td>
                      <td>
                        <input
                          type="number"
                          id="prodcostvalue"
                          className="input_text"
                          {...register("_prodcostvalue", {
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "형식에 맞지 않습니다.",
                            },
                          })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="agent_tbody_td">월 이용료</td>
                      <td>백분율(%)</td>
                      <td>
                        <input
                          type="number"
                          id="usagefeevalue"
                          className="input_text"
                          {...register("_usagefeevalue", {
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "형식에 맞지 않습니다.",
                            },
                          })}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
