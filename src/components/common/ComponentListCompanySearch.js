export default function ComponentListCompanySearch() {
  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form className="listSearchForm formLayout">
        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>관리번호</span>
          </label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>상호</span>
          </label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>사업자 등록번호</span>
          </label>
          <div>
            <input></input>
          </div>
        </div>
        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>계약자</span>
          </label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>아이디</span>
          </label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>핸드폰 번호</span>
          </label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <div className="blockLabel">
            <span>회원상태</span>
          </div>
          <div>
            <input
              className="listSearchRadioInput"
              type="radio"
              id="status2"
              name="status"
              value="2"
            />
            <label className="listSearchRadioLabel" htmlFor="status2">
              대기
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              id="status1"
              name="status"
              value="1"
            />
            <label className="listSearchRadioLabel" htmlFor="status1">
              완료
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              id="status0"
              name="status"
              value="0"
            />
            <label className="listSearchRadioLabel" htmlFor="status0">
              거절
            </label>
          </div>
        </div>

        <div className="listSearchWrap">
          <div className="blockLabel">
            <span>계약관리</span>
          </div>
          <div>
            <input
              className="listSearchRadioInput"
              type="radio"
              id="useFlag0"
              name="usFlag"
              value="0"
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag0">
              해지
            </label>
            <input
              className="listSearchRadioInput"
              type="radio"
              id="useFlag1"
              name="usFlag"
              value="1"
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag1">
              정상
            </label>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>계약일</span>
          </label>
          <div>
            <input type="date"></input>
          </div>
        </div>
        <div className="listSearchButtonWrap">
          <button type="reset" value="초기화">
            초기화
          </button>
          <button type="submit" value="검색">
            검색
          </button>
        </div>
      </form>
    </div>
  );
}
