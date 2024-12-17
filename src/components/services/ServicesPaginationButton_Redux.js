import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import * as PAGE from "../../action/page";

export default function ServicesPaginationButton({ listPage, page, setPage }) {
  const dispatch = useDispatch();

  const pageData = useSelector((state) => state.page.pageData, shallowEqual);
  const listPageData = useSelector(
    (state) => state.page.listPageData,
    shallowEqual
  );

  const pageDataGet =
    !!listPageData && !!listPageData.totalElements && !!pageData;

  const handlePageChange = (page) => {
    page.getPage === 1
      ? dispatch(PAGE.setPage({ getPage: page, activePage: page }))
      : dispatch(
          PAGE.setPage({
            getPage: page * 15 - 15,
            activePage: page,
          })
        );
  };

  if (pageDataGet)
    return pageDataGet ? (
      <Pagination
        activePage={pageData.activePage}
        itemsCountPerPage={15}
        totalItemsCount={listPageData.totalElements}
        pageRangeDisplayed={10}
        firstPageText={<HiChevronDoubleLeft />}
        lastPageText={<HiChevronDoubleRight />}
        prevPageText={<HiChevronLeft />}
        nextPageText={<HiChevronRight />}
        onChange={handlePageChange}
      />
    ) : (
      <span>페이지 버튼 로딩중</span>
    );
}
