import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { serviesPostDataSettingRcid } from "../Services/useData";
import {
  urlGetCompanyDetail,
  urlNoticeList,
  urlReviewList,
} from "../Services/string";

import DetailContentList from "../components/common/DetailContentList";
import GetCompany from "../components/common/GetCompany";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function DetailCompany() {
  let { cid } = useParams();
  const [companyDetail, setCompanyDetail] = useState([]);
  const [noticeList, setNoticeList] = useState([]);
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    }).then((res) => {
      if (res.status === "success") {
        setCompanyDetail(res.data);
        console.log("res.data!!!", res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        alert("정보가 없습니다. 사업자 정보를 입력해 주세요!");
        window.location.href = `company/${cid}/setcompanydetail`;
        return;
      }
    });
    serviesPostDataSettingRcid(urlNoticeList, cid, setNoticeList);
    serviesPostDataSettingRcid(urlReviewList, cid, setReviewList);
  }, []);
  return (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url="setcompanydetail" text="상세정보 수정" />
      </ul>
      <div className="paddingBox commonBox">
        <GetCompany companyDetail={companyDetail} />
      </div>
      <div className="paddingBox commonBox">
        <ul className="detailContentsList detailContentCenter">
          {noticeList && (
            <DetailContentList
              getData={noticeList}
              url={`/company/${companyDetail.rcid}/noticelist`}
              title="공지사항"
            />
          )}
          {companyDetail && (
            <DetailContentList
              getData={reviewList}
              url={`/company/${companyDetail.rcid}/reviewlist`}
              title="리뷰"
            />
          )}
        </ul>
      </div>
    </>
  );
}
