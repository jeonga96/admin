import { useState, useEffect } from "react";
import { urlSuggestKeyword } from "../../Services/string";
import { servicesPostData } from "../../Services/importData";

export default function ComponentListAdminKeyword({
  handleOnclick,
  CKECKSUMBIT,
}) {
  const [getData, setGetData] = useState([]);

  useEffect(() => {
    // submit 버튼 클릭했다면, 서버에서 값을 다시 받아와서 렌더링 한다.
    setGetData([]);
    setTimeout(() => {
      servicesPostData(urlSuggestKeyword, {}).then((res) =>
        setGetData(res.data)
      );
    }, 100);
  }, [CKECKSUMBIT]);

  return (
    <section className="tableWrap">
      <h3 className="blind">table</h3>
      <div className="commonBox flexTableWrap">
        <table className="commonTable">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>순위</th>
              <th style={{ width: "70%" }}>키워드</th>
              <th style={{ width: "20%" }}>검색량</th>
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
              <th style={{ width: "20%" }}>검색량</th>
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
              <th style={{ width: "20%" }}>검색량</th>
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
              <th style={{ width: "20%" }}>검색량</th>
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
    </section>
  );
}
