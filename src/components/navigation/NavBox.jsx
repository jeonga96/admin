import { useState } from "react";
import styled from "styled-components";
import NavInner from "./NavInner";

const NavBoxWrap = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 270px;
  height: 100%;
  background-color: #ff0;
  transition: all 500ms ease-in;
  &.hide {
    left: -270px;
  }
`;
function NavBox() {
  const [btn, setBtn] = useState(true);
  const onClickBtn = () => {
    setBtn(!btn);
  };
  return (
    <NavBoxWrap className={btn ? "hide" : "show"}>
      <div className="NavHederInner">
        <h1>Salessa</h1>
        <button type="button" onClick={onClickBtn}>
          닫기
        </button>
      </div>
      <NavInner />
    </NavBoxWrap>
  );
}
export default NavBox;
