// 사업자 회원 관리 > 견적의뢰서 관리 > 공사콕 견적의뢰서 상세 관리 (!!esid)

import { shallowEqual, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";

import * as STR from "../../service/string";

import ImageSet from "../../components/services/ServicesImageSetPreview";

export default function ComponentEstimateinfo() {
  // react-hook-form 라이브러리
  const {
    register,
    setValue,
    // getValues,
    watch,
  } = useForm();
  const getedData = useSelector((state) => state.getedData, shallowEqual);

  const navigate = useNavigate();

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    // 추가 시 라디오&체크박스 기본 값
    setValue("_reqEstimate", "1");
    setValue("_reqBill", "1");
    setValue("_useFlag", "1");
    setValue("_gongsaType", "reser");

    // 해당 esid의 견적의뢰서 가지고 오기
    API.servicesPostData(STR.urlGetEstimateInfo, {
      esid: getedData.resid,
    })
      .then((res) => {
        if (res.status === "success") {
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
        }
      })
      .catch((res) => console.log(res));
  }, []);

  return (
    <>
      {/* 갼적서 요청 내용  ================================================================ */}
      <fieldset id="CompanyDetail_2">
        <h3>
          견적의뢰서
          <button onClick={() => navigate(`/estimateinfo/${getedData.resid}`)}>
            견적의뢰서 수정
          </button>
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
              disabled
            />
            <label className="listSearchRadioLabel" htmlFor="DetailUseFlag0">
              휴면
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              checked={watch("_useFlag") == "1"}
              value="1"
              id="DetailUseFlag1"
              {...register("_useFlag")}
              disabled
            />
            <label className="listSearchRadioLabel" htmlFor="DetailUseFlag1">
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
              disabled
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
              disabled
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
              disabled
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
              disabled
              type="text"
              id="fromUid"
              name="_fromUid"
              placeholder="견적서를 요청받은 관리번호를 입력해 주세요."
              {...register("_fromUid", {
                required: "입력되지 않았습니다.",
              })}
            />
          </div>
        </div>

        <div className="formContentWrap">
          <label htmlFor="toUid" className=" blockLabel">
            <span>견적 수령</span>
          </label>
          <div>
            <input
              disabled
              type="text"
              id="toUid"
              placeholder="견적서를 요청한 관리번호를 입력해 주세요."
              {...register("_toUid", {
                required: "입력되지 않았습니다.",
              })}
            />
          </div>
        </div>

        <div className="formContentWrap">
          <label htmlFor="reqVisit" className=" blockLabel">
            <span>방문 요청일</span>
          </label>
          <div>
            <input
              disabled
              type="date"
              id="reqVisit"
              {...register("_reqVisit")}
            />
          </div>
        </div>

        <div className="formContentWrap">
          <label htmlFor="siteAddress" className=" blockLabel">
            <span>방문 요청 주소</span>
          </label>
          <div>
            <input
              disabled
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
              disabled
              type="textara"
              id="reqDetail"
              placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
              {...register("_reqDetail")}
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
              disabled
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
              {...register("_reqPrice")}
            />
          </div>
        </div>

        <div className="formContentWrap" style={{ width: "100%" }}>
          <label htmlFor="addInfo" className=" blockLabel">
            <span>추가 정보</span>
          </label>
          <div>
            <textarea
              disabled
              id="addInfo"
              placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
              {...register("_addInfo")}
            />
          </div>
        </div>

        <ImageSet id="addImgs" title="참고 이미지" />
      </fieldset>
    </>
  );
}
