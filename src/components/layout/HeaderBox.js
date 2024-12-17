import { useNavigate } from "react-router-dom";

import * as ST from "../../service/useData/storage";
import * as APIURL from "../../service/string/apiUrl";
import * as STR from "../../service/string/stringtoconst";
import * as API from "../../service/api";

import { useEffect, useState } from "react";

export default function HeaderBox() {
  const navigate = useNavigate();
  const [userrole, setUserrole] = useState("");

  useEffect(() => {
    API.servicesPostData(APIURL.urlGetUser, {
      uid: ST.servicesGetStorage("uid"),
    }).then((res) => {
      if (res.status === "success") {
        const USERROLE = res.data.userrole;
        if (USERROLE.includes("ROLE_ADMIN_AG")) {
          return setUserrole("지점 ( 대리점 ) 관리자");
        } else if (USERROLE.includes("ROLE_ADMIN_SD")) {
          return setUserrole("지사 ( 총판 ) 관리자");
        } else if (USERROLE.includes("ROLE_ADMIN")) {
          return setUserrole("일반 관리자");
        } else {
          return setUserrole("일반 회원");
        }
      }
    });
  }, []);

  const fnDate = () => {
    const TODAY = new Date();
    let time = {
      year: TODAY.getFullYear(),
      month: TODAY.getMonth() + 1,
      date: TODAY.getDate(),
    };
    return `${time.year}년 ${time.month}월 ${time.date}일`;
  };

  const handleLogout = () => {
    ST.servicesRemoveStorage(STR.TOKEN);
    navigate("/login");
  };

  return (
    <div className="headerWrap">
      <h2 className="blind">네비게이션 열기 및 검색창과 회원정보</h2>
      <div className="headerBox">
        {/* <div className="openBtn">
          <button type="button" id="nav_open_btn" onClick={handleNav}>
            <span className="blind">메뉴열기</span>
            <i>
              <AiOutlineMenu />
            </i>
          </button>
        </div> */}
        <div className="infoWrap">
          <div>
            <span>{fnDate()}</span>
            <span>{userrole}</span>
            <span>{ST.servicesGetStorage(STR.WRITER)}</span>
          </div>
          <button className="Link" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
