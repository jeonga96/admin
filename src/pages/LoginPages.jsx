import { Link } from "react-router-dom";

function LoginPages() {
  return (
    <section className="mainWrap loginWrap">
      <h3 className="blind">login</h3>
      <div className="loginBox commonBox">
        <div className="loginImg">
          <span className="blind">로그인 설명 및 광고 이미지</span>
        </div>
        <div className="loginServies">
          <h3>login</h3>
          <form className="loginForm">
            <input
              type="text"
              name="user__Id"
              id="userId"
              placeholder="아이디를 입력해 주세요."
            />
            <label htmlFor="userId" className="blind userIdLabel">
              아이디를 입력해 주세요.
            </label>
            <input
              type="password"
              name="user__Pw"
              id="userPw"
              placeholder="비밀번호를 입력해 주세요."
            />
            <label htmlFor="userPw" className="blind userPwLabel">
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
      </div>
    </section>
  );
}
export default LoginPages;
