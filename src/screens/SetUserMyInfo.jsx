import { useState } from "react";
import { urlSetMyDetail } from "../Services/string";
import { servicesPostData } from "../Services/importData";

function UserDeteil() {
  const [userData, setUserData] = useState("");
  function onChange(e) {
    setUserData({ ...userData, [e.target.id]: [e.target.value] });
  }
  function setUserEvent() {
    servicesPostData(urlSetMyDetail, {
      name: userData.name[0],
      address: userData.address[0],
      mobile: userData.mobile[0],
      location: userData.location[0],
      mail: userData.mail[0],
    })
      .then((res) => {
        console.log("axios는 성공했는데 말이죠", res);
        if (res.status === "fail") {
          alert("잘못된 값을 입력했습니다.");
          return;
        }
        if (res.status === "success") {
          alert("수정이 완료되었습니다.");
          window.location.href = "/usermyinfo";
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
  console.log(userData);

  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <form className="loginForm formLayout " onSubmit={setUserSubmit}>
          <input type="text" id="name" placeholder="name" onChange={onChange} />
          <label htmlFor="name" className="blind">
            수정할 이름을 입력해 주세요.
          </label>

          <input
            type="text"
            id="address"
            placeholder="상세 주소를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="address" className="blind">
            상세 주소를 입력해 주세요.
          </label>

          <input
            type="text"
            id="mobile"
            placeholder="핸드폰번호를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="mobile" className="blind">
            핸드폰번호를 입력해 주세요.
          </label>

          <input
            type="text"
            id="location"
            placeholder="주소를 입력해 주세요. (ㅇㅇ동, ㅇㅇ구)"
            onChange={onChange}
          />
          <label htmlFor="location" className="blind">
            주소를 입력해 주세요. (ㅇㅇ동, ㅇㅇ구)
          </label>

          <input
            type="text"
            id="mail"
            placeholder="메일을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="mail" className="blind">
            메일을 입력해 주세요.
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
