// 사업자 회원 관리 > 사업자 상세정보 > 사업자 리뷰

import { useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";

import * as API from "../services/api";
import * as STR from "../services/string";
import * as UD from "../services/useData";

import ComponentErrorNull from "../components/piece/PieceErrorNull";
import LayoutTopButton from "../components/common/LayoutTopButton";
import DetailCompanyReview from "./DetailCompanyReview";

export default function ListCompanyReview() {
  let { cid } = useParams();

  // 데이터 ------------------------------------------------------------------------
  // 리뷰 목록
  const [review, setReview] = useState([]);
  // 회원관리, 상태관리 cid 저장
  const [clickedUseFlag, setClickedUseFlag] = useState([]);

  // 리뷰 데이터 요청
  useLayoutEffect(() => {
    API.servicesPostData(STR.urlReviewList, {
      rcid: cid,
    }).then((res) => {
      setReview(res.data);
    });
  }, []);

  // 계약관리 submit
  const handleUseFlag = () => {
    for (let i = 0; i < clickedUseFlag.length; i++) {
      API.servicesPostData(STR.urlSetReview, {
        comrid: clickedUseFlag[i],
        useFlag: 0,
      }).then((res) => {
        if (res.status === "fail") {
          UD.servicesUseToast(
            "오류가 발생되어 수정이 진행되지 않았습니다.",
            "e"
          );
        }
        if (res.status === "success") {
          UD.servicesUseToast("완료되었습니다.", "s");
          window.location.reload();
          return;
        }
      });
    }
    //for
  };

  return (review == [] && review.length == 0) || review === undefined ? (
    <ComponentErrorNull />
  ) : (
    <>
      <ul className="tableTopWrap">
        {clickedUseFlag.length > 0 && (
          <LayoutTopButton text="비활성화" fn={handleUseFlag} id="useFlagUse" />
        )}
      </ul>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>비활성화</th>
                <th>리뷰내용</th>
              </tr>
            </thead>
            <tbody>
              {review &&
                review.map((item) => (
                  <tr
                    key={item.comrid}
                    style={{ height: "auto", minHeight: "5.25rem" }}
                  >
                    <DetailCompanyReview
                      compnayReview={item}
                      clickedUseFlag={clickedUseFlag}
                      setClickedUseFlag={setClickedUseFlag}
                    />
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
