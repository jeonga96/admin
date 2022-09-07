import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetUserDetail } from "../Services/string";
import SelctUserRole from "../components/common/SelectUserRole";

import DetailUserComponent from "../components/common/DetailUserComponent";

export default function DetailUser() {
  let { uid } = useParams();
  const [userDetail, setUserDetail] = useState([]);

  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    }).then((res) => {
      if (res.status === "success") {
        setUserDetail(res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        alert("정보가 없습니다. 사용자정보를 입력해 주세요!");
        window.location.href = `user/${uid}/setUserDetail`;
        return;
      }
    });
  }, []);

  return (
    <div className="mainWrap">
      <div>
        <div className="paddingBox commonBox">
          <DetailUserComponent userDetail={userDetail} />
          <div className="detailHead">
            <h4>회원 권한 설정</h4>
            <SelctUserRole userDetail={userDetail} />
          </div>
          <div className="bigButton widthCenter">
            <Link className="Link" to="setUserDetail">
              사업자 정보 수정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
