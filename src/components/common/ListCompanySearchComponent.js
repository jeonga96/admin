export default function ListCompanySearchComponent() {
  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form className="listSearchForm">
        <div className="listSearchWrap">
          <label>관리번호</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>사업자 등록번호</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>업체명</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>생성일</label>
          <input type="date"></input>
        </div>
        <div className="listSearchWrap">
          <label>아이디</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>계약자명</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <label>핸드폰 번호</label>
          <input></input>
        </div>
        <div className="listSearchWrap">
          <div className="title">회원상태</div>

          <label className="listSearchRadioLabel" htmlFor="useFlag0">
            대기
          </label>
          <input
            className="listSearchRadioInput"
            type="radio"
            id="useFlag0"
            name="drone"
            value="0"
          />

          <label className="listSearchRadioLabel" htmlFor="useFlag1">
            완료
          </label>
          <input
            className="listSearchRadioInput"
            type="radio"
            id="useFlag1"
            name="drone"
            value="1"
          />

          <label className="listSearchRadioLabel" htmlFor="useFlag2">
            거절
          </label>
          <input
            className="listSearchRadioInput"
            type="radio"
            id="useFlag2"
            name="drone"
            value="2"
          />

          <label className="listSearchRadioLabel" htmlFor="useFlag3">
            휴면계정
          </label>
          <input
            className="listSearchRadioInput"
            type="radio"
            id="useFlag3"
            name="drone"
            value="3"
          />
        </div>

        <div className="listSearchButtonWrap">
          <input type="reset" value="초기화" />
          <input type="submit" value="검색" />
        </div>
      </form>
    </div>
  );
}
