import { useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlNoticeList } from "../Services/string";

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
    servicesPostData(urlNoticeList, {
      rcid: cid,
    }).then((res) => {
      setNotice(res.data);
      // setListPage(res.page);
    });
  }, []);
  console.log(notice);
  return notice === undefined ? (
    <ComponentErrorNull />
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/company/${cid}/addnotice`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">사업자 공지사항 목록</h3>
        <div className="paddingBox commonBox">
          <ComponentListNotice notice={notice} url={urlNoticeList} />
        </div>
      </section>
    </>
  );
}
