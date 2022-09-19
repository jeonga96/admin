import { Link } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import { servicesPostData } from "../Services/importData";
import { urlCompanylist } from "../Services/string";
import PageButton from "../components/common/PaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function ListCompany() {
  const [companyList, setCompanyList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useLayoutEffect(() => {
    servicesPostData(urlCompanylist, {
      offset: page.getPage,
      size: 10,
    }).then((res) => {
      setCompanyList(res.data);
      setListPage(res.page);
    });
  }, [page.getPage]);

  return (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url="/addcompany" text="사업자 추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th className="widthM">회원번호</th>
                <th className="widthB">계약자명</th>
                <th className="widthM">생성시간</th>
                <th className="widthS">인증</th>
              </tr>
            </thead>
            <tbody className="revenueSaleTbody">
              {companyList.map((item) => (
                <tr key={item.cid}>
                  <td>{item.cid}</td>
                  <td>{item.name}</td>
                  <td>{item.createTime.slice(0, 10)}</td>
                  <td>
                    {item.useFlag ? (
                      <i>
                        <FaUserCheck />
                      </i>
                    ) : null}
                  </td>
                  <td className="tableButton">
                    <Link to={`${item.cid}`} className="buttonLink Link">
                      보기
                    </Link>
                  </td>
                  <td className="tableButton">
                    <Link
                      to={`${item.cid}/setcompanydetail`}
                      className="buttonLink Link"
                    >
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
