// 사업자 회원 관리 > 공사콕 견적의뢰서 리스트

import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import * as CUS from "../../service/customHook";
import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";

import * as PAGE from "../../action/page";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentListEstmateinfoSearch from "../../components/common/ComponentListEstmateinfoSearch";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListEstimateinfo() {
  // 데이터 ------------------------------------------------------------------------
  // 견적요청서 목록
  const [list, setList] = useState([]);

  // 검색 버튼 클릭 유무

  return (
    <>
      <ComponentListEstmateinfoSearch setList={setList} />
      <ul className="tableTopWrap">
        <LayoutTopButton url="add" text="견적의뢰서 추가" />
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
                  <th style={{ width: "60px" }}>관리번호</th>
                  <th style={{ width: "60px" }}>작성자</th>
                  <th style={{ width: "60px" }}>수령자</th>
                  <th style={{ width: "150px" }}>방문 일정</th>
                  <th style={{ width: "200px" }}>공사 유형</th>
                  <th style={{ width: "80px" }}>추가 상세견적서</th>
                  <th style={{ width: "80px" }}>세금계산서</th>
                  <th style={{ width: "100px" }}>작성일자</th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 &&
                  list.map((item, key) => (
                    <tr
                      key={key}
                      className={item.useFlag == 0 ? "propsosalFlageN" : null}
                    >
                      <td className="tableButton">
                        <Link to={`${item.esid}`} className="Link">
                          {item.esid}
                        </Link>
                      </td>
                      <td>{item.fromUid}</td>
                      <td>{item.toUid}</td>
                      <td>{item.reqVisit && item.reqVisit.slice(0, 10)}</td>

                      <td>
                        {item.gongsaType?.includes("emer") && (
                          <i
                            className="tableIcon"
                            style={{ backgroundColor: "red" }}
                          >
                            긴급
                          </i>
                        )}

                        {item.gongsaType?.includes("inday") && (
                          <i
                            className="tableIcon"
                            style={{ backgroundColor: "orange" }}
                          >
                            당일
                          </i>
                        )}

                        {item.gongsaType?.includes("reser") && (
                          <i
                            className="tableIcon"
                            style={{ backgroundColor: "green" }}
                          >
                            예약
                          </i>
                        )}

                        {!item.gongsaType && (
                          <i
                            className="tableIcon"
                            style={{ backgroundColor: "var(--color-bgblack)" }}
                          >
                            일반
                          </i>
                        )}
                      </td>
                      <td>
                        {item.reqEstimate == "1" && (
                          <i className="tableIcon">요청</i>
                        )}
                      </td>
                      <td>
                        {item.reqBill == "1" && (
                          <i className="tableIcon">요청</i>
                        )}
                      </td>
                      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <PageButton />
          </div>
        </section>
      )}
    </>
  );
}
