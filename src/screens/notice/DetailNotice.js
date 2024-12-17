// (cid)를 확인하여 사업자, 관리자 공지사항인지 확인
// (comnid, contid)를 확인하여 작성 및 수정

import { useState } from "react";
import { useParams } from "react-router-dom";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentDetailNotice from "../../components/common/ComponentDetailNotice";

export default function DetailNotice() {
  // contid : 관리자 컨텐츠 id
  // comnid : company review id
  const { cid, comnid, contid } = useParams();

  // 데이터 ------------------------------------------------------------------------
  // 공지사항 목록 데이터
  const [notice, setNotice] = useState([]);

  CUS.useCleanupEffect(() => {
    // comnid 여부를 확인하여 사업자 공지사항 요청
    if (!!comnid) {
      API.servicesPostData(APIURL.urlCompanyGetNotice, {
        comnid: comnid,
      }).then((res) => {
        if (res.status === "success") {
          setNotice(res.data);
          return;
        }
      });
    } else {
      //cid가  없다면 관리자 공지사항 요청
      API.servicesPostData(APIURL.urlGetContent, {
        contid: contid,
      }).then((res) => {
        if (res.status === "success") {
          setNotice(res.data);
          return;
        }
      });
    }
  }, []);

  function fnremove(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    API.servicesPostData(APIURL.urlCompanySetNotice, {
      comnid: comnid,
      rcid: cid,
      useFlag: 0,
      title: notice.title,
      content: notice.content,
      imgs: notice.imgs || "",
    })
      .then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          TOA.servicesUseToast("삭제가 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/company/${cid}/notice`;
          }, 2000);
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  // cid 여부를 확인하여 사업자 공지사항과 공사콕 관리자 공지사항을 return한다.
  return (
    <>
      <div className="commonBox paddingBox">
        <ul className="tableTopWrap tableTopWhiteWrap">
          {!!cid ? (
            <>
              <LayoutTopButton
                url={`/company/${cid}/notice`}
                text="목록으로 가기"
              />
              <LayoutTopButton text="삭제" fn={fnremove} />
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
