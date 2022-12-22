import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlCompanyGetNotice, urlGetContent } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentDetailNotice from "../components/common/ComponentDetailNotice";

export default function CompanyNoticeDetail() {
  const [notice, setNotice] = useState([]);
  const { comnid } = useParams();
  const { cid, contid } = useParams();

  // 해당 공지사항 번호에 맞는 데이터를 가져온다.
  useEffect(() => {
    if (!!cid) {
      // cid 여부를 확인하여 사업자 공지사항 불러오기
      servicesPostData(urlCompanyGetNotice, {
        comnid: comnid,
      }).then((res) => {
        if (res.status === "success") {
          setNotice(res.data);
          return;
        }
      });
    } else {
      // 없다면 관리자 공지사항 불러오기
      servicesPostData(urlGetContent, {
        contid: contid,
      }).then((res) => {
        if (res.status === "success") {
          setNotice(res.data);
          return;
        }
      });
    }
  }, []);

  return (
    <>
      <div className="commonBox paddingBox">
        <ul className="tableTopWrap">
          {!!cid ? (
            <>
              <LayoutTopButton
                url={`/company/${cid}/notice`}
                text="목록으로 가기"
              />
              <LayoutTopButton url={`set`} text="수정" />
            </>
          ) : (
            <>
              <LayoutTopButton url="/notice" text="목록으로 가기" />
              <LayoutTopButton url="set" text="수정" />
            </>
          )}
        </ul>
        <ComponentDetailNotice detail={notice} />
      </div>
    </>
  );
}
