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

export default function ServicesPaginationButton({ listPage, page, setPage }) {
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
