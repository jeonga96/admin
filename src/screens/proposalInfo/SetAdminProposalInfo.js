// 사업자 회원 관리 > 공사콕 견적서 > 공사콕 견적서 상세 관리 (prid 여부 확인)

import { useDispatch, shallowEqual, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentEstimateinfo from "../../components/common/ComponentEstimateinfo";
import ServicesImageSetPreview from "../../components/services/ServicesImageSetPreview";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";

export default function SetAdminProposalInfo() {
  const { prid } = useParams();
  const dispatch = useDispatch();
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  const tableTopScrollBtnDataSet = useRef([
    { idName: "CompanyDetail_1", text: "견적서 분류" },
    { idName: "CompanyDetail_2", text: "견적의뢰서 작성" },
    { idName: "CompanyDetail_3", text: "견적서 세부 내용" },
  ]);

  const tableTopScrollBtnDataAdd = useRef([
    { idName: "CompanyDetail_1", text: "견적서 분류" },
    { idName: "CompanyDetail_3", text: "견적서 세부 내용" },
  ]);

  const getedData = useSelector((state) => state.getedData, shallowEqual);
  // 이미지 ------------------------------------------------------------------------
  // imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const multiImgs = useSelector((state) => state.multiImgsData, shallowEqual);
  const imgsIid = [];
  const [toName, SetToName] = useState("");

  useLayoutEffect(() => {
    // 추가 시 기본 값
    setValue("_useFlag", "1");
    setValue("_gongsaType", "reser");
    setValue("_canNego", "0");
    setValue("_contMethod", "msg");
    setValue("_canTaxBill", "0");
    setValue("_canCard", "0");
    setValue("_canCashBill", "0");
    setValue("_canExtraProp", "0");

    // 수정 시 url에 prid를 확인하여 데이터 받아옴
    if (!!prid) {
      API.servicesPostData(STR.urlGetProposalInfo, {
        prid: prid,
      })
        .then((res) => {
          if (res.status === "success") {
            // 이미지 iid를 가지고 오기 위해 (imgs, titleImg) 사용
            dispatch({
              type: "serviceGetedData",
              payload: { ...res.data },
            });

            // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
            setValue("_fromUid", res.data.fromUid || "");
            setValue("_toUid", res.data.toUid || "");

            setValue("_gname", res.data.gname || "");
            setValue("_garea", res.data.garea || "");
            setValue("_cname", res.data.cname || "");
            setValue("_cceo", res.data.cceo || "");
            setValue("_registration", res.data.registration || "");
            setValue("_corporationno", res.data.corporationno || "");
            setValue("_telnum", res.data.telnum || "");
            setValue("_price", res.data.price || "");
            setValue("_extraCon", res.data.extraCon || "");
            setValue("_caddr", res.data.caddr || "");

            setValue("_useFlag", res.data.useFlag.toString() || "1");
            setValue("_gongsaType", res.data.gongsaType || "reser");
            setValue("_canNego", res.data.canNego.toString() || "0");
            setValue("_contMethod", res.data.contMethod.toString() || "msg");
            setValue("_canTaxBill", res.data.canTaxBill.toString() || "0");
            setValue("_canCard", res.data.canCard.toString() || "0");
            setValue("_canCashBill", res.data.canCashBill.toString() || "0");
            setValue("_canExtraProp", res.data.canExtraProp.toString() || "0");
          }
        })
        .catch((res) => console.log(res));
    }
  }, []);

  useLayoutEffect(() => {
    if (!!prid && !!getValues("_toUid")) {
      API.servicesPostData(STR.urlGetUserCid, {
        uid: getValues("_toUid"),
      }).then((res) => {
        if (res.status === "success") {
          API.servicesPostData(STR.urlGetCompanyDetail, {
            rcid: res.data.cid,
          }).then((res2) => SetToName(res2.data.name));
        }
      });
    }
  }, [getValues("_toUid")]);

  function fnSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    UD.serviesGetImgsIid(imgsIid, multiImgs);
    // setUserDetailInfo 수정
    API.servicesPostData(
      STR.urlSetProposalInfo,
      // 견적서 응답 없음을 방문 제안일 기준으로 판단
      !!prid
        ? // url에 prid를 확인하여 수정, 추가를 결정
          {
            prid: prid,
            fromUid: getValues("_fromUid"),
            toUid: getValues("_toUid"),
            gongsaType: getValues("_gongsaType").toString(),
            gname: getValues("_gname"),
            garea: getValues("_garea"),
            cname: getValues("_cname"),
            cceo: getValues("_cceo"),
            registration: getValues("_registration"),
            corporationno: getValues("_corporationno"),
            caddr: getValues("_caddr"),
            telnum: getValues("_telnum"),
            price:
              (getValues("_price") && getValues("_price").replace(",", "")) ||
              "",
            canNego: getValues("_canNego"),
            contMethod: getValues("_contMethod"),
            canTaxBill: getValues("_canTaxBill"),
            canCard: getValues("_canCard"),
            canCashBill: getValues("_canCashBill"),
            canExtraProp: getValues("_canExtraProp"),
            extraCon: getValues("_extraCon"),
            addImgs: imgsIid.toString() || "",
            useFlag: getValues("_useFlag"),
          }
        : {
            fromUid: getValues("_fromUid"),
            toUid: getValues("_toUid"),
            gongsaType: getValues("_gongsaType").toString(),
            gname: getValues("_gname"),
            garea: getValues("_garea"),
            cname: getValues("_cname"),
            cceo: getValues("_cceo"),
            registration: getValues("_registration"),
            corporationno: getValues("_corporationno"),
            caddr: getValues("_caddr"),
            telnum: getValues("_telnum"),
            price:
              (getValues("_price") && getValues("_price").replace(",", "")) ||
              "",
            canNego: getValues("_canNego"),
            contMethod: getValues("_contMethod"),
            canTaxBill: getValues("_canTaxBill"),
            canCard: getValues("_canCard"),
            canCashBill: getValues("_canCashBill"),
            canExtraProp: getValues("_canExtraProp"),
            extraCon: getValues("_extraCon"),
            addImgs: imgsIid.toString() || "",
            useFlag: getValues("_useFlag"),
          }
    )
      .then((res) => {
        if (res.status === "fail") {
          UD.servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          UD.servicesUseToast("완료되었습니다!", "s");
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            <ComponentTableTopScrollBtn
              data={
                !!prid
                  ? tableTopScrollBtnDataSet.current
                  : tableTopScrollBtnDataAdd.current
              }
            />
            <LayoutTopButton url="/proposalInfo" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            {/* 갼적서 요청 내용  ================================================================ */}
            {/* CompanyDetail_2 ============================================================ */}
            <fieldset id="CompanyDetail_1">
              <h3>견적서 분류</h3>

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
                    style={{ width: "50%", marginBottom: "0px" }}
                    type="text"
                    id="fromUid"
                    name="_fromUid"
                    placeholder="견적서를 요청받은 관리번호를 입력해 주세요."
                    {...register("_fromUid", {
                      required: "입력되지 않았습니다.",
                    })}
                  />
                  <input
                    style={{ width: "50%" }}
                    type="text"
                    disabled
                    value={getValues("_cname")}
                    placeholder="사업자 회원이 아닙니다."
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="toUid" className=" blockLabel">
                  <span>견적 수령</span>
                </label>
                <div>
                  <input
                    style={{ width: "50%", marginBottom: "0px" }}
                    type="text"
                    id="toUid"
                    placeholder="견적서를 요청한 관리번호를 입력해 주세요."
                    {...register("_toUid", {
                      required: "입력되지 않았습니다.",
                    })}
                  />
                  <input
                    style={{ width: "50%" }}
                    type="text"
                    disabled
                    value={toName}
                    placeholder="사업자 회원이 아닙니다."
                  />
                </div>
              </div>
            </fieldset>

            {/* CompanyDetail_2 ============================================================ */}
            {getedData.resid !== undefined && !!prid && (
              <ComponentEstimateinfo />
            )}

            {/* CompanyDetail_3 ============================================================ */}
            <fieldset id="CompanyDetail_3">
              <h3>
                견적서 세부 내용
                {getedData.readFlag == "1" ? (
                  <span>열람</span>
                ) : (
                  <span>미열람</span>
                )}
              </h3>

              <div className="formContentWrap">
                <label htmlFor="gname" className=" blockLabel">
                  <span>공사명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="gname"
                    placeholder="공사명을 적어주세요."
                    {...register("_gname")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_gname"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="garea" className=" blockLabel">
                  <span>공사면적</span>
                </label>
                <div>
                  <input
                    type="number"
                    id="garea"
                    placeholder="공사면적을 적어주세요."
                    {...register("_garea")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_garea"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="cname" className=" blockLabel">
                  <span>업체명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="cname"
                    placeholder="업체명을 적어주세요."
                    {...register("_cname")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_cname"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="cceo" className=" blockLabel">
                  <span>대표자명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="cceo"
                    placeholder="업체의 대표자 이름을 적어주세요."
                    {...register("_cceo")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_cceo"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              {/* 주소 */}
              <div className="formContentWrap">
                <label htmlFor="caddr" className=" blockLabel">
                  <span>사업장 주소</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="caddr"
                    placeholder="사업장 주소를 입력해주세요."
                    {...register("_caddr")}
                  />
                </div>
              </div>

              {/* 카드 결제 여부----------------- */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>연락</span>
                </div>
                <ul className="detailContent">
                  <li>
                    <div className="detailContentCheck">
                      <span style={{ width: "80px" }}>방법</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_contMethod") == "msg"}
                          value="msg"
                          id="contMethodMsg"
                          {...register("_contMethod")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="contMethodMsg"
                        >
                          메신저
                        </label>
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_contMethod") == "tel"}
                          value="tel"
                          id="contMethodTel"
                          {...register("_contMethod")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="contMethodTel"
                        >
                          전화
                        </label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span style={{ width: "100px" }}>연락처</span>
                      <div className="formPaddingWrap">
                        <input
                          type="text"
                          id="telnum"
                          placeholder="전화번호를 입력해 주세요. (예시 00-0000-0000)"
                          value={
                            (watch("_telnum") &&
                              watch("_telnum")
                                .replace(/[^0-9]/g, "")
                                .replace(
                                  /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                                  "$1-$2-$3"
                                )
                                .replace("--", "-")) ||
                            ""
                          }
                          {...register("_telnum", {
                            required: "입력되지 않았습니다.",
                            pattern: {
                              value: /^[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}/,
                              message: "형식에 맞지 않습니다.",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="formContentWrap">
                <label htmlFor="registration" className="blockLabel">
                  <span>사업자 등록 번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="registration"
                    placeholder="사업자 등록 번호를 입력해 주세요. (예시 000-00-00000)"
                    maxLength="12"
                    value={
                      (watch("_registration") &&
                        watch("_registration")
                          .replace(/[^0-9]/g, "")
                          .replace(/([0-9]{3})([0-9]{2})([0-9]+)/, "$1-$2-$3")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_registration", {
                      required: "입력되지 않았습니다.",
                      pattern: {
                        value: /^[0-9]{3}-[0-9]{2}-[0-9]{5}/,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_registration"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="corporationno" className=" blockLabel">
                  <span>법인 등록 번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="corporationno"
                    maxLength="14"
                    value={
                      (watch("_corporationno") &&
                        watch("_corporationno")
                          .replace(/^(\d{0,6})(\d{0,7})$/g, "$1-$2")
                          .replace(/\-{1}$/g, "")) ||
                      ""
                    }
                    {...register("_corporationno")}
                  />
                </div>
              </div>

              {/* 추가 협의 가능 */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>추가 협의 가능</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_canNego") == "0"}
                    value="0"
                    id="canNego0"
                    {...register("_canNego")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="canNego0">
                    예
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_canNego") == "1"}
                    value="1"
                    id="canNego1"
                    {...register("_canNego")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="canNego1">
                    아니오
                  </label>
                </div>
              </div>

              {/* 추가 상세 견적서 */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>추가 상세견적서 필요</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_canExtraProp") == "0"}
                    value="0"
                    id="canExtraProp0"
                    {...register("_canExtraProp")}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="canExtraProp0"
                  >
                    아니오
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_canExtraProp") == "1"}
                    value="1"
                    id="canExtraProp1"
                    {...register("_canExtraProp")}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="canExtraProp1"
                  >
                    예
                  </label>
                </div>
              </div>

              {/* 카드 결제 여부 & 견적금액----------------- */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>결제 관련</span>
                </div>
                <ul className="detailContent">
                  <li>
                    <div className="detailContentCheck">
                      <span style={{ width: "100px" }}>카드결제</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_canCard") == "0"}
                          value="0"
                          id="canCard0"
                          {...register("_canCard")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="canCard0"
                        >
                          불가
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_canCard") == "1"}
                          value="1"
                          id="canCard1"
                          {...register("_canCard")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="canCard1"
                        >
                          가능
                        </label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span style={{ width: "100px" }}>견적금액</span>
                      <div className="formPaddingWrap">
                        <input
                          type="text"
                          id="price"
                          placeholder="견적금액을 입력해 주세요."
                          value={
                            (watch("_price") &&
                              watch("_price")
                                .replace(/[^0-9]/g, "")
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                            ""
                          }
                          {...register("_price")}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 연말정산, 세금계산서&현금매출영수증*/}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>세무 관련</span>
                </div>

                <ul className="detailContent">
                  <li>
                    <div className="detailContentCheck">
                      <span style={{ width: "100px" }}>세금계산서</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_canTaxBill") == "0"}
                          value="0"
                          id="canTaxBill0"
                          {...register("_canTaxBill")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="canTaxBill0"
                        >
                          아니오
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_canTaxBill") == "1"}
                          value="1"
                          id="canTaxBill1"
                          {...register("_canTaxBill")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="canTaxBill1"
                        >
                          예
                        </label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="detailContentCheck">
                      <span style={{ width: "150px" }}>현금매출영수증</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_canCashBill") == "0"}
                          value="0"
                          id="canCashBill0"
                          {...register("_canCashBill")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="canCashBill0"
                        >
                          아니오
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_canCashBill") == "1"}
                          value="1"
                          id="canCashBill1"
                          {...register("_canCashBill")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="canCashBill1"
                        >
                          예
                        </label>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="extraCon" className=" blockLabel">
                  <span>추가 전달사항</span>
                </label>
                <div>
                  <textarea
                    id="extraCon"
                    placeholder="추가 전달사항이 있으면 작성해주세요."
                    {...register("_extraCon")}
                  />
                </div>
              </div>

              <ServicesImageSetPreview id="addImgs" title="참고 이미지" />
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
