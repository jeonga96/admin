// 사업자 회원 관리 > 사업자 상세정보 리스트

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as RAN from "../../service/useData/rander";

import PaginationButton from "../../components/services/ServicesPaginationButton_Redux";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentListCompanySearch from "../../components/common/ComponentListCompanySearch";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

import {
  ListStatus,
  ManualView,
} from "../../components/common/ComponentStatusManualView";
import {
  ListCustomerType,
  CustomerTypeview,
} from "../../components/common/ComponentCustomerTypeManualView";

// 하위 컴포넌트, useState를 별도로 관리하기 위해 하위 컴포넌트로 분리
function ChildList({
  item,
  setClickedStatus,
  clickedStatus,
  setClickedUseFlag,
  clickedUseFlag,
}) {
  // 체크박스 상태 ------------------------------------------------------------------------
  // useFlagCk:계약관리  statusCk:상태관리
  const [useFlagCk, setUseFlagCk] = useState(false);
  // const [statusCk, setStatusCk] = useState(false);

  // id를 확인하여 상태관리와 계약관리를 구분한 후 cid값 저장
  const addCheck = (name, id, isChecked) => {
    (() => {
      if (isChecked) {
        id === "useFlag"
          ? setClickedUseFlag([...clickedUseFlag, name])
          : setClickedStatus([...clickedStatus, name]);
        // 동일한 선택을 할 때 중복 선택되지 않도록 설정
      } else if (!isChecked && clickedUseFlag.includes(name)) {
        setClickedUseFlag(clickedUseFlag.filter((it) => it !== name));
      } else if (!isChecked && clickedStatus.includes(name)) {
        setClickedStatus(clickedStatus.filter((it) => it !== name));
      }
    })();
  };

  useEffect(() => {
    if (!!item.sruid) {
      API.servicesPostData(APIURL.urlGetUserCid, { uid: item.sruid })
        .then((CID) => {
          if (CID.status !== "fail") {
            return API.servicesPostData(APIURL.urlGetCompanyDetail, {
              rcid: CID.data.cid,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
    }
  }, [item.sruid]);

  // 체크 이벤트 동작 & 상위 컴포넌트에게 전달하기 위한 이벤트 동작
  const handleCheck = ({ target }) => {
    // useFlag 이벤트
    if (target.id === "useFlag") {
      // if (clickedStatus.length == 0) { =========
      const CID = target.name;
      // 해당 cid에 안심번호가 입력되어 있다면 안심번호 useFlag에 적용되지 않도록 조건 설정
      if (!item.extnum) {
        // cid 추가, 삭제 이벤트
        setUseFlagCk(!useFlagCk);
        addCheck(CID, target.id, target.checked);
      } else {
        TOA.servicesUseToast("안심번호 삭제를 먼저 진행해 주세요.", "e");
      }
      // 체크박스 상태관리
      // } else {
      //   TOA.servicesUseToast(
      //     "계약관리와 회원상태를 한 번에 수정하실 수 없습니다.",
      //     "e"
      //   );
      // }
    }

    // // status 이벤트
    // if (target.id === "status") {
    //   if (clickedUseFlag.length == 0) {
    //     // 체크박스 상태관리
    //     setStatusCk(!statusCk);
    //     // cid 추가, 삭제 이벤트
    //     addCheck(target.name, target.id, target.checked);
    //   } else {
    //     TOA.servicesUseToast(
    //       "계약관리와 회원상태를 한 번에 수정하실 수 없습니다."
    //     );
    //   }
    // }
  };

  // const fnSruid = () => {
  //   if (!!item.sruid) {
  //     API.servicesPostData(APIURL.urlGetUserCid, { uid: item.sruid })
  //       .then((CID) => {
  //         // console.log("2090 :", item.sruid, CID.data.cid);
  //         API.servicesPostData(APIURL.urlGetCompanyDetail, {
  //           rcid: CID.data.cid,
  //         })
  //           .then((res) => {
  //             // console.log("성공", res.data);
  //             // setValue("_teamTel", res.data.mobilenum || "");
  //             // setValue("_team", res.data.regName || "");
  //             // setValue("_tel", res.data.telnum || "");
  //             // setValue("_name", res.data.regOwner || "");
  //             return res.data.regOwner;
  //           })
  //           .catch((res) => {
  //             console.log("APIURL.urlGetCompanyDetail", res);
  //           });
  //       }) //urlGetUserCid
  //       .catch((res) => {
  //         // TOA.servicesUseToast("얍얍", res);
  //         console.log("APIURL.urlGetUserCid", res);
  //       });
  //   }
  // };

  const isSafeNumber = (num) => {
    if (
      num?.startsWith("050") ||
      num?.startsWith("080") ||
      num?.startsWith("15") ||
      num?.startsWith("16") ||
      num?.startsWith("18") ||
      num?.startsWith("02-15") ||
      num?.startsWith("02-16") ||
      num?.startsWith("02-18")
    ) {
      return true;
    }
    return false; // 추가: 안전하지 않은 번호에 대해 false를 반환합니다.
  };

  const reqCalled = (mobilenum, telnum) => {
    // 두 번호가 모두 안심번호로 시작하면 빈 값을 반환합니다.
    if (isSafeNumber(mobilenum) && isSafeNumber(telnum)) {
      return "";
    }

    // 핸드폰 번호가 있고 안심번호로 시작하지 않으면 핸드폰 번호를 반환합니다.
    if (mobilenum && !isSafeNumber(mobilenum)) {
      return mobilenum;
    }

    // 그 외의 경우에는 telnum을 반환합니다.
    if (telnum && !isSafeNumber(telnum)) {
      return telnum;
    }

    // 모든 경우가 해당되지 않으면 빈 값을 반환합니다.
    return "";
  };

  return (
    <>
      <tr>
        <td>
          <input
            type="checkbox"
            name={item.cid}
            checked={useFlagCk}
            id="useFlag"
            onChange={handleCheck}
          />
        </td>
        {/* <td>
        <input
          type="checkbox"
          name={item.cid}
          checked={statusCk}
          id="status"
          onChange={handleCheck}
        />
      </td> */}
        <td className="tableButton">
          <Link to={`${item.cid}`} className="Link">
            {item.cid}
          </Link>
        </td>
        <td>{ListStatus(item.status)}</td>
        <td>{item.srname}</td>

        <td style={{ position: "relative" }}>
          <ListCustomerType value={item.customerType} />
          {item.cdname}
        </td>

        <td>{item.name}</td>

        <td>{reqCalled(item.mobilenum, item.telnum)}</td>
        {/* <td>{item.telnum}</td>
      <td>{item.mobilenum}</td> */}
        {APIURL.urlPrefix === "https://releaseawsback.gongsacok.com" && (
          <td className="tableButton">
            {!!item.extnum ? (
              <Link
                to={`${item.cid}/safenumber/${item.extnum.replaceAll("-", "")}`}
                className="Link"
              >
                {item.extnum}
              </Link>
            ) : (
              item.extnum
            )}
          </td>
        )}

        <td>{item.createTime && item.createTime.slice(0, 10)}</td>
        {/* <td>{item.taxBillStatus}</td> */}
      </tr>
    </>
  );
}

// ====================================================================================
// 부모
// ====================================================================================
export default function ListCompany() {
  // 목록 데이터
  const [companyList, setCompanyList] = useState([]);
  const [manualview, setManualview] = useState(false);
  const [customerTypeview, setCustomerTypeview] = useState(false);

  // [체크 박스 - 계약관리,회원상태]
  const [clickedUseFlag, setClickedUseFlag] = useState([]);

  // 상태관리
  // 현재는 status를 사업자와 연결 여부로 사용하고 있어 해당 기능(다중선택)필요없어짐 -> 주석처리
  // const [clickedStatus, setClickedStatus] = useState([]);

  // 계약관리 submit
  const handleUseFlagSubmit = (e) => {
    const USEFLAG = e.target.id === "useFlagY" ? "1" : "0";

    const requests = clickedUseFlag.map((cid) =>
      API.servicesPostData(APIURL.urlSetCompanyDetail, {
        rcid: cid,
        useFlag: USEFLAG,
        // 비활성화 시 공사콕 해지로 변경하게 됨
        // customerType: USEFLAG ==="0"?"콕해":""
      }).then((res) => {
        if (res.status === "success") {
          return API.servicesPostData(APIURL.urlSetCompany, {
            cid: cid,
            useFlag: USEFLAG,
          });
        }
      })
    );

    Promise.all(requests)
      .then((responses) => {
        console.log("3", responses);

        const allSuccess = responses.every((res) => res.status === "success");
        if (allSuccess) {
          TOA.servicesUseToast("작업이 완료되었습니다.", "s");
          RAN.serviesAfter1secondReload();
        } else {
          TOA.servicesUseToast(
            "작업이 실패했습니다. 관리자에게 문의해주세요",
            "e"
          );
        }
      })
      .catch((error) => {
        TOA.servicesUseToast(
          "작업이 실패했습니다. 관리자에게 문의해주세요",
          "e"
        );
        console.error("Error during API requests", error);
      });
  };

  return (
    <>
      <ComponentListCompanySearch setCompanyList={setCompanyList} />

      {(companyList == [] && companyList.length == 0) ||
      companyList === undefined ? (
        <>
          <ul className="tableTopWrap">
            <LayoutTopButton url={`add`} text="작성" />
          </ul>
          <ComponentErrorNull />
        </>
      ) : (
        <>
          <ul className="tableTopWrap">
            {clickedUseFlag.length > 0 && (
              <LayoutTopButton text="비활성화" fn={handleUseFlagSubmit} />
            )}
            {clickedUseFlag.length > 0 && (
              <LayoutTopButton
                text="활성화"
                fn={handleUseFlagSubmit}
                id="useFlagY"
              />
            )}

            {/* {clickedStatus.length > 0 && (
              <LayoutTopButton
                text="대기"
                fn={handleStautsSubmit}
                id="waiting"
              />
            )}
            {clickedStatus.length > 0 && (
              <LayoutTopButton
                text="완료"
                fn={handleStautsSubmit}
                id="completion"
              />
            )}
            {clickedStatus.length > 0 && (
              <LayoutTopButton
                text="거절"
                fn={handleStautsSubmit}
                id="refuse"
              />
            )} */}
            {/* <LayoutTopButton
              fn={() => setManualview(!manualview)}
              text="  사용 매뉴얼 보기"
            /> */}
            {/* {clickedStatus.length === 0 && clickedUseFlag.length === 0 && ( */}
            {clickedUseFlag.length === 0 && (
              <LayoutTopButton url="add" text="사업자 추가" />
            )}
          </ul>

          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <div className="commonBox">
              <table className="commonTable">
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>활성화 계정</th>
                    <th style={{ width: "80px" }}>관리 번호</th>
                    <th style={{ width: "100px" }} className="tipTh">
                      <span>회원연결</span>
                      <i
                        onClick={() => setManualview(!manualview)}
                        style={{ marginTop: "0px" }}
                      >
                        !
                      </i>
                    </th>
                    <th style={{ width: "110px" }}>영업 담당자</th>
                    <th
                      style={{ width: "auto", position: "relative" }}
                      className="tipTh"
                    >
                      <i
                        style={{
                          position: "absolute",
                          left: "13px",
                          top: "8px",
                        }}
                        onClick={() => setCustomerTypeview(!customerTypeview)}
                      >
                        !
                      </i>
                      상호명
                    </th>
                    <th style={{ width: "110px" }}>계약자</th>
                    <th style={{ width: "140px" }}>필수 착신번호</th>

                    {APIURL.urlPrefix ===
                      "https://releaseawsback.gongsacok.com" && (
                      <th style={{ width: "140px" }}>안심번호</th>
                    )}
                    <th style={{ width: "110px " }}>계약일</th>
                  </tr>
                </thead>
                <tbody>
                  {companyList.map((item) => {
                    return (
                      <ChildList
                        item={item}
                        key={item.cid}
                        // setClickedStatus={setClickedStatus}
                        // clickedStatus={clickedStatus}
                        setClickedUseFlag={setClickedUseFlag}
                        clickedUseFlag={clickedUseFlag}
                      />
                    );
                  })}
                </tbody>
              </table>
              <PaginationButton />
            </div>
          </section>

          {manualview && <ManualView list={true} />}
          {customerTypeview && <CustomerTypeview list={true} />}
        </>
      )}
    </>
  );
}
