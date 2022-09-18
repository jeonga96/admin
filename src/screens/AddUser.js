import { useState } from "react";
import { servicesPostData } from "../Services/importData";
import { useNavigate } from "react-router-dom";
import { urlAdduser } from "../Services/string";

export default function AddUser() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userid: "",
    passwd: "",
    passwdCk: "",
  });

  function onChange(e) {
    setUserData({ ...userData, [e.target.id]: [e.target.value] });
  }

  function addUserEvent() {
    servicesPostData(urlAdduser, {
      userid: userData.userid[0],
      passwd: userData.passwd[0],
    })
      .then((res) => {
        console.log("axios는 성공했는데 말이죠", res);
        if (
          res.status === "fail" &&
          res.emsg === "Database update failure. check duplicate userid"
        ) {
          alert("이미 가입된 아이디입니다. 다른 아이디를 입력해 주세요,");
          return;
        }
        if (res.status === "fail") {
          alert("잘못된 값을 입력했습니다.");
          return;
        }
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          navigate(`/user`, {
            replace: true,
          });
          return;
        }
      })
      .catch((error) => console.log("실패", error));
  }

  const AddUserSubmit = (e) => {
    e.preventDefault();
    if (
      userData.userid[0] === "" ||
      userData.passwd[0] === "" ||
      userData.passwdCk[0] === ""
    ) {
      alert("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    if (userData.passwd[0] !== userData.passwdCk[0]) {
      alert("비밀번호가 다릅니다. 비밀번호를 다시 입력해 주세요.");
      return;
    }
    addUserEvent();
  };
  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <form
          className="inputFormLayout detailFormLayout"
          onSubmit={AddUserSubmit}
        >
          <div className="formContentWrap">
            <label htmlFor="userid" className="blockLabel">
              아이디
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
              비밀번호
            </label>
            <input
              type="password"
              name="pass_wd"
              id="passwd"
              placeholder="비밀번호를 입력해 주세요."
              onChange={onChange}
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="passwdCk" className="blockLabel">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="pass_wdCk"
              id="passwdCk"
              placeholder="비밀번호를 한 번 더 입력해 주세요."
              onChange={onChange}
            />
          </div>

          <button type="submit" className="loginBtn">
            사용자 추가하기
          </button>
        </form>
      </div>
    </div>
  );
}