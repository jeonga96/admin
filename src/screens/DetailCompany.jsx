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

  const [notice, setNotice] = useState(null);
  const fnNotice = (notice) => {
    setNotice(notice);
  };

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
        setNotice(res.data);
        console.log("urlNoticeList.data!!!", res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        console.log("엥 공지사항이 하나도 없어용", res);
        setNotice(null);
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
                공지사항은 총 {notice > 0 ? notice.length : "0"}개 입니다.{" "}
              </span>
              <div>
                <Link to="notice">
                  바로가기
                  <BsArrowRightShort />
                </Link>
              </div>
            </li>
          </ul>
          <div className="bigButton" style={{ margin: "3.125rem auto 0" }}>
            <Link className="Link" to="setcompanydetail">
              사업자 정보 수정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
