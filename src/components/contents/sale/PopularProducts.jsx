import styled from "styled-components";

const PopularProductsSection = styled.section`
  height: auto;
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
    height: 524px;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
    height: 480px;
  }
`;
function PopularProducts() {
  return (
    <PopularProductsSection>
      <div>PopularProducts</div>
    </PopularProductsSection>
  );
}

export default PopularProducts;
