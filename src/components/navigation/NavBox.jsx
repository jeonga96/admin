import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { GrClose } from "react-icons/gr";

import NavBottom from "./NavArea";

function NavBox() {
  const navChange = useSelector((state) => state.navState);
  const dispatch = useDispatch();
  const onClickBtn = () => {
    dispatch({
      type: "navEvent",
      payload: !navChange,
    });
  };

  return (
    <div className={navChange ? "show navigationWrap" : "hide navigationWrap"}>
      <div className="navTop">
        <h1 className="blind">Salessa 홈페이지</h1>
        <Link to="/">
          <img
            src="https://demo.dashboardpack.com/sales-html/img/logo.png"
            alt="Salessa"
          />
        </Link>
        <button type="button" onClick={onClickBtn} id="nav_close_btn">
          <span className="blind">닫기</span>
          <i>
            <GrClose />
          </i>
        </button>
      </div>
      <NavBottom />
    </div>
  );
}
export default NavBox;
