import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlContentList } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ErrorNullBox from "../components/common/ErrorNullBox";
import ListNoticeComponent from "../components/common/ListNoticeComponent";
import PaginationButton from "../components/common/PaginationButton";

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
    <ErrorNullBox />
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/admin/addnotice`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">공사콕 공지사항 목록</h3>
        <div className="paddingBox commonBox">
          <ListNoticeComponent notice={notice} ISADMIN />
          <PaginationButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
