import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { servicesUseToast } from "../Services/useData";
import {
  urlSetUserDetail,
  urlGetUserDetail,
  urlSetUser,
  urlAddcompany,
  urlSetCompanyDetail,
  urlGetCompanyDetail,
  urlGetUserCid,
  urlUserlist,
  urlSetCompany,
} from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import DetailUserComponent from "../components/common/ComponentSetUser";
import ComponentModal from "../components/common/ComponentModalAgentem";

export default function SetAgentEm() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {},
  });

  const [userData, setUserData] = useState({});
  const [checkBtn, setCheckBtn] = useState(false);
  const clickModal = useSelector((state) => state.click, shallowEqual);

  // 수정 시에만 동작
  useLayoutEffect(() => {
    if (!!uid) {
      servicesPostData(urlGetUserDetail, {
        ruid: uid,
      })
        .then((res) => {
          if (res.status === "success") {
            dispatch({
              type: "getedData",
              payload: { ...res.data },
            });
            setValue("_name", res.data.name || "");
            setValue("_mobile", res.data.mobile || "");
            setValue("_mail", res.data.mail || "");
            servicesPostData(urlGetUserCid, {
              uid: uid,
            }).then((res) => {
              servicesPostData(urlGetCompanyDetail, {
                rcid: res.data.cid,
              }).then((res2) => {
                if (res2.status === "success") {
                  setValue("_telnum", res2.data.telnum || "");
                  setValue("_Cname", res2.data.regName || "");
                }
              });
            });
          }
        })
        .catch((res) => console.log("wrror", res));
    }
  }, []);

  // userData에 값 입력이 추가될 때 실행되도록 설정 & userid를 통해 확인
  useEffect(() => {
    if (!uid && !!userData.userid && userData.userid !== "") {
      fnAddSubmit();
    }
  }, [userData.userid]);

  const fnSelectAgent = (e) => {
    e.preventDefault();
    // dispatch({
    //   type: "clickEvent",
    //   payload: !clickModal,
    // });

    console.log(e);
    // setValue("_Cname", "[ 본사 ] 와짱 ( 주 )");
  };

  // urlSetCompany + urlSetCompanyDetail 수정하는 함수
  const fnsetCompany = (cid, uid) => {
    servicesPostData(urlSetCompany, {
      cid: cid,
      ruid: uid,
      name: getValues("_name"),
    });
    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      telnum: getValues("_telnum"),
      regName: getValues("_Cname"),
    })
      .then((res) => {
        if (res.status === "success") {
          return servicesUseToast("완료되었습니다!", "s");
        }
      })
      .catch((error) => console.log(error));
  };

  // 추가할 때 실행되는 함수
  async function fnAddSubmit() {
    await servicesPostData(urlUserlist, {
      offset: 0,
      size: 2,
      userid: userData.userid,
    }).then((res) => {
      if (res.status === "fail") {
        fnAddSubmit();
      } else {
        servicesPostData(urlSetUser, {
          uid: res.data[0].uid,
          ...userData,
        });
        servicesPostData(urlSetUserDetail, {
          ruid: res.data[0].uid,
          name: getValues("_name"),
          mobile: getValues("_mobile"),
          mail: getValues("_mail"),
        });

        servicesPostData(urlAddcompany, {
          name: getValues("_name"),
        }).then((res2) => {
          fnsetCompany(res2.data.cid, res.data[0].uid);
        });
      }
    });
  }

  // 수정 & 추가 버튼 클릭 이벤트
  function fnSubmit(e) {
    setCheckBtn(!checkBtn);
    if (!!uid) {
      servicesPostData(urlSetUser, {
        uid: uid,
        ...userData,
      });
      servicesPostData(urlSetUserDetail, {
        ruid: uid,
        name: getValues("_name"),
        mobile: getValues("_mobile"),
        mail: getValues("_mail"),
      });

      servicesPostData(urlGetUserCid, {
        uid: uid,
      })
        .then((res) => {
          fnsetCompany(res.data.cid, uid);
        })
        .catch(() =>
          servicesPostData(urlAddcompany, {
            name: getValues("_name"),
          }).then((res2) => {
            fnsetCompany(res2.data.cid, uid);
          })
        );
    }
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            <LayoutTopButton url="/agentem" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>기본 정보</h3>

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
                    style={{
                      width: "88%",
                    }}
                    {...register("_Cname")}
                  />

                  <button
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
                </div>
              </div>

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
                <label htmlFor="telnum" className="blockLabel">
                  <span>별도전화</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="telnum"
                    placeholder="별도번호를 입력해 주세요."
                    maxLength="13"
                    value={
                      (watch("_telnum") &&
                        watch("_telnum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
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
              <DetailUserComponent
                setUserData={setUserData}
                userData={userData}
                checkBtn={checkBtn}
              />

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
          </div>
        </form>
      </div>
    </>
  );
}
