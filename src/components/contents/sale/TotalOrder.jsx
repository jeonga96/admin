import styled from "styled-components";

const TotalOrderSec = styled.section`
  /* height: auto;
  min-height: 241px; */
  height: 242px;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
  }
`;

function TotalOrder() {
  return (
    <TotalOrderSec>
      <div>TotalOrder</div>
    </TotalOrderSec>
  );
}

export default TotalOrder;
