import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { servicesPostData } from "../Services/importData";
import { urlListEstimateInfo } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import PageButton from "../components/common/PiecePaginationButton";
import ComponentListEstmateinfoSearch from "../components/common/ComponentListEstmateinfoSearch";

export default function ListEstimateinfo() {
  const [list, setList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });
  const [searchClick, setSearchClick] = useState(false);

  useEffect(() => {
    // searchClick을 클릭하지 않은 (false) 상태에서 동작
    searchClick === false &&
      servicesPostData(urlListEstimateInfo, {
        offset: page.getPage,
        size: 15,
      }).then((res) => {
        console.log(res);
        setList(res.data);
        setListPage(res.page);
      });
  }, [page.activePage]);

  return (
    <>
      <ComponentListEstmateinfoSearch
        setList={setList}
        setListPage={setListPage}
        searchClick={searchClick}
        setSearchClick={setSearchClick}
        page={page}
      />
      <ul className="tableTopWrap">
        <LayoutTopButton url="add" text="견적의뢰서 추가" />
      </ul>

      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "150px" }}>관리번호</th>
                <th style={{ width: "150px" }}>견적 요청</th>
                <th style={{ width: "150px" }}>견적 수령</th>
                <th style={{ width: "150px" }}>방문날짜</th>
                <th style={{ width: "120px" }}>공사타입</th>
                <th style={{ width: "100px" }}>견적서</th>
                <th style={{ width: "100px" }}>세금계산서</th>
                <th style={{ width: "100px" }}>활성화</th>
              </tr>
            </thead>
            <tbody>
              {list !== [] &&
                list.map((item, key) => (
                  <tr key={key}>
                    <td className="tableButton">
                      <Link to={`${item.esid}`} className="Link">
                        {item.esid}
                      </Link>
                    </td>
                    <td>{item.fromUid}</td>
                    <td>{item.toUid}</td>
                    <td>{item.reqVisit && item.reqVisit.slice(0, 10)}</td>
                    <td>
                      {item.gongsaType && item.gongsaType.includes("emer") && (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "red" }}
                        >
                          긴급
                        </i>
                      )}
                      {item.gongsaType && item.gongsaType.includes("inday") && (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "orange" }}
                        >
                          당일
                        </i>
                      )}
                      {item.gongsaType && item.gongsaType.includes("reser") && (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "green" }}
                        >
                          예약
                        </i>
                      )}
                    </td>
                    <td>
                      {item.reqEstimate == "1" && (
                        <i className="tableIcon">요청</i>
                      )}
                    </td>
                    <td>
                      {item.reqBill == "1" && <i className="tableIcon">요청</i>}
                    </td>
                    <td>
                      {item.useFlag == "1" && <i className="tableIcon">정상</i>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <PageButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
