import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetNotice } from "../Services/string";
import { useGetImage } from "../Services/customHook";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ImageOnClick from "../components/common/ImageOnClick";

function CompanyNoticeDetail() {
  const [companyDetail, setCompanyDetail] = useState([]);
  const [images, setImages] = useState([]);
  const comnid = useParams().comnid;

  // 해당 공지사항 번호에 맞는 데이터를 가져온다.
  useEffect(() => {
    servicesPostData(urlGetNotice, {
      comnid: comnid,
    }).then((res) => {
      if (res.status === "success") {
        setCompanyDetail(res.data);
        return;
      }
    });
  }, []);

  // 서버에서 image를 가져오는 customHook imgs를 가져온다.
  useGetImage(setImages, companyDetail);

  return (
    <>
      <div className="commonBox paddingBox">
        <ul className="tableTopWrap">
          <LayoutTopButton url="modify" text="수정" />
        </ul>
        <ul className="detailPageLayout">
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
            <h4>상세 이미지</h4>
            <ul
              className="detailWidthContent detailWidthContentImg"
              style={{ justifyContent: "left" }}
            >
              {images &&
                images.map((item) => (
                  <ImageOnClick
                    key={item.iid}
                    getData={images}
                    url={item.storagePath}
                    text="공지사항 이미지"
                  />
                ))}
            </ul>
          </li>

          <li className="formContentWrap">
            <h4>공지사항 내용</h4>
            <p>{companyDetail.content}</p>
          </li>
        </ul>
      </div>
    </>
  );
}
export default CompanyNoticeDetail;
