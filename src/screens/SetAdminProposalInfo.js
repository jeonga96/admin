import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import { urlGetProposalInfo, urlSetProposalInfo } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ImageSet from "../components/common/ServicesImageSetPreview";
import PieceRegisterSearchPopUp from "../components/common/PieceRegisterSearchPopUp";

export default function SetAdminProposalInfo() {
  const { prid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [getedData, setGetedData] = useState([]);
  const [imgs, setImgs] = useState([]);
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  const imgsIid = [];
  const [multilAddress, setMultilAddress] = useState({});

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    servicesPostData(urlGetProposalInfo, {
      prid: prid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 이미지 iid를 가지고 오기 위해 (imgs, titleImg) 사용
          setGetedData(res.data);

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

          setValue("_useFlag", res.data.useFlag.toString() || "1");
          setValue("_gongsaType", res.data.gongsaType || "reser");
          setValue("_canNego", res.data.canNego.toString() || "0");
          setValue("_contMethod", res.data.contMethod.toString() || "msg");
          setValue("_canTaxBill", res.data.canTaxBill.toString() || "0");
          setValue("_canCard", res.data.canCard.toString() || "0");
          setValue("_canCashBill", res.data.canCashBill.toString() || "0");
          setValue("_canExtraProp", res.data.canExtraProp.toString() || "0");

          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function setimateinfoSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);

    // setUserDetailInfo 수정
    servicesPostData(
      urlSetProposalInfo,
      // 견적서 응답 없음을 방문 제안일 기준으로 판단
      {
        prid: prid,
        fromUid: getValues("_fromUid"),
        toUid: getValues("_toUid"),
        gongsaType: getValues("_gongsaType").toString(),
        gname: getValues("_gname"),
        garea: getValues("_garea"),
        cname: getValues("_cname"),
        cceo: getValues("_cceo"),
        registration:
          (getValues("_registration") &&
            getValues("_registration").replace(",", "")) ||
          "",
        corporationno: getValues("_corporationno"),
        caddr: multilAddress.siteAddress,
        telnum: getValues("_telnum"),
        price:
          (getValues("_price") && getValues("_price").replace(",", "")) || "",
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
        if (res.status === "success") {
          console.log(res);
          alert("완료되었습니다!");
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  return (
    <>
      <div className="commonBox">
        <form
          className="formLayout"
          onSubmit={handleSubmit(setimateinfoSubmit)}
        >
          <ul className="tableTopWrap">
            <LayoutTopButton url="/proposalInfo" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            {/* 갼적서 요청 내용  ================================================================ */}
            <fieldset>
              <h3>견적서 요청 내용</h3>

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
                <label htmlFor="toUid" className=" blockLabel">
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
                <label htmlFor="fromUid" className=" blockLabel">
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

              {/* 주소 */}
              <PieceRegisterSearchPopUp
                siteAddress
                setMultilAddress={setMultilAddress}
                multilAddress={multilAddress}
                getedData={getedData}
              />

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

              <div className="formContentWrap">
                <label htmlFor="registration" className="blockLabel">
                  <span>사업자 등록 번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="registration"
                    placeholder="사업자 등록 번호를 입력해 주세요. (예시 000-00-00000)"
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
                  <span>법인구분번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="corporationno"
                    placeholder="법인구분번호를 적어주세요."
                    {...register("_corporationno")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_corporationno"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="telnum" className="blockLabel">
                  <span>전화번호</span>
                </label>
                <div>
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
                  <ErrorMessage
                    errors={errors}
                    name="_telnum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="price" className=" blockLabel">
                  <span>견적 금액</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="price"
                    placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
                    value={
                      (watch("_price") &&
                        watch("_price")
                          .replace(/[^0-9]/g, "")
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                      ""
                    }
                    {...register("_price", {
                      // required: "입력되지 않았습니다.",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_price"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
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

              {/* 연락 방법 */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>연락 방법</span>
                </div>
                <div className="formPaddingWrap">
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

              {/* 세금계산서 요청 */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>세금계산서 요청</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_canTaxBill") == "0"}
                    value="0"
                    id="canTaxBill0"
                    {...register("_canTaxBill")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="canTaxBill0">
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
                  <label className="listSearchRadioLabel" htmlFor="canTaxBill1">
                    예
                  </label>
                </div>
              </div>

              {/* 카드 결제 여부 */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>카드결제 가능</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_canCard") == "0"}
                    value="0"
                    id="canCard0"
                    {...register("_canCard")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="canCard0">
                    아니오
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_canCard") == "1"}
                    value="1"
                    id="canCard1"
                    {...register("_canCard")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="canCard1">
                    예
                  </label>
                </div>
              </div>

              {/* 현금 매출 영수증 */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>현금매출영수증 발급</span>
                </div>
                <div className="formPaddingWrap">
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
