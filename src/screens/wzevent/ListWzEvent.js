// 회원관리 > 통합회원 관리 리스트

import { Link } from "react-router-dom";
import { useLayoutEffect, useState } from "react";

import * as API from "../../service/api";
import * as STR from "../../service/string";

import PageButton from "../../components/services/ServicesPaginationButton";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListUser() {
  // 목록 데이터
  const [contentsList, setContentsList] = useState([]);

  // pagination 버튼 관련 ------------------------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useLayoutEffect(() => {
    API.servicesPostData(STR.urlListWzEvent, {
      offset: page.getPage,
      size: 15,
    }).then((res) => {
      setContentsList(res.data);
      setListPage(res.page);
    });
  }, [page.activePage]);

  const fnProductValue = (item) => {
    if (item === "1") {
      return "홈페이지 제작, 관리 ( PC형 )";
    } else if (item === "2") {
      return "블로그 제작 + 포스팅 1회 + 동영상 제작";
    } else if (item === "3") {
      return "블로그 포스팅 7회 작성";
    } else {
      return "홈페이지 + 블로그 포스팅 1회 + 동영상 제작, 관리 업로드";
    }
  };

  return (contentsList == [] && contentsList.length == 0) ||
    contentsList === undefined ? (
    <>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "75px" }}>관리번호</th>
                <th style={{ width: "75px" }}>공사콕회원</th>
                <th style={{ width: "75px" }}>사업자분류</th>
                <th style={{ width: "auto" }}>상품</th>
                <th style={{ width: "150px" }}>업체명</th>
                <th style={{ width: "300px" }}>대표업종</th>
                <th style={{ width: "150px" }}>핸드폰번호</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {contentsList &&
                contentsList.map((item) => (
                  <tr key={item.gweid}>
                    <td className="tableButton">
                      <Link to={`${item.gweid}`} className="Link">
                        {item.gweid}
                      </Link>
                    </td>
                    <td>{item.guserFlag === "0" ? "미가입" : "가입"}</td>
                    <td>{item.busClassFlag}</td>
                    <td>{fnProductValue(item.product)}</td>
                    <td>{item.cname}</td>
                    <td>{item.job}</td>
                    <td>{item.telnum}</td>
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
