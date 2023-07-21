// 유통망 관리 > 지사( 총판 )관리 리스트

import { Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";

import * as API from "../services/api";
import * as STR from "../services/string";

import PageButton from "../components/services/ServicesPaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListAgentSearch from "../components/common/ComponentListAgentSearch";
import ComponentErrorNull from "../components/piece/PieceErrorNull";

export default function ListAgentAg() {
  // 데이터 ------------------------------------------------------------------------
  // 회원 목록
  const [prevUserList, setPrevUserList] = useState([]);
  const [userList, setUserList] = useState([]);

  // pagination 버튼 관련 -----------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // 회원관리, 상태관리 cid 저장
  const [searchClick, setSearchClick] = useState(false);
  const [finish, setFinish] = useState(false);

  useLayoutEffect(() => {
    searchClick === false &&
      API.servicesPostData(STR.urlUserlist, {
        offset: page.getPage,
        userrole: "ROLE_ADMIN_AG",
        size: 15,
      }).then((res) => {
        setPrevUserList(res.data);
        setListPage(res.page);
      });
  }, [page.activePage]);

  useEffect(() => {
    const newArr = [];
    prevUserList.forEach((item) => {
      return API.servicesPostData(STR.urlGetCompanyDetail, {
        rcid: item.cid,
      })
        .then((response) => response.data)
        .then((result) => {
          prevUserList.map((user) => {
            if (user.cid === item.cid) {
              return newArr.push({ ...user, additionalData: result });
            }
            return user;
          });
          if (newArr.length === prevUserList.length) {
            const uidSortArr = newArr.sort((a, b) => b.uid - a.uid);
            setUserList(uidSortArr);
            setFinish(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [listPage && prevUserList]);

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
        setUserList={setPrevUserList}
        setListPage={setListPage}
        searchClick={searchClick}
        setSearchClick={setSearchClick}
        page={page}
      />

      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="지점 ( 대리점 ) 등록" />
      </ul>

      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "120px" }}>관리번호</th>
                <th style={{ width: "100px" }}>대표자</th>
                <th style={{ width: "250px" }}>소속총판</th>
                <th style={{ width: "auto" }}>사업장명</th>
                <th style={{ width: "150px" }}>핸드폰번호</th>
                <th style={{ width: "150px" }}>입사일</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {finish &&
                userList.map((item) => {
                  console.log(item);
                  return (
                    <tr key={item.uid}>
                      <td className="tableButton">
                        <Link to={`${item.uid}`} className="Link">
                          {item.uid}
                        </Link>
                      </td>
                      <td>{item.name}</td>
                      <td>
                        {item.additionalData && item.additionalData.regName}
                      </td>
                      <td>{item.additionalData && item.additionalData.name}</td>
                      <td>{item.mobile}</td>
                      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <PageButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
