import { Link } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import {
  urlCompanylist,
  urlSetCompany,
  urlSetCompanyDetail,
} from "../Services/string";

import PaginationButton from "../components/common/PiecePaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListCompanySearch from "../components/common/ComponentListCompanySearch";

function ListInTr({
  item,
  setClickedStatus,
  clickedStatus,
  setClickedUseFlag,
  clickedUseFlag,
}) {
  const [useFlagCk, setUseFlagCk] = useState(false);
  const [statusCk, setStatusCk] = useState(false);

  const checkedItemHandler = (name, id, isChecked) => {
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

  // 체크 이벤트 동작 & 상위 컴포넌트에게 전달하기 위한 이벤트 동작
  const checkHandler = ({ target }) => {
    // useFlag 이벤트
    if (target.id === "useFlag") {
      if (clickedStatus.length == 0) {
        setUseFlagCk(!useFlagCk);
        checkedItemHandler(target.name, target.id, target.checked);
      } else {
        alert("계약관리와 회원상태를 한 번에 수정하실 수 없습니다.");
      }
    }

    // status 이벤트
    if (target.id === "status") {
      if (clickedUseFlag.length == 0) {
        setStatusCk(!statusCk);
        checkedItemHandler(target.name, target.id, target.checked);
      } else {
        alert("계약관리와 회원상태를 한 번에 수정하실 수 없습니다.");
      }
    }
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          name={item.cid}
          checked={useFlagCk}
          id="useFlag"
          onChange={checkHandler}
        />
      </td>
      <td>
        <input
          type="checkbox"
          name={item.cid}
          checked={statusCk}
          id="status"
          onChange={checkHandler}
        />
      </td>

      <td>{item.cid}</td>
      <td>{item.name}</td>
      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
      <td className="tableButton">
        <Link to={`${item.cid}`} className="Link">
          상세
        </Link>
      </td>
    </tr>
  );
}

export default function ListCompany() {
  const [companyList, setCompanyList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });
  const [clickedUseFlag, setClickedUseFlag] = useState([]);
  const [clickedStatus, setClickedStatus] = useState([]);

  useLayoutEffect(() => {
    servicesPostData(urlCompanylist, {
      offset: page.getPage,
      size: 15,
    }).then((res) => {
      setCompanyList(res.data);
      setListPage(res.page);
    });
  }, [page.getPage]);

  console.log(clickedUseFlag, clickedStatus);

  // 계약관리 submit
  const handleUseFlag = (e) => {
    if (e.target.id === "useFlagY") {
      for (let i = 0; i < clickedUseFlag.length; i++) {
        servicesPostData(urlSetCompany, {
          cid: clickedUseFlag[i],
          useFlag: "1",
        }).then(window.location.reload());
      }
    } else {
      for (let i = 0; i < clickedUseFlag.length; i++) {
        servicesPostData(urlSetCompany, {
          cid: clickedUseFlag[i],
          useFlag: "0",
        }).then(window.location.reload());
      }
    }
  };

  // 회원상태 submit
  const handleStauts = (e) => {
    switch (e.target.id) {
      case "waiting":
        for (let i = 0; i < clickedStatus.length; i++) {
          servicesPostData(urlSetCompanyDetail, {
            rcid: clickedStatus[i],
            status: 2,
          }).then(window.location.reload());
        }
        break;
      case "completion":
        for (let i = 0; i < clickedStatus.length; i++) {
          servicesPostData(urlSetCompanyDetail, {
            rcid: clickedStatus[i],
            status: 1,
          }).then(window.location.reload());
        }
        break;
      default:
        for (let i = 0; i < clickedStatus.length; i++) {
          servicesPostData(urlSetCompanyDetail, {
            rcid: clickedStatus[i],
            status: 0,
          }).then(window.location.reload());
        }
        break;
    }
  };

  return (
    <>
      <ComponentListCompanySearch />
      <ul className="tableTopWrap">
        {clickedUseFlag.length > 0 && (
          <LayoutTopButton text="정상" fn={handleUseFlag} id="useFlagY" />
        )}
        {clickedUseFlag.length > 0 && (
          <LayoutTopButton text="해지" fn={handleUseFlag} id="useFlagN" />
        )}
        {clickedStatus.length > 0 && (
          <LayoutTopButton text="대기" fn={handleStauts} id="waiting" />
        )}
        {clickedStatus.length > 0 && (
          <LayoutTopButton text="완료" fn={handleStauts} id="completion" />
        )}
        {clickedStatus.length > 0 && (
          <LayoutTopButton text="거절" fn={handleStauts} id="refuse" />
        )}
        <LayoutTopButton url="/addcompany" text="사업자 추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "65px" }}>계약관리</th>
                <th style={{ width: "65px" }}>회원상태</th>
                <th style={{ width: "300px" }}>관리번호</th>
                <th style={{ width: "250px" }}>계약자</th>
                <th style={{ width: "300px" }}>계약일</th>
                {/* <th style={{ width: "200px" }}>상세정보</th> */}
                <th style={{ width: "auto" }}></th>
              </tr>
            </thead>
            <tbody>
              {companyList.map((item) => (
                <ListInTr
                  item={item}
                  key={item.cid}
                  setClickedStatus={setClickedStatus}
                  clickedStatus={clickedStatus}
                  setClickedUseFlag={setClickedUseFlag}
                  clickedUseFlag={clickedUseFlag}
                />
              ))}
            </tbody>
          </table>
          <PaginationButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
