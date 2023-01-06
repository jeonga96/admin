import { Link, useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlReviewList } from "../Services/string";
import { MdOutlineImage } from "react-icons/md";

import ComponentErrorNull from "../components/common/ComponentErrorNull";
import DetailCompanyReview from "./DetailCompanyReview";

export default function ListCompanyReview() {
  let { cid } = useParams();

  // 데이터 ------------------------------------------------------------------------
  // 리뷰 목록
  const [review, setReview] = useState([]);

  // 리뷰 데이터 요청
  useLayoutEffect(() => {
    servicesPostData(urlReviewList, {
      rcid: cid,
    }).then((res) => {
      setReview(res.data);
      console.log(res.data);
    });
  }, []);

  return review === undefined ? (
    <ComponentErrorNull />
  ) : (
    <>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            {/* <thead>
              <tr>
                <th style={{ width: "auto" }}>내용</th>
              </tr>
            </thead> */}
            <tbody>
              {review &&
                review.map((item) => (
                  <tr
                    key={item.comrid}
                    style={{ height: "auto", minHeight: "5.25rem" }}
                  >
                    <DetailCompanyReview compnayReview={item} />
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
