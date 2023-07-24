// 공사콕 앱 관리 > 공사콕 공지사항 리스트

import { useForm } from "react-hook-form";
import { useState, useLayoutEffect } from "react";

import * as API from "../service/api";
import * as STR from "../service/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentErrorNull from "../components/piece/PieceErrorNull";
import ComponentListNotice from "../components/common/ComponentListNotice";

import PaginationButton from "../components/services/ServicesPaginationButton";

export default function ListAdminNotice() {
  const { register, watch } = useForm({
    defaultValues: {
      _category: "notice",
    },
  });

  // 데이터 ------------------------------------------------------------------------
  // 목록 데이터
  const [notice, setNotice] = useState([]);

  // pagination 버튼 관련 ------------------------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // 카테고리 확인하여 데이터 요청
  useLayoutEffect(() => {
    API.servicesPostData(STR.urlContentList, {
      category: watch("_category") || "notice",
      offset: 0,
      size: 15,
    }).then((res) => {
      setNotice(res.data);
      setListPage(res.page);
    });
  }, [watch("_category") || page.getPage]);

  return (notice == [] && notice.length == 0) || notice === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`set`} text="작성" />
      </ul>
      <div className="filterWrap">
        <input
          type="radio"
          checked={watch("_category") == "notice"}
          value="notice"
          id="notice"
          {...register("_category")}
        />
        <label className="listSearchRadioLabel" htmlFor="notice">
          전체 회원 공지
        </label>
        <input
          type="radio"
          checked={watch("_category") == "noticeTocompany"}
          value="noticeTocompany"
          id="noticeTocompany"
          {...register("_category")}
        />
        <label className="listSearchRadioLabel" htmlFor="noticeTocompany">
          사업자 회원 공지
        </label>
      </div>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`set`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">공사콕 공지사항 목록</h3>
        <div className="paddingBox commonBox">
          <div className="filterWrap">
            <label className="listSearchRadioLabel" htmlFor="notice">
              <input
                type="radio"
                checked={watch("_category") == "notice"}
                value="notice"
                id="notice"
                {...register("_category")}
              />
              <span>전체 회원 공지</span>
            </label>
            <label className="listSearchRadioLabel" htmlFor="noticeTocompany">
              <input
                type="radio"
                checked={watch("_category") == "noticeTocompany"}
                value="noticeTocompany"
                id="noticeTocompany"
                {...register("_category")}
              />
              <span>사업자 회원 공지</span>
            </label>
          </div>

          <ComponentListNotice notice={notice} ISADMIN />
          <PaginationButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </>
  );
}
