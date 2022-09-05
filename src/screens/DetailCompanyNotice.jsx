import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { servicesPostData, useDidMountEffect } from "../Services/importData";
import { urlGetNotice, urlGetImages } from "../Services/string";

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

  useDidMountEffect(() => {
    servicesPostData(urlGetImages, {
      imgs: companyDetail.imgs,
    }).then((res) => {
      setImage(res.data);
    });
  }, [companyDetail]);

  return (
    <div className="mainWrap">
      <div className="commonBox">
        {/* <ul className="detailPageLayout"> */}
        <ul>
          <li className="detailHead">
            <h4>제목</h4>
            <span>{companyDetail.title}</span>
          </li>
          <li className="detailSpan detailTime">
            <div>
              <em>작성 시간</em>
              <span>{companyDetail.createTime}</span>
            </div>
            <div>
              <em>수정 시간</em>
              <span>{companyDetail.updateTime}</span>
            </div>
          </li>
          <li className="detailHead">
            <h4>내용</h4>
            <span>{companyDetail.content}</span>
          </li>

          <li className="detailImage">
            <div className="imgsImg">
              <h4>상세 이미지</h4>
              <div>
                <ul>
                  {image &&
                    image.map((item, i) => (
                      <li key={item.iid}>
                        <img src={item.storagePath} alt="사업자 상세 이미지" />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default CompanyNoticeDetail;
