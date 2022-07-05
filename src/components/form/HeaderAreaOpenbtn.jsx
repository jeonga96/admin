import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";

const OpenBtn = styled.button`
  float: left;
  width: auto;
  height: auto;
  padding-top: 13px;
  margin-right: 15px;
  span {
    ${({ theme }) => theme.styles.blind}
  }
  i {
    width: 100%;
    height: 100%;
    font-size: 20px;
  }
`;

function NavOpenbtn({ btn, fnBtn }) {
  const onClickBtn = () => {
    fnBtn(btn);
  };
  return (
    <OpenBtn type="button" id="nav_open_btn" onClick={onClickBtn}>
      <span>메뉴열기</span>
      <i>
        <AiOutlineMenu />
      </i>
    </OpenBtn>
  );
}
export default NavOpenbtn;
