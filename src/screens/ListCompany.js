import { Link } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { BsCheck2 } from "react-icons/bs";
import { servicesPostData } from "../Services/importData";
import { urlCompanylist } from "../Services/string";
import PageButton from "../components/common/PaginationButton";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ListCompanySearchComponent from "../components/common/ListCompanySearchComponent";

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
      <ListCompanySearchComponent />
      <ul className="tableTopWrap">
        <LayoutTopButton url="/addcompany" text="사업자 추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th className="widthM">관리번호</th>
                <th className="widthB">계약자</th>
                <th className="widthM">계약일</th>
                <th className="widthS">상세정보</th>
              </tr>
            </thead>
            <tbody>
              {companyList.map((item) => (
                <tr key={item.cid}>
                  <td>{item.cid}</td>
                  <td>{item.name}</td>
                  <td>{item.createTime.slice(0, 10)}</td>
                  <td>
                    {item.useFlag ? (
                      <i>
                        <BsCheck2 />
                      </i>
                    ) : null}
                  </td>
                  <td className="tableButton">
                    <Link to={`${item.cid}`} className="buttonLink Link">
                      상세
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
