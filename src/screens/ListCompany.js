import { Link } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlCompanylist } from "../Services/string";

import PageButton from "../components/common/PiecePaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentListCompanySearch from "../components/common/ComponentListCompanySearch";

export default function ListCompany() {
  const [companyList, setCompanyList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useLayoutEffect(() => {
    servicesPostData(urlCompanylist, {
      offset: page.getPage,
      size: 15,
    }).then((res) => {
      setCompanyList(res.data);
      setListPage(res.page);
    });
  }, [page.getPage]);

  return (
    <>
      <ComponentListCompanySearch />
      <ul className="tableTopWrap">
        <LayoutTopButton url="/addcompany" text="사업자 추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "300px" }}>관리번호</th>
                <th style={{ width: "250px" }}>계약자</th>
                <th style={{ width: "300px" }}>계약일</th>
                <th style={{ width: "200px" }}>계약관리</th>
                {/* <th style={{ width: "200px" }}>상세정보</th> */}
                <th style={{ width: "auto" }}></th>
              </tr>
            </thead>
            <tbody>
              {companyList.map((item) => (
                <tr key={item.cid}>
                  <td>{item.cid}</td>
                  <td>{item.name}</td>
                  <td>{item.createTime && item.createTime.slice(0, 10)}</td>
                  <td>
                    {item.useFlag && item.name ? (
                      <i className="tableIcon">정상</i>
                    ) : null}
                  </td>
                  {/* <td>{item.updateTime ? <i>입력</i> : null}</td> */}
                  <td className="tableButton">
                    <Link to={`${item.cid}`} className="Link">
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
