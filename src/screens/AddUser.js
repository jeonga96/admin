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

  // 회원 추가 이벤트
  const AddUserSubmit = (e) => {
    servicesPostData(urlAdduser, {
      userid: getValues("_userid"),
      passwd: getValues("_passwd"),
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
              <span>아이디</span>
            </label>
            <div>
              <input
                type="text"
                id="userid"
                placeholder="아이디를 입력해 주세요."
                {...register("_userid", {
                  required: "아이디는 필수로 입력해야 합니다.",
                  minLength: {
                    value: 4,
                    message: "4자 이상으로 입력해주세요.",
                  },
                  maxLength: {
                    value: 16,
                    message: "16자 이하로 입력해주세요.",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,16}$/g,
                    message: "영문, 숫자를 포함해 주세요.",
                  },
                })}
              />

              <ErrorMessage
                errors={errors}
                name="_userid"
                render={({ message }) => (
                  <span className="errorMessageWrap">{message}</span>
                )}
              />
            </div>
          </div>

          <div className="formContentWrap">
            <label htmlFor="passwd" className="blockLabel">
              <span>비밀번호</span>
            </label>
            <div>
              <input
                type="password"
                id="passwd"
                placeholder="비밀번호를 입력해 주세요."
                {...register("_passwd", {
                  required: "비밀번호는 필수로 입력해야 합니다.",
                  minLength: {
                    value: 6,
                    message: "6자 이상으로 입력해주세요.",
                  },
                  maxLength: {
                    value: 16,
                    message: "16자 이하로 입력해주세요.",
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,16}$/g,
                    message: "영문, 숫자, 특수문자를 포함해 주세요.",
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
              <ErrorMessage
                errors={errors}
                name="_passwd"
                render={({ message }) => (
                  <span className="errorMessageWrap">{message}</span>
                )}
              />
            </div>
          </div>

          <div className="formContentWrap">
            <label htmlFor="passwdCk" className="blockLabel">
              <span>비밀번호 확인</span>
            </label>
            <div>
              <input
                type="password"
                id="passwdck"
                placeholder="비밀번호를 한 번 더 입력해 주세요."
                {...register("_passwdck", {
                  required: "비밀번호 확인을 진행해 주세요.",
                  validate: {
                    matchesPassword: (value) => {
                      const { _passwd } = getValues();
                      return (
                        _passwd === value || "비밀번호가 일치하지 않습니다."
                      );
                    },
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name="_passwdck"
                render={({ message }) => (
                  <span className="errorMessageWrap">{message}</span>
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
