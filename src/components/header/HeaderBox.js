import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as ST from "../../services/storage";
import * as STR from "../../services/string";

import { AiOutlineMenu } from "react-icons/ai";

export default function HeaderBox() {
  const navigate = useNavigate();
  const navChange = useSelector((state) => state.navState);
  const dispatch = useDispatch();

  const handleNav = () => {
    dispatch({
      type: "navEvent",
      payload: !navChange,
    });
  };

  const handleLogout = () => {
    ST.servicesRemoveStorage(STR.TOKEN);
    navigate("/login");
  };

  return (
    <div className="headerWrap">
      <h2 className="blind">네비게이션 열기 및 검색창과 회원정보</h2>
      <div className="headerBox">
        <div className="openBtn">
          <button type="button" id="nav_open_btn" onClick={handleNav}>
            <span className="blind">메뉴열기</span>
            <i>
              <AiOutlineMenu />
            </i>
          </button>
        </div>
        <div className="infoWrap">
          <button className="Link" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
