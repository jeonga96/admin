import { Link, useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlReviewList, urlGetReview, urlSetReview } from "../Services/string";
import { MdOutlineImage } from "react-icons/md";

import ComponentErrorNull from "../components/common/ComponentErrorNull";
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
    servicesPostData(urlReviewList, {
      rcid: cid,
    }).then((res) => {
      setReview(res.data);
    });
  }, []);

  console.log("clickedUseFlag", clickedUseFlag);
  console.log(review);

  // 계약관리 submit
  const handleUseFlag = (e) => {
    for (let i = 0; i < clickedUseFlag.length; i++) {
      servicesPostData(urlGetReview, {
        comrid: clickedUseFlag[i],
      })
        .then((res) => {
          servicesPostData(urlSetReview, {
            comrid: res.data.comrid,
            ruidNick: res.data.ruidNick,
            useFlag: 0,
            rcid: res.data.rcid,
            ruid: res.data.ruid,
            title: res.data.title,
            content: res.data.content,
            imgs: res.data.imgs,
            positiveCount: res.data.positiveCount,
            negativeCount: res.data.negativeCount,
          });
        })
        .then((res) => console.log(res.data));
      // .then(window.location.reload());
    }
    //for
  };

  return review === undefined ? (
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
