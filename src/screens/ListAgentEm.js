// 유통망관리 > 사원관리 리스트

import { Link } from "react-router-dom";
import { useLayoutEffect, useState } from "react";

import * as API from "../Services/api";
import * as STR from "../Services/string";

import PageButton from "../components/services/ServicesPaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListAgentSearch from "../components/common/ComponentListAgentSearch";
import ComponentErrorNull from "../components/piece/PieceErrorNull";

export default function ListAgentEm() {
  // 데이터 ------------------------------------------------------------------------
  // 회원 목록
  const [userList, setUserList] = useState([]);

  // pagination 버튼 관련 -----------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // 회원관리, 상태관리 cid 저장
  const [searchClick, setSearchClick] = useState(false);

  useLayoutEffect(() => {
    // searchClick을 클릭하지 않은 (false) 상태에서 동작
    searchClick === false &&
      API.servicesPostData(STR.urlUserlist, {
        offset: page.getPage,
        userrole: "ROLE_ADMIN" || "ROLE_ADMINAG" || "ROLE_ADMINSD",
        size: 15,
      }).then((res) => {
        setUserList(res.data);
        setListPage(res.page);
      });
  }, [page.activePage]);

  return (userList == [] && userList.length == 0) || userList === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="작성" />
      </ul>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <ComponentListAgentSearch
        setUserList={setUserList}
        setListPage={setListPage}
        searchClick={searchClick}
        setSearchClick={setSearchClick}
        page={page}
      />

      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="사원등록" />
      </ul>

      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "150px" }}>관리번호</th>
                <th style={{ width: "150px" }}>아이디</th>
                <th style={{ width: "150px" }}>이름</th>
                <th style={{ width: "auto" }}>소속</th>
                <th style={{ width: "150px" }}>핸드폰번호</th>
                <th style={{ width: "150px" }}>계약 / 입사일</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {userList &&
                userList.map((item) => (
                  <tr key={item.uid}>
                    <td className="tableButton">
                      <Link to={`${item.uid}`} className="Link">
                        {item.uid}
                      </Link>
                    </td>
                    <td>{item.userid}</td>
                    <td>{item.name}</td>
                    <td>
                      {/* {item.userrole &&
                        item.userrole.includes("ROLE_ADMIN") && (
                          <i
                            className="tableIcon"
                            style={{ backgroundColor: "orange" }}
                          >
                            [본사] 와짱( 주 )
                          </i>
                        )} */}
                      {item.userrole &&
                      item.userrole.includes("ROLE_ADMIN_AG") ? (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "green" }}
                        >
                          지점 ( 대리점 ) 관리
                        </i>
                      ) : item.userrole.includes("ROLE_ADMIN_SD") ? (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "blue" }}
                        >
                          지사 ( 총판 ) 관리
                        </i>
                      ) : (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "orange" }}
                        >
                          [본사] 와짱( 주 )
                        </i>
                      )}
                      {/* {item.userrole &&
                      
                        )} */}
                    </td>
                    <td>{item.mobile}</td>

                    <td>{item.createTime && item.createTime.slice(0, 10)}</td>
                    {/* <td>{item.udid ? <i className="tableIcon">입력</i> : null}</td> */}
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
