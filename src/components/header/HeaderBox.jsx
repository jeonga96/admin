import { BsBell } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MyInfoPopup from "../common/MyInfoPopup";

export default function HeaderBox() {
  const navChange = useSelector((state) => state.navState);
  const dispatch = useDispatch();
  const [popup, setPopup] = useState(false);

  const onClickBtn = () => {
    dispatch({
      type: "navEvent",
      payload: !navChange,
    });
  };
  return (
    <div className="headerWrap">
      <h2 className="blind">네비게이션 열기 및 검색창과 회원정보</h2>
      <div className="headerBox">
        <div className="openBtn">
          <button type="button" id="nav_open_btn" onClick={onClickBtn}>
            <span className="blind">메뉴열기</span>
            <i>
              <AiOutlineMenu />
            </i>
          </button>
        </div>
        <div className="headerSearch">
          <form>
            <button type="submit">
              <i>
                <BsSearch />
              </i>
            </button>
            <input
              type="text"
              id="searchValue"
              name="search_Value"
              placeholder="Search here..."
            />
            <label className="blind" htmlFor="searchValue">
              검색할 내용을 입력해 주세요.
            </label>
          </form>
        </div>
        <div className="infoWrap">
          <ul className="noticeWrap">
            <li>
              <button>
                <span className="blind">알림</span>
                <i>
                  <BsBell />
                </i>
              </button>
            </li>
            <li>
              <button>
                <span className="blind">메세지</span>
                <i>
                  <IoMailOutline />
                </i>
              </button>
            </li>
          </ul>
          <div
            className="Headeruser"
            onClick={() => {
              setPopup(!popup);
            }}
          >
            <div>
              <span className="blind">마이페이지</span>
              <i>
                <BiUser />
              </i>
              {popup ? <MyInfoPopup /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
