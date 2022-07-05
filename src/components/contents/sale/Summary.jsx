import styled from "styled-components";

const SummarySec = styled.section`
  height: auto;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
    /* min-height: 242px; */
    height: 242px;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
    /* min-height: 219px; */
    height: 220px;
  }
`;

function Summary() {
  return (
    <SummarySec>
      <div>Summary</div>
    </SummarySec>
  );
}

export default Summary;
