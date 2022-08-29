import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData, useDidMountEffect } from "../Services/importData";
import { urlSetUserDetail, urlGetUserDetail } from "../Services/string";

function SetUserDetail() {
  const { uid } = useParams();

  const [userDetail, setUserDetail] = useState({
    name: "",
    address: "",
    mobile: "",
    location: "",
    mail: "",
  });
  const getDataFinish = useRef(null);

  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          setUserDetail(res.data);
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("기존에 입력된 데이터가 없습니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function onChange(e) {
    setUserDetail({ ...userDetail, [e.target.id]: e.target.value });
  }

  const addUserEvent = () => {
    servicesPostData(urlSetUserDetail, {
      ruid: uid,
      name: userDetail.name,
      address: userDetail.address,
      mobile: userDetail.mobile,
      location: userDetail.location,
      mail: userDetail.mail,
    })
      .then((res) => {
        console.log("axios 성공!", res);
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          window.location.href = `/user/${uid}`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  function AddUserSubmit(e) {
    e.preventDefault();
    addUserEvent();
  }

  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <form className="formLayout detailFormLayout" onSubmit={AddUserSubmit}>
          <label htmlFor="name" className=" blockLabel">
            이름
          </label>
          <input
            type="text"
            id="name"
            placeholder="이름을 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current ? userDetail.name : userDetail.name || ""
            }
          />
          <label htmlFor="location" className=" blockLabel">
            주소 (ㅇㅇ구, ㅇㅇ동)
          </label>
          <input
            type="text"
            id="location"
            placeholder="주소를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? userDetail.location
                : userDetail.location || ""
            }
          />
          <label htmlFor="comment" className=" blockLabel">
            상세 주소
          </label>
          <input
            type="text"
            id="address"
            placeholder="상세주소를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? userDetail.address
                : userDetail.address || ""
            }
          />
          <label htmlFor="mobile" className="blockLabel">
            핸드폰 번호
          </label>
          <input
            type="text"
            id="mobile"
            placeholder="모바일 번호"
            onChange={onChange}
            value={
              getDataFinish.current
                ? userDetail.mobile
                : userDetail.mobile || ""
            }
          />

          <label htmlFor="mail" className=" blockLabel">
            이메일
          </label>
          <input
            type="text"
            id="mail"
            placeholder="이메일을 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current ? userDetail.mail : userDetail.mail || ""
            }
          />
          <button type="submit" className="loginBtn">
            사용자 상세정보 수정하기
          </button>
        </form>
      </div>
    </div>
  );
}
export default SetUserDetail;
