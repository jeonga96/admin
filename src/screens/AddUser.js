import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";

import { servicesPostData } from "../Services/importData";
import { urlAdduser } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";

export default function AddUser() {
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userid: "",
    passwd: "",
    passwdCk: "",
  });

  // input 입력값 저장 이벤트
  function onChange(e) {
    setUserData({ ...userData, [e.target.id]: [e.target.value] });
  }

  // 회원 추가 이벤트
  const AddUserSubmit = (e) => {
    servicesPostData(urlAdduser, {
      userid: userData.userid[0],
      passwd: userData.passwd[0],
    })
      .then((res) => {
        if (
          res.status === "fail" &&
          res.emsg === "Database update failure. check duplicate userid"
        ) {
          alert("이미 가입된 아이디입니다. 다른 아이디를 입력해 주세요,");
          return;
        }
        if (res.status === "fail") {
          alert("잘못된 값을 입력했습니다.");
          return;
        }
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          navigate(`/user`, {
            replace: true,
          });
          return;
        }
      })
      .catch((error) => console.log("실패", error));
  };
  return (
    <>
      <div className="commonBox">
        <form className="formLayout " onSubmit={handleSubmit(AddUserSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="userid" className="blockLabel">
              아이디
            </label>
            <input
              type="text"
              name="user_id"
              id="userid"
              placeholder="아이디를 입력해 주세요."
              {...register("user_id", {
                onChange: onChange,
                required: "아이디는 필수로 입력해야 합니다.",
                minLength: {
                  value: 2,
                  message: "2자 이상의 아이디만 사용가능합니다.",
                },
                maxLength: {
                  value: 16,
                  message: "16자 이하의 아이디만 사용가능합니다.",
                },
                pattern: {
                  value: /[A-Za-z]/,
                  message: "입력 형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="user_id"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="passwd" className="blockLabel">
              비밀번호
            </label>
            <input
              type="password"
              name="pass_wd"
              id="passwd"
              placeholder="비밀번호를 입력해 주세요."
              {...register("pass_wd", {
                onChange: onChange,
                required: "비밀번호는 필수로 입력해야 합니다.",
                maxLength: {
                  value: 16,
                  message: "16자 이하의 비밀번호만 사용가능합니다.",
                },
                minLength: {
                  value: 2,
                  message: "2자 이상의 비밀번호만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="pass_wd"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="passwdCk" className="blockLabel">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="pass_wdCk"
              id="passwdCk"
              placeholder="비밀번호를 한 번 더 입력해 주세요."
              {...register("pass_wdCk", {
                onChange: onChange,
                required: "비밀번호 확인을 진행해 주세요.",
                validate: {
                  matchesPassword: (value) => {
                    const { pass_wd } = getValues();
                    return pass_wd === value || "비밀번호가 일치하지 않습니다.";
                  },
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="pass_wdCk"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />
        </form>
      </div>
    </>
  );
}
