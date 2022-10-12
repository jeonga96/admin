import { servicesGetStorage } from "../../Services/importData";
import { ALLKEYWORD } from "../../Services/string";
import { useState, useEffect } from "react";
import { type } from "@testing-library/user-event/dist/type";

export default function SetAllKeyWord() {
  // 전체 키워드 받아오기
  const [keywords, setKeywords] = useState([]);
  // 입력된 값이 포함된 키워드 저장되는 state
  const [search, setSearch] = useState(null);
  // 선택된 키워드 저장되는 state
  const [selectKeyword, setSelectKeyword] = useState([]);
  // 검색창 닫기, 검색 버튼
  const [searchBtn, setSearchBtn] = useState(false);

  useEffect(() => {
    setKeywords(JSON.parse(servicesGetStorage(ALLKEYWORD)));
  }, []);

  const keywordFilter = keywords.filter((data) => {
    if (search === null) return null;
    else if (data.keyword.toLowerCase().includes(search.toLowerCase())) {
      return data;
    }
  });
  const handleKeywordOnclick = (item, e) => {
    e.preventDefault();
    setSelectKeyword([...selectKeyword, item]);
  };
  console.log(selectKeyword === [], selectKeyword);
  return (
    <div className="keywordWrap">
      <div>
        <input
          type="text"
          placeholder="키워드를 입력해 주세요."
          onChange={(e) => setSearch(e.target.value)}
          className="keywordInput"
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
      {searchBtn ? (
        <ul className="keywordBox">
          {keywordFilter.map((item) => (
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
          ))}
        </ul>
      ) : null}
      {selectKeyword !== [] && (
        <ul className="keywordSelectWrap">
          {selectKeyword.map((item) => (
            <li key={item.kid}>
              <span>{item.keyword}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
