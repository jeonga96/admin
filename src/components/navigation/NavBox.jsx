import { Link } from "react-router-dom";
import { GrClose } from "react-icons/gr";

import NavBottom from "./NavArea";

function NavBox({ btn, fnBtn }) {
  const onClickBtn = () => {
    fnBtn(btn);
  };

  return (
    <div className={btn ? "show navigationWrap" : "hide navigationWrap"}>
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
