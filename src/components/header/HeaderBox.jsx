import styled from "styled-components";
const HederWrap = styled.header`
  width: 100%;
  height: 102px;
  background-color: #00d;
`;
function HeaderBox() {
  return (
    <HederWrap>
      <button type="button" className="menu_open">
        메뉴열기
      </button>
    </HederWrap>
  );
}
export default HeaderBox;
