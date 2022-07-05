import styled from "styled-components";

const MonthlyInvoicesSec = styled.section`
  /* height: auto;
  min-height: 510px; */
  height: 510px;
  ${({ theme }) => theme.media.pc} {
    width: 50%;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
  }
`;

function MonthlyInvoices() {
  return (
    <MonthlyInvoicesSec>
      <div>MonthlyInvoices</div>
    </MonthlyInvoicesSec>
  );
}

export default MonthlyInvoices;
