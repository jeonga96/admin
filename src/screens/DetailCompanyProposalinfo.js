import { Link, useParams, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import { servicesPostData } from "../Services/importData";
import { useDidMountEffect } from "../Services/customHook";
import { urlListProposalInfo, urlGetCompany } from "../Services/string";

import PageButton from "../components/piece/PiecePaginationButton";
import ComponentErrorNull from "../components/common/ComponentErrorNull";

export default function DetailCompanyProposalinfo() {
  const { rcid } = useParams();
  const location = useLocation();

  // [데이터 요청]
  // 목록 데이터
  const [list, setList] = useState([]);
  // cid에 연결된 ruid 저장
  const RUID = useRef("");

  // [pagination 버튼 관련]
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useLayoutEffect(() => {
    // uid가져오기
    servicesPostData(urlGetCompany, { cid: rcid })
      .then((res) => (RUID.current = res.data.ruid))
      // 가져온 uid로 견적 요청서 가져오기
      .then((res) =>
        servicesPostData(
          urlListProposalInfo,
          // url에 맞춰 수령 기준, 요청 기준으로 견적 요청서를 가져온다
          location.pathname.includes("from")
            ? {
                fromUid: res,
                offset: page.getPage,
                size: 15,
              }
            : {
                toUid: res,
                offset: page.getPage,
                size: 15,
              }
        )
          .then((res) => {
            setList(res.data);
            setListPage(res.page);
          })
          .catch(setList([]))
      );
  }, []);

  // 페이지 이동시마다 발생
  // 두번째 렌더링부터 이벤트 발생
  useDidMountEffect(() => {
    servicesPostData(
      urlListProposalInfo,
      location.pathname.includes("from")
        ? {
            fromUid: RUID.current,
            offset: page.getPage,
            size: 15,
          }
        : {
            toUid: RUID.current,
            offset: page.getPage,
            size: 15,
          }
    )
      .then((res) => {
        setList(res.data);
        setListPage(res.page);
      })
      .catch(setList([]));
  }, [page.activePage]);

  return (
    <>
      {(list == [] && list.length == 0) || list === undefined ? (
        <ComponentErrorNull />
      ) : (
        <section className="tableWrap">
          <h3 className="blind">table</h3>
          <div className="paddingBox commonBox">
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>관리번호</th>
                  <th style={{ width: "100px" }}>견적 요청</th>
                  <th style={{ width: "100px" }}>견적 수령</th>
                  <th style={{ width: "auto" }}>공사명</th>
                  <th style={{ width: "150px" }}>업체명</th>
                  <th style={{ width: "100px" }}>대표자명</th>
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
                        <Link
                          to={`/proposalInfo/${item.prid}`}
                          className="Link"
                        >
                          {item.prid}
                        </Link>
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
