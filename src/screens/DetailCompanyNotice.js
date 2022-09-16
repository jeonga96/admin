import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetNotice } from "../Services/string";
import { useGetImage } from "../Services/customHook";

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
    <div className="mainWrap">
      <div className="commonBox paddingBox">
        <ul>
          <li className="detailContentTitle">
            <h4 className="blind">제목</h4>
            <span>{companyDetail.title}</span>
          </li>
          {companyDetail.createTime && (
            <li className="detailSpan detailTime">
              <div>{`${companyDetail.createTime.slice(
                0,
                10
              )} ${companyDetail.createTime.slice(11, 19)}`}</div>
            </li>
          )}
          <li className="detailContentLink">
            <Link to="modify">수정</Link>
          </li>
          <li className="detailContentText">
            <div className="detailContentImage">
              <h4 className="blind">상세 이미지</h4>
              <ul>
                {image &&
                  image.map((item, i) => (
                    <li key={item.iid}>
                      <span>{`공지사항 첨부 이미지 ${i + 1}`}</span>
                      <img src={item.storagePath} alt="공지사항 첨부 이미지" />
                    </li>
                  ))}
              </ul>
            </div>
            <h4 className="blind">공지사항 내용</h4>
            <span className="detailContentTextArea">
              {companyDetail.content}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default CompanyNoticeDetail;
