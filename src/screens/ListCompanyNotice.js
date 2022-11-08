import { useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlCompanyNoticeList } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentErrorNull from "../components/common/ComponentErrorNull";
import ComponentListNotice from "../components/common/ComponentListNotice";
// import PageButton from "../components/common/PageButton";

export default function ListCompanyNotice() {
  let { cid } = useParams();
  const [notice, setNotice] = useState([]);
  // const [listPage, setListPage] = useState({});
  // const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useLayoutEffect(() => {
    servicesPostData(urlCompanyNoticeList, {
      rcid: cid,
    }).then((res) => {
      setNotice(res.data);
      // setListPage(res.page);
    });
  }, []);

  return notice === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/company/${cid}/notice/set`} text="작성" />
      </ul>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/company/${cid}/notice/set`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">사업자 공지사항 목록</h3>
        <div className="paddingBox commonBox">
          <ComponentListNotice notice={notice} />
        </div>
      </section>
    </>
  );
}
