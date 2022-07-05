import styled from "styled-components";

const DailySalesSec = styled.section`
  height: auto;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
    /* min-height: 241px; */
    height: 242px;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
    /* min-height: 225px; */
    height: 225px;
  }
`;

function DailySales() {
  return (
    <DailySalesSec>
      <div>DailySales</div>
    </DailySalesSec>
  );
}

export default DailySales;
