import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData, servicesGetStorage } from "../Services/importData";
import {
  serviesPostDataSettingRcid,
  servicesUseToast,
} from "../Services/useData";
import {
  serviesGetImgsIid,
  serviesGetKeywords,
  serviesGetKid,
} from "../Services/useData";

import {
  urlGetCompanyDetail,
  urlSetCompanyDetail,
  urlSetCompany,
  ALLKEYWORD,
  urlCompanyNoticeList,
  urlGetCompany,
  urlReviewList,
  urlListEstimateInfo,
  urlListProposalInfo,
} from "../Services/string";
import SetImage from "../components/common/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";
import SetAllKeyWord from "../components/common/ComponentSetAllKeyWord";
import ComponentSetCompany from "../components/common/ComponentSetCompany";
import PieceDetailListLink from "../components/common/PieceDetailListLink";
import PieceRegisterSearchPopUp from "../components/common/PieceRegisterSearchPopUp";

export default function SetCompanyDetail() {
  const { cid } = useParams();

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
  // 서버에서 titleImg, imgs의 iid를 받아오기 위해 사용
  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  // imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const imgsIid = [];
  // 사업자 등록증 이미지
  const [regImgs, setRegImgs] = useState(null);

  // 주소 ------------------------------------------------------------------------
  // address:신주소,  oldaddress:구주소,  zipcode:우편번호,  latitude:위도,  longitude:경도
  const [multilAddress, setMultilAddress] = useState({});

  // 키워드 ------------------------------------------------------------------------
  // 선택된 키워드 저장되는 state
  const [companyDetailKeyword, setCompanyDetailKeyword] = useState([]);
  // keywordValue:서버에 키워드를 보낼 때 keyword의 value만 필요
  const keywordValue = [];

  // 사업자 상세관리에서 사용하는 setCompanyDetailInfo 외 API  --------------------------------------
  // setUser 수정 - 하위컴포넌트에게 전달
  const [companyData, setCompanyData] = useState({});

  // 하단 링크 이동 될 사업자 공지사항, 사업자 리뷰, 견적서
  const [noticeList, setNoticeList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [toEstimateinfo, setToEstimateinfo] = useState([]);
  const [fromEstimateinfo, setFromEstimateinfo] = useState([]);
  const [toproposalInfo, setToproposalInfo] = useState([]);
  const [fromproposalInfo, setFromproposalInfo] = useState([]);

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다. ==============
  useEffect(() => {
    // 상세 회사정보 불러오기 기존 값이 없다면 새로운 회원이다. 새로 작성함
    servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 값이 있다면 저장한 후 getDataFinish 값을 변경
          setGetedData(res.data);

          setValue("_detailUseFlag", res.data.useFlag.toString() || "1");
          setValue("_status", res.data.status.toString() || "2");
          setValue("_gongsaType", res.data.gongsaType || "reser");
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
          setValue("_tags", res.data.tags || "");
          setValue("_bigCategory", res.data.bigCategory || "");
          setValue("_subCategory", res.data.subCategory || "");
          setValue("_reCount", res.data.reCount || "");
          setValue("_okCount", res.data.okCount || "");
          setValue("_noCount", res.data.noCount || "");

          // 로그인 시 로컬스토리지에 저장한 전체 키워드 가져오기
          const allKeywordData = JSON.parse(servicesGetStorage(ALLKEYWORD));
          // 이미 입력된 키워드 값이 있다면 가져온 keywords 와 allKeywordData의 keyword의 value를 비교하여 keyword 객체 가져오기
          // 삭제 기능을 위해 kid도 불러와야 해서 해당 기능 추가
          serviesGetKid(
            setCompanyDetailKeyword,
            res.data.keywords,
            allKeywordData
          );

          // 외부 동영상 링크
          if (res.data.vidlinkurl) {
            const nameVar = res.data.vidlinkurl.split(",");
            setValue("_vidlinkurl1", nameVar[0] || "");
            setValue("_vidlinkurl2", nameVar[1] || "");
          }

          // 외부 링크
          if (res.data.linkurl) {
            const nameVar = res.data.linkurl.split(",");
            setValue("_linkurl1", nameVar[0] || "");
            setValue("_linkurl2", nameVar[1] || "");
            setValue("_linkurl3", nameVar[2] || "");
            setValue("_linkurl4", nameVar[3] || "");
            setValue("_linkurl5", nameVar[4] || "");
          }

          // 공지사항, 리뷰, 견적요청서 링크 이동 개수 확인하기 위해 데이터 받아오기
          serviesPostDataSettingRcid(urlCompanyNoticeList, cid, setNoticeList);
          serviesPostDataSettingRcid(urlReviewList, cid, setReviewList);
          // 견적요청서 - uid가 필요하기 떄문에 cid로 uid를 확인한 후 진행
          servicesPostData(urlGetCompany, { cid: cid }).then((res) => {
            // 견적 요청서 요청
            console.log(res.data.ruid);
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
          const WorkTimeArr = res.data.workTime.split("~");
          setValue("_workTimeTo", WorkTimeArr[0].trim() || "");
          setValue("_workTimeFrom", WorkTimeArr[1].trim() || "");

          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("새로운 사업자 회원입니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  // input ","로 구분된 문자열 최대 입력 개수제한 ========================
  const onChangeValidation = (e) => {
    let arr = e.target.value.split(",");
    if (e.target.id === "tags") {
      if (arr.length > 20) {
        servicesUseToast("최대 20개까지 입력할 수 있습니다.");
        arr = arr.filter((it, i) => i < 20);
      }
      return setValue("_tag", arr.toString());
    } else {
      if (arr.length > 10) {
        servicesUseToast("최대 10개까지 입력할 수 있습니다.");
        arr = arr.filter((it, i) => i < 10);
      }
      return e.target.id === "bigCategory"
        ? setValue("_bigCategory", arr.toString())
        : setValue("_subCategory", arr.toString());
    }
  };

  // form submit 이벤트 =========================================
  const handleSubmitEvent = () => {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);
    // 서버에 keywords의 keyword value만을 보내기 위해 실행하는 함수
    serviesGetKeywords(keywordValue, companyDetailKeyword);

    servicesPostData(urlSetCompany, {
      cid: cid,
      ...companyData,
    });

    // ComponentSetCompany submit
    // setComapny (계약자명, uid, 사업자 활성화)
    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      useFlag: getValues("_detailUseFlag"),
      gongsaType: getValues("_gongsaType").toString(),
      status: getValues("_status").toString(),
      name: getValues("_name"),
      comment: getValues("_comment"),
      location: getValues("_location"),
      registration: getValues("_registration"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
      oldaddress: multilAddress.oldaddress,
      zipcode: multilAddress.zipcode,
      workTime: `${watch("_workTimeTo")} ~ ${watch("_workTimeFrom")}`,
      offer: getValues("_offer"),
      titleImg: titleImg ? titleImg[0].iid : "",
      regImgs: regImgs ? regImgs[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
      longitude: multilAddress.longitude,
      latitude: multilAddress.latitude,
      telnum: getValues("_telnum"),
      mobilenum: getValues("_mobilenum"),
      email: getValues("_email"),
      ceogreet: getValues("_ceogreet"),
      extnum: getValues("_extnum"),
      keywords: keywordValue.toString() || "",
      tags: getValues("_tags"),
      subCategory: getValues("_subCategory"),
      bigCategory: getValues("_bigCategory"),
      reCount: getValues("_reCount"),
      okCount: getValues("_okCount"),
      noCount: getValues("_noCount"),
      vidlinkurl:
        `${getValues("_vidlinkurl1")},${getValues("_vidlinkurl2")}` || "",
      linkurl:
        `${getValues("_linkurl1")},${getValues("_linkurl2")},${getValues(
          "_linkurl3"
        )},${getValues("_linkurl4")},${getValues("_linkurl5")},` || "",
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
          <ul className="tableTopWrap">
            <LayoutTopButton url="/company" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            <fieldset>
              <h3>구역 설명</h3>
              {/* setCompany radio (계약자, 사업자활성화, 회원연결) ================================================================ */}
              <ComponentSetCompany
                setCompanyData={setCompanyData}
                companyData={companyData}
              />

              {/* setDetailCompanyInfo radio ================================================================ */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>회원관리</span>
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
                    name="_status"
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
                    name="_status"
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
                    name="_status"
                    value="1"
                    id="status1"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="status1">
                    완료
                  </label>
                </div>
              </div>
            </fieldset>

            <div className="formContentWrap">
              <div className="blockLabel">
                <span>사업자 공사 관리</span>
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

            {/* setDetailUserInfo radio 끝, input(상호 ~ 키워드) ================================================================ */}

            <div className="formContentWrap">
              <label htmlFor="name" className="blockLabel">
                <span>상호</span>
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="상호명을 입력해 주세요."
                  {...register("_name", {
                    required: "입력되지 않았습니다.",
                    maxLength: {
                      value: 15,
                      message: "15자 이하의 글자만 사용가능합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_name"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
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

            <div className="formContentWrap">
              <label htmlFor="subCategory" className="blockLabel">
                <span>상세업종</span>
              </label>
              <div>
                <input
                  type="text"
                  id="subCategory"
                  placeholder="상세업종을 입력해 주세요."
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

            <SetImage
              regImgs={regImgs}
              setRegImgs={setRegImgs}
              getData={getedData}
              id="regImgs"
              title="사업자 등록증"
              getDataFinish={getDataFinish.current}
            />

            <div className="formContentWrap">
              <label htmlFor="mobilenum" className="blockLabel">
                <span>핸드폰번호</span>
              </label>
              <div>
                <input
                  type="text"
                  id="mobilenum"
                  placeholder="핸드폰번호를 입력해 주세요. (예시 000-0000-0000)"
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
                  {...register("_mobilenum", {
                    required: "입력되지 않았습니다.",
                    pattern: {
                      value: /^[0-9]{3,4}-[0-9]{3,4}-[0-9]{4}/,
                      message: "형식에 맞지 않습니다.",
                    },
                  })}
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
              <label htmlFor="extnum" className="blockLabel">
                <span>안심 번호</span>
              </label>
              <div>
                <input
                  type="text"
                  id="extnum"
                  placeholder="안심 번호를 입력해 주세요."
                  value={
                    (watch("_extnum") &&
                      watch("_extnum")
                        .replace(/[^0-9]/g, "")
                        .replace(/(^[0-9]{3})([0-9]+)([0-9]{4}$)/, "$1-$2-$3")
                        .replace("--", "-")) ||
                    ""
                  }
                  {...register("_extnum", {
                    pattern: {
                      value: /^[0-9]{3}-[0-9]{3,5}-[0-9]{4}/,
                      message: "형식에 맞지 않습니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_extnum"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
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
                  {...register("_location", {
                    maxLength: {
                      value: 50,
                      message: "50자 이하의 글자만 사용가능합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_location"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            {/* 주소 */}
            <PieceRegisterSearchPopUp
              setMultilAddress={setMultilAddress}
              multilAddress={multilAddress}
              getedData={getedData}
            />

            <div className="formContentWrap">
              <label htmlFor="email" className="blockLabel">
                <span>이메일</span>
              </label>
              <div>
                <input
                  type="text"
                  id="email"
                  placeholder="이메일을 입력해 주세요."
                  {...register("_email", {
                    pattern: {
                      value:
                        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
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
              <label htmlFor="comment" className="blockLabel">
                <span>사업자 한줄 소개</span>
              </label>
              <div>
                <input
                  type="text"
                  id="comment"
                  placeholder="사업자에 대한 짧은 소개글을 입력해 주세요."
                  {...register("_comment", {
                    maxLength: {
                      value: 20,
                      message: "20자 이하의 글자만 사용가능합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_comment"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            <div className="formContentWrap">
              <label htmlFor="comment" className="blockLabel">
                <span>대표인사말</span>
              </label>
              <div>
                <input
                  type="text"
                  id="ceogreet"
                  placeholder="인사말을 입력해 주세요."
                  {...register("_ceogreet", {
                    maxLength: {
                      value: 50,
                      message: "50자 이하의 글자만 사용가능합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_ceogreet"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            <div className="formContentWrap">
              <label htmlFor="workTime" className="blockLabel">
                <span>근무 시간</span>
              </label>

              <ul className="detailContent">
                <li>
                  <div>
                    <span>시작</span>
                    <input
                      type="time"
                      id="workTime"
                      placeholder="근무 시간을 입력해 주세요."
                      {...register("_workTimeTo", {})}
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
                      {...register("_workTimeFrom", {})}
                    />
                  </div>
                </li>
              </ul>
            </div>

            <SetImage
              img={titleImg}
              setImg={setTitleImg}
              getData={getedData}
              id="titleImg"
              title="대표 이미지"
              getDataFinish={getDataFinish.current}
            />

            <SetImage
              imgs={imgs}
              setImgs={setImgs}
              id="imgs"
              title="상세 이미지"
              getData={getedData}
              getDataFinish={getDataFinish.current}
            />

            <div className="formContentWrap" style={{ width: "100%" }}>
              <label htmlFor="offer" className="blockLabel">
                <span>사업자 소개글</span>
              </label>
              <div>
                <textarea
                  type="text"
                  id="offer"
                  placeholder="사업자 소개글을 입력해 주세요."
                  {...register("_offer", {
                    maxLength: {
                      value: 100,
                      message: "100자 이하의 글자만 사용가능합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_offer"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            <div className="formContentWrap">
              <label htmlFor="keywords" className="blockLabel">
                <span>키워드</span>
              </label>
              <SetAllKeyWord
                companyDetailKeyword={companyDetailKeyword}
                setCompanyDetailKeyword={setCompanyDetailKeyword}
              />
            </div>

            <div className="formContentWrap">
              <label htmlFor="tags" className="blockLabel">
                <span>태그</span>
              </label>
              <div>
                <input
                  type="text"
                  id="tags"
                  placeholder="태그를 입력해 주세요."
                  value={
                    (watch("_tags") && watch("_tags").replace(" ", ",")) || ""
                  }
                  {...register("_tags", {
                    onChange: onChangeValidation,
                  })}
                />
              </div>
            </div>

            <div className="formContentWrap">
              <label className="blockLabel">
                <span>동영상 링크</span>
              </label>
              <div>
                <input
                  type="text"
                  id="vidlinkurl1"
                  placeholder="외부 동영상 링크를 입력해 주세요."
                  {...register("_vidlinkurl1")}
                />
                <input
                  type="text"
                  id="vidlinkurl2"
                  placeholder="외부 동영상 링크를 입력해 주세요."
                  {...register("_vidlinkurl2")}
                />
              </div>
            </div>

            <div className="formContentWrap">
              <label className="blockLabel">
                <span>외부 링크</span>
              </label>
              <div>
                <input
                  type="text"
                  id="linkurl1"
                  placeholder="외부 링크를 입력해 주세요."
                  {...register("_linkurl1")}
                />
                <input
                  type="text"
                  id="linkurl2"
                  placeholder="외부 링크를 입력해 주세요."
                  {...register("_linkurl2")}
                />
                <input
                  type="text"
                  id="linkurl3"
                  placeholder="외부 링크를 입력해 주세요."
                  {...register("_linkurl3")}
                />
                <input
                  type="text"
                  id="linkurl4"
                  placeholder="외부 링크를 입력해 주세요."
                  {...register("_linkurl4")}
                />
                <input
                  type="text"
                  id="linkurl5"
                  placeholder="외부 링크를 입력해 주세요."
                  {...register("_linkurl5")}
                />
              </div>
            </div>

            {/* 견적 관리 링크 이동 ================================================================ */}
            <fieldset>
              <h3>견적 관리</h3>
              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>견적의뢰서</span>
                </label>
                <ul className="detailContent">
                  {getedData && (
                    <PieceDetailListLink
                      getData={toEstimateinfo}
                      url={`toestimateinfo`}
                      title="요청"
                      inCommon
                    />
                  )}

                  {getedData && (
                    <PieceDetailListLink
                      getData={fromEstimateinfo}
                      url={`fromestimateinfo`}
                      title="수령"
                      inCommon
                    />
                  )}
                </ul>
              </div>
              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>견적서</span>
                </label>
                <ul className="detailContent">
                  {getedData && (
                    <PieceDetailListLink
                      getData={toproposalInfo}
                      url={`toproposalInfo`}
                      title="요청"
                      inCommon
                    />
                  )}

                  {getedData && (
                    <PieceDetailListLink
                      getData={fromproposalInfo}
                      url={`fromproposalInfo`}
                      title="수령"
                      inCommon
                    />
                  )}
                </ul>
              </div>
            </fieldset>

            {/* 고객관리 링크 이동 ================================================================ */}
            <fieldset>
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
                  {getedData && (
                    <PieceDetailListLink
                      getData={noticeList}
                      url={`/company/${getedData.rcid}/notice`}
                      title="공지사항"
                      inCommon
                    />
                  )}
                  {getedData && (
                    <PieceDetailListLink
                      getData={reviewList}
                      url={`/company/${getedData.rcid}/review`}
                      title="리뷰"
                      inCommon
                    />
                  )}
                </ul>
              </div>
            </fieldset>
          </div>
        </form>
      </div>

      {/* <div className="paddingBox commonBox">
        <ul className="detailContentsList">
          {getedData && (
            <PieceDetailListLink
              getData={noticeList}
              url={`/company/${getedData.rcid}/notice`}
              title="공지사항"
            />
          )}
        </ul>
      </div> */}
    </>
  );
}
