import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import * as ID from "../../Services/importData";
import * as STR from "../../Services/string";

import { GrClose } from "react-icons/gr";

export default function NavBox() {
  const { pathname } = useLocation();
  const navChange = useSelector((state) => state.navState);
  const dispatch = useDispatch();
  const onClickBtn = () => {
    dispatch({
      type: "navEvent",
      payload: !navChange,
    });
  };

  const [data, setData] = useState([]);
  function axiosData() {
    ID.servicesGetData(STR.navUrl).then((res) => setData(res));
  }
  useEffect(() => {
    axiosData();
  }, []);

  return (
    <div className={navChange ? "show navigationWrap" : "hide navigationWrap"}>
      <div className="navTop">
        <h1 className="blind">wazzang admin</h1>
        <Link to="/user">
          <img src="/data/gonsacokLogoEn.png" alt="와짱 관리자페이지" />
        </Link>
        <button type="button" onClick={onClickBtn} id="nav_close_btn">
          <span className="blind">닫기</span>
          <i>
            <GrClose />
          </i>
        </button>
      </div>

      <div className="navBottom">
        <h2 className="blind">카테고리 보기</h2>
        <ul>
          {data.map((item, key) => (
            <li key={key} className="navInner">
              <div className="navHeaderPart">
                <span>{item.name}</span>
              </div>

              <ul className="navContentPart">
                {item.subNav.map((item, key) => (
                  <li key={key}>
                    {item.url.includes("https://") ? (
                      <a
                        href={item.url}
                        className={
                          pathname.includes(item.url)
                            ? "link focusNavLink"
                            : "link"
                        }
                      >
                        {item.subName}
                      </a>
                    ) : (
                      <Link
                        to={item.url}
                        className={
                          pathname.includes(item.url)
                            ? "link focusNavLink"
                            : "link"
                        }
                      >
                        {item.subName}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
