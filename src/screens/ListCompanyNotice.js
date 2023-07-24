// 사업자 회원 관리 > 사업자 상세정보 > 사업자 리뷰

import { useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import * as API from "../service/api";
import * as STR from "../service/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentErrorNull from "../components/piece/PieceErrorNull";
import ComponentListNotice from "../components/common/ComponentListNotice";

export default function ListCompanyNotice() {
  let { cid } = useParams();

  // 데이터 ------------------------------------------------------------------------
  // 공지사항 목록
  const [notice, setNotice] = useState([]);

  useLayoutEffect(() => {
    API.servicesPostData(STR.urlCompanyNoticeList, {
      rcid: cid,
    }).then((res) => {
      setNotice(res.data && res.data.reverse());
    });
  }, []);

  return (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`/company/${cid}`} text="상세정보 가기" />
        <LayoutTopButton url={`/company/${cid}/notice/set`} text="작성" />
      </ul>

      {notice === undefined || (notice == [] && notice.length == 0) ? (
        <ComponentErrorNull />
      ) : (
        <section className="tableWrap">
          <h3 className="blind">사업자 공지사항 목록</h3>
          <div className="paddingBox commonBox">
            <ComponentListNotice notice={notice} />
          </div>
        </section>
      )}
    </>
  );
}
