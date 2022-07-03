import { Link } from "react-router-dom";
import styled from "styled-components";
import NavInner from "./NavInner";

const NavBoxWrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 270px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  transition: all 500ms ease-in;
  box-shadow: ${({ theme }) => theme.styles.boxShadow};
  &.hide {
    left: -270px;
  }
`;
const NavHeaderInner = styled.div`
  width: auto;
  height: auto;
  margin: 30px;
  padding-bottom: 20px;
  h1 {
    ${({ theme }) => theme.styles.blind}
  }
  img {
    width: 100px;
    height: 19px;
  }
  button {
    position: absolute;
    top: 0;
    right: 0;
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
        <h1>Salessa</h1>
        <Link to="/">
          <img
            src="https://demo.dashboardpack.com/sales-html/img/logo.png"
            alt="Salessa"
          />
        </Link>
        <button type="button" onClick={onClickBtn}>
          닫기
        </button>
      </NavHeaderInner>
      <NavInner />
    </NavBoxWrap>
  );
}
export default NavBox;
