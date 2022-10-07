import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetReview } from "../Services/string";
import { useGetImage } from "../Services/customHook";

import ImageOnClick from "../components/common/ImageOnClick";
import BarChart from "../components/common/BarChart";

export default function DetailCompanyReview() {
  const [companyDetail, setCompanyDetail] = useState([]);
  const [images, setImages] = useState([]);
  const comrid = useParams().comrid;

  useEffect(() => {
    servicesPostData(urlGetReview, {
      comrid: comrid,
    }).then((res) => {
      if (res.status === "success") {
        setCompanyDetail(res.data);
        console.log("res.data!!!", res.data);
        return;
      }
    });
  }, []);

  // 서버에서 image를 가져오는 customHook imgs를 가져온다.
  useGetImage(setImages, companyDetail);

  return (
    <>
      <div className="commonBox paddingBox">
        <ul className="detailPageLayout" style={{ paddingTop: "20px" }}>
          <li className="detailTime">
            <div>
              <em>작성 시간</em>
              <span>
                {companyDetail.createTime &&
                  companyDetail.createTime.slice(0, 10) +
                    " " +
                    companyDetail.createTime.slice(11, 19)}
              </span>
            </div>
            <div>
              <em>수정 시간</em>
              <span>
                {companyDetail.updateTime &&
                  companyDetail.updateTime.slice(0, 10) +
                    " " +
                    companyDetail.updateTime.slice(11, 19)}
              </span>
            </div>
          </li>

          <li className="formContentWrap">
            <h4>제목</h4>
            <span>{companyDetail.title}</span>
          </li>

          <li className="formContentWrap">
            <h4>별명</h4>
            <span>{companyDetail.ruidNick}</span>
          </li>

          <li className="formContentWrap">
            <h4>리뷰 내용</h4>
            <p>{companyDetail.content}</p>
          </li>

          <li className="formContentWrap">
            <h4>업체 만족도</h4>
            <p>
              {companyDetail.negativeCount && (
                <BarChart
                  negativeCount={companyDetail.negativeCount}
                  positiveCount={companyDetail.positiveCount}
                />
              )}
            </p>
          </li>

          <li className="formContentWrap">
            <h4>리뷰 이미지</h4>
            <div className="detailWidthContent detailWidthContentImg">
              {images &&
                images.map((item) => (
                  <ImageOnClick
                    key={item.iid}
                    getData={images}
                    url={item.storagePath}
                    text="리뷰 이미지"
                  />
                ))}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
