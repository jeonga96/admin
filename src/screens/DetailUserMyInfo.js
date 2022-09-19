import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { urlGetMyDetail } from "../Services/string";
import { servicesPostData } from "../Services/importData";

import DetailUserComponent from "../components/common/DetailUserComponent";

export default function DetailUserMyInfo() {
  const [userDetail, setUserDetail] = useState([]);

  useEffect(() => {
    servicesPostData(urlGetMyDetail, {})
      .then((res) => {
        if (res.status === "success") {
          setUserDetail(res.data);
          return;
        }
        if (res.status === "fail" && res.emsg === "process failed.") {
          alert("정보가 없습니다. 사업자 정보를 입력해 주세요!");
          window.location.href = `/setusermyinfo`;
          return;
        }
      })
      .catch();
  }, []);

  return (
    <>
      <div className="userDetailBox">
        <div className="commonBox paddingBox">
          {/* <ul className="userDetailWrap"> */}
          {/* <li className="boxTitle">
              안녕하세요 {userData ? userData.name : "no name"} 님!
            </li> */}
          <DetailUserComponent userDetail={userDetail} />
          <div>
            <div className="bigButton">
              <Link className="Link" to="/setusermyinfo">
                회원 정보 수정
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
