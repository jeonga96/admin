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
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/company/${cid}/addnotice`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th className="widthM">회원번호</th>
                <th className="widthBB">내용</th>
                <th className="widthM">날짜</th>
              </tr>
            </thead>
            <tbody className="commonTable">
              {notice &&
                notice.map((item) => (
                  <tr key={item.comnid} style={{ height: "5.25rem" }}>
                    <td>{item.comnid}</td>
                    <td className="tableContentWrap">
                      <em>{item.title}</em>
                      <i>{item.imgs ? <MdOutlineImage /> : null}</i>
                      <p>
                        {item.content.length > 55
                          ? item.content.slice(0, 54) + "..."
                          : item.content}
                      </p>
                    </td>
                    <td>{item.createTime.slice(0, 10)}</td>
                    <td>
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
    </>
  );
}
