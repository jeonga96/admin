// 회원관리 > 통합회원 관리 리스트
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";

import * as PAGE from "../../action/page";

import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListUser() {
  // 목록 데이터
  const [contentsList, setContentsList] = useState([]);
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  CUS.useCleanupEffect(() => {
    setContentsList([]);
    API.servicesPostData(APIURL.urlListWzEvent, {
      offset: pageData.getPage,
      size: 15,
    }).then((res) => {
      setContentsList(res.data);
      dispatch(PAGE.setListPage(res.page));
    });
  }, [pageData.getPage]);

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
                <th style={{ width: "7%" }}>관리번호</th>
                <th style={{ width: "9%" }}>공사콕회원</th>
                <th style={{ width: "9%" }}>사업자분류</th>
                <th style={{ width: "auto" }}>상품</th>
                <th style={{ width: "12%" }}>상호명</th>
                <th style={{ width: "12%" }}>대표 ( 주력 ) 업종</th>
                <th style={{ width: "12%" }}>휴대폰</th>
                <th style={{ width: "7%" }}>상태</th>
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
                    <td>
                      {(!item.status || item.status === "AP") && (
                        <i
                          className="tableIcon"
                          style={{
                            backgroundColor: "orange",
                            fontSize: "0.725rem",
                            lineHeight: "1.65",
                            height: "min-content",
                          }}
                        >
                          신청완료
                        </i>
                      )}
                      {item.status == "CO" && (
                        <i
                          className="tableIcon"
                          style={{
                            backgroundColor: "green",
                            fontSize: "0.725rem",
                            lineHeight: "1.65",
                            height: "min-content",
                          }}
                        >
                          처리완료
                        </i>
                      )}
                    </td>
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
