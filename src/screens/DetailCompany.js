import { useEffect, useState } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetCompanyDetail, urlNoticeList } from "../Services/string";

import GetCompany from "../components/common/GetCompany";

export default function DetailCompany() {
  let { cid } = useParams();
  const [companyDetail, setCompanyDetail] = useState([]);

  const [noticeList, setNoticeList] = useState(null);

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

    servicesPostData(urlNoticeList, { rcid: cid }).then((res) => {
      if (res.status === "success") {
        setNoticeList(res.data);
        console.log("urlNoticeList.data!!!", res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        console.log("엥 공지사항이 하나도 없어용", res);
        setNoticeList(null);
        return;
      }
    });
  }, []);

  return (
    <>
      <div>
        <div className="paddingBox commonBox">
          <GetCompany companyDetail={companyDetail} />
          <ul className="detailContentsList">
            <li>
              <Link
                to={companyDetail && `/company/${companyDetail.rcid}/notice`}
              >
                <h4 className="title">공지사항</h4>
                <span className="content">
                  공지사항은 총
                  {noticeList && noticeList.length > 0
                    ? noticeList.length
                    : "0"}
                  개 입니다.
                </span>
                <div className="link">
                  바로가기
                  <BsArrowRightShort />
                </div>
              </Link>
            </li>
          </ul>
          <div className="bigButton" style={{ margin: "3.125rem auto 0" }}>
            <Link className="Link" to="setcompanydetail">
              상세정보 수정
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
