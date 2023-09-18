import { useState, useEffect } from "react";

import * as API from "../../service/api";
import * as STR from "../../service/string";

export default function ServiceModalSaleskeywordAllKeyword({
  fn,
  setClickModal,
  clickModal,
}) {
  const [list, setList] = useState([]);

  useEffect(() => {
    API.servicesPostData(STR.urlAllKeyword, {}).then((res) => {
      setList(res.data);
    });
  }, []);

  return (
    clickModal && (
      <>
        <div className="clickModal">
          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "492px" }}>키워드</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => {
                  return (
                    <tr key={item.uid} onClick={(e) => fn(item)}>
                      <td style={{ width: "492px" }}>{item.keyword}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <button
            type="button"
            className="formContentBtn"
            onClick={() => setClickModal(false)}
          >
            닫기
          </button>
        </div>
      </>
    )
  );
}
