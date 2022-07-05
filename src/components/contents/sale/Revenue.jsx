import styled from "styled-components";

const RevenueSec = styled.section`
  width: 100%;
  height: 367px;
  /* height: auto; */
  min-height: 367px;
  ${({ theme }) => theme.media.pc} {
  }
  ${({ theme }) => theme.media.minPc} {
  }
`;

function Revenue() {
  return (
    <RevenueSec>
      <div>Revenue</div>
    </RevenueSec>
  );
}

export default Revenue;
