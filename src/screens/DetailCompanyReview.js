import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetReview } from "../Services/string";
import { useGetImage } from "../Services/customHook";

import ServicesImageOnClick from "../components/common/ServicesImageOnClick";
import PieceBarChart from "../components/common/PieceBarChart";

export default function DetailCompanyReview() {
  // url로 리뷰 번호 확인
  const comrid = useParams().comrid;

  // 데이터 ------------------------------------------------------------------------
  // 작성된 리뷰
  const [compnayReview, setCompnayReview] = useState([]);
  // 이미지 ------------------------------------------------------------------------
  // images : 리뷰 이미지
  const [images, setImages] = useState([]);

  // 리뷰 데이터 요청
  useLayoutEffect(() => {
    servicesPostData(urlGetReview, {
      comrid: comrid,
    }).then((res) => {
      if (res.status === "success") {
        setCompnayReview(res.data);
        return;
      }
    });
  }, []);

  // iid로 이미지 url요청하는 커스텀 훅
  useGetImage(setImages, compnayReview);

  return (
    <>
      <div className="commonBox paddingBox">
        <ul className="detailPageLayout" style={{ paddingTop: "20px" }}>
          <li className="detailTime">
            <div>
              <em>작성 시간</em>
              <span>
                {compnayReview.createTime &&
                  compnayReview.createTime.slice(0, 10) +
                    " " +
                    compnayReview.createTime.slice(11, 19)}
              </span>
            </div>
            <div>
              <em>수정 시간</em>
              <span>
                {compnayReview.updateTime &&
                  compnayReview.updateTime.slice(0, 10) +
                    " " +
                    compnayReview.updateTime.slice(11, 19)}
              </span>
            </div>
          </li>

          <li className="detailContentWrap title">
            <h4 className="blind">제목</h4>
            <div>
              <span className="titleText">{compnayReview.title}</span>
              <span className="contentText">{compnayReview.ruidNick}</span>
            </div>
          </li>

          <li className="detailContentWrap">
            <h4 className="blind">내용</h4>
            <div>
              <p>{compnayReview.content}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {compnayReview.negativeCount && (
                  <div style={{ width: "49.5%", height: "75px" }}>
                    <PieceBarChart
                      negativeCount={compnayReview.negativeCount}
                      positiveCount={compnayReview.positiveCount}
                    />
                  </div>
                )}
                <div
                  className=" detailWidthContentImg detailWidthContent"
                  style={{ justifyContent: "left", width: "49.5%" }}
                >
                  {images &&
                    images.map((item) => (
                      <ServicesImageOnClick
                        key={item.iid}
                        getData={images}
                        url={item.storagePath}
                        text="리뷰 이미지"
                      />
                    ))}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
