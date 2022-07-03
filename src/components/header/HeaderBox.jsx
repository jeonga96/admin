import styled from "styled-components";
const HederWrap = styled.header`
  width: 100%;
  height: 102px;
  background-color: ${({ theme }) => theme.colors.white};
`;
function HeaderBox({ btn, fnBtn }) {
  const onClickBtn = () => {
    fnBtn(btn);
  };
  return (
    <HederWrap>
      <button type="button" id="nav_open_btn" onClick={onClickBtn}>
        메뉴열기
      </button>
    </HederWrap>
  );
}
export default HeaderBox;
