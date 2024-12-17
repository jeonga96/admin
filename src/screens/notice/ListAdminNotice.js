// 공사콕 앱 관리 > 공사콕 공지사항 리스트

import { useForm } from "react-hook-form";
import { useState } from "react";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";

import * as PAGE from "../../action/page";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";
import ComponentListNotice from "../../components/common/ComponentListNotice";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import PaginationButton from "../../components/services/ServicesPaginationButton_Redux";

export default function ListAdminNotice() {
  const { register, watch } = useForm({
    defaultValues: {
      _category: "notice",
    },
  });

  // 데이터 ------------------------------------------------------------------------
  // 목록 데이터
  const [notice, setNotice] = useState([]);
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  const [showUseFlagZero, setShowUseFlagZero] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [buttonText, setButtonText] = useState("게시글 전체보기");

  const toggleVisibility = () => {
    setShowUseFlagZero((prev) => !prev);
    setButtonText((prev) =>
      prev === "게시글 전체보기" ? "비공개 숨김" : "게시글 전체보기"
    );
    setButtonClicked((prev) => !prev);
  };

  // 카테고리 확인하여 데이터 요청
  CUS.useCleanupEffect(() => {
    API.servicesPostData(APIURL.urlContentList, {
      category: watch("_category") || "notice",
      offset: pageData.getPage,
      size: 15,
    }).then((res) => {
      if (res.status === "success" && res !== undefined) {
        let filteredNotice = res.data;
        if (!showUseFlagZero) {
          // showUseFlagZero가 false일 때만 필터링
          filteredNotice = res.data.filter((item) => item.useFlag === 1);
        }
        setNotice(filteredNotice);
        dispatch(PAGE.setListPage(res.page));
      }
    });
  }, [watch("_category"), pageData.getPage, showUseFlagZero]);

  return (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`set`} text="작성" />
      </ul>
      <section className="tableWrap">
        <h3 className="blind">공사콕 공지사항 목록</h3>
        <div className="paddingBox commonBox">
          <div className="filterWrap">
            <button
              className={`hideButton ${buttonClicked ? "clicked" : ""}`}
              onClick={toggleVisibility}
            >
              {buttonText}
            </button>
            <label className="listSearchRadioLabel" htmlFor="notice">
              <input
                type="radio"
                checked={watch("_category") == "notice"}
                value="notice"
                id="notice"
                {...register("_category")}
              />
              <span>B2C 공지</span>
            </label>
            <label className="listSearchRadioLabel" htmlFor="noticeTocompany">
              <input
                type="radio"
                checked={watch("_category") == "noticeTocompany"}
                value="noticeTocompany"
                id="noticeTocompany"
                {...register("_category")}
              />
              <span>B2B 공지</span>
            </label>
          </div>
          {(notice == [] && notice.length == 0) || notice === undefined ? (
            <ComponentErrorNull />
          ) : (
            <>
              <ComponentListNotice notice={notice} ISADMIN />
              <PaginationButton />
            </>
          )}
        </div>
      </section>
    </>
  );
}
