import { useSelector, useDispatch } from "react-redux";

export default function Login() {
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
    <section className="loginWrap">
      <div className="commonBox loginBox">
        <h3>login</h3>
        <form className="formLayout " onSubmit={fnLogin}>
          <div className="formContentWrap">
            <label htmlFor="userid" className="blockLabel">
              ID
            </label>
            <input
              type="text"
              name="user_id"
              id="userid"
              placeholder="아이디를 입력해 주세요."
              onChange={onChange}
            />
          </div>
          <div className="formContentWrap">
            <label htmlFor="passwd" className="blockLabel">
              Password
            </label>
            <input
              type="password"
              name="pass_wd"
              id="passwd"
              placeholder="비밀번호를 입력해 주세요."
              onChange={onChange}
            />
          </div>
          <button type="submit" className="widthFullButton">
            Log In
          </button>
        </form>
      </div>
    </section>
  );
}
