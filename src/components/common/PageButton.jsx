import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Pagination from "react-js-pagination";
import { useRef } from "react";

function PageButton({ listPage, page, setPage }) {
  const pageDataGet = listPage.totalElements && page;

  const totalPage = useRef(
    listPage.totalElements % 10 !== 0
      ? listPage.totalPages + 1
      : listPage.totalPages
  );
  const handlePageChange = (page) => {
    page === 1
      ? setPage({ getPage: page, activePage: page })
      : setPage({ getPage: page * 10 - 9, activePage: page });
  };
  return (
    <div>
      {pageDataGet && (
        <Pagination
          activePage={page.activePage}
          itemsCountPerPage={10}
          totalItemsCount={listPage.totalElements}
          pageRangeDisplayed={totalPage.current}
          firstPageText={<HiChevronDoubleLeft />}
          lastPageText={<HiChevronDoubleRight />}
          prevPageText={<HiChevronLeft />}
          nextPageText={<HiChevronRight />}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}
export default PageButton;
