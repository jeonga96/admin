import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { urlGetUserDetail } from "../Services/string";
import { servicesPostData } from "../Services/importData";

function UserDeteil() {
  const [userData, setUserData] = useState({});
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
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserDeteil;
