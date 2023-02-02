import { useForm } from "react-hook-form";
import { useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlContentList } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentErrorNull from "../components/common/ComponentErrorNull";
import ComponentListNotice from "../components/common/ComponentListNotice";

import PaginationButton from "../components/common/PiecePaginationButton";

export default function ListEvent() {
  const { register, watch } = useForm();

  // 데이터 ------------------------------------------------------------------------
  // 목록 데이터
  const [wzEvent, setWzEvent] = useState([]);

  // pagination 버튼 관련 ------------------------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // 카테고리 확인하여 데이터 요청
  useLayoutEffect(() => {
    servicesPostData(urlContentList, {
      category: watch("_category") || "wzEvent",
      offset: 0,
      size: 15,
    }).then((res) => {
      console.log(res.data);
      // setWzEvent(res.data.reverse());
      setWzEvent(res.data);
      setListPage(res.page);
    });
  }, [watch("_category") || page.getPage]);

  return wzEvent === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`set`} text="작성" />
      </ul>

      <section className="tableWrap">
        <h3 className="blind">공사콕 이벤트 목록</h3>
        <div className="paddingBox commonBox">
          <div className="filterWrap">
            <select {...register("_category")}>
              <option value="wzEvent">와짱 이벤트</option>
              <option value="businessEvent">고객 ( 사용자 ) 이벤트</option>
            </select>
          </div>
          <ComponentErrorNull />
        </div>
      </section>
    </>
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`set`} text="추가" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">공사콕 이벤트 목록</h3>
        <div className="paddingBox commonBox">
          <div className="filterWrap">
            <select {...register("_category")}>
              <option value="wzEvent">와짱 이벤트</option>
              <option value="businessEvent">고객 ( 사용자 ) 이벤트</option>
            </select>
          </div>

          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "auto" }}>내용</th>
                <th style={{ width: "150px" }}>날짜</th>
              </tr>
            </thead>
            <tbody className="commonTable">
              {wzEvent &&
                wzEvent.map((item) => (
                  <tr
                    key={item.contid}
                    style={{ height: "5.25rem" }}
                    className={item.useFlag == 0 ? "flageN" : null}
                  >
                    <td className="tableContentWrap">
                      <Link
                        to={`${item.contid}/set`}
                        className="Link"
                        style={{ paddingLeft: "30px" }}
                      >
                        <p>{item.contentString}</p>
                        <em>{item.contentDetail}</em>
                      </Link>
                    </td>
                    <td>{item.createTime.slice(0, 10)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <PaginationButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
