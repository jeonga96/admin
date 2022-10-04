import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export default function Login() {
  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();
  const dispatch = useDispatch();

  const fnLogin = (e) => {
    // reducer - initialState로 값 전달
    dispatch({
      type: "userInfoInputChange",
      payload: { userid: watch("user_id"), passwd: watch("pass_wd") },
    });
    dispatch({
      type: "loginEvent",
    });
  };

  return (
    <section className="loginWrap">
      <div className="commonBox loginBox">
        <h3>login</h3>
        <form className="formLayout " onSubmit={handleSubmit(fnLogin)}>
          <div className="formContentWrap">
            <label htmlFor="userid" className="blockLabel">
              ID
            </label>
            <input
              type="text"
              name="user_id"
              id="userid"
              placeholder="아이디를 입력해 주세요."
              {...register("user_id", {
                required: "아이디는 필수로 입력해야 합니다.",
                minLength: {
                  value: 2,
                  message: "아이디는 2글자 이상 입력해 주세요.",
                },
                maxLength: {
                  value: 16,
                  message: "16자 이하의 아이디만 사용 가능합니다.",
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
              Password
            </label>
            <input
              type="password"
              name="pass_wd"
              id="passwd"
              placeholder="비밀번호를 입력해 주세요."
              {...register("pass_wd", {
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

          <button
            type="submit"
            className="widthFullButton"
            disabled={isSubmitting}
            style={{ marginTop: "20px" }}
          >
            Log In
          </button>
        </form>
      </div>
    </section>
  );
}
