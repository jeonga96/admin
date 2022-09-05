import { Link, useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlNoticeList } from "../Services/string";
// import PageButton from "../components/common/PageButton";

function CompanyNotice() {
  let { cid } = useParams();
  const [notice, setNotice] = useState([]);
  // const [listPage, setListPage] = useState({});
  // const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useLayoutEffect(() => {
    servicesPostData(urlNoticeList, {
      rcid: cid,
    }).then((res) => {
      setNotice(res.data);
      // setListPage(res.page);
    });
  }, []);

  return (
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="smallButton">
          <Link className="buttonLink Link" to={`/company/${cid}/addnotice`}>
            작성
          </Link>
        </div>
      </div>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th>제목</th>
              </tr>
            </thead>
            <tbody className="revenueSaleTbody">
              {/* {companyList.map((item) => (
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
              ))} */}
            </tbody>
          </table>
          {/* <PageButton listPage={listPage} page={page} setPage={setPage} /> */}
        </div>
      </section>
    </div>
  );
}
export default CompanyNotice;
