import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Pagination from "react-js-pagination";
import { useRef, useEffect } from "react";

function PageButton({ listPage, page, setPage }) {
  const totalPage = useRef(
    listPage.totalElements % 10 != 0
      ? listPage.totalPages + 1
      : listPage.totalPages
  );

  const handlePageChange = (page) => {
    setPage(page === 1 ? page : page * 10 - 9);
    console.log("page", page);
  };

  return (
    <div>
      <Pagination
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={listPage.totalElements}
        pageRangeDisplayed={totalPage.current}
        firstPageText={<HiChevronDoubleLeft />}
        lastPageText={<HiChevronDoubleRight />}
        prevPageText={<HiChevronLeft />}
        nextPageText={<HiChevronRight />}
        onChange={handlePageChange}
        // hideFirstLastPages={true}
      />
    </div>
  );
}
export default PageButton;
