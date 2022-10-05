import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { servicesGetData } from "../../Services/importData";
import { navUrl } from "../../Services/string";
import { useState, useEffect } from "react";

import { GrClose } from "react-icons/gr";
import NavInnerSub from "./NavInnerSub";

export default function NavBox() {
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
    servicesGetData(navUrl).then((res) => setData(res));
  }
  useEffect(() => {
    axiosData();
  }, []);

  return (
    <div className={navChange ? "show navigationWrap" : "hide navigationWrap"}>
      <div className="navTop">
        <h1 className="blind">wazzang admin</h1>
        <Link to="/">
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
            <li key={key}>
              {item.url ? (
                <Link className="link navInnerSub" to={item.url}>
                  <div className="navPart">
                    <div>
                      <img src={item.icon} alt={item.name} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ) : (
                <NavInnerSub item={item} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
