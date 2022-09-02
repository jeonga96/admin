import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        // window.location.href = `company/${cid}/setcompanydetail`;
        return;
      }
    });
  }, []);

  return (
    <div className="mainWrap">
      <div>
        <div className="paddingBox commonBox">
          <GetCompany companyDetail={companyDetail} />
          <div className="bigButton" style={{ margin: "0 auto" }}>
            <Link className="Link" to="setcompanydetail">
              정보 수정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CompanyMyDetail;
