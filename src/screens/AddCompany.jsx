import { useSelector, useDispatch } from "react-redux";

function AddCompany() {
  // const user = useSelector((state) => state.userInfo);
  // const dispatch = useDispatch();

  // function onChange(e) {
  //   dispatch({
  //     type: "userInfoInputChange",
  //     payload: { ...user, [e.target.id]: [e.target.value] },
  //   });
  // }
  // const fnLogin = (e) => {
  //   e.preventDefault();
  //   if (user.userid === "" || user.passwd === "") {
  //     return alert("아이디와 비밀번호를 모두 입력해 주세요.");
  //   }
  //   dispatch({
  //     type: "addUserEvent",
  //   });
  // };
  return (
    <section className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <h3>사업자 추가</h3>
        {/* <form className="formLayout" onSubmit={fnLogin}>
          <input
            type="text"
            name="user_id"
            id="name"
            placeholder="아이디를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="name" className="blind userIdLabel">
            아이디를 입력해 주세요.
          </label>
          <button type="submit" className="loginBtn">
            사용자 추가하기
          </button>
        </form> */}
      </div>
    </section>
  );
}

export default AddCompany;
