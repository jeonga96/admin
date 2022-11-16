import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetReview } from "../Services/string";
import { useGetImage } from "../Services/customHook";

import ServicesImageOnClick from "../components/common/ServicesImageOnClick";
import PieceBarChart from "../components/common/PieceBarChart";

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

          <li className="detailContentWrap title">
            <h4 className="blind">제목</h4>
            <div>
              <span className="titleText">{companyDetail.title}</span>
              <span className="contentText">{companyDetail.ruidNick}</span>
            </div>
          </li>

          <li className="detailContentWrap">
            <h4 className="blind">내용</h4>
            <div>
              <p>{companyDetail.content}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {companyDetail.negativeCount && (
                  <div style={{ width: "49.5%", height: "75px" }}>
                    <PieceBarChart
                      negativeCount={companyDetail.negativeCount}
                      positiveCount={companyDetail.positiveCount}
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
