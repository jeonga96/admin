export function ManualView({ list, style }) {
  return (
    <div
      className={
        list
          ? "CompanyListManual CompanyManual"
          : "CompanySetManual CompanyManual"
      }
      style={style}
    >
      <ul style={{ paddingLeft: "9px"}}>
        <li>
          <span>회원 연결된 상태</span>
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#999999" }}>
            대기
          </i>
          : 공사콕 앱에서 생성된 회원 계정으로 관리자가 사업자 인증을 하지 않은
          상태
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#660000" }}>
            거절
          </i>
          : 사업자 인증이 거절된 상태
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#38761d" }}>
            완료
          </i>
          : 사업자 인증을 받아 앱에서 B2B 화면을 확인할 수 있는 상태
        </li>

        <li>
          <span>회원 연결이 해지된 상태</span>
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#1155cc" }}>
            생성
          </i>
          : 관리자 페이지에서 생성된 계정, 관리자 인증을 받은 상태
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#66aadd" }}>
            대용량
          </i>
          : 대용량 데이터로 생성된 상태
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#009999" }}>
            입력
          </i>
          : 대표이미지와 안심번호가 입력되어 앱에서 사업자 회원 정보가 보이는
          상태
        </li>

        {/* <li>
          -
          <i
            className="tableIcon"
            style={{ backgroundColor: "#eee", color: "#333" }}
          >
            미연결
          </i>
          : 사업자 연결이 되어있지 않은 회원 상태
        </li> */}
      </ul>
    </div>
  );
}

export function SetStatus(STATUS) {
  // const STATUS = getedData.status;
  if (STATUS === 0) {
    return (
      <div className="titleSpan" style={{ backgroundColor: "#ff0000" }}>
        해지
      </div>
    );
  } else if (STATUS === 1) {
    return (
      <div className="titleSpan" style={{ backgroundColor: "#38761d" }}>
        완료
      </div>
    );
  } else if (STATUS === 2) {
    return (
      <div className="titleSpan" style={{ backgroundColor: "#999999" }}>
        대기
      </div>
    );
  } else if (STATUS === 3) {
    return (
      <div className="titleSpan" style={{ backgroundColor: "#660000" }}>
        거절
      </div>
    );
  } else if (STATUS === 4) {
    return (
      <div className="titleSpan" style={{ backgroundColor: "#1155cc" }}>
        생성
      </div>
    );
  } else if (STATUS === 5) {
    return (
      <div className="titleSpan" style={{ backgroundColor: "#66aadd" }}>
        대용량
      </div>
    );
  } else if (STATUS === 6) {
    return (
      <div className="titleSpan" style={{ backgroundColor: "#009999" }}>
        입력
      </div>
    );
  } else {
    return (
      <div
        className="titleSpan"
        style={{ backgroundColor: "#eee", color: "#333" }}
      >
        미연결
      </div>
    );
  }
}

export function ListStatus(STATUS) {
  if (STATUS == 0) {
    return (
      <i className="tableIcon" style={{ backgroundColor: "#ff0000" }}>
        해지
      </i>
    );
  } else if (STATUS == 1) {
    return (
      <i className="tableIcon" style={{ backgroundColor: "#38761d" }}>
        완료
      </i>
    );
  } else if (STATUS == 2) {
    return (
      <i className="tableIcon" style={{ backgroundColor: "#999999" }}>
        대기
      </i>
    );
  } else if (STATUS == 3) {
    return (
      <i className="tableIcon" style={{ backgroundColor: "#660000" }}>
        거절
      </i>
    );
  } else if (STATUS == 4) {
    return (
      <i className="tableIcon" style={{ backgroundColor: "#1155cc" }}>
        생성
      </i>
    );
  } else if (STATUS == 5) {
    return (
      <i className="tableIcon" style={{ backgroundColor: "#66aadd" }}>
        대용량
      </i>
    );
  } else if (STATUS == 6) {
    return (
      <i className="tableIcon" style={{ backgroundColor: "#009999" }}>
        입력
      </i>
    );
  } else {
    return (
      <i
        className="tableIcon"
        style={{ backgroundColor: "#eee", color: "#333" }}
      >
        미연결
      </i>
    );
  }
}
