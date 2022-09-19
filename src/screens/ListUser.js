import { Link } from "react-router-dom";
import { FaUserEdit, FaUserCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { servicesPostData } from "../Services/importData";
import { urlUserlist } from "../Services/string";

import PageButton from "../components/common/PaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function ListUser() {
  const [userList, setUserList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useEffect(() => {
    servicesPostData(urlUserlist, {
      offset: page.getPage,
      size: 10,
    }).then((res) => {
      setUserList(res.data);
      setListPage(res.page);
    });
  }, [page.getPage]);

  return (
    <>
      <div className="tableTopWrap">
        <ul className="tableTopWrap">
          <LayoutTopButton url="/adduser" text="회원 추가" />
        </ul>
      </div>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th className="widthS">회원번호</th>
                <th className="widthB">아이디</th>
                <th className="widthM">회원 권한</th>
                <th className="widthM">생성시간</th>
                <th className="widthS">상세정보</th>
                <th className="widthS">인증</th>
              </tr>
            </thead>
            <tbody className="revenueSaleTbody">
              {userList.map((item) => (
                <tr key={item.uid}>
                  <td>{item.uid}</td>
                  <td>{item.userid}</td>
                  <td>
                    {item.userrole.includes("ROLE_ADMIN")
                      ? "관리자"
                      : item.userrole.includes("ROLE_COMPANY")
                      ? "사업자"
                      : "일반"}
                  </td>
                  <td>{item.createTime.slice(0, 10)}</td>
                  <td>
                    {item.name ? (
                      <i>
                        <FaUserEdit />
                      </i>
                    ) : null}
                  </td>
                  <td>
                    {item.useFlag ? (
                      <i>
                        <FaUserCheck />
                      </i>
                    ) : null}
                  </td>
                  <td className="tableButton">
                    <Link to={`${item.uid}`} className="buttonLink Link">
                      보기
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
