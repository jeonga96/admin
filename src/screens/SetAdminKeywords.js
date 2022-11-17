import { useForm } from "react-hook-form";
import { useState } from "react";
import { urlSetKeyword, urlAllKeyword, ALLKEYWORD } from "../Services/string";
import { servicesPostData, servicesSetStorage } from "../Services/importData";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetAdminKeyeords() {
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  // 전체 키워드 받아오기
  const [allKeywords, setAllKeywords] = useState(null);
  // 입력된 값이 포함된 키워드 저장되는 state
  const [searchValue, setSearchValue] = useState(null);
  // 검색창 닫기, 검색 버튼
  const [searchBtn, setSearchBtn] = useState(false);
  // 키워드 추가할 때마다 요소가 추가
  const [companyDetailKeyword, setCompanyDetailKeyword] = useState([]);
  // 수정된 값 저장
  const [modifyData, setModifyData] = useState(null);

  // 전체 키워드에서 입력한 키워드가 포함됐을 때의 값을 반환하는 코드
  const keywordFilter =
    !!allKeywords &&
    allKeywords.filter((data) => {
      if (searchValue === null) return data;
      else if (data.keyword.toLowerCase().includes(searchValue.toLowerCase())) {
        return data;
      }
    }, []);

  const handleOpenBtn = (e) => {
    e.preventDefault();
    setSearchBtn(!searchBtn);
    searchBtn === false
      ? servicesPostData(urlAllKeyword, {})
          .then((res) => {
            servicesSetStorage(ALLKEYWORD, JSON.stringify(res.data));
            setAllKeywords(res.data);
          })
          .then(setSearchBtn(!searchBtn))
      : setSearchBtn(!searchBtn);
  };

  const handleKeywordOnclick = (item, e) => {
    e.preventDefault();
    const addArr = [item, ...companyDetailKeyword];
    const newKeyword = new Set(addArr);
    setCompanyDetailKeyword([...newKeyword]);
  };

  const onChange = (e) => {
    if (modifyData === null) {
      // modifyData가 비어있다면 아직 아무것도 입력되지 않았음으로 값 추가만 진행
      return setModifyData([{ kid: e.target.id, hitCount: e.target.value }]);
    } else {
      // modifyData에 내용이 있다면 kid를 확인하여 kid가 같다면 마지막 kid를 전달한다.
      const copyArr = [
        ...modifyData,
        { kid: e.target.id, hitCount: e.target.value },
      ];
      const sameLastValue = copyArr.filter(
        (v, i) => copyArr.findLastIndex((el) => el.kid === e.target.id) === i
      );
      const initalValue = copyArr.filter((v, i) => v.kid !== e.target.id);
      setModifyData([...initalValue, ...sameLastValue]);
    }
  };

  // 수정 버튼
  const HandleSubmit = () => {
    for (let i = 0; i < modifyData.length; i++) {
      servicesPostData(urlSetKeyword, modifyData[i]);
    }
    setCompanyDetailKeyword([]);
    setModifyData(null);
    setSearchBtn(false);
    setAllKeywords([]);
    alert("완료되었습니다.");
  };

  console.log(keywordFilter);
  return (
    <>
      <div className="commonBox">
        {/* -------------------- 키워드 검색 -------------------- */}
        <div className="keywordWrap">
          <div style={{ marginBottom: "46px", marginTop: "36px" }}>
            <input
              type="text"
              placeholder="키워드를 입력해 주세요."
              onChange={(e) => setSearchValue(e.target.value)}
              className="keywordInput"
            />
            <button onClick={handleOpenBtn}>
              {searchBtn ? "닫기" : "검색"}
            </button>
          </div>

          {searchBtn && (
            <ul className="keywordBox" id="keywordBoxAdmin">
              {keywordFilter.length > 0 &&
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
                ))}

              {allKeywords !== null && keywordFilter.length === 0 ? (
                <li>
                  <span>검색된 데이터가 없습니다. 다시 입력해 주세요.</span>
                </li>
              ) : (
                <li>
                  <span>Loading ... </span>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* -------------------- 수정값 입력 폼 -------------------- */}
        <form className="formLayout" onSubmit={handleSubmit(HandleSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="수정" disabled={isSubmitting} />
          </ul>
          {companyDetailKeyword !== [] &&
            companyDetailKeyword.map((it, key, arr) => (
              <fieldset key={it.kid}>
                <div className="formWrap">
                  <div className="listSearchWrap" style={{ width: "33.333%" }}>
                    <div className="blockLabel">키워드</div>
                    <div>
                      <input
                        id="keyword"
                        type="text"
                        placeholder="키워드"
                        value={it.keyword}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="listSearchWrap" style={{ width: "33.333%" }}>
                    <div className="blockLabel">기존 조회량</div>
                    <div>
                      <input id="initalKeyword" value={it.hitCount} disabled />
                    </div>
                  </div>

                  <div className="listSearchWrap" style={{ width: "33.333%" }}>
                    <div className="blockLabel">더할 조회량</div>
                    <div>
                      <input
                        id={it.kid}
                        name="_hitCount"
                        type="number"
                        placeholder="해당 키워드가 검색된 수치입니다."
                        onChange={onChange}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            ))}
        </form>
      </div>

      {/* 하단 list ---------------------------------------- */}
    </>
  );
}
