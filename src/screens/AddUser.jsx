import { useSelector, useDispatch } from "react-redux";

function AddUser() {
  const user = useSelector((state) => state.userInfoAdd);
  const dispatch = useDispatch();

  function onChange(e) {
    dispatch({
      type: "userInfoAddInputChange",
      payload: { ...user, [e.target.id]: [e.target.value] },
    });
  }

  const fnAddUser = (e) => {
    e.preventDefault();
    if (
      user.userid[0] === "" ||
      user.passwd[0] === "" ||
      user.passwdCk[0] === ""
    ) {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    if (user.passwd[0] !== user.passwdCk[0]) {
      alert("비밀번호가 다릅니다. 비밀번호를 다시 입력해 주세요.");
      return;
    }
    dispatch({
      type: "addUserEvent",
    });
  };
  return (
    <section className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <h3>관리자 추가</h3>
        <form className="formLayout" onSubmit={fnAddUser}>
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
          <input
            type="password"
            name="pass_wdCk"
            id="passwdCk"
            placeholder="비밀번호를 한 번 더 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="passwdCk" className="blind userPwLabel">
            비밀번호를 한 번 더 입력해 주세요.
          </label>
          <button type="submit" className="loginBtn">
            사용자 추가하기
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddUser;
