// 사업자 회원 관리 > 공사콕 견적서 리스트

import { Link } from "react-router-dom";
import { useState } from "react";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentListEstmateinfoSearch from "../../components/common/ComponentListEstmateinfoSearch";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListPropsosalinfo() {
  const [list, setList] = useState([]);

  return (
    <>
      <ComponentListEstmateinfoSearch setList={setList} LISTPROPSOSLINFO />
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
                  <th style={{ width: "7%" }}>견적서</th>
                  <th style={{ width: "7%" }}>견적의뢰서</th>
                  <th style={{ width: "7%" }}>작성자</th>
                  <th style={{ width: "7%" }}>수령자</th>
                  <th style={{ width: "auto" }}>공사명</th>
                  <th style={{ width: "18%" }}>업체명</th>
                  <th style={{ width: "10%" }}>대표자</th>
                  <th style={{ width: "12%" }}>연락처</th>
                  <th style={{ width: "17%" }}>공사타입</th>
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
                              /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                            .replace("--", "-")}
                      </td>
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
