import { useEffect } from "react";
import Pagination from "react-js-pagination";

function PageButton({ listPage, page, setPage }) {
  console.log(listPage);

  const totalPage =
    listPage.totalElements % 10 != 0
      ? listPage.totalPages + 1
      : listPage.totalPages;

  const handlePageChange = (page) => {
    setPage(page === 1 ? page : page * 10 - 9);
  };

  return (
    <div>
      <Pagination
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={listPage.totalElements}
        pageRangeDisplayed={totalPage}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={handlePageChange}
      />
    </div>
  );
}
export default PageButton;
