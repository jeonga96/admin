import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Login() {
  const login = useSelector((state) => state.login);
  const dispatch = useDispatch();

  function onChange(e) {
    dispatch({
      type: "userInfoInputChange",
      payload: { ...login, [e.target.id]: [e.target.value] },
    });
  }
  const fnLogin = (e) => {
    e.preventDefault();
    if (login.userid[0] === "" || login.passwd[0] === "") {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    dispatch({
      type: "loginEvent",
    });
  };

  return (
    <section className="mainWrap loginWrap">
      <div className="commonBox loginBox">
        <h3>login</h3>
        <form className="inputFormLayout" onSubmit={fnLogin}>
          <input
            type="text"
            name="user_id"
            id="userid"
            placeholder="아이디를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="userid" className="blind">
            아이디를 입력해 주세요.
          </label>
          <input
            type="password"
            name="pass_wd"
            id="passwd"
            placeholder="비밀번호를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="passwd" className="blind">
            비밀번호를 입력해 주세요.
          </label>
          <button type="submit" className="loginBtn">
            Log In
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
