import { Link } from "react-router-dom";
import styled from "styled-components";
import { GrClose } from "react-icons/gr";

import NavArea from "./NavArea";

const NavBoxWrap = styled.nav`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 270px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  transition: all 500ms ease-in;
  box-shadow: ${({ theme }) => theme.styles.boxShadow};
  ${({ theme }) => theme.media.wideTab} {
    width: 20vw;
  }
  ${({ theme }) => theme.media.widePc} {
    width: 270px;
  }
  &.hide {
    left: -270px;
  }
`;
const NavHeaderInner = styled.div`
  width: auto;
  height: auto;
  margin: 30px;
  ${({ theme }) => theme.media.minTab} {
    padding: 30px;
  }
  h1 {
    ${({ theme }) => theme.styles.blind}
  }
  img {
    width: 100px;
    height: 19px;
  }
  button {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    span {
      ${({ theme }) => theme.styles.blind}
    }
    i {
      font-size: 20px;
    }
  }

  ${({ theme }) => theme.media.pc} {
    #nav_close_btn {
      display: none;
    }
  }
`;
function NavBox({ btn, fnBtn }) {
  const onClickBtn = () => {
    fnBtn(btn);
  };

  return (
    <NavBoxWrap className={btn ? "show" : "hide"}>
      <NavHeaderInner>
        <h1>Salessa 홈페이지</h1>
        <Link to="/">
          <img
            src="https://demo.dashboardpack.com/sales-html/img/logo.png"
            alt="Salessa"
          />
        </Link>
        <button type="button" onClick={onClickBtn} id="nav_close_btn">
          <span>닫기</span>
          <i>
            <GrClose />
          </i>
        </button>
      </NavHeaderInner>
      <NavArea />
    </NavBoxWrap>
  );
}
export default NavBox;
