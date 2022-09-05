import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { servicesPostData } from "../Services/importData";
import { urlGetCompanyMyDetail } from "../Services/string";

import GetCompany from "../components/common/GetCompany";

function CompanyMyDetail() {
  const [companyDetail, setCompanyDetail] = useState([]);

  useEffect(() => {
    servicesPostData(urlGetCompanyMyDetail, {
      rcid: 44,
    }).then((res) => {
      if (res.status === "success") {
        setCompanyDetail(res.data);
        console.log("res.data!!!", res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        alert("정보가 없습니다. 사업자 정보를 입력해 주세요!");
        window.location.href = "/setcompanymydetail";
        return;
      }
    });
  }, []);

  return (
    <div className="mainWrap">
      <div>
        <div className="paddingBox commonBox">
          <GetCompany companyDetail={companyDetail} />
          <ul className="detailContentsList">
            <li>
              <h4>공지사항</h4>
              <span>
                {/* 공지사항은 총 {notice > 0 ? notice.length : "0"}개 입니다.{" "} */}
              </span>
              <div>
                <Link to={`/company/44/notice`}>
                  바로가기
                  <BsArrowRightShort />
                </Link>
              </div>
            </li>
          </ul>

          <div className="bigButton" style={{ margin: "3.125rem auto 0" }}>
            <Link className="Link" to="/setcompanymydetail">
              정보 수정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CompanyMyDetail;
