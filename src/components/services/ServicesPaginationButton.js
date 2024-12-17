// -- 사용 예시 ListCompany, ListUser --

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
  itemCount,
  listPage,
  page,
  setPage,
}) {
  const pageDataGet = !!listPage && !!listPage.totalElements && !!page;
  const handlePageChange = (page) => {
    page.getPage === 1
      ? setPage({ getPage: page, activePage: page })
      : setPage({
          getPage: page * itemCount - itemCount,
          activePage: page,
        });
  };

  if (pageDataGet)
    return pageDataGet ? (
      <Pagination
        activePage={page.activePage}
        itemsCountPerPage={itemCount}
        totalItemsCount={listPage.totalElements}
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
