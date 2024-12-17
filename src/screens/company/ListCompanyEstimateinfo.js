import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Link, useParams, useLocation } from "react-router-dom";
import { useRef, useState } from "react";

import * as CUS from "../../service/customHook";
import * as API from "../../service/api";
import * as CH from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";

import * as PAGE from "../../action/page";

import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function DetailComapnyEsimateinfo() {
  const { rcid } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // [데이터 요청]
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);
  const [list, setList] = useState([]);
  // cid에 연결된 ruid 저장
  const RUID = useRef("");

  // 첫 렌더링
  CUS.useCleanupEffect(() => {
    // uid가져오기
    API.servicesPostData(APIURL.urlGetCompany, { cid: rcid })
      .then((res) => {
        RUID.current = res.data.ruid;
      })
      // 가져온 uid로 견적 요청서 가져오기
      .then(() => {
        // url에 맞춰 수령 기준, 요청 기준으로 견적 요청서를 가져온다
        // (url에 from이 들어가면 formUid로 검색 )
        API.servicesPostData(
          APIURL.urlListEstimateInfo,
          location.pathname.includes("from")
            ? {
                fromUid: RUID.current,
                offset: pageData.getPage,
                size: 15,
              }
            : {
                toUid: RUID.current,
                offset: pageData.getPage,
                size: 15,
              }
        )
          .then((res) => {
            // console.log("// 가져온 uid로 견적 요청서 가져오기", res);
            setList(res.data);
            dispatch(PAGE.setListPage(res.page));
          })
          .catch(setList([]));
      });
  }, []);

  // 페이지 이동시마다 발생
  // 두번째 렌더링부터 이벤트 발생
  CH.useDidMountEffect(() => {
    API.servicesPostData(
      APIURL.urlListEstimateInfo,
      location.pathname.includes("from")
        ? {
            fromUid: RUID.current,
            offset: pageData.getPage,
            size: 15,
          }
        : {
            toUid: RUID.current,
            offset: pageData.getPage,
            size: 15,
          }
    )
      .then((res) => {
        setList(res.data);
        dispatch(PAGE.setListPage(res.page));
      })
      .catch(setList([]));
  }, [pageData.getPage]);

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
                  <th style={{ width: "150px" }}>관리번호</th>
                  <th style={{ width: "150px" }}>견적 요청</th>
                  <th style={{ width: "150px" }}>견적 수령</th>
                  <th style={{ width: "150px" }}>방문날짜</th>
                  <th style={{ width: "120px" }}>공사타입</th>
                  <th style={{ width: "100px" }}>견적서</th>
                  <th style={{ width: "100px" }}>세금계산서</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, key) => (
                  <tr
                    key={key}
                    className={item.useFlag == 0 ? "propsosalFlageN" : null}
                  >
                    <td className="tableButton">
                      <Link to={`/estimateinfo/${item.esid}`} className="Link">
                        {item.esid}
                      </Link>
                    </td>
                    <td>{item.fromUid}</td>
                    <td>{item.toUid}</td>
                    <td>{item.reqVisit && item.reqVisit.slice(0, 10)}</td>
                    <td>
                      {item.gongsaType && item.gongsaType.includes("emer") && (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "red" }}
                        >
                          긴급
                        </i>
                      )}
                      {item.gongsaType && item.gongsaType.includes("inday") && (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "orange" }}
                        >
                          당일
                        </i>
                      )}
                      {item.gongsaType && item.gongsaType.includes("reser") && (
                        <i
                          className="tableIcon"
                          style={{ backgroundColor: "green" }}
                        >
                          예약
                        </i>
                      )}
                    </td>
                    <td>
                      {item.reqEstimate == "1" && (
                        <i className="tableIcon">요청</i>
                      )}
                    </td>
                    <td>
                      {item.reqBill == "1" && <i className="tableIcon">요청</i>}
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
