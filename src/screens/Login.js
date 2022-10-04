import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

export default function Login() {
  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();
  const login = useSelector((state) => state.login);
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

  console.log("📍", errors);
  console.log("📍👀", watch("user_id"), watch("pass_wd"));
  // console.log("📍👀", watchLoginValue[0], watchLoginValue[1]);

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
                required: "아이디는 필수 입력입니다.",
                minLength: {
                  value: 2,
                  message: "아이디는 2글자 이상 입력해 주세요.",
                },
                maxLength: {
                  value: 15,
                  message: "아이디는 15글자를 초과할 수 없습니다.",
                },
                pattern: {
                  value: /[A-Za-z]/,
                  message: "입력 형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          {errors.userid?.type === "required" && (
            <div className="errorMessageWrap">
              <span>{errors.userid.message}</span>
            </div>
          )}
          {errors.userid?.type === "minLength" && (
            <div className="errorMessageWrap">
              <span>{errors.userid.message}</span>
            </div>
          )}
          {errors.userid?.type === "maxLength" && (
            <div className="errorMessageWrap">
              <span>{errors.userid.message}</span>
            </div>
          )}
          {errors.userid?.type === "pattern" && (
            <div className="errorMessageWrap">
              <span>{errors.userid.message}</span>
            </div>
          )}

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
                  value: 25,
                  message: "비밀번호는 25글자를 초과할 수 없습니다.",
                },
                minLength: {
                  value: 2,
                  message: "비밀번호는 2글자 이상 입력해 주세요.",
                },
              })}
            />
          </div>

          {errors.passwd?.type === "required" && (
            <div className="errorMessageWrap">
              <span>{errors.passwd.message}</span>
            </div>
          )}
          {errors.passwd?.type === "maxLength" && (
            <div className="errorMessageWrap">
              <span>{errors.passwd.message}</span>
            </div>
          )}
          {errors.passwd?.type === "minLength" && (
            <div className="errorMessageWrap">
              <span>{errors.passwd.message}</span>
            </div>
          )}

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
