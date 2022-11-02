import { Link } from "react-router-dom";
import { BsCheck2 } from "react-icons/bs";
import { useEffect, useState } from "react";
import { servicesPostData } from "../Services/importData";
import { urlUserlist } from "../Services/string";

import PageButton from "../components/common/PiecePaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListUserSearch from "../components/common/ComponentListUserSearch";

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
                <th style={{ width: "200px" }}>관리번호</th>
                <th style={{ width: "200px" }}>아이디</th>
                <th style={{ width: "150px" }}>이름</th>
                <th style={{ width: "100px" }}>회원권한</th>
                <th style={{ width: "200px" }}>핸드폰번호</th>
                <th style={{ width: "200px" }}>계약일</th>
                <th style={{ width: "100px" }}>상세정보</th>
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
                      {item.useFlag ? (
                        <i>
                          {/* <BsCheck2 /> */}
                          입력
                        </i>
                      ) : null}
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
