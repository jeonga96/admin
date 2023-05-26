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
    page.getPage === 1
      ? setPage({ getPage: page, activePage: page })
      : setPage({
          getPage: page * 15 - 15,
          activePage: page,
        });
  };

  if (pageDataGet)
    return (
      <div>
        {pageDataGet ? (
          <Pagination
            activePage={page.activePage}
            itemsCountPerPage={15}
            totalItemsCount={listPage.totalElements}
            pageRangeDisplayed={Math.ceil(listPage.totalElements / 15)}
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
