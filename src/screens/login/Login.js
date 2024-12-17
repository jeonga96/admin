// 로그인

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";

import * as APIURL from "../../service/string/apiUrl";
import * as STR from "../../service/string/stringtoconst";
import * as TOA from "../../service/library/toast";
import * as ST from "../../service/useData/storage";
import CHECKBRANCH from "../../checkbranch";

export default function Login() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  const fnSubmit = (e) => {
    axios
      .post(
        APIURL.urlLogin,
        {
          userid: getValues("_userid"),
          passwd: getValues("_passwd"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("로그인??");
        const RES = res.data;
        if (RES.status === "fail") {
          console.log("fail");
          TOA.servicesUseToast(
            "회원이 아닙니다. 회원가입을 먼저 진행해 주세요.",
            "e"
          );
          return;
        }
        if (RES.status === "success") {
          console.log("success");
          const accessToken = RES.data.jtoken;
          const uid = RES.data.uid;
          const userid = RES.data.userid;
          ST.servicesSetStorage(STR.TOKEN, accessToken);
          ST.servicesSetStorage(STR.UID, uid);
          ST.servicesSetStorage(STR.USERID, userid);

          // 현재 로그인한 계정의 정보를 확인할 수 있도록 설정
          axios
            .post(
              APIURL.urlGetUserDetail,
              { ruid: uid },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            .then((res2) => {
              console.log(res2);
              if (res2.data.status !== "fail") {
                ST.servicesSetStorage(STR.WRITER, res2.data.data.name);
                window.location.href = "/company";
              } else {
                window.location.href = "/company";
              }
            });
        }
      })

      .catch((error) => console.log("reducer login error", error));
  };

  return (
    <section className="loginWrap">
      <div className="commonBox" style={{ border: "1px solid #dedede" }}>
        <h3>
          {CHECKBRANCH() === "RELEASE"
            ? "관리자 로그인"
            : CHECKBRANCH() === "STAGE"
            ? "[ 테스트용 ] 관리자 로그인"
            : "[ 개발용 ] 관리자 로그인"}
        </h3>
        <form onSubmit={handleSubmit(fnSubmit)}>
          <div className="formContentWrap">
            <label htmlFor="userid" className="blockLabel">
              <span>아이디</span>
            </label>
            <div style={{ border: "1px solid #dedede" }}>
              <input
                type="text"
                name="_userid"
                id="userid"
                maxLength={16}
                {...register("_userid", {
                  required: "입력되지 않았습니다.",
                  minLength: {
                    value: 4,
                    message: "4자 이상으로 입력해주세요.",
                  },
                  maxLength: {
                    value: 16,
                    message: "16자 이상으로 입력해주세요.",
                  },
                  pattern: {
                    value: /^([a-zA-Z0-9]){4,16}$/g,
                    // value: /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/g,
                    message: "영문, 숫자를 포함해 주세요.",
                  },
                })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="_userid"
              render={({ message }) => (
                <span className="errorMessageWrap">{message}</span>
              )}
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="passwd" className="blockLabel">
              <span>비밀번호</span>
            </label>
            <div style={{ border: "1px solid #dedede" }}>
              <input
                type="password"
                name="_passwd"
                id="passwd"
                maxLength={16}
                {...register("_passwd", {
                  required: "입력되지 않았습니다.",
                  minLength: {
                    value: 6,
                    message: "6자 이상으로 입력해주세요.",
                  },
                  maxLength: {
                    value: 16,
                    message: "16자 이하로 입력해주세요.",
                  },
                  pattern: {
                    // value: /^([a-zA-Z0-9]){4,16}$/g,
                    value: /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/g,
                    message: "영문, 숫자를 한 개 이상 입력해 주세요.",
                  },
                  validate: {
                    matchesPassword: (value) => {
                      const { _userid } = getValues();
                      return (
                        _userid !== value ||
                        "아이디와 동일한 비밀번호는 사용할 수 없습니다."
                      );
                    },
                  },
                })}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="_passwd"
              render={({ message }) => (
                <span className="errorMessageWrap">{message}</span>
              )}
            />
          </div>

          <button
            type="submit"
            className="widthWideBtn"
            isSubmitting={isSubmitting}
          >
            로그인
          </button>
        </form>
      </div>
    </section>
  );
}
