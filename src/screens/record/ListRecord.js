// 사업자 회원 관리 > 공사콕 견적서 리스트

import { Link } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentListRecord from "../../components/common/ComponentListRecord";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as RAN from "../../service/useData/rander";
import * as MO from "../../service/library/modal";

export default function ListAudio() {
  const { cid } = useParams();
  const [list, setList] = useState([]);

  return (
    <>
      <ComponentListRecord
        setList={setList}
        COMPANY={cid ? true : false}
        cid={cid}
      />
      <ul className="tableTopWrap">
        {cid && <LayoutTopButton url="add" text="녹취록 추가" />}
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
                  <th style={{ width: "5%" }}>관리번호</th>
                  <th style={{ width: "5%" }}>녹취종류</th>
                  <th style={{ width: "15%" }}>상호명</th>
                  <th style={{ width: "10%" }}>녹취자</th>
                  <th style={{ width: "35%" }}>녹취내용</th>
                  <th style={{ width: "auto" }} className="recordAfter">
                    녹취록 / 다운로드
                  </th>
                  <th style={{ width: "12%" }}>녹취일시</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 &&
                  list.map((item, key) => (
                    <tr key={key}>
                      <td className="tableButton">
                        <Link
                          to={`${item.fid}`}
                          className="Link"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          {item.fid}
                        </Link>
                      </td>

                      <td>{item.recordType}</td>
                      <td className="tableButton">
                        <Link
                          to={`/company/${item.cid}`}
                          className="Link"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          {item.cname}
                        </Link>
                      </td>
                      <td>{item.recordName}</td>
                      <td
                        style={{
                          height: "auto",
                          textOverflow: "initial",
                          whiteSpace: "pre-wrap",
                          padding: "8px 4px",
                          textAlign: "left",
                          lineHeight: "150%",
                        }}
                      >
                        {item.recordContents}
                      </td>
                      <td>
                        <div style={{ display: "flex", height: "auto" }}>
                          <audio controls src={item.storagePath}>
                            {item.fileName}
                          </audio>
                          {/* <a
                            href={item.storagePath}
                            download={item.fileName}
                            style={{ lineHeight: "0" }}
                          >
                            <button
                              type="button"
                              style={{
                                cursor: "pointer",
                                height: "22px",
                                padding: "0 10px",
                                marginTop: "none",
                                backgroundColor: "rgb(117, 117, 117)",
                                color: "#fff",
                                borderRadius: "2px",
                                display: "inline-block",
                              }}
                            >
                              다운로드
                            </button>
                          </a> */}
                        </div>
                      </td>
                      <td>{item.telRecordTime}</td>
                      <td>
                        <button
                          type="button"
                          style={{
                            backgroundColor: "#da3933",
                            color: "#fff",
                            width: "80%",
                            height: "26px",
                            marginLeft: "6px",
                          }}
                          onClick={() => {
                            // 삭제된 데이터는 복구할 수 없습니다. 현재 데이터를 삭제 하시겠습니까?
                            MO.servicesRecordModalRemoveCk(async () => {
                              const formData = new FormData();
                              formData.append("fid", item.fid);
                              formData.append("useFlag", "0");

                              await API.servicesPostDataForm(
                                APIURL.urlSetRecord,
                                formData
                              );

                              TOA.servicesUseToast("삭제되었습니다.", "s");
                              RAN.serviesAfter1secondReload();
                            });
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {list.length > 0 && <PageButton />}
          </div>
        </section>
      )}
    </>
  );
}
