import { useForm } from "react-hook-form";
import { useState } from "react";
import { urlSetKeyword, urlAllKeyword, ALLKEYWORD } from "../Services/string";
import { servicesPostData, servicesSetStorage } from "../Services/importData";

import ComponentSetAllKeyWord from "../components/common/ComponentSetAllKeyWord";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetAdminAppbanner() {
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();
  // 키워드 추가할 때마다 요소가 추가
  const [companyDetailKeyword, setCompanyDetailKeyword] = useState([]);
  // 수정된 값 저장
  const [modifyData, setModifyData] = useState(null);

  function onChange(e) {
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
  }
  console.log("fff", modifyData);
  function refreshButton() {
    servicesPostData(urlAllKeyword, {}).then((res) => {
      servicesSetStorage(ALLKEYWORD, JSON.stringify(res.data));
    });
  }
  function HandleSubmit() {
    for (let i = 0; i < modifyData.length; i++) {
      servicesPostData(urlSetKeyword, modifyData[i]).then((res) =>
        console.log(res)
      );
    }
  }
  console.log(companyDetailKeyword);

  return (
    <>
      <div className="commonBox">
        <ComponentSetAllKeyWord
          companyDetailKeyword={companyDetailKeyword}
          setCompanyDetailKeyword={setCompanyDetailKeyword}
        />
        <form className="formLayout" onSubmit={handleSubmit(HandleSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton
              text="키워드 새로고침"
              fn={refreshButton}
              disabled={isSubmitting}
            />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
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
                    <div className="blockLabel">기존 값</div>
                    <div>
                      <input id="initalKeyword" value={it.hitCount} disabled />
                    </div>
                  </div>

                  <div className="listSearchWrap" style={{ width: "33.333%" }}>
                    <div className="blockLabel">더할 수</div>
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
