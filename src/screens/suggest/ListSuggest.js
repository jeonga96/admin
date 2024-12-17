// 공사콕 앱 관리 > 공사콕 건의사항 리스트

import { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";

import * as PAGE from "../../action/page";

import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListSuggest() {
  // 목록 데이터
  const [contentsList, setContentsList] = useState([]);

  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  CUS.useCleanupEffect(() => {
    setContentsList([]);
    API.servicesPostData(APIURL.urlListSuggest, {
      offset: pageData.getPage,
      size: 15,
    }).then((res) => {
      setContentsList(res.data);
      dispatch(PAGE.setListPage(res.page));
    });
  }, [pageData.getPage]);

  // useEffect(() => {
  //   if (location.state?.resetPage) {
  //     dispatch(setSuggestpage(1));
  //   }
  // }, [location, dispatch]);

  // useEffect(() => {
  //   setPage({ ...page, activePage: setSuggestpage || 1 });
  // }, [currentSuggestPage]);

  // const handlePageChange = (newPage) => {
  //   dispatch(setSuggestpage(newPage));
  // };

  return (contentsList == [] && contentsList.length === 0) ||
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
                <th style={{ width: "250px" }}>제목</th>
                <th style={{ width: "200px" }}>건의사항 유형</th>
                <th style={{ width: "auto" }}>내용</th>
                <th style={{ width: "160px" }}>이메일</th>
              </tr>
            </thead>
            <tbody>
              {contentsList &&
                contentsList.map((item) => (
                  <tr key={item.sid}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td
                      style={{
                        whiteSpace: "normal",
                        height: "auto",
                        padding: "0.4rem",
                        lineHeight: "1.6",
                        textAlign: "left",
                      }}
                    >
                      {item.content}
                    </td>

                    <td>{item.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <PageButton />
        </div>
      </section>
    </>
  );
}
