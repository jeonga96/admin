import { useState, useEffect, useCallback } from "react";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

export default function ServiceModalSaleskeywordRecommendKeyword({
  click,
  setClick,
  inputData,
  fn,
}) {
  const [list, setList] = useState([]);

  const fetchData = useCallback(() => {
    if (!!inputData) {
      API.servicesPostData(APIURL.urlLikeKeyword, {
        keyword: inputData,
      })
        .then((res) => {
          if (res.status === "success") {
            setList(res.data);
          } else {
            setClick(false);
            setList([]);
            TOA.servicesUseToast("검색 데이터가 없습니다.", "e");
          }
        })
        .catch((error) => {
          // 오류 처리
          console.error("API 호출 오류:", error);
          setClick(false);
          setList([]);
        });
    } else {
      TOA.servicesUseToast("입력 데이터가 없습니다.", "e");
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
                  <th style={{ width: "20%" }}>사용회원</th>
                  <th style={{ width: "60%" }}>키워드</th>
                  <th style={{ width: "20%" }}>순위</th>
                </tr>
              </thead>

              <tbody style={{ display: "contents" }}>
                {list.map((item, i) => {
                  return (
                    <tr key={i} onClick={() => fn(item)}>
                      <td style={{ width: "20%" }}>{item.rcid}</td>
                      <td style={{ width: "60%" }}>{item.keyword}</td>
                      <td style={{ width: "20%" }}>{item.prior}</td>
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
