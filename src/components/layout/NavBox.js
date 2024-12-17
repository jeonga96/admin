import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as CLEAN from "../../service/useData/cleanup";
import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import CHECKBRANCH from "../../checkbranch";

export default function NavBox() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navBarRef = useRef(null);
  const [navbarStyle, setNavbarStyle] = useState("hideBefore displayAfter");

  useEffect(() => {
    const handleNavbarScroll = () => {
      const scrollPosition = navBarRef.current.scrollTop;
      const styleClass =
        scrollPosition > 0
          ? "displayBefore hideAfter"
          : "hideBefore displayAfter";
      setNavbarStyle(styleClass);
    };

    const navBarElement = navBarRef.current;
    if (navBarElement) {
      navBarElement.addEventListener("scroll", handleNavbarScroll);
    }

    return () => {
      if (navBarElement) {
        navBarElement.removeEventListener("scroll", handleNavbarScroll);
      }
    };
  }, []);

  const [data, setData] = useState([]);

  function axiosData() {
    API.servicesGetData(APIURL.navUrl).then((res) => {
      setData(res);
    });
  }

  useEffect(() => {
    axiosData();
  }, []);

  return (
    <div className="navigationWrap">
      <div className="navTop">
        <h1 className="blind">wazzang admin</h1>
        <Link to="/company">
          <img src="/data/gonsacokLogoEn.png" alt="와짱 관리자페이지" />
        </Link>
      </div>

      <div className="navBottom">
        <h2 className="blind">카테고리 보기</h2>
        <div className={`navbarBox ${navbarStyle}`} ref={navBarRef}>
          <ul className="navbar">
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
                            `/${pathname.split("/")[1]}` === item.url
                              ? "link focusNavLink"
                              : "link"
                          }
                        >
                          <i>&lt;</i>
                          <span>{item.subName}</span>
                        </a>
                      ) : (
                        <Link
                          onClick={() =>
                            CLEAN.serviesPaginationCleanup(dispatch)
                          }
                          to={{
                            pathname: item.url,
                            state: { resetPage: true },
                          }}
                          className={
                            `/${pathname.split("/")[1]}` === item.url
                              ? "link focusNavLink"
                              : "link"
                          }
                        >
                          <i>&lt;</i>
                          <span>{item.subName}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        {CHECKBRANCH() !== "RELEASE" && (
          <div
            style={{
              color: "white",
              marginTop: "14px",
              marginLeft: "5px",
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {CHECKBRANCH() === "STAGE" ? "테스트 서버" : "개발 서버"}
          </div>
        )}
      </div>
    </div>
  );
}
