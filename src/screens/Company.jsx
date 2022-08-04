// import { Link, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosPostToken, getStorage } from "../Services/importData";
import { urlCompanylist, ISLOGIN } from "../Services/string";

function Company() {
  const [companyList, setCompanyList] = useState([]);
  const [listPage, setListPage] = useState({});

  useEffect(() => {
    const token = getStorage(ISLOGIN);
    axiosPostToken(
      urlCompanylist,
      {
        offset: 1,
        size: 10,
      },
      token
    ).then((res) => {
      setCompanyList(res.data);
      setListPage(res.page);
    });
  }, []);

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
                {/* <th>cid</th> */}
                <th>name</th>
              </tr>
            </thead>
            <tbody className="revenueSaleTbody">
              {companyList.map((item) => (
                <tr key={item.cid}>
                  {/* <td>{item.cid}</td> */}
                  <td>
                    <Link to={`/company/${item.cid}`}>{item.name}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            {/* {buttonArr.map((item, key) => (
              <li key={key}>
                <button type="button">{item}</button>
                <span className="blind">{item}페이지로 가기</span>
              </li>
            ))} */}
          </ul>
        </div>
      </section>
      {/* <Outlet /> */}
    </div>
  );
}
export default Company;
