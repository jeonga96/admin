import { Link, useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlNoticeList } from "../Services/string";
import { MdOutlineImage } from "react-icons/md";

import LayoutTopButton from "../components/common/LayoutTopButton";
// import PageButton from "../components/common/PageButton";

export default function ListCompanyNotice() {
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
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/company/${cid}/addnotice`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th>번호</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody className="contentTbody">
              {notice &&
                notice.map((item) => (
                  <tr key={item.comnid}>
                    <td>{item.comnid}</td>
                    <td>
                      <div className="titleWrap">
                        <div>
                          <span>{item.title}</span>
                          <i>{item.imgs ? <MdOutlineImage /> : null}</i>
                        </div>
                        <span>{item.createTime.slice(0, 10)}</span>
                      </div>
                      <span className="content">
                        {item.content.length > 100
                          ? item.content.slice(0, 99) + "..."
                          : item.content}
                      </span>
                      <div className="tableButton">
                        <Link
                          to={`/company/${item.rcid}/${item.comnid}`}
                          className="buttonLink Link"
                        >
                          보기
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* <PageButton listPage={listPage} page={page} setPage={setPage} /> */}
        </div>
      </section>
    </div>
  );
}
