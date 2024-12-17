// 유통망관리 > 사원관리

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentModal from "../../components/services/ServiceModalAgentem";

import * as RC from "../../service/useData/roleCheck";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";

import * as CLICK from "../../action/click";

export default function SetAgentEm() {
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _afflname: "",
      _corporationno: "",
      _email: "",
      _fax: "",
      _name: "",
      _phonenum: "",
      _situation: "approval",
      _sepphonenum: "",
      _useFlag: "1",
    },
  });

  const { daid } = useParams();
  const UID_VAL = useRef("");
  const dispatch = useDispatch();
  const clickModal = useSelector((state) => state.click.click, shallowEqual);
  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );

  const [userData, setUserData] = useState({});

  async function fnGetDaid() {
    const DAID_RES = await API.servicesPostData(APIURL.urlGetDistribution, {
      daid: daid,
    });

    if (DAID_RES.status === "success") {
      const DATA = DAID_RES.data;
      UID_VAL.current = DATA.ruid;
      const USER_RES = await API.servicesPostData(APIURL.urlGetUser, {
        uid: DATA.ruid,
      });
      setValue("_userid", USER_RES.data.userid || "");

      // getUserDetail에도 들어가는 값
      setValue("_name", DATA.name || "");
      setValue("_phonenum", DATA.phonenum || "");

      // urlGetDistribution에만 있는 값
      setValue("_afflname", DATA.afflname || "");
      setValue("_corporationno", DATA.corporationno || "");
      setValue("_fax", DATA.fax || "");
      setValue("_situation", DATA.situation || "");
      setValue("_remarks", DATA.remarks || "");
      setValue("_prodcost", DATA.prodcost || "");
      setValue("_registration", DATA.registration || "");
      setValue("_sepphonenum", DATA.sepphonenum || "");
      setValue("_adsepphonenum", DATA.adsepphonenum || "");
      setValue("_adphonenum", DATA.adphonenum || "");
      setValue("_phonenum", DATA.phonenum || "");
      setValue("_adfax", DATA.adfax || "");
      setValue("_email", DATA.email || "");
      setValue("_usagefeevalue", DATA.usagefeevalue || "");
      setValue("_prodcostvalue", DATA.prodcostvalue || "");
    }
  }

  // 수정 시에만 동작
  CUS.useCleanupEffect(() => {
    dispatch(CLICK.serviceClick(false));
    if (!!daid) {
      fnGetDaid();
    }
  }, []);

  // ComponentModalAgentem에서 동작하는 함수
  const fnSelectAgent = (item) => {
    // setValue("_afflname", item.cname);

    setValue(
      "_afflname",
      item.managetype === "SD"
        ? `${item.cname}`
        : `${
            item.afflname === "[ 본사 ] 와짱 ( 주 )"
              ? item.afflname
              : `${item.afflname}`
          }  /  ${item.cname}`
      // `[ ${item.managetype === "SD" ? "총" : "대"} ] ${item.cname}`
    );

    setValue("_adsepphonenum", item.adsepphonenum);
    setValue("_adphonenum", item.adphonenum);
    dispatch(CLICK.serviceClick(false));
  };

  useEffect(() => {
    if (userData.addUserFail) {
      TOA.servicesUseToast("이미 존재하는 아이디입니다.", "e");
      setUserData({ ...userData, addUserFail: false });
    }
  }, [userData.addUserFail]);

  // 추가할 때 실행되는 함수
  async function fnAddSubmit() {
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

      API.servicesPostData(APIURL.urlSetUser, {
        uid: UAPI,
        userrole: "ROLE_USER,ROLE_ADMIN",
        useFlag: "1",
      });

      API.servicesPostData(APIURL.urlSetUserDetail, {
        ruid: UAPI,
        name: getValues("_name"),
        mobile: getValues("_phonenum"),
      })
        .then((res) => {
          API.servicesPostData(APIURL.urlAddDistribution, {
            ruid: UAPI,
            name: getValues("_name"),
            phonenum: getValues("_phonenum"),
            afflname: getValues("_afflname"),
            corporationno: getValues("_corporationno"),
            fax: getValues("_fax"),
            email: getValues("_email"),
            situation: getValues("_situation"),
            remarks: getValues("_remarks"),
            adress: multilAddress.address,
            detailAdress: multilAddress.detailaddress,
            prodcost: getValues("_prodcost"),
            registration: getValues("_registration"),
            sepphonenum: getValues("_sepphonenum"),
            adsepphonenum: getValues("_adsepphonenum"),
            adphonenum: getValues("_adphonenum"),
            phonenum: getValues("_phonenum"),
            prodcostvalue: getValues("_prodcostvalue"),
            usagefeevalue: getValues("_usagefeevalue"),
            adfax: getValues("_adfax"),
            managetype: "EM",
          }).then((res) => {
            if (res.status === "success") {
              TOA.servicesUseToast("완료되었습니다!", "s");

              // setTimeout(() => {
              //     navigate("/agentag");
              //     window.location.reload();
              // }, 2000);
            } else {
              console.error("Unexpected response status:", res.status);
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async function fnSetSubmit() {
    const SETUSER = await API.servicesPostData(APIURL.urlSetUser, {
      uid: UID_VAL.current,
      useFlag: getValues("_situation") === "stop" ? "0" : "1",
    });

    const SETUSERDETAIL = await API.servicesPostData(APIURL.urlSetUserDetail, {
      ruid: UID_VAL.current,
      name: getValues("_name"),
      mobile: getValues("_phonenum"),
    });

    const SETDISRTRI = await API.servicesPostData(APIURL.urlSetDistribution, {
      daid: daid,
      name: getValues("_name"),
      afflname: getValues("_afflname"),
      // getValues("_afflname") === "[ 본사 ] 와짱 ( 주 )"
      //   ? getValues("_afflname")
      //   : getValues("_afflname").split("]")[1],
      corporationno: getValues("_corporationno"),
      fax: getValues("_fax"),
      email: getValues("_email"),
      situation: getValues("_situation"),
      remarks: getValues("_remarks"),
      prodcost: getValues("_prodcost"),
      registration: getValues("_registration"),
      sepphonenum: getValues("_sepphonenum"),
      phonenum: getValues("_phonenum"),
      adsepphonenum: getValues("_adsepphonenum"),
      adphonenum: getValues("_adphonenum"),
      prodcostvalue: getValues("_prodcostvalue"),
      usagefeevalue: getValues("_usagefeevalue"),
      adfax: getValues("_adfax"),
    });

    if (
      SETDISRTRI.status === "success" &&
      SETUSER.status === "success" &&
      SETUSERDETAIL.status === "success"
    ) {
      TOA.servicesUseToast("수정되었습니다.", "s");
    } else {
      TOA.servicesUseToast("작업에 실패했습니다.", "e");
    }
  }

  // 수정 & 추가 버튼 클릭 이벤트
  function fnSubmit(e) {
    if (!!daid) {
      fnSetSubmit();
    } else {
      fnAddSubmit();
    }
  }

  function fnPasswordSubmit() {
    if (!RC.serviesPasswdCheck(watch("_userid"), watch("_passwd"))) {
      return;
    }

    API.servicesPostData(APIURL.urlSetUser, {
      uid: UID_VAL.current, //수정필요
      passwd: watch("_passwd"),
    }).then((res) => {
      if (res.status === "success") {
        console.log("pw", res);
        TOA.servicesUseToast("비밀번호 변경이 완료되었습니다.", "s");
      }
    });
  }

  return (
    <>
      <div className="commonBox">
        <div className="formLayout">
          <ul className="tableTopWrap tableTopBorderWrap">
            <LayoutTopButton url="/agentem" text="목록으로 가기" />
            <LayoutTopButton text="완료" fn={handleSubmit(fnSubmit)} />
          </ul>
          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>기본 정보</h3>

              <div className="formContentWrap" style={{ width: "100%" }}>
                {/* /setCompany */}
                <label htmlFor="afflname" className="blockLabel">
                  <span>소속</span>
                </label>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <input
                    type="text"
                    id="afflname"
                    disabled
                    style={{
                      width: "83%",
                    }}
                    {...register("_afflname")}
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
                      setValue("_sepphonenum", "1577-7942");
                    }}
                  >
                    본사소속
                  </button>
                </div>
              </div>

              {/* setDetailUserInfo  ================================================================ */}

              {/* 소속 번호 */}
              <div className="formContentWrap">
                <label htmlFor="phonenum" className="blockLabel">
                  <span>소속 휴대폰</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="phonenum"
                    disabled
                    {...register("_phonenum")}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="sepphonenum" className="blockLabel">
                  <span>소속 별도전화</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="sepphonenum"
                    disabled
                    {...register("_sepphonenum")}
                  />
                </div>
              </div>
              {/* 소속 번호 끝*/}

              <div className="formContentWrap">
                <label htmlFor="name" className=" blockLabel">
                  <span>이름 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="name"
                    placeholder="이름을 입력해 주세요."
                    required
                    maxLength={8}
                    {...register("_name", {
                      maxLength: {
                        value: 8,
                        message: "8자 이하로 입력해주세요.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_name"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="registration" className=" blockLabel">
                  <span>주민번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="registration"
                    placeholder="주민등록 번호를 입력해주세요."
                    maxLength={14}
                    value={
                      (watch("_registration") &&
                        watch("_registration")
                          .replace(/[^0-9]/g, "")
                          .replace(/([0-9]{6})([0-9]{7}$)/, "$1-$2")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_registration", {})}
                  />
                </div>
              </div>
              <div className="formContentWrap">
                <label htmlFor="adphonenum" className="blockLabel">
                  <span>휴대폰 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="adphonenum"
                    placeholder="휴대폰 번호를 입력해 주세요."
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
                    {...register("_adphonenum", {})}
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
                    placeholder="전화번호를 입력해 주세요."
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
                    {...register("_adsepphonenum", {})}
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
                <label htmlFor="adfax" className=" blockLabel">
                  <span>팩스</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="adfax"
                    placeholder="팩스번호를 입력해 주세요."
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
                    {...register("_adfax")}
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
              <div className="formContentWrap">
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

                  {/* 추후 사용될 수도 있음 */}
                  {/* <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_situation") == "requestforapproval"}
                    value="requestforapproval"
                    id="requestforapproval"
                    {...register("_situation")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="requestforapproval">
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
                  <label className="listSearchRadioLabel" htmlFor="requesttostop">
                    중지 요청
                  </label> */}
                </div>
              </div>
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
                          {...register("_prodcostvalue", {})}
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
                          {...register("_usagefeevalue", {})}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
}
