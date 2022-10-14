import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlContentList } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentErrorNull from "../components/common/ComponentErrorNull";
import ComponentListNotice from "../components/common/ComponentListNotice";
import PaginationButton from "../components/common/PiecePaginationButton";

export default function ListAdminNotice() {
  const [notice, setNotice] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  useLayoutEffect(() => {
    servicesPostData(urlContentList, {
      category: "notice",
      offset: 0,
      size: 10,
    }).then((res) => {
      setNotice(res.data);
      setListPage(res.page);
    });
  }, []);
  console.log(notice);
  return notice === undefined ? (
    <ComponentErrorNull />
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/admin/addnotice`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">공사콕 공지사항 목록</h3>
        <div className="paddingBox commonBox">
          <ComponentListNotice notice={notice} ISADMIN />
          <PaginationButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
