import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { servicesPostData } from "../Services/importData";
import { urlUserlist } from "../Services/string";

import PageButton from "../components/common/PiecePaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListUserSearch from "../components/common/ComponentListUserSearch";

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
    if (target.id === "useFlag") {
      if (clickedStatus.length == 0) {
        setUseFlagCk(!useFlagCk);
        checkedItemHandler(target.name, target.id, target.checked);
      } else {
        alert("계약관리와 회원상태를 한 번에 수정하실 수 없습니다.");
      }
    }
    if (target.id === "status") {
      if (clickedUseFlag.length == 0) {
        setStatusCk(!statusCk);
        checkedItemHandler(target.name, target.id, target.checked);
      }
    } else {
      alert("계약관리와 회원상태를 한 번에 수정하실 수 없습니다.");
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

export default function ListUser() {
  const [userList, setUserList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useEffect(() => {
    servicesPostData(urlUserlist, {
      offset: page.getPage,
      size: 15,
    }).then((res) => {
      setUserList(res.data);
      setListPage(res.page);
    });
  }, [page.activePage]);

  return (
    <>
      <ComponentListUserSearch
        setUserList={setUserList}
        setListPage={setListPage}
      />
      <ul className="tableTopWrap">
        <LayoutTopButton url="/adduser" text="회원 추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>관리번호</th>
                <th style={{ width: "250px" }}>아이디</th>
                <th style={{ width: "150px" }}>이름</th>
                <th style={{ width: "100px" }}>회원권한</th>
                <th style={{ width: "250px" }}>핸드폰번호</th>
                <th style={{ width: "100px" }}>계약일</th>
                <th style={{ width: "100px" }}>상세입력</th>
                <th style={{ width: "100px" }}>사업자</th>
                <th style={{ width: "auto" }}></th>
              </tr>
            </thead>
            <tbody>
              {userList &&
                userList.map((item) => (
                  <tr key={item.uid}>
                    <td>{item.uid}</td>
                    <td>{item.userid}</td>
                    <td>{item.name}</td>
                    <td>
                      {item.userrole && item.userrole.includes("ROLE_ADMIN")
                        ? "관리자"
                        : "일반"}
                    </td>
                    <td>{item.mobile}</td>
                    <td>{item.createTime && item.createTime.slice(0, 10)}</td>
                    <td>
                      {item.udid ? <i className="tableIcon">입력</i> : null}
                    </td>
                    <td>
                      {item.cid ? <i className="tableIcon">사업자</i> : null}
                    </td>
                    <td className="tableButton">
                      <Link to={`${item.uid}`} className="Link">
                        상세
                      </Link>
                    </td>
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
