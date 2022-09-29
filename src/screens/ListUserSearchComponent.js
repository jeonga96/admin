export default function ListUserSearchComponent() {
  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form className="listSearchForm">
        <div className="listSearchWrap">
          <label>회원 관리 번호</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>아이디</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>회원 권한</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>이름</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>핸드폰 번호</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>생성일</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label className="listSearchCheckLabel" for="useFlag">
            휴먼고객
          </label>
          <input
            className="listSearchCheckInput"
            type="checkbox"
            id="useFlag"
            name="drone"
            value={true}
          />
        </div>
        {/* <div className="listSearchWrap">
          <label>사업자 번호</label>
          <input></input>
        </div> */}

        <div className="listSearchButtonWrap">
          <button>검색</button>
          <button>초기화</button>
        </div>
      </form>
    </div>
  );
}
