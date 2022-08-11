// import { Link, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosPostToken, getStorage } from "../Services/importData";
import { urlCompanylist, ISLOGIN } from "../Services/string";

import PageButton from "../components/common/PageButton";

function Company() {
  const [companyList, setCompanyList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = getStorage(ISLOGIN);
    axiosPostToken(
      urlCompanylist,
      {
        offset: page,
        size: 10,
      },
      token
    ).then((res) => {
      setCompanyList(res.data);
      setListPage(res.page);
    });
  }, [page]);

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
          <PageButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </div>
  );
}
export default Company;
