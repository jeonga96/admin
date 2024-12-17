// (cid)를 확인하여 사업자, 관리자 공지사항인지 확인
// (comnid, contid)를 확인하여 작성 및 수정
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import LayoutTopButton from "../../components/layout/LayoutTopButton";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

export default function DetailNotice() {
  const { register, setValue, watch } = useForm({
    defaultValues: {},
  });
  const [eventStatus, setEventStatus] = useState("");
  // contid : 관리자 컨텐츠 id
  // comnid : company review id
  const { gweid } = useParams();

  // 데이터 ------------------------------------------------------------------------
  // 공지사항 목록 데이터
  // const [contents, setPro] = useState([]);

  CUS.useCleanupEffect(() => {
    // comnid 여부를 확인하여 사업자 공지사항 요청
    // API.servicesPostData("https://devawsback.gongsacok.com/admin/getWzevent", {
    API.servicesPostData(APIURL.urlGetWzEvent, {
      gweid: gweid,
    }).then((res) => {
      console.log(res);
      if (res.status === "success") {
        console.log(res);
        // setPro(res.data);
        const PRODUCT = res.data.product;
        setValue("_guserFlag", res.data.guserFlag);
        setValue("_busClassFlag", res.data.busClassFlag);
        setValue("_cname", res.data.cname);
        setValue("_name", res.data.name);
        setValue("_job", res.data.job);
        setValue("_jobDetail", res.data.jobDetail);
        setValue("_telnum", res.data.telnum);
        setValue("_eventPath", res.data.eventPath);
        setValue("_remark", res.data.remark);
        setValue("_name", res.data.name);
        console.log(res.data.status);
        if (PRODUCT === "1") {
          return setValue("_product", "( 선택1 ) 홈페이지 제작, 관리 ( PC형 )");
        } else if (PRODUCT === "2") {
          return setValue(
            "_product",
            "( 선택2 ) 블로그 제작 + 포스팅 1회 + 동영상 제작"
          );
        } else if (PRODUCT === "3") {
          return setValue("_product", "( 선택3 ) 블로그 포스팅 7회 작성");
        } else {
          return setValue(
            "_product",
            "( 선택4 ) 홈페이지 + 블로그 포스팅 1회 + 동영상 제작, 관리 업로드"
          );
        }
      }
    });
    API.servicesPostData(APIURL.urlSetEventStatus, {
      gweid: gweid,
    }).then((res) => {
      if (res.status === "success") {
        const eventStatus = res.data.status;
        console.log(eventStatus);
        setEventStatus(eventStatus);
      }
    });
  }, []);

  const fnStatus = (event) => {
    event.preventDefault();
    const newStatus = eventStatus === "AP" ? "CO" : "AP"; // Toggle between "AP" and "CO"
    API.servicesPostData(APIURL.urlSetEventStatus, {
      gweid: gweid,
      status: newStatus,
    }).then((res) => {
      if (res.status === "success") {
        console.log("success");
        setEventStatus(newStatus);
        if (newStatus === "AP") {
          TOA.servicesUseToast("대기 상태로 변경되었습니다.", "s");
        } else {
          TOA.servicesUseToast("처리 완료되었습니다.", "s");
        }
      }
    });
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout formLayoutDisabled">
          <ul className="tableTopWrap tableTopBorderWrap">
            <LayoutTopButton
              text={
                eventStatus === undefined || eventStatus === "AP"
                  ? "대기 상태"
                  : "처리 완료"
              }
              fn={fnStatus}
            />
            <LayoutTopButton url="/wzevent" text="목록으로 가기" />
          </ul>

          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>사용자 회원 정보 수정</h3>

              {/* 공사콕 회원 여부 */}
              <div className="formContentWrap">
                <label htmlFor="guserFlag" className="blockLabel">
                  <span>공사콕 회원 여부</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="guserFlag"
                    disabled
                    value={
                      watch("_guserFlag") == "0" ? "미가입" : "가입" || "미가입"
                    }
                    {...register("_guserFlag")}
                  />
                </div>
              </div>

              {/* 공사콕 회원 여부 */}
              <div className="formContentWrap">
                <label htmlFor="busClassFlag" className="blockLabel">
                  <span>사업자 분류</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="busClassFlag"
                    disabled
                    {...register("_busClassFlag")}
                  />
                </div>
              </div>

              {/* 상품 선택(*/}
              <div className="formContentWrap">
                <label htmlFor="product" className="blockLabel">
                  <span>상품 선택</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="product"
                    disabled
                    {...register("_product")}
                  />
                </div>
              </div>

              {/* 상호명(*/}
              <div className="formContentWrap">
                <label htmlFor="cname" className="blockLabel">
                  <span>상호명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="cname"
                    disabled
                    {...register("_cname")}
                  />
                </div>
              </div>

              {/* 대표 ( 주력 ) 업종 */}
              <div className="formContentWrap">
                <label htmlFor="job" className="blockLabel">
                  <span>대표 ( 주력 ) 업종</span>
                </label>
                <div>
                  <input type="text" id="job" disabled {...register("_job")} />
                </div>
              </div>

              {/* 상세 업종 */}
              <div className="formContentWrap">
                <label htmlFor="jobDetail" className="blockLabel">
                  <span>상세 업종</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="jobDetail"
                    disabled
                    {...register("_jobDetail")}
                  />
                </div>
              </div>

              {/* 신청자 성함 */}
              <div className="formContentWrap">
                <label htmlFor="name" className="blockLabel">
                  <span>신청자 성함</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="name"
                    disabled
                    {...register("_name")}
                  />
                </div>
              </div>

              {/* 휴대폰 번호 */}
              <div className="formContentWrap">
                <label htmlFor="telnum" className="blockLabel">
                  <span>휴대폰 번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="telnum"
                    disabled
                    {...register("_telnum")}
                  />
                </div>
              </div>

              {/* 이벤트 참여 경로 */}
              <div className="formContentWrap">
                <label htmlFor="eventPath" className="blockLabel">
                  <span>이벤트 참여 경로</span>
                </label>
                <div>
                  <textarea
                    id="eventPath"
                    disabled
                    {...register("_eventPath")}
                  />
                </div>
              </div>

              {/* 전달 사항 */}
              <div className="formContentWrap">
                <label htmlFor="remark" className="blockLabel">
                  <span>전달 사항</span>
                </label>
                <div>
                  <textarea id="remark" disabled {...register("_remark")} />
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
