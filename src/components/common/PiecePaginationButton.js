import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Pagination from "react-js-pagination";

export default function PageButton({ listPage, page, setPage }) {
  const pageDataGet = listPage.totalElements && page;
  const handlePageChange = (page) => {
    page === 1
      ? setPage({ getPage: page, activePage: page })
      : setPage({ getPage: page * 10 - 10, activePage: page });
  };
  if (pageDataGet)
    return (
      <div>
        {pageDataGet ? (
          <Pagination
            activePage={page.activePage}
            itemsCountPerPage={10}
            totalItemsCount={listPage.totalElements}
            pageRangeDisplayed={Math.ceil(listPage.totalElements / 10)}
            firstPageText={<HiChevronDoubleLeft />}
            lastPageText={<HiChevronDoubleRight />}
            prevPageText={<HiChevronLeft />}
            nextPageText={<HiChevronRight />}
            onChange={handlePageChange}
          />
        ) : (
          <span>페이지 버튼 로딩중</span>
        )}
      </div>
    );
}
