import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { serviesPostDataSettingRcid } from "../Services/useData";
import {
  urlGetCompanyDetail,
  urlNoticeList,
  urlReviewList,
} from "../Services/string";

import PieceDetailListLink from "../components/common/PieceDetailListLink";
import GetCompany from "../components/common/ComponentDetailCompany";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentErrorNull from "../components/common/ComponentErrorNull";

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
  return companyDetail && companyDetail.length === 0 ? (
    <ComponentErrorNull />
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url="/company" text="목록으로 가기" />
        <LayoutTopButton url="setcompanydetail" text="수정" />
      </ul>
      <div className="paddingBox commonBox">
        <GetCompany companyDetail={companyDetail} />
      </div>
      <div className="paddingBox commonBox">
        <ul className="detailContentsList detailContentCenter">
          {noticeList && (
            <PieceDetailListLink
              getData={noticeList}
              url={`/company/${companyDetail.rcid}/noticelist`}
              title="공지사항"
            />
          )}
          {companyDetail && (
            <PieceDetailListLink
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
