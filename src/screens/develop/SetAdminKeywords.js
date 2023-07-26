// 현재 숨긴 키워드 순위 확인 및 조정 페이지

import { useForm } from "react-hook-form";
import { useState } from "react";

import * as STR from "../../service/string";
import * as API from "../../service/api";
import * as UD from "../../service/useData";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentListAdminKeyword from "../../components/common/ComponentListAdminKeyword";

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
  const [sumbit, setSubmit] = useState(false);

  // 전체 키워드에서 입력한 키워드가 포함됐을 때의 값을 반환하는 코드
  const keywordFilter =
    !!allKeywords &&
    allKeywords.filter((data) => {
      if (searchValue === null) return data;
      else if (data.keyword.toLowerCase().includes(searchValue.toLowerCase())) {
        return data;
      }
    }, []);

  // 검색, 닫기 버튼 클릭 이벤트
  // 기존 검색량을 최근 것으로 수정하기 위해 검색버튼 클릭 시 서버에서 전체 키워드를 다시 받아오도록 설정
  const handleBtnOnClick = (e) => {
    e.preventDefault();
    setSearchBtn(!searchBtn);
    searchBtn === false
      ? API.servicesPostData(STR.urlAllKeyword, {})
          .then((res) => {
            API.servicesSetStorage(STR.ALLKEYWORD, JSON.stringify(res.data));
            setAllKeywords(res.data);
          })
          .then(setSearchBtn(!searchBtn))
      : setSearchBtn(!searchBtn);
  };

  // 수정이 가능하도록 하는 input 입력창 표시되는 click 이벤트
  // 중복이 발생하지 않도록 new Set 이용
  const handleKeywordOnclick = (item, e) => {
    e.preventDefault();
    const addArr = [item, ...companyDetailKeyword];
    const newKeyword = new Set(addArr);
    setCompanyDetailKeyword([...newKeyword]);
  };

  // hitCount 수정하는 input onChange 이벤트
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
  const fnSubmit = () => {
    for (let i = 0; i < modifyData.length; i++) {
      API.servicesPostData(STR.urlSetKeyword, modifyData[i]);
    }
    setCompanyDetailKeyword([]);
    setModifyData(null);
    setSearchBtn(false);
    setAllKeywords([]);
    setSubmit(!sumbit);
    UD.servicesUseToast("완료되었습니다.", "s");
  };

  // 초기화 버튼
  const HandleReset = () => {
    setCompanyDetailKeyword([]);
    setModifyData(null);
    setSearchBtn(false);
    setAllKeywords([]);
  };

  return (
    <>
      <div className="commonBox">
        {/* -------------------- 키워드 검색 -------------------- */}
        <div className="keywordWrap">
          <div className="keywordBox">
            <div>
              <input
                type="text"
                placeholder="키워드를 입력해 주세요."
                onChange={(e) => setSearchValue(e.target.value)}
                className="keywordInput"
              />
              <button onClick={handleBtnOnClick}>
                {searchBtn ? "닫기" : "검색"}
              </button>
            </div>

            {searchBtn && (
              <div className="keywordArea">
                <div>
                  <ul>
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

                    {allKeywords !== null && keywordFilter.length === 0 && (
                      <li>
                        <span>
                          검색된 데이터가 없습니다. 다시 입력해 주세요.
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------------------- 수정값 입력 폼 -------------------- */}
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="초기화" fn={HandleReset} />
            <LayoutTopButton text="수정" disabled={isSubmitting} />
          </ul>

          {/* 검색 결과 & 표 클릭 결과 표시되는 수정 값 입력하는 인풋 */}
          {companyDetailKeyword !== [] &&
            companyDetailKeyword.map((it) => (
              <fieldset key={it.kid}>
                <div className="formWrap">
                  <div className="listSearchWrap" style={{ width: "33.333%" }}>
                    {/* 키워드와 기존 검색량은 확인을 위한 표시일 뿐 입력하여 수정할 순 없다. -> disabled */}
                    <div className="blockLabel">
                      <span>키워드</span>
                    </div>
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
                    <div className="blockLabel">
                      <span>조회수</span>
                    </div>
                    <div>
                      <input id="initalKeyword" value={it.hitCount} disabled />
                    </div>
                  </div>

                  <div className="listSearchWrap" style={{ width: "33.333%" }}>
                    <div className="blockLabel">
                      <span>조회수 수정</span>
                    </div>
                    <div>
                      <input
                        id={it.kid}
                        name="_hitCount"
                        type="number"
                        placeholder="+,-로 조회수를 수정할 수 있습니다."
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
      <ComponentListAdminKeyword
        handleOnclick={handleKeywordOnclick}
        CKECKSUMBIT={sumbit}
      />
    </>
  );
}
