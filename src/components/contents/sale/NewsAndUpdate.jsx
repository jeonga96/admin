import styled from "styled-components";

const TransactionSec = styled.section`
  height: auto;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
    /* min-height: 444px; */
    height: 444px;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
    /* min-height: 424px; */
    height: 424px;
  }
`;

function NewsAndUpdate() {
  return (
    <TransactionSec>
      <div>NewsAndUpdate</div>
    </TransactionSec>
  );
}

export default NewsAndUpdate;
