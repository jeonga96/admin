import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Login() {
  const user = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  function onChange(e) {
    dispatch({
      type: "userInfoInputChange",
      payload: { ...user, [e.target.id]: [e.target.value] },
    });
  }
  const fnLogin = (e) => {
    e.preventDefault();
    if (user.userid[0] === "" || user.passwd[0] === "") {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    dispatch({
      type: "loginEvent",
    });
  };

  // useState로 작성한 코드
  // const [login, setlogin] = useState({ userid: "", passwd: "" });
  // function onChange(e) {
  //   setlogin({ ...login, [e.target.id]: [e.target.value] });
  // }
  // const fnLogin = (e) => {
  //   e.preventDefault();
  //   if (login.userid[0] === "" || login.passwd[0] === "") {
  //     return console.log("빈칸으로 두면 안 됩니당");
  //   }
  //   loginEvent(loginUrl, login);
  // };

  return (
    <section className="mainWrap loginWrap">
      <div className="commonBox loginBox">
        <h3>login</h3>
        <form className="loginForm formLayout " onSubmit={fnLogin}>
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
          {/* <Link to="/adduser" className="joinLink link">
            <span>회원가입</span>
          </Link> */}
          <Link to="/forgetPw" className="forgerPwLink link">
            <span>비밀번호 찾기</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Login;
