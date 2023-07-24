// 로그인

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../service/api";
import * as STR from "../service/string";
import * as ST from "../service/storage";

export default function Login() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting },
  } = useForm();

  const fnSubmit = (e) => {
    API.servicesPostData(STR.urlLogin, {
      userid: getValues("_userid"),
      passwd: getValues("_passwd"),
    })
      .then((res) => {
        if (res.status === "fail") {
          alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
          return;
        }
        if (res.status === "success") {
          const accessToken = res.data.jtoken;
          const uid = res.data.uid;

          ST.servicesSetStorage(STR.TOKEN, accessToken);
          ST.servicesSetStorage(STR.UID, uid);

          window.location.href = "/";
          return;
        }
      })
      .catch((error) => console.log("reducer login error", error));
  };

  return (
    <section className="loginWrap">
      <div className="commonBox" style={{ border: "1px solid #dedede" }}>
        <h3>관리자 로그인</h3>
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
                {...register("_userid", {
                  required: "아이디는 필수로 입력해야 합니다.",
                  // minLength: {
                  //   value: 4,
                  //   message: "4자 이상으로 입력해주세요.",
                  // },
                  // maxLength: {
                  //   value: 16,
                  //   message: "16자 이상으로 입력해주세요.",
                  // },
                  // pattern: {
                  //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,16}$/g,
                  //   message: "영문, 숫자를 포함해 주세요.",
                  // },
                })}
              />
            </div>
            {/* <ErrorMessage
              errors={errors}
              name="_userid"
              render={({ message }) => (
                <span className="errorMessageWrap">{message}</span>
              )}
            /> */}
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
                {...register("_passwd", {
                  required: "비밀번호는 필수로 입력해야 합니다.",
                  // minLength: {
                  //   value: 6,
                  //   message: "6자 이상으로 입력해주세요.",
                  // },
                  // maxLength: {
                  //   value: 16,
                  //   message: "16자 이하로 입력해주세요.",
                  // },
                  // pattern: {
                  //   value:
                  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,16}$/g,
                  //   message: "영문, 숫자, 특수문자를 포함해 주세요.",
                  // },
                })}
              />
            </div>
            {/* <ErrorMessage
              errors={errors}
              name="_passwd"
              render={({ message }) => (
                <span className="errorMessageWrap">{message}</span>
              )}
            /> */}
          </div>

          <button
            type="submit"
            className="widthWideBtn"
            disabled={isSubmitting}
          >
            로그인
          </button>
        </form>
      </div>
    </section>
  );
}
