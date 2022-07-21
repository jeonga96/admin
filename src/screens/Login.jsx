// import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// import { loginEvent } from "../service/importData";
// import { loginUrl } from "../service/string";

function Login() {
  const user = useSelector((state) => state.userInfo);
  // const [login, setlogin] = useState({ userid: "", passwd: "" });
  const dispatch = useDispatch();

  function onChange(e) {
    dispatch({
      type: "userInfoInputChange",
      payload: { ...user, [e.target.id]: [e.target.value] },
    });
  }
  const fnLogin = (e) => {
    e.preventDefault();
    if (user.userid === "" || user.passwd === "") {
      return alert("아이디와 비밀번호를 모두 입력해 주세요.");
    }
    dispatch({
      type: "loginEvent",
    });
  };
  return (
    <div id="wrap">
      <section className="mainWrap loginWrap">
        <h3 className="blind">login</h3>
        <div className="loginBox commonBox">
          <h3>login</h3>
          <form className="loginForm" onSubmit={fnLogin}>
            <input
              type="text"
              name="user_id"
              id="userid"
              placeholder="아이디를 입력해 주세요."
              onChange={onChange}
            />
            <label htmlFor="userid" className="blind userIdLabel">
              아이디를 입력해 주세요.
            </label>
            <input
              type="password"
              name="pass_wd"
              id="passwd"
              placeholder="비밀번호를 입력해 주세요."
              onChange={onChange}
            />
            <label htmlFor="passwd" className="blind userPwLabel">
              비밀번호를 입력해 주세요.
            </label>
            <button type="submit" className="loginBtn">
              Log In
            </button>
          </form>
          <div className="LoginLinkWrap">
            <Link to="/join" className="joinLink link">
              <span>회원가입</span>
            </Link>
            <Link to="/forgetPw" className="forgerPwLink link">
              <span>비밀번호 찾기</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
