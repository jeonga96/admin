import styled from "styled-components";

const KalenderSec = styled.section`
  /* height: auto;
  min-height: 526px; */
  height: 526px;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
  }
`;

function Kalender() {
  return (
    <KalenderSec>
      <div>Kalender</div>
    </KalenderSec>
  );
}

export default Kalender;
