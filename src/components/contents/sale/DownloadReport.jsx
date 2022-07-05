import styled from "styled-components";

const DownloadReportSec = styled.section`
  width: 100%;
  /* height: auto;
  min-height: 131px; */
  height: 131px;
  ${({ theme }) => theme.media.pc} {
  }
  ${({ theme }) => theme.media.minPc} {
  }
`;

function DownloadReport() {
  return (
    <DownloadReportSec>
      <div>DownloadReport</div>
    </DownloadReportSec>
  );
}

export default DownloadReport;
