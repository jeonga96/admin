import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetReview } from "../Services/string";
import { useGetImage } from "../Services/customHook";

import ServicesImageOnClick from "../components/common/ServicesImageOnClick";
import PieceBarChart from "../components/common/PieceBarChart";

export default function DetailCompanyReview({ compnayReview }) {
  // url로 리뷰 번호 확인
  // const comrid = useParams().comrid;

  // 이미지 ------------------------------------------------------------------------
  // images : 리뷰 이미지
  const [images, setImages] = useState([]);

  // 리뷰 데이터 요청
  // useLayoutEffect(() => {
  //   servicesPostData(urlGetReview, {
  //     comrid: comrid,
  //   }).then((res) => {
  //     if (res.status === "success") {
  //       setCompnayReview(res.data);
  //       return;
  //     }
  //   });
  // }, []);

  // iid로 이미지 url요청하는 커스텀 훅
  useGetImage(setImages, compnayReview);

  return (
    <>
      {/* <td>{compnayReview.ruidNick || "익명"}</td> */}
      <td className="tableReviewWrap">
        <div>
          <h4>{compnayReview.title}</h4>
          <ul>
            <li>
              <span>{compnayReview.ruidNick || "익명"}</span>
            </li>
            <li>
              <em>작성</em>
              <span>
                {compnayReview.createTime &&
                  compnayReview.createTime.slice(0, 10) +
                    " " +
                    compnayReview.createTime.slice(11, 19)}
              </span>
            </li>
            <li>
              <em>수정</em>
              <span>
                {compnayReview.updateTime &&
                  compnayReview.updateTime.slice(0, 10) +
                    " " +
                    compnayReview.updateTime.slice(11, 19)}
              </span>
            </li>
          </ul>
          <p>{compnayReview.content}</p>
        </div>
        <div className="tableReviewImgWrap">
          <div>
            <div className="tableReviewImg">
              <div style={{ width: 62 * images.length + "px" }}>
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
        </div>

        {/* <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}> */}
        {/* {compnayReview.negativeCount && (
              <div style={{ width: "49.5%", height: "75px" }}>
                <PieceBarChart
                  negativeCount={compnayReview.negativeCount}
                  positiveCount={compnayReview.positiveCount}
                />
              </div>
            )} */}
        {/* </div> */}
        {/* </div> */}
        {/* </li> */}
      </td>

      {/* 
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
        </li> */}
      {/* </ul> */}
      {/* </div> */}
    </>
  );
}
