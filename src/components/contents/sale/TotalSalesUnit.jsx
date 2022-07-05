import styled from "styled-components";

const TotalSalesUnitSec = styled.section`
  /* height: auto;
  min-height: 516px; */
  height: 516px;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
  }
`;

function TotalSalesUnit() {
  return (
    <TotalSalesUnitSec>
      <div>TotalSalesUnit</div>
    </TotalSalesUnitSec>
  );
}

export default TotalSalesUnit;
