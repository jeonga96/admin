import { servicesGetStorage } from "../../Services/importData";
import { useDidMountEffect } from "../../Services/customHook";
import { ALLKEYWORD } from "../../Services/string";
import { useState, useEffect, useRef } from "react";

export default function SetAllKeyWord({
  getDataKeyword,
  companyDetailKeyword,
  setCompanyDetailKeyword,
}) {
  // 전체 키워드 받아오기
  const allKeywords = useRef([]);
  // 입력된 값이 포함된 키워드 저장되는 state
  const [searchValue, setSearchValue] = useState(null);
  // 검색창 닫기, 검색 버튼
  const [searchBtn, setSearchBtn] = useState(false);
  // handleKeywordOnclick에서 사용할, 이미 입력된 키워드(kid)를 담을 배열
  const clickedKeyword = [];

  // 로그인 시 받은 전체 키워드를 가져온다
  useEffect(() => {
    const allKeywordData = JSON.parse(servicesGetStorage(ALLKEYWORD));
    allKeywords.current = allKeywordData;
  }, []);

  // 전체 키워드에서 입력한 키워드가 포함됐을 때의 값을 반환하는 코드
  const keywordFilter = allKeywords.current.filter((data) => {
    if (searchValue === null) return data;
    else if (data.keyword.toLowerCase().includes(searchValue.toLowerCase())) {
      return data;
    }
  }, []);

  // 키워드가 검색된 목록에서 키워드 클릭하는 이벤트
  const handleKeywordOnclick = (item, e) => {
    e.preventDefault();
    companyDetailKeyword.forEach((el) => clickedKeyword.push(el.kid));
    if (!clickedKeyword.includes(item.kid)) {
      setCompanyDetailKeyword([...companyDetailKeyword, item]);
    }
  };

  // 키워드 삭제 시 실행되는 코드
  const onRemove = (kid, e) => {
    e.preventDefault();
    setCompanyDetailKeyword(
      companyDetailKeyword.filter((it) => it.kid !== kid)
    );
  };

  return (
    <div className="keywordWrap">
      <div>
        <input
          type="text"
          placeholder="키워드를 입력해 주세요."
          onChange={(e) => setSearchValue(e.target.value)}
          className="keywordInput"
          // onKeyUp={(e) => {
          //   if (e.key === "Enter") {
          //     e.preventDefault();
          //     setSearchBtn(!searchBtn);
          //   }
          // }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setSearchBtn(!searchBtn);
          }}
        >
          {searchBtn ? "닫기" : "검색"}
        </button>
      </div>
      {searchBtn && (
        <ul className="keywordBox">
          {keywordFilter.length > 0 ? (
            keywordFilter.map((item) => (
              <li key={item.kid}>
                <span>
                  <button
                    onClick={(e) => {
                      handleKeywordOnclick(item, e);
                    }}
                  >
                    {item.keyword}
                  </button>
                </span>
              </li>
            ))
          ) : (
            <li>
              <span>검색된 데이터가 없습니다. 다시 입력해 주세요.</span>
            </li>
          )}
        </ul>
      )}
      {companyDetailKeyword.length > 0 && (
        <ul className="keywordSelectWrap">
          {companyDetailKeyword.map((item) => (
            <li key={item.kid}>
              <button onClick={(e) => onRemove(item.kid, e)}>
                <span># {item.keyword}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
