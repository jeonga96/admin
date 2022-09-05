import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { urlGetMyDetail, TOKEN } from "../Services/string";
import {
  servicesPostData,
  servicesRemoveStorage,
} from "../Services/importData";

function UserDeteil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const logoutEvent = () => {
    servicesRemoveStorage(TOKEN);
    navigate("/login");
  };

  useEffect(() => {
    servicesPostData(urlGetMyDetail, {})
      .then((res) => {
        if (res.status === "success") {
          setUserData(res.data);
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

  console.log(userData);
  return (
    <div className="mainWrap">
      <div className="userDetailBox">
        <div className="commonBox paddingBox">
          <ul className="userDetailWrap">
            <li className="boxTitle">
              안녕하세요 {userData ? userData.name : "no name"} 님!
            </li>
            <li className="detailHead">
              <h4>핸드폰 번호</h4>
              <span>{userData.mobile}</span>
            </li>
            <li className="detailHead">
              <h4>상세주소</h4>
              <span>{userData.address}</span>
            </li>
            <li className="detailHead">
              <h4>주소 (ㅇㅇ구, ㅇㅇ동)</h4>
              <span>{userData.location}</span>
            </li>
            <li className="detailHead">
              <h4>E-mail</h4>
              <span>{userData.mail}</span>
            </li>
          </ul>
          <div>
            <div className="bigButton">
              <Link className="Link" to="/setusermyinfo">
                회원 정보 수정
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserDeteil;
