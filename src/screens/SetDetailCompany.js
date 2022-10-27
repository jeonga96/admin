import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData, servicesGetStorage } from "../Services/importData";
import { serviesPostDataSettingRcid } from "../Services/useData";
import {
  serviesGetImgsIid,
  serviesGetKeywords,
  serviesGetKid,
} from "../Services/useData";
import {
  urlGetCompanyDetail,
  urlSetCompanyDetail,
  ALLKEYWORD,
  urlCompanyNoticeList,
  urlReviewList,
} from "../Services/string";

import SetImage from "../components/common/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";
import SetAllKeyWord from "../components/common/ComponentSetAllKeyWord";
import ComponentSetCompany from "../components/common/ComponentSetCompany";
import PieceDetailListLink from "../components/common/PieceDetailListLink";

export default function SetCompanyDetail() {
  const { cid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  // 서버에서 titleImg, imgs의 iid를 받아오기 위해 사용
  const [getedData, setGetedData] = useState([]);
  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시
  // imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const imgsIid = [];
  // 사업자 등록증 이미지
  const [regImgs, setRegImgs] = useState(null);
  // useFlag radio
  const [detailUseFlag, setDetailUseFlag] = useState(1);
  // status radio
  const [status, setStatus] = useState(2);
  // gongsaType radio
  const [gongsaType, SetGonsaType] = useState("norm");
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  // mapcoor:위도 경도 저장,
  const mapcoor = useRef({ longitude: "", latitude: "" });
  // 선택된 키워드 저장되는 state
  const [companyDetailKeyword, setCompanyDetailKeyword] = useState([]);
  // keywordValue:서버에 키워드를 보낼 때 keyword의 value만 필요
  const keywordValue = [];

  // 하단 링크 이동 될 사업자 공지사항, 사업자 리뷰
  const [noticeList, setNoticeList] = useState([]);
  const [reviewList, setReviewList] = useState([]);

  // 카카오 API, 주소를 위도 경도로 변환
  const callMapcoor = () => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        mapcoor.current.longitude = Math.floor(result[0].x * 100000);
        mapcoor.current.latitude = Math.floor(result[0].y * 100000);
        console.log("kako map API 이상없음!", mapcoor.current);
      }
      addUserEvent();
    };
    geocoder.addressSearch(getValues("_address"), callback);
  };

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    // 기본 회사정보 불러오기
    // servicesPostData(urlGetCompany, {
    //   cid: cid,
    // })
    //   .then((res) => {
    //     if (res.status === "success") {
    //       setCompanyInfo(res.data);
    //     }
    //   })
    //   .catch((res) => console.log(res));

    // 상세 회사정보 불러오기 기존 값이 없다면 새로운 회원이다. 새로 작성함
    servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 값이 있다면 저장한 후 getDataFinish 값을 변경
          setGetedData(res.data);
          mapcoor.current.longitude = res.data.longitude;
          mapcoor.current.latitude = res.data.latitude;

          setValue("_name", res.data.name || "");
          setValue("_comment", res.data.comment || "");
          setValue("_location", res.data.location || "");
          setValue("_address", res.data.address || "");
          setValue("_registration", res.data.registration || "");
          setValue("_workTime", res.data.workTime || "");
          setValue("_offer", res.data.offer || "");
          setValue("_ceogreet", res.data.ceogreet || "");
          setValue("_telnum", res.data.telnum || "");
          setValue("_mobilenum", res.data.mobilenum || "");
          setValue("_email", res.data.email || "");
          setValue("_extnum", res.data.extnum || "");
          setValue("_extnum", res.data.extnum || "");
          setValue("_tags", res.data.tags || "");

          setDetailUseFlag(res.data.useFlag || "1");
          setStatus(res.data.status || "2");
          SetGonsaType(res.data.gongsaType || "norm");

          // 로그인 시 로컬스토리지에 저장한 전체 키워드 가져오기
          const allKeywordData = JSON.parse(servicesGetStorage(ALLKEYWORD));
          // 이미 입력된 키워드 값이 있다면 가져온 keywords 와 allKeywordData의 keyword의 value를 비교하여 keyword 객체 가져오기
          // 삭제 기능을 위해 kid도 불러와야 해서 해당 기능 추가
          serviesGetKid(
            setCompanyDetailKeyword,
            res.data.keywords,
            allKeywordData
          );
          serviesPostDataSettingRcid(urlCompanyNoticeList, cid, setNoticeList);
          serviesPostDataSettingRcid(urlReviewList, cid, setReviewList);
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("새로운 사업자 회원입니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  // form submit 이벤트
  const addUserEvent = () => {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);
    // 서버에 keywords의 keyword value만을 보내기 위해 실행하는 함수
    serviesGetKeywords(keywordValue, companyDetailKeyword);
    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      name: getValues("_name"),
      comment: getValues("_comment"),
      location: getValues("_location"),
      address: getValues("_address"),
      registration: getValues("_registration"),
      workTime: getValues("_workTime"),
      offer: getValues("_offer"),
      titleImg: titleImg ? titleImg[0].iid : "",
      regImgs: regImgs ? regImgs[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
      longitude: mapcoor.current.longitude,
      latitude: mapcoor.current.latitude,
      telnum: getValues("_telnum"),
      mobilenum: getValues("_mobilenum"),
      email: getValues("_email"),
      ceogreet: getValues("_ceogreet"),
      extnum: getValues("_extnum"),
      keywords: keywordValue.toString() || "",
      tags: getValues("_tags"),
      useFlag: detailUseFlag,
      gongsaType: gongsaType,
      status: status,
    })
      .then((res) => {
        if (res.status === "success") {
          alert("완료되었습니다.");
          // window.location.href = cid ? `/company` : "CompanyMyDetail";
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  function UserDetailInfoSubmit() {
    // companyDetailInfo.address가 입력되어 있으면 위도경도 구하는 함수 실행(내부에 addUserEvent이벤트 실행 코드 있음)
    !!getValues("_address") ? callMapcoor() : addUserEvent();
  }

  return (
    <>
      <ComponentSetCompany />
      <div className="commonBox">
        <form
          className="formLayout"
          onSubmit={handleSubmit(UserDetailInfoSubmit)}
        >
          <ul className="tableTopWrap">
            <LayoutTopButton url="/company" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <fieldset className="formContentWrapWithRadio">
            <div className="listSearchWrap">
              <div className="blockLabel">회원관리</div>
              <div className="formContentWrapWithRadioValue">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={detailUseFlag == 0}
                  name="_detailUseFlag"
                  value="0"
                  id="DetailUseFlog0"
                  {...register("_detailUseFlag", {
                    onChange: (e) => {
                      setDetailUseFlag(e.target.value);
                    },
                  })}
                />
                <label
                  className="listSearchRadioLabel"
                  htmlFor="DetailUseFlog0"
                >
                  휴면
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={detailUseFlag == 1}
                  name="_detailUseFlag"
                  value="1"
                  id="DetailUseFlog1"
                  {...register("_detailUseFlag", {
                    onChange: (e) => {
                      setDetailUseFlag(e.target.value);
                    },
                  })}
                />
                <label
                  className="listSearchRadioLabel"
                  htmlFor="DetailUseFlog1"
                >
                  사용
                </label>
              </div>
            </div>

            <div className="listSearchWrap">
              <div className="blockLabel">계약관리</div>
              <div className="formContentWrapWithRadioValue">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={status == 2}
                  name="_statusCheck"
                  value="2"
                  id="status2"
                  {...register("_statusCheck", {
                    onChange: (e) => {
                      setStatus(e.target.value);
                    },
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="status2">
                  대기
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={status == 0}
                  name="_statusCheck"
                  value="0"
                  id="status0"
                  {...register("_statusCheck", {
                    onChange: (e) => {
                      setStatus(e.target.value);
                    },
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="status0">
                  거절
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={status == 1}
                  name="_statusCheck"
                  value="1"
                  id="status1"
                  {...register("_statusCheck", {
                    onChange: (e) => {
                      setStatus(e.target.value);
                    },
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="status1">
                  완료
                </label>
              </div>
            </div>

            <div className="listSearchWrap">
              <div className="blockLabel">사업자 공사 관리</div>
              <div className="formContentWrapWithRadioValue">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={gongsaType === "emer"}
                  name="_gonsaType"
                  value="emer"
                  id="typeEmer"
                  {...register("_gonsaType", {
                    onChange: (e) => {
                      SetGonsaType(e.target.value);
                    },
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="typeEmer">
                  긴급
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={gongsaType === "inday"}
                  name="_gonsaType"
                  value="inday"
                  id="typeInday"
                  {...register("_gonsaType", {
                    onChange: (e) => {
                      SetGonsaType(e.target.value);
                    },
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="typeInday">
                  당일
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={gongsaType === "reser"}
                  name="_gonsaType"
                  value="reser"
                  id="typeReser"
                  {...register("_gonsaType", {
                    onChange: (e) => {
                      SetGonsaType(e.target.value);
                    },
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="typeReser">
                  예약
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={gongsaType === "norm"}
                  name="_gonsaType"
                  value="norm"
                  id="typeNorm"
                  {...register("_gonsaType", {
                    onChange: (e) => {
                      SetGonsaType(e.target.value);
                    },
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="typeNorm">
                  일반
                </label>
              </div>
            </div>
          </fieldset>

          <div className="formContentWrap">
            <label htmlFor="name" className="blockLabel">
              상호
            </label>
            <input
              type="text"
              id="name"
              name="_name"
              placeholder="상호명을 입력해 주세요."
              {...register("_name", {
                required: "입력되지 않았습니다.",
                maxLength: {
                  value: 15,
                  message: "15자 이하의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_name"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <SetImage
            regImgs={regImgs}
            setRegImgs={setRegImgs}
            getData={getedData}
            id="regImgs"
            title="사업자 등록증"
            getDataFinish={getDataFinish.current}
          />

          <div className="formContentWrap">
            <label htmlFor="registration" className=" blockLabel">
              사업자 등록 번호
            </label>
            <input
              type="text"
              id="registration"
              name="_registration"
              placeholder="사업자 등록 번호를 입력해 주세요. (예시 000-00-00000)"
              {...register("_registration", {
                required: "입력되지 않았습니다.",
                pattern: {
                  value: /^[0-9]{3}-[0-9]{2}-[0-9]{5}/,
                  message: "형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_registration"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="mobilenum" className=" blockLabel">
              핸드폰번호
            </label>
            <input
              type="text"
              id="mobilenum"
              name="_mobilenum"
              placeholder="핸드폰번호를 입력해 주세요. (예시 000-0000-0000)"
              {...register("_mobilenum", {
                required: "입력되지 않았습니다.",
                pattern: {
                  value: /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/,
                  message: "형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_mobilenum"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="telnum" className=" blockLabel">
              전화번호
            </label>
            <input
              type="text"
              id="telnum"
              name="_telnum"
              placeholder="전화번호를 입력해 주세요. (예시 00-0000-0000)"
              {...register("_telnum", {
                required: "입력되지 않았습니다.",
                pattern: {
                  value: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/,
                  message: "형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_telnum"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="extnum" className=" blockLabel">
              안심 번호
            </label>
            <input
              type="text"
              id="extnum"
              name="_extnum"
              placeholder="추가 번호를 입력해 주세요."
              {...register("_extnum", {
                maxLength: {
                  value: 13,
                  message: "형식에 맞지 않습니다.",
                },
                pattern: {
                  value: /[0-9]/,
                  message: "형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_extnum"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="location" className=" blockLabel">
              위치
            </label>
            <input
              type="text"
              id="location"
              name="_location"
              placeholder="사업자의 위치를 입력해 주세요. (예시 ㅇㅇ구, ㅇㅇ동)"
              {...register("_location", {
                maxLength: {
                  value: 50,
                  message: "50자 이하의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_location"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="address" className=" blockLabel">
              주소
            </label>
            <input
              type="text"
              id="address"
              name="_address"
              placeholder="주소를 입력해 주세요."
              {...register("_address", {
                required: "입력되지 않았습니다.",
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_address"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          {/* mapcoor = useRef({ longitude: "", latitude: "" }); */}
          {mapcoor.current.longitude && (
            <div className="formContentWrap">
              <label htmlFor="address" className=" blockLabel">
                좌표
              </label>
              <ul className="detailContent" style={{ display: "flex" }}>
                <li>
                  <span>위도</span>
                  <input
                    type="text"
                    disabled
                    value={mapcoor.current.longitude}
                  />
                </li>
                <li>
                  <span>경도</span>
                  <input
                    type="text"
                    disabled
                    value={mapcoor.current.latitude}
                  />
                </li>
              </ul>
            </div>
          )}

          <div className="formContentWrap">
            <label htmlFor="email" className=" blockLabel">
              이메일
            </label>
            <input
              type="text"
              id="email"
              name="_email"
              placeholder="이메일을 입력해 주세요."
              {...register("_email", {
                pattern: {
                  value:
                    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                  message: "형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_email"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="comment" className=" blockLabel">
              사업자 한줄 소개
            </label>
            <input
              type="text"
              id="comment"
              name="_comment"
              placeholder="사업자에 대한 짧은 소개글을 입력해 주세요."
              {...register("_comment", {
                maxLength: {
                  value: 20,
                  message: "20자 이하의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_comment"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="comment" className=" blockLabel">
              대표인사말
            </label>
            <input
              type="text"
              id="ceogreet"
              name="_ceogreet"
              placeholder="인사말을 입력해 주세요."
              {...register("_ceogreet", {
                maxLength: {
                  value: 50,
                  message: "50자 이하의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_ceogreet"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="workTime" className=" blockLabel">
              근무 시간
            </label>
            <input
              type="text"
              id="workTime"
              name="_workTime"
              placeholder="근무 시간을 입력해 주세요."
              {...register("_workTime", {
                maxLength: {
                  value: 20,
                  message: "20자 이하의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_workTime"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

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

          <div className="formContentWrap">
            <label htmlFor="offer" className="blockLabel">
              사업자 소개글
            </label>
            <textarea
              type="text"
              id="offer"
              name="_offer"
              placeholder="사업자 소개글을 입력해 주세요."
              {...register("_offer", {
                maxLength: {
                  value: 100,
                  message: "100자 이하의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_offer"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="keywords" className=" blockLabel">
              키워드
            </label>
            <SetAllKeyWord
              getDataKeyword={getValues("_keywords")}
              companyDetailKeyword={companyDetailKeyword}
              setCompanyDetailKeyword={setCompanyDetailKeyword}
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="tags" className=" blockLabel">
              태그
            </label>
            <input
              type="text"
              id="tags"
              name="_tags"
              placeholder="태그를 입력해 주세요."
              {...register("_tags", {
                maxLength: {
                  value: 100,
                  message: "100자 이하의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_tags"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />
        </form>
      </div>

      <div className="paddingBox commonBox">
        <ul className="detailContentsList detailContentCenter">
          {getedData && (
            <PieceDetailListLink
              getData={noticeList}
              url={`/company/${getedData.rcid}/notice`}
              title="공지사항"
            />
          )}
          {getedData && (
            <PieceDetailListLink
              getData={reviewList}
              url={`/company/${getedData.rcid}/review`}
              title="리뷰"
            />
          )}
        </ul>
      </div>
    </>
  );
}
