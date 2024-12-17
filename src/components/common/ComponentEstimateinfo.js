// 사업자 회원 관리 > 견적의뢰서 관리 > 공사콕 견적의뢰서 상세 관리 (!!esid)

import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";

import * as DATA from "../../action/data";

import ImageSet from "../services/ServicesImageSetPreview";

export default function ComponentEstimateinfo() {
  // react-hook-form 라이브러리
  const { register, setValue, getValues, watch } = useForm();
  const { prid } = useParams();
  const dispatch = useDispatch();
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const navigate = useNavigate();
  const [residData, setResidData] = useState({});

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    // 해당 esid의 견적의뢰서 가지고 오기
    API.servicesPostData(APIURL.urlGetEstimateInfo, {
      esid: getedData.resid,
    })
      .then((res) => {
        if (res.status === "success") {
          setResidData(res.data);
        }
      })
      .catch((res) => console.log(res));
  }, []);

  useEffect(() => {
    const payload = {
      ...getedData,
      imgs: residData.addImgs,
    };
    dispatch(DATA.serviceGetedData(payload));

    setValue("_fromUid", residData.fromUid || "");
    setValue("_toUid", residData.toUid || "");
    setValue("_reqDetailEsti", residData.reqDetail || "");
    setValue("_reqPriceEsti", residData.reqPrice || "");

    setValue(
      "_reqVisitDate",
      (residData.reqVisit && residData.reqVisit.slice(0, 10)) || ""
    );
    setValue(
      "_reqVisitTime",
      (residData.reqVisit && residData.reqVisit.slice(11, 19)) || ""
    );
    setValue("_addInfo", residData.addInfo || "");
    setValue("_proDetail", residData.proDetail || "");
    setValue("_proPrice", residData.proPrice || "");
    setValue(
      "_proVisit",
      (residData.proVisit && residData.proVisit.slice(0, 10)) || ""
    );

    setValue(
      "_reqEstimate",
      residData.reqEstimate && residData.reqEstimate.toString()
    );
    setValue("_reqBill", residData.reqBill && residData.reqBill.toString());

    setValue("_canCardEsti", residData.canCard && residData.canCard);
    setValue(
      "_canCashBillEsti",
      residData.canCashBill && residData.canCashBill
    );
    setValue("_useFlagEsti", residData.useFlag && residData.useFlag.toString());
    setValue("_isGongsaEsti", residData.isGongsa);
    setValue("_gongsaTypeEsti", residData.gongsaType || "reser");
    setValue("_readFlagEsti", residData.readFlag || "0");
    setValue("_siteAddressEsti", residData.siteAddress);
    console.log(residData);
  }, [residData]);

  return (
    residData.fromUid && (
      <>
        {/* 갼적서 요청 내용  ================================================================ */}
        <fieldset
          id="CompanyDetail_2"
          style={prid && { border: "1px solid rgba(0,0,0,0.2)" }}
        >
          <h3 style={prid && { backgroundColor: "rgba(0,0,0,0.2)" }}>
            견적의뢰서
            <button
              onClick={() => navigate(`/estimateinfo/${getedData.resid}`)}
            >
              견적의뢰서 수정
            </button>
          </h3>

          <div className="formContentWrap">
            <label htmlFor="name" className=" blockLabel">
              <span>공사 견적의뢰서 작성</span>
            </label>
            <div className="formPaddingWrap">
              <input
                disabled
                type="radio"
                value="1"
                checked={getValues("_isGongsaEsti")?.toString() === "1"}
                id="isGongsaEsti1"
                className="listSearchRadioInput"
                {...register("_isGongsaEsti", {
                  onChange: (e) => setValue("_isGongsaEsti", e.target.value), // 변경 사항을 저장
                })}
              />
              <label htmlFor="isGongsaEsti1" className="listSearchRadioLabel">
                예
              </label>

              <input
                disabled
                type="radio"
                value="0"
                checked={getValues("_isGongsaEsti")?.toString() === "0"}
                id="isGongsaEsti0"
                className="listSearchRadioInput"
                {...register("_isGongsaEsti", {
                  onChange: (e) => setValue("_isGongsaEsti", e.target.value), // 변경 사항을 저장
                })}
              />
              <label htmlFor="isGongsaEsti0" className="listSearchRadioLabel">
                아니요 ( 기타 )
              </label>
            </div>
          </div>

          {/* 공사 타입 */}
          <div className="formContentWrap">
            <label htmlFor="name" className=" blockLabel">
              <span>공사 유형 선택</span>
            </label>
            <div
              className={`formPaddingWrap ${
                getValues("_isGongsaEsti")?.toString() === 0 ? "isGongsa0" : ""
              }`}
            >
              <input
                type="checkbox"
                value="emer"
                id="emerEsti"
                className="listSearchRadioInput"
                checked={
                  (watch("_gongsaType") &&
                    watch("_gongsaType").includes("emer")) ||
                  false
                }
                {...register("_gongsaType")}
                disabled
              />
              <label htmlFor="emerEsti" className="listSearchRadioLabel">
                긴급
              </label>

              <input
                type="checkbox"
                value="inday"
                id="indayEsti"
                className="listSearchRadioInput"
                checked={
                  (watch("_gongsaType") &&
                    watch("_gongsaType").includes("inday")) ||
                  false
                }
                {...register("_gongsaType")}
                disabled
              />
              <label htmlFor="indayEsti" className="listSearchRadioLabel">
                당일
              </label>

              <input
                type="checkbox"
                value="reser"
                id="reserEsti"
                className="listSearchRadioInput"
                checked={
                  watch("_gongsaType") && watch("_gongsaType").includes("reser")
                    ? true
                    : false
                }
                {...register("_gongsaType")}
                disabled
              />
              <label htmlFor="reserEsti" className="listSearchRadioLabel">
                예약
              </label>

              <input
                type="checkbox"
                value=""
                id="resetEsti"
                className="listSearchRadioInput"
                checked={
                  watch("_gongsaType") == "" || !watch("_gongsaType")
                    ? true
                    : false
                }
                {...register("_gongsaType", {
                  onChange: (e) => {
                    if (!!watch("_gongsaType") && !e.target.value) {
                      setValue("_gongsaType", "");
                    }
                  },
                })}
                disabled
              />
              <label htmlFor="resetEsti" className="listSearchRadioLabel">
                일반
              </label>
            </div>
          </div>

          <div className="formContentWrap" style={{ width: "100%" }}>
            <label htmlFor="reqDetailEsti" className=" blockLabel">
              <span>
                원하는 공사 또는
                <br />
                기타 입력
              </span>
            </label>
            <div>
              <textarea
                disabled
                type="textara"
                id="reqDetailEsti"
                placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
                {...register("_reqDetailEsti")}
              />
            </div>
          </div>

          <div className="formContentWrap">
            <label htmlFor="reqPriceEsti" className=" blockLabel">
              <span>견적의뢰 책정 금액</span>
            </label>
            <div style={{ display: "flex" }}>
              <input
                disabled
                type="text"
                id="reqPriceEsti"
                className="textAlineRight"
                {...register("_reqPriceEsti")}
                value={
                  (watch("_reqPriceEsti") &&
                    watch("_reqPriceEsti")
                      .replace(/[^0-9]/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                  ""
                }
                style={{ marginBottom: 0 }}
              />
              <span
                style={{
                  width: "38px",
                  textAlign: "center",
                  lineHeight: "30px",
                }}
              >
                원 이내
              </span>
            </div>
          </div>

          <div className="formContentWrap">
            <label htmlFor="reqVisit" className=" blockLabel">
              <span>방문 일정 선택</span>
            </label>
            <div>
              <input
                disabled
                type="date"
                id="reqVisit"
                {...register("_reqVisitDate")}
                style={{ width: "50%", marginBottom: 0 }}
              />
              <input
                disabled
                type="time"
                id="reqVisit"
                {...register("_reqVisitTime")}
                style={{ width: "50%" }}
              />
            </div>
          </div>

          <div className="formContentWrap" style={{ width: "100%" }}>
            <label htmlFor="address" className=" blockLabel">
              <span>결제 관련</span>
            </label>
            <ul className="detailContent">
              {/* 견적서 */}
              <li style={{ width: "25%" }}>
                <div>
                  <span>견적서 요청</span>
                  <div className="detailContentInputWrap">
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
                      필요
                    </label>

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
                      불필요
                    </label>
                  </div>
                </div>
              </li>

              {/* 세금 계산서 요청 */}
              <li style={{ width: "25%" }}>
                <div>
                  <span>세금계산서</span>
                  <div className="detailContentInputWrap">
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
                      필요
                    </label>

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
                      불필요
                    </label>
                  </div>
                </div>
              </li>

              {/* 카드 결제 */}
              <li style={{ width: "25%" }}>
                <div className="detailContentCheck">
                  <span style={{ width: "100px" }}>카드 결제</span>
                  <div className="detailContentInputWrap">
                    <input
                      disabled
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_canCardEsti") == "1"}
                      value="1"
                      id="canCard1"
                      {...register("_canCardEsti")}
                    />
                    <label className="listSearchRadioLabel" htmlFor="canCard1">
                      예
                    </label>

                    <input
                      disabled
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_canCardEsti") == "0"}
                      value="0"
                      id="canCard0"
                      {...register("_canCardEsti")}
                    />
                    <label className="listSearchRadioLabel" htmlFor="canCard0">
                      아니오
                    </label>
                  </div>
                </div>
              </li>

              {/* 현금영수증 */}
              <li style={{ width: "25%" }}>
                <div className="detailContentCheck">
                  <span style={{ width: "150px" }}>현금영수증</span>
                  <div className="detailContentInputWrap">
                    <input
                      disabled
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_canCashBillEsti") == "1"}
                      value="1"
                      id="canCashBill1"
                      {...register("_canCashBillEsti")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="canCashBill1"
                    >
                      필요
                    </label>
                    <input
                      disabled
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_canCashBillEsti") == "0"}
                      value="0"
                      id="canCashBill0"
                      {...register("_canCashBillEsti")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="canCashBill0"
                    >
                      불필요
                    </label>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="formContentWrap" style={{ width: "100%" }}>
            <label htmlFor="siteAddressEsti" className=" blockLabel">
              <span>공사 현장 장소</span>
            </label>
            <div>
              <input
                disabled
                type="text"
                id="siteAddressEsti"
                name="_siteAddressEsti"
                placeholder="간단 입력"
                {...register("_siteAddressEsti")}
              />
            </div>
          </div>

          <div className="formContentWrap" style={{ width: "100%" }}>
            <label htmlFor="addInfo" className=" blockLabel">
              <span>전달 사항</span>
            </label>
            <div>
              <textarea
                disabled
                id="addInfo"
                placeholder="50자 이내로 입력해주세요."
                {...register("_addInfo")}
                maxLength={50}
              />
            </div>
          </div>

          <ImageSet
            disabled
            id="imgs"
            title="이미지 ( 최대 10장 )"
            maxLangImage={10}
          />
        </fieldset>
      </>
    )
  );
}
