import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetNotice } from "../Services/string";
import { useGetImage } from "../Services/customHook";

import LayoutTopButton from "../components/common/LayoutTopButton";

function CompanyNoticeDetail() {
  const [companyDetail, setCompanyDetail] = useState([]);
  const [image, setImage] = useState([]);
  const comnid = useParams().comnid;

  useEffect(() => {
    servicesPostData(urlGetNotice, {
      comnid: comnid,
    }).then((res) => {
      if (res.status === "success") {
        setCompanyDetail(res.data);
        console.log("res.data!!!", res.data);
        return;
      }
    });
  }, []);
  useGetImage(setImage, companyDetail);

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
              className="detailWidthContent"
              style={{ justifyContent: "left" }}
            >
              {image &&
                image.map((item) => (
                  <li
                    key={item.iid}
                    className="img"
                    style={{
                      backgroundImage: `url("${image && item.storagePath}")`,
                    }}
                  >
                    <span className="blind">공지사항 이미지 </span>
                  </li>
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
