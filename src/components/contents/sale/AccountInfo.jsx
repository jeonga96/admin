import styled from "styled-components";

const AccountInfoSec = styled.section`
  /* height: auto; */
  ${({ theme }) => theme.media.pc} {
    width: 33.3333%;
    /* min-height: 444px; */
    height: 444px;
  }
  ${({ theme }) => theme.media.minPc} {
    width: 100%;
    /* min-height: 432px; */
    height: 432px;
  }
`;

function AccountInfo() {
  return (
    <AccountInfoSec>
      <div>AccountInfo</div>
    </AccountInfoSec>
  );
}

export default AccountInfo;
