import { Link } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import {
  // servicesPostDataToken,
  servicesPostData,
} from "../Services/importData";
import { urlCompanylist } from "../Services/string";
import PageButton from "../components/common/PageButton";

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
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="smallButton">
          <Link className="buttonLink Link" to="/addcompany">
            사업자 추가
          </Link>
        </div>
      </div>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th>name</th>
              </tr>
            </thead>
            <tbody className="revenueSaleTbody">
              {companyList.map((item) => (
                <tr key={item.cid}>
                  <td>{item.name}</td>
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
    </div>
  );
}
