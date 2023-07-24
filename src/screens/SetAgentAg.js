// 유통망관리 > 자사(총판)관리
// 지사 총판 수정 : setCompany(대표자명:_regOwner)
// urlSetCompanyDetail(상태:_useFlag,휴대폰:_mobilenum, 법인번호:_corporationno, 이메일:_email, 별도번호:_telnum, 소속:_Cname, 사업장명:_regName, 대표자명:_regOwner,주민법인번호:_registration, ...주소)
// <<운영자 관리자 번호의 별도 전화>> - urlSetCompanyDetail(별도전화:_extnum )
// 운영자(완리자)정보 : setUser(userrole, 아이디, 비밀번호),setUserDetail(이름:_name, 휴대폰:_mobile, 이메일:_mail )

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../services/api";
import * as UD from "../services/useData";
import * as STR from "../services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import PieceRegisterSearchPopUp from "../components/event/ServiceRegisterSearchPopUp";
import ComponentModal from "../components/piece/PieceModalAgentem";

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

  const clickModal = useSelector((state) => state.click, shallowEqual);
  const multilAddress = useSelector(
    (state) => state.multilAddressData,
    shallowEqual
  );

  // ComponentModalAgentem에서 동작하는 함수
  const fnSelectAgent = (item) => {
    const Cname = item.additionalData.name;
    setValue("_Cname", Cname);
    dispatch({
      type: "clickEvent",
      payload: false,
    });
  };

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
                  setValue("_regName", res2.data.regName || "");
                  setValue("_useFlag", res2.data.useFlag || "");
                  setValue("_regOwner", res2.data.regOwner || "");
                  setValue("_mobilenum", res2.data.mobilenum || "");
                  setValue("_corporationno", res2.data.corporationno || "");
                  setValue("_registration", res2.data.registration || "");
                  setValue("_email", res2.data.email || "");
                  setValue("_telnum", res2.data.telnum || "");
                  setValue("_Cname", res2.data.name || "");
                  setValue("_extnum", res2.data.extnum || "");
                }
              });
            });
          }
        })
        .catch((res) => console.log("wrror", res));
    }
  }, []);

  console.log(watch("_registration"));
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
      email: getValues("_email"),
      telnum: getValues("_telnum"),
      name: getValues("_Cname"),
      regName: getValues("_regName"),
      regOwner: getValues("_regOwner"),
      registration: getValues("_registration"),
      extnum: getValues("_extnum"),
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
            const UAPI = res.data[0].uid;
            API.servicesPostData(STR.urlSetUser, {
              uid: UAPI,
              userrole: "ROLE_USER,ROLE_ADMIN_AG",
              useFlag: "1",
              userid: getValues("_userid"),
              passwd: getValues("_passwd"),
            });
            API.servicesPostData(STR.urlSetUserDetail, {
              ruid: UAPI,
              name: getValues("_name"),
              mobile: getValues("_mobile"),
              mail: getValues("_mail"),
            });
            API.servicesPostData(STR.urlAddcompany, {
              name: getValues("_name"),
            }).then((res2) => {
              fnsetCompany(res2.data.cid, UAPI);
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
            <LayoutTopButton url="/agentag" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
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
                    id="Cname"
                    disabled
                    {...register("_Cname")}
                    style={{ width: "75%" }}
                  />

                  <button
                    type="button"
                    className="formContentBtn"
                    onClick={() =>
                      dispatch({
                        type: "clickEvent",
                        payload: !clickModal,
                      })
                    }
                  >
                    유통망 조회
                  </button>

                  <ComponentModal fn={fnSelectAgent} />

                  <button
                    className="formContentBtn"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("_Cname", "[ 본사 ] 와짱 ( 주 )");
                    }}
                  >
                    본사소속
                  </button>

                  <button
                    className="formContentBtn"
                    onClick={(e) => {
                      e.preventDefault();
                      setValue("_Cname", "-");
                    }}
                  >
                    단독 대리점
                  </button>
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <div className="blockLabel">
                  <span>상태</span>
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
                <label htmlFor="regOwner" className=" blockLabel">
                  <span>사업장명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="regName"
                    placeholder="사업장명을 입력해 주세요."
                    {...register("_regName", {
                      required: "입력되지 않았습니다.",
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
                <label htmlFor="ex" className="blockLabel">
                  <span>비고</span>
                </label>
                <div>
                  <textarea
                    type="text"
                    id="ex"
                    placeholder="기능 적용 X"
                    maxLength="100"
                    {...register("_ex")}
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
