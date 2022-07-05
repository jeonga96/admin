import styled from "styled-components";

import Search from "../form/HaderSerch";
import Info from "./HeaderAreaInfo";
import NavOpenBtn from "../form/HeaderAreaOpenbtn";

const HederWrap = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  ${({ theme }) => theme.media.pc} {
    height: 100px;
    padding: 30px;
  }
  ${({ theme }) => theme.media.minTab} {
    height: 80px;
    padding: 20px;
  }
`;

function HeaderBox({ btn, fnBtn }) {
  return (
    <HederWrap>
      <h2>네비게이션 열기 및 검색창과 회원정보</h2>
      <NavOpenBtn btn={btn} fnBtn={fnBtn} />
      <Search />
      <Info />
    </HederWrap>
  );
}
export default HeaderBox;
