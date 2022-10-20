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
  }, [page.getPage]);

  return (
    <>
      <ComponentListUserSearch />
      <ul className="tableTopWrap">
        <LayoutTopButton url="/adduser" text="회원 추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th className="widthS">관리번호</th>
                <th className="widthM">아이디</th>
                <th className="widthS">이름</th>
                <th className="widthS">회원권한</th>
                <th className="widthM">핸드폰번호</th>
                <th className="widthS">계약일</th>
                <th className="widthS">상세정보</th>
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
                          <BsCheck2 />
                        </i>
                      ) : null}
                    </td>
                    <td className="tableButton">
                      <Link to={`${item.uid}`} className="Link">
                        상세
                      </Link>
                    </td>
                    <td className="tableButton">
                      <Link to={`${item.uid}/setUserdetail`} className="Link">
                        수정
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
