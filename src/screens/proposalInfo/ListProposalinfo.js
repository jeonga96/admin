// 사업자 회원 관리 > 공사콕 견적서 리스트

import { Link } from "react-router-dom";
import { useLayoutEffect, useState } from "react";

import * as API from "../../service/api";
import * as STR from "../../service/string";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import PageButton from "../../components/services/ServicesPaginationButton";
import ComponentListEstmateinfoSearch from "../../components/common/ComponentListEstmateinfoSearch";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListPropsosalinfo() {
  // 데이터 ------------------------------------------------------------------------
  // 견적서 목록
  const [list, setList] = useState([]);

  // pagination 버튼 관련 ------------------------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // 검색 버튼 클릭 유무
  const [searchClick, setSearchClick] = useState(false);

  useLayoutEffect(() => {
    // searchClick을 클릭하지 않은 (false) 상태에서 동작
    searchClick === false &&
      API.servicesPostData(STR.urlListProposalInfo, {
        offset: page.getPage,
        size: 15,
      }).then((res) => {
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
        LISTPROPSOSLINFO
      />
      <ul className="tableTopWrap">
        <LayoutTopButton url="add" text="견적서 추가" />
      </ul>
      {(list == [] && list.length == 0) || list === undefined ? (
        <ComponentErrorNull />
      ) : (
        <section className="tableWrap">
          <h3 className="blind">table</h3>
          <div className="paddingBox commonBox">
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>견적서</th>
                  <th style={{ width: "80px" }}>견적의뢰서</th>
                  <th style={{ width: "80px" }}>견적 요청</th>
                  <th style={{ width: "80px" }}>견적 수령</th>
                  <th style={{ width: "auto" }}>공사명</th>
                  <th style={{ width: "150px" }}>견적요청 업체명</th>
                  <th style={{ width: "80px" }}>대표자명</th>
                  <th style={{ width: "150px" }}>연락처</th>
                  <th style={{ width: "120px" }}>공사타입</th>
                  <th style={{ width: "80px" }}>활성화</th>
                </tr>
              </thead>
              <tbody>
                {list !== [] &&
                  list.map((item, key) => (
                    <tr key={key}>
                      <td className="tableButton">
                        <Link to={`${item.prid}`} className="Link">
                          {item.prid}
                        </Link>
                      </td>
                      <td className="tableButton">
                        {!!item.resid ? (
                          <Link
                            to={`/estimateinfo/${item.resid}`}
                            className="Link"
                          >
                            {item.resid}
                          </Link>
                        ) : (
                          item.resid
                        )}
                      </td>
                      <td>{item.fromUid}</td>
                      <td>{item.toUid}</td>
                      <td>{item.gname}</td>
                      <td>{item.cname}</td>
                      <td>{item.cceo}</td>
                      <td>
                        {item.telnum &&
                          item.telnum
                            .replace(/[^0-9]/g, "")
                            .replace(
                              /(^[0-9]{3})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace("--", "-")}
                      </td>
                      <td>
                        {item.gongsaType &&
                          item.gongsaType.includes("emer") && (
                            <i
                              className="tableIcon"
                              style={{ backgroundColor: "red" }}
                            >
                              긴급
                            </i>
                          )}
                        {item.gongsaType &&
                          item.gongsaType.includes("inday") && (
                            <i
                              className="tableIcon"
                              style={{ backgroundColor: "orange" }}
                            >
                              당일
                            </i>
                          )}
                        {item.gongsaType &&
                          item.gongsaType.includes("reser") && (
                            <i
                              className="tableIcon"
                              style={{ backgroundColor: "green" }}
                            >
                              예약
                            </i>
                          )}
                      </td>
                      <td>
                        {item.useFlag == "1" && (
                          <i className="tableIcon">정상</i>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <PageButton listPage={listPage} page={page} setPage={setPage} />
          </div>
        </section>
      )}
    </>
  );
}
