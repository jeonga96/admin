// import { Link, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState, useLayoutEffect } from "react";
import {
  servicesPostDataToken,
  servicesGetStorage,
} from "../Services/importData";
import { urlCompanylist, ISLOGIN } from "../Services/string";

import PageButton from "../components/common/PageButton";

function Company() {
  const [companyList, setCompanyList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 1, activePage: 1 });

  useLayoutEffect(() => {
    const token = servicesGetStorage(ISLOGIN);
    servicesPostDataToken(
      urlCompanylist,
      {
        offset: page.getPage,
        size: 10,
      },
      token
    ).then((res) => {
      setCompanyList(res.data);
      setListPage(res.page);
    });
  }, [page.getPage]);

  return (
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="smallButton">
          <Link className="smallButtonLink Link" to="/addcompany">
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
              {companyList.map((item, key) => (
                <tr key={item.cid}>
                  <td>
                    <Link to={`${item.cid}`}>{item.name}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
export default Company;
