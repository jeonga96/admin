import { useState, useLayoutEffect } from "react";

import * as STR from "../../Services/string";
import * as API from "../../Services/api";

export default function ComponentListAdminKeyword({
  handleOnclick,
  CKECKSUMBIT,
}) {
  // 데이터 ------------------------------------------------------------------------
  // 작성된 데이터를 받아옴
  const [getData, setGetData] = useState([]);

  useLayoutEffect(() => {
    // 서버에서 새로 값을 받아와도 map이 렌더링 되지 않으므로 getData를 빈배열로 반든 후, 새로 할당
    setGetData([]);
    // 값을 서버에 보내고, 다시 받아올 때 시간 차이를 두기 위해 0.1초 후 진행하도록 설정
    setTimeout(() => {
      API.servicesPostData(STR.urlSuggestKeyword, {}).then((res) =>
        setGetData(res.data)
      );
    }, 100);
    // submit 버튼 클릭했다면, 서버에서 값을 다시 받아와서 렌더링 한다.
  }, [CKECKSUMBIT]);

  return (
    <section className="tableWrap">
      <div className="commonBox">
        <h3>키워드 검색순위 상위 100위</h3>
        <div className="flexTableWrap">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>순위</th>
                <th style={{ width: "70%" }}>키워드</th>
                <th style={{ width: "20%" }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {getData &&
                getData.slice(0, 25).map((item, index) => (
                  <tr key={item.kid}>
                    <td>{index + 1}</td>
                    <td>
                      <button onClick={(e) => handleOnclick(item, e)}>
                        {item.keyword}
                      </button>
                    </td>
                    <td>{item.hitCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>순위</th>
                <th style={{ width: "70%" }}>키워드</th>
                <th style={{ width: "20%" }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {getData &&
                getData.slice(25, 50).map((item, index) => (
                  <tr key={item.kid}>
                    <td>{index + 26}</td>
                    <td>
                      <button onClick={(e) => handleOnclick(item, e)}>
                        {item.keyword}
                      </button>
                    </td>
                    <td>{item.hitCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>순위</th>
                <th style={{ width: "70%" }}>키워드</th>
                <th style={{ width: "20%" }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {getData &&
                getData.slice(50, 75).map((item, index) => (
                  <tr key={item.kid}>
                    <td>{index + 51}</td>
                    <td>
                      <button onClick={(e) => handleOnclick(item, e)}>
                        {item.keyword}
                      </button>
                    </td>
                    <td>{item.hitCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>순위</th>
                <th style={{ width: "70%" }}>키워드</th>
                <th style={{ width: "20%" }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {getData &&
                getData.slice(75, 100).map((item, index) => (
                  <tr key={item.kid}>
                    <td>{index + 76}</td>
                    <td>
                      <button onClick={(e) => handleOnclick(item, e)}>
                        {item.keyword}
                      </button>
                    </td>
                    <td>{item.hitCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
