import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { servicesPostData } from "../Services/importData";
import { urlUserlist, urlSetUser } from "../Services/string";

import PageButton from "../components/common/PiecePaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListUserSearch from "../components/common/ComponentListUserSearch";

function ListInTr({ item, setClickedUseFlag, clickedUseFlag }) {
  const [useFlagCk, setUseFlagCk] = useState(false);

  const checkedItemHandler = (name, isChecked) => {
    (() => {
      if (isChecked) {
        setClickedUseFlag([...clickedUseFlag, name]);
        // 동일한 선택을 할 때 중복 선택되지 않도록 설정
      } else if (!isChecked && clickedUseFlag.includes(name)) {
        setClickedUseFlag(clickedUseFlag.filter((it) => it !== name));
      }
    })();
  };
  // 체크 이벤트 동작 & 상위 컴포넌트에게 전달하기 위한 이벤트 동작
  const checkHandler = ({ target }) => {
    setUseFlagCk(!useFlagCk);
    checkedItemHandler(target.name, target.checked);
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          name={item.uid}
          checked={useFlagCk}
          id="useFlag"
          onChange={checkHandler}
        />
      </td>
      <td className="tableButton">
        <Link to={`${item.uid}`} className="Link">
          {item.uid}
        </Link>
      </td>
      <td className="tableButton">
        <Link to={`/company/${item.cid}`} className="Link">
          {item.cid}
        </Link>
      </td>
      <td>{item.userid}</td>
      <td>{item.name}</td>
      <td>
        {item.userrole && item.userrole.includes("ROLE_ADMIN")
          ? "관리자"
          : "일반"}
      </td>
      <td>{item.mobile}</td>
      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
      <td>{item.udid ? <i className="tableIcon">입력</i> : null}</td>
    </tr>
  );
}

export default function ListUser() {
  const [userList, setUserList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });
  const [clickedUseFlag, setClickedUseFlag] = useState([]);
  const [searchClick, setSearchClick] = useState(false);

  useEffect(() => {
    // searchClick을 클릭하지 않은 (false) 상태에서 동작
    searchClick === false &&
      servicesPostData(urlUserlist, {
        offset: page.getPage,
        size: 15,
      }).then((res) => {
        setUserList(res.data);
        setListPage(res.page);
      });
  }, [page.activePage]);

  // 계약관리 submit
  const handleUseFlag = (e) => {
    // useFlag 활성화(정상) 버튼 클릭 시 useFlag:1, 해지 버튼 클릭시 useFlag:0
    for (let i = 0; i < clickedUseFlag.length; i++) {
      servicesPostData(urlSetUser, {
        uid: clickedUseFlag[i],
        useFlag: e.target.id === "useFlagUse" ? "1" : "0",
      }).then(window.location.reload());
    }
  };

  return (
    <>
      <ComponentListUserSearch
        setUserList={setUserList}
        setListPage={setListPage}
        searchClick={searchClick}
        setSearchClick={setSearchClick}
        page={page}
      />
      <ul className="tableTopWrap">
        {clickedUseFlag.length > 0 && (
          <LayoutTopButton text="정상" fn={handleUseFlag} id="useFlagUse" />
        )}
        {clickedUseFlag.length > 0 && (
          <LayoutTopButton text="해지" fn={handleUseFlag} />
        )}
        <LayoutTopButton url="add" text="회원 추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "70px" }}> 계약관리</th>
                <th style={{ width: "140px" }}>관리번호</th>
                <th style={{ width: "140px" }}>사업자관리번호</th>
                <th style={{ width: "140px" }}>아이디</th>
                <th style={{ width: "140px" }}>이름</th>
                <th style={{ width: "100px" }}>회원권한</th>
                <th style={{ width: "auto" }}>핸드폰번호</th>
                <th style={{ width: "140px" }}>계약일</th>
                <th style={{ width: "70px" }}>상세입력</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {userList &&
                userList.map((item) => (
                  <ListInTr
                    item={item}
                    key={item.uid}
                    clickedUseFlag={clickedUseFlag}
                    setClickedUseFlag={setClickedUseFlag}
                  />
                ))}
            </tbody>
          </table>
          <PageButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
