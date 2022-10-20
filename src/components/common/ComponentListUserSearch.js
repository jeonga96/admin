export default function ComponentListUserSearch() {
  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form className="listSearchForm">
        <div className="listSearchWrap">
          <label className="blockLabel">관리번호</label>
          <div>
            <input></input>
          </div>
        </div>
        <div className="listSearchWrap">
          <label className="blockLabel">아이디</label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">이름</label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">회원권한</label>
          <div>
            <input></input>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">핸드폰번호</label>
          <div>
            <input></input>
          </div>
        </div>
        <div className="listSearchWrap">
          <label className="blockLabel">계약일</label>
          <div>
            <input type="date"></input>
          </div>
        </div>
        {/* <div className="listSearchWrap">
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
        </div> */}
        <div className="listSearchWrap">
          <div className="blockLabel">계약관리</div>
          <div>
            <input
              className="listSearchRadioInput"
              type="radio"
              id="useFlag1"
              name="drone"
              value="1"
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag1">
              회원
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              id="useFlag0"
              name="drone"
              value="0"
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag0">
              해지
            </label>
          </div>
        </div>

        <div className="listSearchButtonWrap">
          <input type="reset" value="초기화" />
          <input type="submit" value="검색" />
        </div>
      </form>
    </div>
  );
}
