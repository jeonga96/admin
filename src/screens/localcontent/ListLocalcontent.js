// 공사콕 앱 관리 > 공사콕 공지사항 리스트

import { useForm } from "react-hook-form";
import { useState } from "react";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";

import * as PAGE from "../../action/page";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";
import ComponentListLocalContent from "../../components/common/ComponentListLocalContent";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import PaginationButton from "../../components/services/ServicesPaginationButton_Redux";

export default function ListAdminNotice() {
  const { register, watch } = useForm({
    defaultValues: {
      _category: "localcontent",
    },
  });

  // 데이터 ------------------------------------------------------------------------
  // 목록 데이터
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  // 카테고리 확인하여 데이터 요청
  const pagefilter = (actionCate) => {
    API.servicesPostData(APIURL.urListlLocalContent, {
      category: watch("_category") || "localcontent",
      offset: actionCate ? 0 : pageData.getPage,
      size: 15,
    }).then((res) => {
      console.log("pageData", res.data);
      if (res?.status === "success") {
        setList(res.data);
        dispatch(PAGE.setListPage(res.page));
      }
    });
  };
  CUS.useCleanupEffect(() => {
    pagefilter();
  }, [pageData.getPage]);

  CUS.useCleanupEffect(() => {
    pagefilter(true);
  }, [watch("_category")]);

  return (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">공사콕 공지사항 목록</h3>
        <div className="paddingBox commonBox">
          <div className="filterWrap">
            <label className="listSearchRadioLabel" htmlFor="localcontent">
              <input
                type="radio"
                checked={watch("_category") == "localcontent"}
                value="localcontent"
                id="localcontent"
                {...register("_category")}
              />
              <span>B2C 최신글</span>
            </label>
            <label className="listSearchRadioLabel" htmlFor="localbusiness">
              <input
                type="radio"
                checked={watch("_category") == "localbusiness"}
                value="localbusiness"
                id="localbusiness"
                {...register("_category")}
              />
              <span>B2B 최신글</span>
            </label>
          </div>
          {(list == [] && list.length == 0) || list === undefined ? (
            <ComponentErrorNull />
          ) : (
            <>
              <ComponentListLocalContent list={list} />
              <PaginationButton />
            </>
          )}
        </div>
      </section>
    </>
  );
}
