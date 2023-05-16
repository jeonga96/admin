import { useLayoutEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid, servicesUseToast } from "../Services/useData";
import { urlSetEstimateInfo, urlGetEstimateInfo } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ImageSet from "../components/common/ServicesImageSetPreview";

export default function SetAdminEstimateinfo() {
  const { esid } = useParams();
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  // 데이터 ------------------------------------------------------------------------
  // 작성된 데이터를 받아옴
  const [getedData, setGetedData] = useState([]);
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);

  // 이미지 ------------------------------------------------------------------------
  // imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [imgs, setImgs] = useState([]);
  const imgsIid = [];

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useLayoutEffect(() => {
    // 추가 시 라디오&체크박스 기본 값
    setValue("_reqEstimate", "1");
    setValue("_reqBill", "1");
    setValue("_useFlag", "1");
    setValue("_gongsaType", "reser");

    // 해당 esid의 견적의뢰서 가지고 오기
    servicesPostData(urlGetEstimateInfo, {
      esid: esid,
    })
      .then((res) => {
        if (res.status === "success") {
          console.log("success", res.data);
          // 이미지 iid를 가지고 오기 위해 (imgs, titleImg) 사용
          setGetedData(res.data);
          // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
          setValue("_fromUid", res.data.fromUid || "");
          setValue("_toUid", res.data.toUid || "");
          setValue("_reqDetail", res.data.reqDetail || "");
          setValue("_reqPrice", res.data.reqPrice || "");
          setValue(
            "_reqVisit",
            (res.data.reqVisit && res.data.reqVisit.slice(0, 10)) || ""
          );
          setValue("_addInfo", res.data.addInfo || "");

          setValue("_proDetail", res.data.proDetail || "");
          setValue("_proPrice", res.data.proPrice || "");
          setValue(
            "_proVisit",
            (res.data.proVisit && res.data.proVisit.slice(0, 10)) || ""
          );

          setValue(
            "_reqEstimate",
            (res.data.reqEstimate && res.data.reqEstimate.toString()) || "1"
          );
          setValue(
            "_reqBill",
            (res.data.reqBill && res.data.reqBill.toString()) || "1"
          );
          setValue(
            "_useFlag",
            (res.data.useFlag && res.data.useFlag.toString()) || "1"
          );
          setValue("_gongsaType", res.data.gongsaType || "reser");
          setValue("_readFlag", res.data.readFlag || "0");
          setValue("_siteAddress", res.data.siteAddress);

          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function fnSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);

    const reqDate = new Date(getValues("_reqVisit"));
    const proDate = new Date(getValues("_proVisit"));

    if (!esid) {
      // setUserDetailInfo 추가-------------------------------------------
      servicesPostData(
        urlSetEstimateInfo,
        !getValues("_proVisit")
          ? // 견적서 응답 없음을 방문 제안일 기준으로 판단
            // 견적서 응답 내용을 입력하지 않고, 요청서만 작성했을 때
            {
              toUid: getValues("_toUid"),
              fromUid: getValues("_fromUid"),
              gongsaType: getValues("_gongsaType").toString(),
              reqDetail: getValues("_reqDetail"),
              reqPrice:
                (getValues("_reqPrice") &&
                  getValues("_reqPrice").replace(",", "")) ||
                "",
              siteAddress: getValues("_siteAddress"),
              reqVisit: reqDate.toISOString().slice(0, 19) || "",
              reqEstimate: getValues("_reqEstimate"),
              reqBill: getValues("_reqBill"),
              useFlag: getValues("_useFlag"),
              addInfo: getValues("_addInfo"),
            }
          : // 견적서 응답 내용을 입력했을 때
            {
              toUid: getValues("_toUid"),
              fromUid: getValues("_fromUid"),
              gongsaType: getValues("_gongsaType").toString(),
              reqDetail: getValues("_reqDetail"),
              reqPrice:
                (getValues("_reqPrice") &&
                  getValues("_reqPrice").replace(",", "")) ||
                "",
              siteAddress: getValues("_siteAddress"),
              reqVisit: reqDate.toISOString().slice(0, 19) || "",
              reqEstimate: getValues("_reqEstimate"),
              reqBill: getValues("_reqBill"),
              useFlag: getValues("_useFlag"),
              addInfo: getValues("_addInfo"),
              proDetail: getValues("_proDetail"),
              proPrice:
                (getValues("_proPrice") &&
                  getValues("_proPrice").replace(",", "")) ||
                "",
              proVisit: proDate.toISOString().slice(0, 19) || "",
              addImgs: imgsIid.toString() || "",
            }
      )
        .then((res) => {
          if (res.status === "success") {
            servicesUseToast("완료되었습니다!", "s");
            return;
          }
        })
        .catch((error) => console.log("axios 실패", error.response));
    } else {
      // setUserDetailInfo 수정-------------------------------------------
      servicesPostData(
        urlSetEstimateInfo,
        !getValues("_proVisit")
          ? // 견적서 응답 없음을 방문 제안일 기준으로 판단
            // 견적서 응답 내용을 입력하지 않고, 요청서만 작성했을 때
            {
              esid: esid,
              toUid: getValues("_toUid"),
              fromUid: getValues("_fromUid"),
              gongsaType: getValues("_gongsaType").toString(),
              reqDetail: getValues("_reqDetail"),
              reqPrice:
                (getValues("_reqPrice") &&
                  getValues("_reqPrice").replace(",", "")) ||
                "",
              siteAddress: getValues("_siteAddress"),
              reqVisit: reqDate.toISOString().slice(0, 19) || "",
              reqEstimate: getValues("_reqEstimate"),
              reqBill: getValues("_reqBill"),
              useFlag: getValues("_useFlag"),
              addInfo: getValues("_addInfo"),
            }
          : // 견적서 응답 내용을 입력했을 때
            {
              esid: esid,
              toUid: getValues("_toUid"),
              fromUid: getValues("_fromUid"),
              gongsaType: getValues("_gongsaType").toString(),
              reqDetail: getValues("_reqDetail"),
              reqPrice:
                (getValues("_reqPrice") &&
                  getValues("_reqPrice").replace(",", "")) ||
                "",
              siteAddress: getValues("_siteAddress"),
              reqVisit: reqDate.toISOString().slice(0, 19) || "",
              reqEstimate: getValues("_reqEstimate"),
              reqBill: getValues("_reqBill"),
              useFlag: getValues("_useFlag"),
              addInfo: getValues("_addInfo"),
              proDetail: getValues("_proDetail"),
              proPrice:
                (getValues("_proPrice") &&
                  getValues("_proPrice").replace(",", "")) ||
                "",
              proVisit: proDate.toISOString().slice(0, 19) || "",
              addImgs: imgsIid.toString() || "",
            }
      )
        .then((res) => {
          if (res.status === "success") {
            servicesUseToast("완료되었습니다!", "s");
            return;
          }
        })
        .catch((error) => console.log("axios 실패", error.response));
    }
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton url="/estimateinfo" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            {/* 갼적서 요청 내용  ================================================================ */}
            <fieldset>
              <h3>
                견적서 요청 내용
                {getedData.readFlag == "1" ? (
                  <span>열람</span>
                ) : (
                  <span>미열람</span>
                )}
              </h3>

              {/* 사용 플래그  */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>회원관리</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_useFlag") == "0"}
                    value="0"
                    id="DetailUseFlag0"
                    {...register("_useFlag")}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="DetailUseFlag0"
                  >
                    휴면
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_useFlag") == "1"}
                    value="1"
                    id="DetailUseFlag1"
                    {...register("_useFlag")}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="DetailUseFlag1"
                  >
                    사용
                  </label>
                </div>
              </div>

              {/* 공사 타입 */}
              <div className="formContentWrap">
                <label htmlFor="name" className=" blockLabel">
                  <span>공사 타입</span>
                </label>
                <div className="formPaddingWrap">
                  <input
                    type="checkbox"
                    value="emer"
                    id="emer"
                    className="listSearchRadioInput"
                    checked={
                      (watch("_gongsaType") &&
                        watch("_gongsaType").includes("emer")) ||
                      false
                    }
                    {...register("_gongsaType")}
                  />
                  <label htmlFor="emer" className="listSearchRadioLabel">
                    긴급
                  </label>
                  <input
                    type="checkbox"
                    value="inday"
                    id="inday"
                    name="gongsaType"
                    className="listSearchRadioInput"
                    checked={
                      (watch("_gongsaType") &&
                        watch("_gongsaType").includes("inday")) ||
                      false
                    }
                    {...register("_gongsaType")}
                  />
                  <label htmlFor="inday" className="listSearchRadioLabel">
                    당일
                  </label>
                  <input
                    type="checkbox"
                    value="reser"
                    id="reser"
                    name="gongsaType"
                    className="listSearchRadioInput"
                    checked={
                      (watch("_gongsaType") &&
                        watch("_gongsaType").includes("reser")) ||
                      false
                    }
                    {...register("_gongsaType")}
                  />
                  <label htmlFor="reser" className="listSearchRadioLabel">
                    예약
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="fromUid" className=" blockLabel">
                  <span>견적 요청</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="fromUid"
                    name="_fromUid"
                    placeholder="견적서를 요청받은 관리번호를 입력해 주세요."
                    {...register("_fromUid", {
                      required: "입력되지 않았습니다.",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_fromUid"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="toUid" className=" blockLabel">
                  <span>견적 수령</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="toUid"
                    placeholder="견적서를 요청한 관리번호를 입력해 주세요."
                    {...register("_toUid", {
                      required: "입력되지 않았습니다.",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_toUid"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="reqVisit" className=" blockLabel">
                  <span>방문 요청일</span>
                </label>
                <div>
                  <input type="date" id="reqVisit" {...register("_reqVisit")} />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="siteAddress" className=" blockLabel">
                  <span>방문 요청 주소</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="siteAddress"
                    name="_siteAddress"
                    placeholder="방문을 요청할 주소를 입력해 주세요."
                    {...register("_siteAddress")}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="reqDetail" className=" blockLabel">
                  <span>요청 내역</span>
                </label>
                <div>
                  <textarea
                    type="textara"
                    id="reqDetail"
                    placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
                    {...register("_reqDetail")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_reqDetail"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>계산서 요청</span>
                </label>
                <ul className="detailContent">
                  {/* 세금 계산서 요청 */}
                  <li style={{ width: "50%" }}>
                    <div>
                      <span>세금계산서</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_reqBill") == "0"}
                          value="0"
                          id="DetailReqBill0"
                          {...register("_reqBill")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="DetailReqBill0"
                        >
                          미발급
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_reqBill") == "1"}
                          value="1"
                          id="DetailReqBill1"
                          {...register("_reqBill")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="DetailReqBill1"
                        >
                          발급
                        </label>
                      </div>
                    </div>
                  </li>
                  {/* 견적 요청서 요청 */}
                  <li style={{ width: "50%" }}>
                    <div>
                      <span>견적서</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_reqEstimate") == "0"}
                          value="0"
                          id="reqEstimate0"
                          {...register("_reqEstimate")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="reqEstimate0"
                        >
                          미발급
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_reqEstimate") == "1"}
                          value="1"
                          id="reqEstimate1"
                          {...register("_reqEstimate")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="reqEstimate1"
                        >
                          발급
                        </label>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="formContentWrap">
                <label htmlFor="reqPrice" className=" blockLabel">
                  <span>공사 희망 금액</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="reqPrice"
                    placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
                    value={
                      (watch("_reqPrice") &&
                        watch("_reqPrice")
                          .replace(/[^0-9]/g, "")
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                      ""
                    }
                    {...register("_reqPrice", {
                      // required: "입력되지 않았습니다.",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_reqPrice"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="addInfo" className=" blockLabel">
                  <span>추가 정보</span>
                </label>
                <div>
                  <textarea
                    id="addInfo"
                    placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
                    {...register("_addInfo")}
                  />
                </div>
              </div>
            </fieldset>

            {/* 갼적서 응답 내용  ================================================================ */}
            <fieldset>
              <h3>견적서 응답 내용</h3>

              <div className="formContentWrap">
                <label htmlFor="proVisit" className=" blockLabel">
                  <span>방문 제안일</span>
                </label>
                <div>
                  <input type="date" id="proVisit" {...register("_proVisit")} />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="proPrice" className=" blockLabel">
                  <span>공사 제안 금액</span>
                </label>
                <div>
                  <input
                    placeholder="견적 응답이 돌아오지 않았습니다."
                    id="proPrice"
                    value={
                      (watch("_proPrice") &&
                        watch("_proPrice")
                          .replace(/[^0-9]/g, "")
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                      ""
                    }
                    {...register("_proPrice")}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="proDetail" className=" blockLabel">
                  <span>응답 내용</span>
                </label>
                <div>
                  <textarea
                    id="proDetail"
                    placeholder="견적 응답이 돌아오지 않았습니다."
                    disabled={!!esid ? false : true}
                    {...register("_proDetail")}
                  />
                </div>
              </div>

              <ImageSet
                imgs={imgs}
                setImgs={setImgs}
                id="addImgs"
                title="참고 이미지"
                getData={getedData}
                getDataFinish={getDataFinish.current}
              />
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
