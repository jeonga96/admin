import { useState } from "react";
import { urlSetUserDetail, ISLOGIN } from "../Services/string";
import { axiosPostToken, getStorage } from "../Services/importData";

function UserDeteil() {
  const [userData, setUserData] = useState("");
  function onChange(e) {
    setUserData({ [e.target.id]: [e.target.value] });
  }
  function setUserEvent() {
    const token = getStorage(ISLOGIN);
    axiosPostToken(
      urlSetUserDetail,
      {
        name: userData.name[0],
      },
      token
    )
      .then((res) => {
        console.log("axios는 성공했는데 말이죠", res);
        if (res.status === "fail") {
          alert("잘못된 값을 입력했습니다.");
          return;
        }
        if (res.status === "success") {
          alert("수정이 완료되었습니다.");
          window.location.href = "/userdetail";
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  }

  const setUserSubmit = (e) => {
    e.preventDefault();
    if (userData.name[0] === "") {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setUserEvent();
  };
  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <form className="loginForm formLayout " onSubmit={setUserSubmit}>
          <input type="text" id="name" placeholder="name" onChange={onChange} />
          <label htmlFor="name" className="blind userIdLabel">
            수정할 이름을 입력해 주세요.
          </label>
          <button type="submit" className="loginBtn">
            수정 정보 등록하기
          </button>
        </form>
      </div>
    </div>
  );
}
export default UserDeteil;
