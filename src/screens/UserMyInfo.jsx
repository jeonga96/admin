import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { urlGetUserDetail, TOKEN } from "../Services/string";
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
    servicesPostData(urlGetUserDetail, {}).then((res) => setUserData(res.data));
  }, []);

  return (
    <div className="mainWrap">
      <div className="userDetailBox">
        <div className="commonBox paddingBox">
          <div className="userDetailWrap">
            <span className="boxTitle userDetailTitle">
              안녕하세요 {userData.name ?? "no name"} 님!
            </span>
          </div>
          <div className="bigButton widthCenter">
            <Link className="Link" to="/setusermyinfo">
              회원 정보 수정
            </Link>
            <button className="Link" onClick={logoutEvent}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserDeteil;
