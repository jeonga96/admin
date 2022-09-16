import { useState, useEffect, useRef } from "react";
import { urlSetMyDetail, urlGetMyDetail } from "../Services/string";
import { servicesPostData } from "../Services/importData";

export default function SetDetailUserMyInfo() {
  const [userData, setUserData] = useState("");
  const getDataFinish = useRef(null);

  useEffect(() => {
    servicesPostData(urlGetMyDetail, {})
      .then((res) => {
        if (res.status === "success") {
          setUserData(res.data);
          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

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
        <form className="detailFormLayout" onSubmit={setUserSubmit}>
          <div className="formContentWrap">
            <label htmlFor="name" className="blockLabel">
              이름
            </label>
            <input
              type="text"
              id="name"
              placeholder="수정할 이름을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current ? userData.name : userData.name || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="address" className="blockLabel">
              주소
            </label>
            <input
              type="text"
              id="address"
              placeholder="상세 주소를 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? userData.address
                  : userData.address || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="mobile" className="blockLabel">
              핸드폰번호
            </label>
            <input
              type="text"
              id="mobile"
              placeholder="핸드폰번호를 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current ? userData.mobile : userData.mobile || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="location" className="blockLabel">
              주소(ㅇㅇ동, ㅇㅇ구)
            </label>
            <input
              type="text"
              id="location"
              placeholder="주소를 입력해 주세요. (ㅇㅇ동, ㅇㅇ구)"
              onChange={onChange}
              value={
                getDataFinish.current
                  ? userData.location
                  : userData.location || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="mail" className="blockLabel">
              이메일
            </label>
            <input
              type="text"
              id="mail"
              placeholder="메일을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current ? userData.mail : userData.mail || ""
              }
            />
          </div>

          <button type="submit" className="loginBtn">
            수정 정보 등록하기
          </button>
        </form>
      </div>
    </div>
  );
}
