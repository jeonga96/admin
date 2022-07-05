import styled from "styled-components";

const TransactionSec = styled.section`
  height: auto;
  /* min-height: 444px; */
  height: 444px;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
  }
`;

function Transaction() {
  return (
    <TransactionSec>
      <div>Transaction</div>
    </TransactionSec>
  );
}

export default Transaction;
