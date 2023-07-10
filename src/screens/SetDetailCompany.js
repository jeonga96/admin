// 사업자 회원 관리 > 사업자 상세정보 (수정)
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { servicesPostData } from "../Services/importData";

import {
  serviesPostDataSettingRcid,
  servicesUseToast,
} from "../Services/useData";
import { serviesGetImgsIid } from "../Services/useData";

import {
  urlGetCompanyDetail,
  urlSetCompanyDetail,
  urlSetCompany,
  urlCompanyNoticeList,
  urlGetCompany,
  urlReviewList,
  urlListEstimateInfo,
  urlListProposalInfo,
  urlSetUser,
  urlGetUser,
} from "../Services/string";
import SetImage from "../components/services/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentSetCompany from "../components/common/ComponentSetCompany";
import PieceDetailListLink from "../components/piece/PieceDetailListLink";
import PieceRegisterSearchPopUp from "../components/services/ServiceRegisterSearchPopUp";
import ComponentTableTopNumber from "../components/piece/PieceTableTopNumber";
import ComponentTableTopScrollBtn from "../components/piece/PieceTableTopScrollBtn";

export default function SetCompanyDetail() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      _detailUseFlag: "1",
      _status: "2",
      _gongsaType: "",
      _comType: "일반사업자",
    },
  });

  const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_1", text: "계약 기본 정보" },
    { idName: "CompanyDetail_2", text: "사업자 기본 정보" },
    { idName: "CompanyDetail_3", text: "사업자 정보" },
    { idName: "CompanyDetail_4", text: "청구결제사항" },
    { idName: "CompanyDetail_5", text: "견적 관리" },
    { idName: "CompanyDetail_6", text: "고객 관리" },
  ]);

  // 데이터 ------------------------------------------------------------------------
  // 작성된 데이터를 받아옴
  const getedData = useSelector((state) => state.getedData, shallowEqual);
  // 이미지 ------------------------------------------------------------------------
  const titleImg = useSelector((state) => state.imgData, shallowEqual);
  const imgs = useSelector((state) => state.imgsData, shallowEqual);
  const regImgs = useSelector((state) => state.multiImgsData, shallowEqual);
  // 서버에서 titleImg, imgs의 iid를 받아오기 위해 사용
  const imgsIid = [];
  // 주소 ------------------------------------------------------------------------
  // 사업자 상세관리에서 사용하는 setCompanyDetailInfo 외 API  --------------------------------------
  const multilAddress = useSelector(
    (state) => state.multilAddressData,
    shallowEqual
  );
  // setUser 수정 - 하위컴포넌트에게 전달
  const [companyData, setCompanyData] = useState({});

  // 하단 링크 이동 될 사업자 공지사항, 사업자 리뷰, 견적서
  const [noticeList, setNoticeList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [toEstimateinfo, setToEstimateinfo] = useState([]);
  const [fromEstimateinfo, setFromEstimateinfo] = useState([]);
  const [toproposalInfo, setToproposalInfo] = useState([]);
  const [fromproposalInfo, setFromproposalInfo] = useState([]);

  const ruid = useRef("");

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    // 상세 회사정보 불러오기 기존 값이 없다면 새로운 회원이다. 새로 작성함
    servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          dispatch({
            type: "getedData",
            payload: { ...res.data },
          });

          setValue("_detailUseFlag", res.data.useFlag.toString() || 1);
          setValue(
            "_status",
            (res.data.status && res.data.status.toString()) || 2
          );
          setValue(
            "_gongsaType",
            res.data.gongsaType === undefined ? "" : res.data.gongsaType
          );
          setValue("_comType", res.data.comType);
          setValue("_name", res.data.name || "");
          setValue("_comment", res.data.comment || "");
          setValue("_location", res.data.location || "");
          setValue("_registration", res.data.registration || "");
          setValue("_workTime", res.data.workTime || "");
          setValue("_offer", res.data.offer || "");
          setValue("_ceogreet", res.data.ceogreet || "");
          setValue("_telnum", res.data.telnum || "");
          setValue("_mobilenum", res.data.mobilenum || "");
          setValue("_email", res.data.email || "");
          setValue("_extnum", res.data.extnum || "");
          setValue("_regName", res.data.regName || "");
          setValue("_corporationno", res.data.corporationno || "");
          setValue("_regOwner", res.data.regOwner || "");
          setValue("_age", res.data.age);

          setValue("_bigCategory", res.data.bigCategory || "");
          setValue("_subCategory", res.data.subCategory || "");
          setValue("_reCount", res.data.reCount || "");
          setValue("_okCount", res.data.okCount || "");
          setValue("_noCount", res.data.noCount || "");

          // 공지사항, 리뷰, 견적요청서 링크 이동 개수 확인하기 위해 데이터 받아오기
          serviesPostDataSettingRcid(urlCompanyNoticeList, cid, setNoticeList);
          serviesPostDataSettingRcid(urlReviewList, cid, setReviewList);
          // 견적요청서 - uid가 필요하기 떄문에 cid로 uid를 확인한 후 진행
          servicesPostData(urlGetCompany, { cid: cid }).then((res) => {
            ruid.current = res.data.ruid;

            // 회원정보
            servicesPostData(urlGetUser, {
              uid: res.data.ruid,
            })
              .then((res) => {
                if (res.status === "success") {
                  setValue("_userid", res.data.userid.toString() || "");
                }
              })
              .catch((res) => console.log(res));

            // 견적 요청서 요청
            servicesPostData(urlListEstimateInfo, {
              fromUid: res.data.ruid,
              offset: 0,
              size: 5,
            }).then((res) => setFromEstimateinfo(res.data));
            // 견적 요청서 수령
            servicesPostData(urlListEstimateInfo, {
              toUid: res.data.ruid,
              offset: 0,
              size: 5,
            }).then((res) => setToEstimateinfo(res.data));

            // 견적서 요청
            servicesPostData(urlListProposalInfo, {
              fromUid: res.data.ruid,
              offset: 0,
              size: 5,
            }).then((res) => setFromproposalInfo(res.data));

            // 견적서 수령
            servicesPostData(urlListProposalInfo, {
              toUid: res.data.ruid,
              offset: 0,
              size: 5,
            }).then((res) => setToproposalInfo(res.data));
          });

          // 근무 시간 (근무시간!!!!!! 다시 입력!!!!!)
          if (!!res.data.workTime) {
            const WorkTimeArr = res.data.workTime.split("~");
            setValue("_workTimeTo", WorkTimeArr[0].trim() || "");
            setValue("_workTimeFrom", WorkTimeArr[1].trim() || "");
          }
        }
      })
      .catch((res) => console.log(res));
  }, []);

  const onChangeValidation = (e) => {
    let arr = e.target.value.split(",");
    if (e.target.id === "tags") {
      if (arr.length > 20) {
        servicesUseToast("최대 20개까지 입력할 수 있습니다.");
        arr = arr.filter((it, i) => i < 20);
      }
      return setValue("_tag", arr.toString() || "");
    } else {
      if (arr.length > 10) {
        servicesUseToast("최대 10개까지 입력할 수 있습니다.");
        arr = arr.filter((it, i) => i < 10);
      }
      return e.target.id === "bigCategory"
        ? setValue("_bigCategory", arr.toString() || "")
        : setValue("_subCategory", arr.toString() || "");
    }
  };

  const handleSubmitEvent = () => {
    // 서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);
    servicesPostData(urlSetCompany, {
      cid: cid,
      ...companyData,
    });

    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      useFlag: getValues("_detailUseFlag"),
      gongsaType: getValues("_gongsaType").toString() || "",
      status: getValues("_status").toString() || "",
      name: getValues("_name"),
      comment: getValues("_comment"),
      location: getValues("_location"),
      registration: getValues("_registration"),
      corporationno: getValues("_corporationno"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
      oldaddress: multilAddress.oldaddress,
      zipcode: multilAddress.zipcode,
      workTime: `${watch("_workTimeTo")} ~ ${watch("_workTimeFrom")}`,
      offer: getValues("_offer"),
      titleImg: titleImg.length > 0 ? titleImg[0].iid : "694",
      regImgs: regImgs.length > 0 ? regImgs[0].iid : "",
      imgs: imgsIid.length > 0 ? imgsIid.toString() : "",
      longitude: multilAddress.longitude,
      latitude: multilAddress.latitude,
      telnum: getValues("_telnum"),
      mobilenum: getValues("_mobilenum"),
      email: getValues("_email"),
      ceogreet: getValues("_ceogreet"),
      regOwner: getValues("_regOwner"),
      extnum: getValues("_extnum"),
      regName: getValues("_regName"),
      age: getValues("_age"),
      comType: getValues("_comType"),
      subCategory: getValues("_subCategory"),
      bigCategory: getValues("_bigCategory"),
      reCount: getValues("_reCount"),
      okCount: getValues("_okCount"),
      noCount: getValues("_noCount"),
      // vidlinkurl:
      //   `${getValues("_vidlinkurl1")},${getValues("_vidlinkurl2")}` || "",
      // linkurl:
      //   `${getValues("_linkurl1")},${getValues("_linkurl2")},${getValues(
      //     "_linkurl3"
      //   )},${getValues("_linkurl4")},${getValues("_linkurl5")},` || "",
    })
      .then((res) => {
        if (res.status === "fail") {
          servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          servicesUseToast("완료되었습니다!", "s");
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(handleSubmitEvent)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            <ComponentTableTopScrollBtn data={tableTopScrollBtnData.current} />
            <ComponentTableTopNumber title="사업자 관리번호" text={cid} />
            <LayoutTopButton url="/company" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>계약 기본 정보</h3>
              {/* setCompany radio (계약자, 사업자활성화, 회원연결) ================================================================ */}
              <ComponentSetCompany
                setCompanyData={setCompanyData}
                companyData={companyData}
              />

              {/* setDetailCompanyInfo radio ================================================================ */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>상세정보 관리</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_detailUseFlag") == "0"}
                    value="0"
                    id="DetailUseFlag0"
                    {...register("_detailUseFlag", {})}
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
                    checked={watch("_detailUseFlag") == "1"}
                    value="1"
                    id="DetailUseFlag1"
                    {...register("_detailUseFlag", {})}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="DetailUseFlag1"
                  >
                    사용
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>계약관리</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_status") == 2}
                    value="2"
                    id="status2"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="status2">
                    대기
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_status") == 0}
                    value="0"
                    id="status0"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="status0">
                    거절
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_status") == 1}
                    value="1"
                    id="status1"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="status1">
                    완료
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>계정관리</span>
                </label>
                <ul className="detailContent">
                  <li style={{ width: "50%" }}>
                    <div>
                      <span>아이디</span>
                      <input
                        type="text"
                        id="userid"
                        placeholder={!companyData.ruid ? "미등록 회원" : ""}
                        disabled
                        {...register("_userid", {})}
                      />
                    </div>
                  </li>
                  <li style={{ width: "50%" }}>
                    <div>
                      <span>비밀번호</span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          type="text"
                          id="passwd"
                          style={{
                            width: "80%",
                          }}
                          disabled={!companyData.ruid && true}
                          placeholder={!companyData.ruid ? "미등록 회원" : ""}
                          {...register("_passwd")}
                        />
                        <button
                          type="button"
                          disabled={!companyData.ruid && true}
                          onClick={() => {
                            servicesPostData(urlSetUser, {
                              uid: ruid.current,
                              passwd: watch("_passwd"),
                            }).then((res) => {
                              if (res.status === "success") {
                                servicesUseToast(
                                  "비밀번호 변경이 완료되었습니다.",
                                  "s"
                                );
                              }
                            });
                          }}
                          className="formContentBtn"
                        >
                          변경
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </fieldset>
            {/* 계약기본정보 필드 끝 ==================================================================== */}

            {/* 고객 기본정보 필드 시작 ==================================================================== */}
            <fieldset id="CompanyDetail_2">
              <h3>사업자 기본 정보</h3>
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>공사유형</span>
                </div>
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
                    className="listSearchRadioInput"
                    checked={
                      watch("_gongsaType") &&
                      watch("_gongsaType").includes("reser")
                        ? true
                        : false
                    }
                    {...register("_gongsaType")}
                  />
                  <label htmlFor="reser" className="listSearchRadioLabel">
                    예약
                  </label>

                  <input
                    type="checkbox"
                    value=""
                    id="reset"
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
                  />
                  <label htmlFor="reset" className="listSearchRadioLabel">
                    해당없음
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>사업자 분류</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_comType") == "일반사업자"}
                    value="일반사업자"
                    id="comType0"
                    {...register("_comType")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="comType0">
                    일반사업자
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_comType") == "법인사업자"}
                    value="법인사업자"
                    id="comType01"
                    {...register("_comType")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="comType01">
                    법인사업자
                  </label>
                </div>
              </div>

              {/* setDetailUserInfo radio 끝, input(상호 ~ 키워드) ================================================================ */}

              <div className="formContentWrap">
                <label htmlFor="Cname" className="blockLabel">
                  <span>사업자명 ( 회사명 )</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="Cname"
                    placeholder="15자 이하로 입력해 주세요."
                    maxLength="15"
                    {...register("_name")}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="bigCategory" className="blockLabel">
                  <span>대표업종</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="bigCategory"
                    placeholder="대표업종을 입력해 주세요."
                    value={
                      (watch("_bigCategory") &&
                        watch("_bigCategory").replace(" ", ",")) ||
                      ""
                    }
                    {...register("_bigCategory", {
                      onChange: onChangeValidation,
                    })}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="subCategory" className="blockLabel">
                  <span>상세업종</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="subCategory"
                    placeholder="상세업종은 최대 10개까지 입력 가능합니다."
                    value={
                      (watch("_subCategory") &&
                        watch("_subCategory").replace(" ", ",")) ||
                      ""
                    }
                    {...register("_subCategory", {
                      onChange: onChangeValidation,
                    })}
                  />
                </div>
              </div>

              {/* 나이 */}
              <div className="formContentWrap" style={{ width: "100%" }}>
                <div className="blockLabel">
                  <span>나이</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "10"}
                    value="10"
                    id="age10"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age10">
                    10대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "20"}
                    value="20"
                    id="age20"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age20">
                    20대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "30"}
                    value="30"
                    id="age30"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age30">
                    30대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "40"}
                    value="40"
                    id="age40"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age40">
                    40대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "50"}
                    value="50"
                    id="age50"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age50">
                    50대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "60"}
                    value="60"
                    id="age60"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age60">
                    60대 이상
                  </label>
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
                <label htmlFor="corporationno" className="blockLabel">
                  <span>법인 등록 번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="corporationno"
                    placeholder="법인 등록 번호를 입력해 주세요. (예시 000000-0000000)"
                    maxLength="14"
                    {...register("_corporationno")}
                    value={
                      (watch("_corporationno") &&
                        watch("_corporationno")
                          .replace(/^(\d{0,6})(\d{0,7})$/g, "$1-$2")
                          .replace(/\-{1}$/g, "")) ||
                      ""
                    }
                    {...register("_corporationno", {
                      pattern: {
                        value: /^[0-9]{6}-[0-9]{7}$/,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="regName" className="blockLabel">
                  <span>사업자 등록 상표명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="regName"
                    placeholder="15자 이하로 입력해 주세요."
                    maxLength="15"
                    {...register("_regName")}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="regOwner" className="blockLabel">
                  <span>대표자명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="regOwner"
                    placeholder="대표자명을 입력해 주세요."
                    maxLength={8}
                    {...register("_regOwner")}
                  />
                </div>
              </div>

              <SetImage id="regImgs" title="사업자 등록증" />

              <div className="formContentWrap">
                <label htmlFor="mobilenum" className="blockLabel">
                  <span>휴대폰</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="mobilenum"
                    placeholder="휴대폰번호를 입력해 주세요. (예시 000-0000-0000)"
                    maxLength={13}
                    value={
                      (watch("_mobilenum") &&
                        watch("_mobilenum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_mobilenum")}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_mobilenum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="telnum" className="blockLabel">
                  <span>일반전화</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="telnum"
                    placeholder="전화번호를 입력해 주세요. (예시 00-0000-0000)"
                    maxLength="14"
                    value={
                      (watch("_telnum") &&
                        watch("_telnum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{4}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_telnum", {
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
                <label htmlFor="extnum" className="blockLabel">
                  <span>안심번호</span>
                </label>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <input
                    type="text"
                    id="extnum"
                    style={{ width: "85.5%" }}
                    disabled
                    value={
                      (watch("_extnum") &&
                        watch("_extnum")
                          .replace(/[^0-9]/g, "")
                          .replace(/(^[0-9]{3})([0-9]+)([0-9]{4}$)/, "$1-$2-$3")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_extnum")}
                  />
                  <Link
                    className="formContentBtn"
                    to={
                      !!watch("_extnum")
                        ? `050biz/${watch("_extnum").replaceAll("-", "")}`
                        : "050biz"
                    }
                  >
                    {!!watch("_extnum") ? "관리" : "등록"}
                  </Link>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="location" className="blockLabel">
                  <span>위치</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="location"
                    placeholder="사업자의 위치를 입력해 주세요. (예시 ㅇㅇ구, ㅇㅇ동)"
                    maxLength="50"
                    {...register("_location")}
                  />
                </div>
              </div>

              {/* 주소 */}
              <PieceRegisterSearchPopUp />

              <div className="formContentWrap">
                <label htmlFor="email" className="blockLabel">
                  <span>이메일</span>
                </label>
                <div>
                  <input
                    type="email"
                    id="email"
                    placeholder="이메일을 입력해 주세요."
                    value={
                      (watch("_email") &&
                        watch("_email").replace(/[^\\!-z]/gi, "")) ||
                      ""
                    }
                    {...register("_email", {
                      pattern: {
                        value:
                          /^[0-9a-z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_email"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="workTime" className="blockLabel">
                  <span>업무시간</span>
                </label>

                <ul className="detailContent">
                  <li>
                    <div>
                      <span>시작</span>
                      <input
                        type="time"
                        id="workTime"
                        placeholder="근무 시간을 입력해 주세요."
                        {...register("_workTimeTo")}
                      />
                    </div>
                  </li>
                  <li>
                    <div>
                      <span>마감</span>
                      <input
                        type="time"
                        id="workTime"
                        placeholder="근무 시간을 입력해 주세요."
                        {...register("_workTimeFrom")}
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </fieldset>
            {/* 고객기본정보 ============================================================================== */}

            <fieldset id="CompanyDetail_3">
              <h3>사업자 정보</h3>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="ceogreet" className="blockLabel">
                  <span>대표인사말</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="ceogreet"
                    placeholder="인사말을 입력해 주세요."
                    maxLength="50"
                    {...register("_ceogreet")}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="offer" className="blockLabel">
                  <span>사업자 소개글</span>
                </label>
                <div>
                  <textarea
                    type="text"
                    id="offer"
                    placeholder="최대 100자까지 입력하실 수 있습니다."
                    maxLength="100"
                    {...register("_offer")}
                  />
                </div>
              </div>

              <SetImage id="titleImg" title="대표 이미지" />

              <SetImage id="imgs" title="상세 이미지" />
            </fieldset>

            <fieldset id="CompanyDetail_4">
              <h3>청구결제사항</h3>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="ex" className="blockLabel">
                  <span>비고</span>
                </label>
                <div>
                  <textarea
                    type="text"
                    id="ex"
                    placeholder="기능 적용 X"
                    maxLength="100"
                    {...register("_ex")}
                  />
                </div>
              </div>
            </fieldset>

            {/* 견적 관리 링크 이동 ================================================================ */}
            <fieldset id="CompanyDetail_5">
              <h3>견적 관리</h3>
              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>견적의뢰서</span>
                </label>
                <ul className="detailContent">
                  <PieceDetailListLink
                    getData={toEstimateinfo}
                    url={`toestimateinfo`}
                    title="요청"
                    useLink={
                      toEstimateinfo && toEstimateinfo.length > 0 ? true : false
                    }
                  />

                  <PieceDetailListLink
                    getData={fromEstimateinfo}
                    url={`fromestimateinfo`}
                    title="수령"
                    useLink={
                      fromEstimateinfo && fromEstimateinfo.length > 0
                        ? true
                        : false
                    }
                  />
                </ul>
              </div>
              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>견적서</span>
                </label>
                <ul className="detailContent">
                  <PieceDetailListLink
                    getData={toproposalInfo}
                    url={`toproposalInfo`}
                    title="요청"
                    useLink={
                      toproposalInfo && toproposalInfo.length > 0 ? true : false
                    }
                  />

                  <PieceDetailListLink
                    getData={fromproposalInfo}
                    url={`fromproposalInfo`}
                    title="수령"
                    useLink={
                      fromproposalInfo && fromproposalInfo.length > 0
                        ? true
                        : false
                    }
                  />
                </ul>
              </div>
            </fieldset>

            {/* 고객관리 링크 이동 ================================================================ */}
            <fieldset id="CompanyDetail_6">
              <h3>고객 관리</h3>
              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>평점</span>
                </label>
                <ul className="detailContent">
                  <li style={{ width: "33.3333%" }}>
                    <div>
                      <span>추천</span>
                      <input
                        type="number"
                        id="reCount"
                        {...register("_reCount")}
                      />
                    </div>
                  </li>

                  <li style={{ width: "33.3333%" }}>
                    <div>
                      <span>만족</span>
                      <input
                        type="number"
                        id="okCount"
                        {...register("_okCount")}
                      />
                    </div>
                  </li>
                  <li style={{ width: "33.3333%" }}>
                    <div>
                      <span>불만족</span>
                      <input
                        type="number"
                        id="noCount"
                        {...register("_noCount")}
                      />
                    </div>
                  </li>
                </ul>
              </div>

              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>커뮤니티 관리</span>
                </label>
                <ul className="detailContent">
                  <PieceDetailListLink
                    getData={noticeList}
                    url={`/company/${getedData.rcid}/notice`}
                    title="공지사항"
                    useLink={true}
                  />

                  <PieceDetailListLink
                    getData={reviewList}
                    url={`/company/${getedData.rcid}/review`}
                    title="리뷰"
                    useLink={reviewList.length > 0 ? true : false}
                  />
                </ul>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
