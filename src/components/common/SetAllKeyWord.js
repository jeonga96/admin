import { servicesGetStorage } from "../../Services/importData";
import { ALLKEYWORD } from "../../Services/string";
import { useState, useEffect } from "react";

export default function SetAllKeyWord() {
  const [keywords, setKeywords] = useState([]);
  const [search, setSearch] = useState(null);
  const [selectKeyword, setSelectKeyword] = useState(null);

  useEffect(() => {
    setKeywords(JSON.parse(servicesGetStorage(ALLKEYWORD)));
  }, []);

  const keywordFilter = keywords.filter((data) => {
    if (search === null) return keywords;
    else if (data.keyword.toLowerCase().includes(search.toLowerCase())) {
      return data;
    }
  });
  const handleKeywordOnclick = (item) => {
    setSelectKeyword(item);
    // console.log(item);
  };

  return (
    <div className="keywordWrap">
      <div>
        <input
          type="text"
          placeholder="키워드를 입력해 주세요."
          onChange={(e) => setSearch(e.target.value)}
          className="keywordInput"
        />
        <ul className="keywordBox">
          {keywordFilter.map((item) => (
            <li key={item.kid}>
              <button onClick={handleKeywordOnclick(item)}>
                <span>{item.keyword}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul className="keywordSelectWrap">
          <li>d</li>
        </ul>
      </div>
    </div>
  );
}
