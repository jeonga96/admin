import styled from "styled-components";

const MarketValusSection = styled.section`
  /* height: auto; */
  height: 524px;
  ${({ theme }) => theme.media.pc} {
    width: 66.6666%;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
  }
`;

function MarketValus() {
  return (
    <MarketValusSection>
      <div>MarketValus</div>
    </MarketValusSection>
  );
}

export default MarketValus;
