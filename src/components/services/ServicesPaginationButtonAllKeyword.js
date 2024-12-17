// -- 사용 예시 ListCompany, ListUser --

// listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
// const [listPage, setListPage] = useState({});
// const [page, setPage] = useState({ getPage: 0, activePage: 1 });
//  <PaginationButton listPage={listPage} page={page} setPage={setPage}/>

import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Pagination from "react-js-pagination";

export default function ServicesPaginationButton({
  total,
  activePage,
  setActivePage,
}) {
  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <Pagination
      activePage={activePage}
      itemsCountPerPage={100}
      totalItemsCount={total}
      pageRangeDisplayed={10}
      firstPageText={<HiChevronDoubleLeft />}
      lastPageText={<HiChevronDoubleRight />}
      prevPageText={<HiChevronLeft />}
      nextPageText={<HiChevronRight />}
      onChange={handlePageChange}
    />
  );
}
