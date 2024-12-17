// 유통망관리 > 사원관리 리스트

import { Link } from "react-router-dom";
import { useState } from "react";

import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentListAgentSearch from "../../components/common/ComponentListAgentSearch";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListAgentEm() {
  // 데이터 ------------------------------------------------------------------------
  // 회원 목록
  const [userList, setUserList] = useState([]);

  // 회원관리, 상태관리 cid 저장

  return (userList == [] && userList.length == 0) || userList === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="작성" />
      </ul>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <ComponentListAgentSearch setUserList={setUserList} />

      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="사원등록" />
      </ul>

      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "150px" }}>유통망 관리번호</th>
                {/* <th style={{ width: "150px" }}>회원 관리번호</th> */}
                <th style={{ width: "200px" }}>소속</th>
                <th style={{ width: "200px" }}>이름</th>
                {/* <th style={{ width: "auto" }}>관리자 레벨</th> */}
                <th style={{ width: "auto" }}>휴대폰</th>
                <th style={{ width: "100px" }}>상태</th>
                <th style={{ width: "150px" }}>입사일</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {userList &&
                userList.map((item) => (
                  <tr key={item.daid}>
                    <td className="tableButton">
                      <Link to={`${item.daid}`} className="Link">
                        {item.daid}
                      </Link>
                    </td>
                    {/* <td>
                      {item.ruid}
                    </td> */}

                    <td>{item.afflname}</td>
                    <td>{item.name}</td>
                    {/* <td>
                      <span
                        className={
                          item.managetype === "AG"
                            ? "admin-ag-text"
                            : item.managetype === "SD"
                            ? "admin-sd-text"
                            : "head-office-text"
                        }
                      >
                        {item.managetype === "AG"
                          ? "지점 ( 대리점 ) 관리"
                          : item.managetype === "SD"
                          ? "지사 ( 총판 ) 관리"
                          : "본사 관리자"}
                      </span>
                    </td> */}
                    <td>{item.adphonenum}</td>
                    <td>{item.situation === "stop" ? "중지" : "승인"}</td>
                    <td>{item.createTime && item.createTime.slice(0, 10)}</td>
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
