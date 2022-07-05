import styled from "styled-components";

const TopSellingProductSec = styled.section`
  height: auto;
  ${({ theme }) => theme.media.pc} {
    width: 50%;
    /* min-height: 510px; */
    height: 510px;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
    height: 500px;
  }
`;

function TopSellingProduct() {
  return (
    <TopSellingProductSec>
      <div>TopSellingProduct</div>
    </TopSellingProductSec>
  );
}

export default TopSellingProduct;
