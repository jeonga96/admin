import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlCompanyGetNotice, urlGetContent } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentDetailNotice from "../components/common/ComponentDetailNotice";

export default function DetailNotice() {
  const { comnid, cid, contid } = useParams();

  // 데이터 ------------------------------------------------------------------------
  // 공지사항 목록 데이터
  const [notice, setNotice] = useState([]);

  useLayoutEffect(() => {
    // cid 여부를 확인하여 사업자 공지사항 요청
    if (!!cid) {
      servicesPostData(urlCompanyGetNotice, {
        comnid: comnid,
      }).then((res) => {
        if (res.status === "success") {
          setNotice(res.data);
          return;
        }
      });
    } else {
      //cid가  없다면 관리자 공지사항 요청
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

  // cid 여부를 확인하여 사업자 공지사항과 공사콕 관리자 공지사항을 return한다.
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
