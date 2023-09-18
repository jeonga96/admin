import { useState, useEffect, useCallback } from "react";

import * as API from "../../service/api";
import * as STR from "../../service/string";
import * as UD from "../../service/useData";

export default function ServiceModalSaleskeywordRecommendKeyword({
  click,
  setClick,
  inputData,
  fn,
}) {
  const [list, setList] = useState([]);

  const fetchData = useCallback(() => {
    if (!!inputData) {
      API.servicesPostData(STR.urlListIsSalesKeyword, {
        keyword: inputData,
      })
        .then((res) => {
          console.log(inputData, res);
          if (res.status === "success") {
            const usedPriors = res.data.map((item) => item.prior);
            const useOkPriors = Array.from(
              { length: 7 },
              (_, index) => index + 1
            ).filter((prior) => !usedPriors.includes(prior));
            return setList(useOkPriors);
          } else if (!!inputData) {
            return setList([1, 2, 3, 4, 5, 6, 7]);
          }
        })
        .catch((error) => {
          // 오류 처리
          console.error("API 호출 오류:", error);
          setClick(false);
          setList([]);
        });
    } else {
      UD.servicesUseToast("입력 데이터가 없습니다.", "e");
    }
  }, [inputData, setClick]);

  // click이 변경될 때 fetchData 함수 실행
  useEffect(() => {
    if (click) {
      fetchData();
    }
  }, [click, fetchData]);

  return (
    click &&
    list.length > 0 && (
      <>
        <div className="clickModal">
          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "492px" }}>사용가능한 순위</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item, i) => {
                  console.log(item);
                  return (
                    <tr key={i}>
                      <td style={{ width: "492px" }} onClick={() => fn(item)}>
                        {item}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <button
            type="button"
            className="formContentBtn"
            onClick={() => setClick(false)}
          >
            닫기
          </button>
        </div>
      </>
    )
  );
}
