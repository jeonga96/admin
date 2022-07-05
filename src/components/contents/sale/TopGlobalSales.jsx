import styled from "styled-components";

const TopGlobalSalesSec = styled.section`
  height: auto;
  ${({ theme }) => theme.media.pc} {
    width: 66.6666%;
    height: 526px;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
    height: 620px;
  }
`;

function TopGlobalSales() {
  return (
    <TopGlobalSalesSec>
      <div>TopGlobalSales</div>
    </TopGlobalSalesSec>
  );
}

export default TopGlobalSales;
