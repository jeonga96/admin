import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import { urlSetEstimateInfo, urlGetEstimateInfo } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ImageSet from "../components/common/ServicesImageSetPreview";
import PieceRegisterSearchPopUp from "../components/common/PieceRegisterSearchPopUp";

export default function SetAdminEstimateinfo() {
  const { esid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [getedData, setGetedData] = useState([]);
  const [imgs, setImgs] = useState([]);
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  const imgsIid = [];
  const [multilAddress, setMultilAddress] = useState({});
  // 비밀번호는 기본값 설정되면 안 되기 때문에 X
  const [checkData, setCheckData] = useState({
    reqEstimate: 1,
    reqBill: 1,
    useFlag: 1,
    gongsaType: "reser",
  });

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    servicesPostData(urlGetEstimateInfo, {
      esid: esid,
    })
      .then((res) => {
        if (res.status === "success") {
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

          // setMultilAddress({ siteAddress: res.data.siteAddress || "" });
          setCheckData({
            reqEstimate: String(res.data.reqEstimate) || "1",
            reqBill: String(res.data.reqBill) || "1",
            useFlag: String(res.data.useFlag) || "1",
            gongsaType: res.data.gongsaType || "reser",
          });

          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function setimateinfoSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);

    const reqDate = new Date(getValues("_reqVisit"));
    const proDate = new Date(getValues("_proVisit"));

    // setUserDetailInfo 수정
    servicesPostData(urlSetEstimateInfo, {
      esid: esid,
      toUid: getValues("_toUid"),
      fromUid: getValues("_fromUid"),
      gongsaType: checkData.gongsaType,
      reqDetail: getValues("_reqDetail"),
      reqPrice: getValues("_reqPrice"),
      siteAddress: multilAddress.siteAddress,
      reqVisit: reqDate.toISOString().slice(0, 19) || "",
      reqEstimate: checkData.reqEstimate,
      reqBill: checkData.reqBill,
      useFlag: checkData.useFlag,
      addInfo: getValues("_addInfo"),
      proDetail: getValues("_proDetail"),
      proPrice: getValues("_proPrice"),
      proVisit: proDate.toISOString().slice(0, 19) || "",
      addImgs: imgsIid.toString() || "",
    })
      .then((res) => {
        if (res.status === "success") {
          console.log(res);
          alert("완료되었습니다!");
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  // const arrrr = ["a", "a", "bb", "b", "c"];
  // const ar1 = arrrr.filter((it) => it !== "bb");
  // console.log(ar1);

  const handleOnchangeGonsatype = (e) => {
    const INVERTORARR = checkData.gongsaType.split(",");
    let arr = [];
    if (INVERTORARR.length == 1) {
      if (checkData.gongsaType !== e.target.value) {
        arr = [checkData.gongsaType, e.target.value];
      }
    } else {
      arr = [...INVERTORARR];
      if (arr.includes(e.target.value)) {
        console.log("1", arr);
        arr = arr.filter((it) => it !== e.target.value);
      } else {
        arr.push(e.target.value);
      }
      return arr;
    }
    arr = arr.toString();
    setCheckData({
      ...checkData,
      gongsaType: arr,
    });
  };
  console.log("toString", checkData.gongsaType);

  return (
    <>
      <div className="commonBox">
        <form
          className="formLayout"
          onSubmit={handleSubmit(setimateinfoSubmit)}
        >
          <ul className="tableTopWrap">
            <LayoutTopButton url="/estimateinfo" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            {/* 갼적서 요청 내용  ================================================================ */}
            <fieldset>
              <h3>견적서 요청 내용</h3>

              {/* 사용 플래그  */}
              <div className="formContentWrap">
                <div className="blockLabel">회원관리</div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={checkData.useFlag == "0"}
                    name="_detailUseFlag"
                    value="0"
                    id="DetailUseFlag0"
                    {...register("_detailUseFlag", {
                      onChange: (e) => {
                        setCheckData({
                          ...checkData,
                          useFlag: e.target.value,
                        });
                      },
                    })}
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
                    checked={checkData.useFlag == "1"}
                    name="_detailUseFlag"
                    value="1"
                    id="DetailUseFlag1"
                    {...register("_detailUseFlag", {
                      onChange: (e) => {
                        setCheckData({
                          ...checkData,
                          useFlag: e.target.value,
                        });
                      },
                    })}
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
                  공사 타입
                </label>
                <div className="formPaddingWrap">
                  <input
                    type="checkbox"
                    value="emer"
                    id="emer"
                    name="gongsaType"
                    className="listSearchRadioInput"
                    checked={checkData.gongsaType.includes("emer")}
                    onChange={handleOnchangeGonsatype}
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
                    checked={checkData.gongsaType.includes("inday")}
                    onChange={handleOnchangeGonsatype}
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
                    checked={checkData.gongsaType.includes("reser")}
                    onChange={handleOnchangeGonsatype}
                  />
                  <label htmlFor="reser" className="listSearchRadioLabel">
                    예약
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="toUid" className=" blockLabel">
                  견적 요청
                </label>
                <div>
                  <input
                    type="text"
                    id="toUid"
                    name="_toUid"
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
                <label htmlFor="fromUid" className=" blockLabel">
                  견적 수령
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
                <label htmlFor="reqVisit" className=" blockLabel">
                  방문 요청일
                </label>
                <div>
                  <input
                    type="date"
                    id="reqVisit"
                    name="_reqVisit"
                    {...register("_reqVisit")}
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

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="toUid" className=" blockLabel">
                  요청 내역
                </label>
                <div>
                  <textarea
                    type="textara"
                    id="reqDetail"
                    name="_reqDetail"
                    placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
                    {...register("_reqDetail", {
                      // required: "입력되지 않았습니다.",
                    })}
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

              {/* 세금 계산서 요청 */}
              <div className="formContentWrap">
                <div className="blockLabel">세금계산서 요청</div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={checkData.reqBill == "0"}
                    name="_detailReqBill"
                    value="0"
                    id="DetailReqBill0"
                    {...register("_detailReqBill", {
                      onChange: (e) => {
                        setCheckData({
                          ...checkData,
                          reqBill: e.target.value,
                        });
                      },
                    })}
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
                    checked={checkData.reqBill == "1"}
                    name="_detailReqBill"
                    value="1"
                    id="DetailReqBill1"
                    {...register("_detailReqBill", {
                      onChange: (e) => {
                        setCheckData({
                          ...checkData,
                          reqBill: e.target.value,
                        });
                      },
                    })}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="DetailReqBill1"
                  >
                    발급
                  </label>
                </div>
              </div>

              {/* 견적 요청서 요청 */}
              <div className="formContentWrap">
                <div className="blockLabel">견적서 요청</div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={checkData.reqEstimate == "0"}
                    name="_reqEstimate"
                    value="0"
                    id="reqEstimate0"
                    {...register("_reqEstimate", {
                      onChange: (e) => {
                        setCheckData({
                          ...checkData,
                          reqEstimate: e.target.value,
                        });
                      },
                    })}
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
                    checked={checkData.reqEstimate == "1"}
                    name="_reqEstimate"
                    value="1"
                    id="reqEstimate1"
                    {...register("_reqEstimate", {
                      onChange: (e) => {
                        setCheckData({
                          ...checkData,
                          reqEstimate: e.target.value,
                        });
                      },
                    })}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="reqEstimate1"
                  >
                    발급
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="reqPrice" className=" blockLabel">
                  공사 희망 금액
                </label>
                <div>
                  <input
                    type="number"
                    id="reqPrice"
                    name="_reqPrice"
                    placeholder="견적 요청에 대한 상세 내용을 입력해 주세요."
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
                  추가 정보
                </label>
                <div>
                  <textarea
                    id="addInfo"
                    name="_addInfo"
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
                  방문 제안일
                </label>
                <div>
                  <input
                    type="date"
                    id="proVisit"
                    name="_proVisit"
                    {...register("_proVisit")}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="proPrice" className=" blockLabel">
                  공사 제안 금액
                </label>
                <div>
                  <input
                    type="number"
                    id="proPrice"
                    name="_proPrice"
                    placeholder="견적 응답이 돌아오지 않았습니다."
                    {...register("_proPrice")}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="proDetail" className=" blockLabel">
                  응답 내용
                </label>
                <div>
                  <textarea
                    id="proDetail"
                    name="_proDetail"
                    placeholder="견적 응답이 돌아오지 않았습니다."
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
