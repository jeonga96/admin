// 유통망관리 > 자사(총판)관리

// 지사 총판 수정 : setCompany(대표자명:_regOwner)
// STR.urlSetCompanyDetail(상태:_useFlag,휴대폰:_mobilenum, 법인번호:_corporationno, 이메일:_email, 별도번호:_telnum, 사업장명:_Cname, 대표자명:_regOwner,주민법인번호:_registration, ...주소)
// <<운영자 관리자 번호의 별도 전화>> - STR.urlSetCompanyDetail(별도전화:_extnum )
// 운영자(완리자)정보 : setUser(userrole, 아이디, 비밀번호),setUserDetail(이름:_name, 휴대폰:_mobile, 이메일:_mail )

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import PieceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp";

export default function SetAgentSd() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      _useFlag: "1",
    },
  });

  const multilAddress = useSelector(
    (state) => state.multilAddressData,
    shallowEqual
  );

  const [wz, setWz] = useState(false);

  // 수정 시에만 동작
  useLayoutEffect(() => {
    if (!!uid) {
      API.servicesPostData(STR.urlGetUser, {
        uid: uid,
      }).then((res) => {
        if (res.status === "success") {
          setValue("_userid", res.data.userid || "");
        }
      });

      API.servicesPostData(STR.urlGetUserDetail, {
        ruid: uid,
      })
        .then((res) => {
          if (res.status === "success") {
            dispatch({
              type: "serviceClick",
              payload: { ...res.data },
            });
            setValue("_name", res.data.name || "");
            setValue("_mobile", res.data.mobile || "");
            setValue("_mail", res.data.mail || "");

            API.servicesPostData(STR.urlGetUserCid, {
              uid: uid,
            }).then((res) => {
              API.servicesPostData(STR.urlGetCompanyDetail, {
                rcid: res.data.cid,
              }).then((res2) => {
                if (res2.status === "success") {
                  dispatch({
                    type: "serviceGetedData",
                    payload: { ...res2.data },
                  });
                  if (
                    !!res2.data.name &&
                    res2.data.name.includes("[본사직영]")
                  ) {
                    setWz(true);
                  }
                  setValue("_useFlag", res2.data.useFlag || "");
                  setValue("_regOwner", res2.data.regOwner || "");
                  setValue("_mobilenum", res2.data.mobilenum || "");
                  setValue("_corporationno", res2.data.corporationno || "");
                  setValue("_registration", res2.data.registration || "");
                  setValue("_email", res2.data.email || "");
                  setValue("_telnum", res2.data.telnum || "");
                  setValue("_Cname", res2.data.name || "");
                  setValue("_extnum", res2.data.extnum || "");
                  setValue("_remarks", res2.data.remarks || "");
                }
              });
            });
          }
        })
        .catch((res) => console.log("wrror", res));
    }
  }, []);

  // company 관련 코드 : 수정 & 추가 중복되는 동작 함수
  const fnsetCompany = (cid, uid) => {
    API.servicesPostData(STR.urlSetCompany, {
      cid: cid,
      ruid: uid,
      name: getValues("_regOwner"),
    });
    API.servicesPostData(STR.urlSetCompanyDetail, {
      rcid: cid,
      useFlag: getValues("_useFlag"),
      mobilenum: getValues("_mobilenum"),
      corporationno: getValues("_corporationno"),
      email: getValues("email"),
      telnum: getValues("_telnum"),
      name: getValues("_Cname"),
      regOwner: getValues("_regOwner"),
      registration: getValues("_registration"),
      extnum: getValues("_extnum"),
      remarks: getValues("_remarks"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
      oldaddress: multilAddress.oldaddress,
      zipcode: multilAddress.zipcode,
      longitude: multilAddress.longitude,
      latitude: multilAddress.latitude,
    })
      .then((res) => {
        if (res.status === "success") {
          UD.servicesUseToast("완료되었습니다!", "s");
          if (!uid) {
            setTimeout(() => {
              navigate("/agentsd");
              window.location.reload();
            }, 2000);
          }
          return;
        }
      })
      .catch((error) => console.log(error));
  };

  // 추가할 때 실행되는 함수
  async function fnAddSubmit() {
    await API.servicesPostData(STR.urlAdduser, {
      userid: watch("_userid"),
      passwd: watch("_passwd"),
    }).then((status) => {
      if (status.status === "success")
        API.servicesPostData(STR.urlUserlist, {
          offset: 0,
          size: 2,
          userid: watch("_userid"),
        }).then((res) => {
          if (status.status === "success") {
            const UID = res.data[0].uid;
            API.servicesPostData(STR.urlSetUser, {
              uid: UID,
              userrole: "ROLE_USER,ROLE_ADMIN_SD",
              useFlag: getValues("_useFlag"),
              userid: getValues("_userid"),
              passwd: getValues("_passwd"),
            });
            API.servicesPostData(STR.urlSetUserDetail, {
              ruid: UID,
              name: getValues("_name"),
              mobile: getValues("_mobile"),
              mail: getValues("_mail"),
            });
            API.servicesPostData(STR.urlAddcompany, {
              name: getValues("_name"),
            }).then((res2) => {
              fnsetCompany(res2.data.cid, UID);
            });
          }
        });
    });
  }

  // 수정 & 추가 버튼 클릭 이벤트
  function fnSubmit(e) {
    if (!!uid) {
      API.servicesPostData(STR.urlSetUser, {
        uid: uid,
        userid: getValues("_userid"),
        passwd: getValues("_passwd"),
        useFlag: getValues("_useFlag"),
      });
      API.servicesPostData(STR.urlSetUserDetail, {
        ruid: uid,
        name: getValues("_name"),
        nick: getValues("_nick"),
        mobile: getValues("_mobile"),
        mail: getValues("_mail"),
      });

      API.servicesPostData(STR.urlGetUserCid, {
        uid: uid,
      })
        .then((res) => {
          fnsetCompany(res.data.cid, uid);
        })
        .catch(() =>
          API.servicesPostData(STR.urlAddcompany, {
            name: getValues("_name"),
          }).then((res2) => {
            fnsetCompany(res2.data.cid, uid);
          })
        );
    } else {
      fnAddSubmit();
    }
  }

  function fnSameBtn(e) {
    e.preventDefault();
    setValue("_name", getValues("_regOwner"));
    setValue("_mobile", getValues("_mobilenum"));
    setValue("_extnum", getValues("_telnum"));
    setValue("_mail", getValues("_email"));
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            <LayoutTopButton url="/agentsd" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>사업장 정보</h3>
              <div
                className="formContentWrap"
                style={{
                  width: "100%",
                }}
              >
                {/* /setCompany */}
                <label htmlFor="Cname" className="blockLabel">
                  <span>사업장명</span>
                </label>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <input
                    type="text"
                    id="Cname"
                    {...register("_Cname")}
                    style={{ width: "84.5%" }}
                  />

                  <button
                    style={{ width: "15%" }}
                    className={
                      wz ? "formContentBtn btnClick" : "formContentBtn"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setWz(!wz);
                      wz
                        ? setValue(
                            "_Cname",
                            getValues("_Cname").replace("[본사직영] ", "")
                          )
                        : setValue(
                            "_Cname",
                            `[본사직영] ${getValues("_Cname")}`
                          );
                    }}
                  >
                    본사 직영 총판
                  </button>
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <div className="blockLabel">
                  <span>회원 활성화</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_useFlag") == "1"}
                    value="1"
                    id="useFlag1"
                    {...register("_useFlag")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="useFlag1">
                    승인
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_useFlag") == "0"}
                    value="0"
                    id="useFlag0"
                    {...register("_useFlag")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="useFlag0">
                    중지
                  </label>
                </div>
              </div>

              {/* setDetailUserInfo  ================================================================ */}
              <div className="formContentWrap">
                <label htmlFor="regOwner" className=" blockLabel">
                  <span>대표자명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="regOwner"
                    placeholder="대표자명을 입력해 주세요."
                    maxLength={8}
                    {...register("_regOwner", {
                      required: "입력되지 않았습니다.",
                      maxLength: {
                        value: 8,
                        message: "8자 이하의 글자만 사용가능합니다.",
                      },
                    })}
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
                    placeholder="사업자 등록 번호를 입력해 주세요. (예시 000-00-00000)"
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
                <label htmlFor="mobile" className="blockLabel">
                  <span>휴대폰</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="mobilenum"
                    placeholder="휴대폰 번호를 입력해 주세요."
                    maxLength={13}
                    value={
                      (watch("_mobilenum") &&
                        watch("_mobilenum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_mobilenum", {
                      required: "입력되지 않았습니다.",
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

              <div className="formContentWrap">
                {/* /setComapny */}
                <label htmlFor="telnum" className="blockLabel">
                  <span>별도전화</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="telnum"
                    placeholder="전화번호를 입력해 주세요."
                    maxLength={13}
                    value={
                      (watch("_telnum") &&
                        watch("_telnum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{4}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_telnum", {
                      pattern: {
                        value: /^[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}/,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_telnum"
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

              {/* 주소 */}
              <PieceRegisterSearchPopUp />

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

            <fieldset id="CompanyDetail_2">
              <h3>
                운영자 ( 관리자 ) 정보
                <button onClick={fnSameBtn}>사업장 정보와 동일</button>
              </h3>

              {/* setDetailUserInfo  ================================================================ */}
              <div className="formContentWrap">
                <label htmlFor="name" className=" blockLabel">
                  <span>이름</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="name"
                    placeholder="이름을 입력해 주세요."
                    maxLength={8}
                    {...register("_name", {
                      required: "입력되지 않았습니다.",
                      maxLength: {
                        value: 8,
                        message: "8자 이하의 글자만 사용가능합니다.",
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
                <label htmlFor="mobile" className="blockLabel">
                  <span>휴대폰</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="mobile"
                    placeholder="휴대폰 번호를 입력해 주세요."
                    maxLength={13}
                    value={
                      (watch("_mobile") &&
                        watch("_mobile")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_mobile", {
                      required: "입력되지 않았습니다.",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_mobile"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                {/* /setComapny */}
                <label htmlFor="extnum" className="blockLabel">
                  <span>별도전화</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="extnum"
                    placeholder="별도번호를 입력해 주세요."
                    maxLength={13}
                    value={
                      (watch("_extnum") &&
                        watch("_extnum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_extnum", {
                      pattern: {
                        value: /^[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}/,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_extnum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="mail" className=" blockLabel">
                  <span>이메일</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="mail"
                    placeholder="이메일을 입력해 주세요."
                    value={
                      (watch("_mail") &&
                        watch("_mail").replace(/[^\\!-z]/gi, "")) ||
                      ""
                    }
                    {...register("_mail", {
                      pattern: {
                        value:
                          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                        message: "형식에 맞지 않습니다.",
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
                </div>
              </div>

              {/* setUser (회원활성화, 회원권한, 비밀번호관리) ================================================================ */}
              {/* <DetailUserComponent
                setUserData={setUserData}
                userData={userData}
                checkBtn={checkBtn}
              /> */}

              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>아이디</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <input type="text" id="userid" {...register("_userid")} />
                </div>
              </div>

              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>비밀번호 관리</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <input
                    type="text"
                    id="passwd"
                    style={
                      !!uid
                        ? {
                            width: "86%",
                          }
                        : { width: "100%" }
                    }
                    {...register("_passwd")}
                  />
                  {!!uid && (
                    <button
                      type="button"
                      onClick={() => {
                        API.servicesPostData(STR.urlSetUser, {
                          uid: uid,
                          passwd: watch("_passwd"),
                        }).then((res) => {
                          if (res.status === "success") {
                            UD.servicesUseToast(
                              "비밀번호 변경이 완료되었습니다.",
                              "s"
                            );
                          }
                        });
                      }}
                      className="formContentBtn"
                    >
                      변경
                    </button>
                  )}
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
