import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData, servicesGetStorage } from "../Services/importData";
import {
  serviesGetImgsIid,
  serviesGetKeywords,
  serviesGetKid,
} from "../Services/useData";
import {
  urlGetCompanyDetail,
  urlSetCompanyDetail,
  ALLKEYWORD,
} from "../Services/string";
import SetImage from "../components/common/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";
import SetAllKeyWord from "../components/common/ComponentSetAllKeyWord";
import ComponentSetCompany from "../components/common/ComponentSetCompany";

export default function SetCompanyDetail() {
  const { cid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm();

  ///"/admin/setCompanyDetailInfo" 로 보내기 위한 상세 회사 정보
  const [companyDetailInfo, setCompanyDetailInfo] = useState({
    name: "",
    comment: "",
    location: "",
    address: "",
    registration: "",
    workTime: "",
    offer: "",
    titleImg: "",
    imgs: "",
    telnum: "",
    mobilenum: "",
    email: "",
    extnum: "",
    tags: "",
    useFlag: "",
  });

  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시
  // imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const imgsIid = [];
  // useFlag radio
  const [useFlagCheck, setUseFlagCheck] = useState(1);
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  // mapcoor:위도 경도 저장,
  const mapcoor = useRef({ longitude: "", latitude: "" });
  // 선택된 키워드 저장되는 state
  const [companyDetailKeyword, setCompanyDetailKeyword] = useState([]);
  // keywordValue:서버에 키워드를 보낼 때 keyword의 value만 필요
  const keywordValue = [];

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
    geocoder.addressSearch(companyDetailInfo.address, callback);
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
          // 값이 있다면 comapnyData에 저장한 후 getDataFinish 값을 변경
          setCompanyDetailInfo(res.data);
          setUseFlagCheck(res.data.useFlag);
          // 로그인 시 로컬스토리지에 저장한 전체 키워드 가져오기
          const allKeywordData = JSON.parse(servicesGetStorage(ALLKEYWORD));
          // 이미 입력된 키워드 값이 있다면 가져온 keywords 와 allKeywordData의 keyword의 value를 비교하여 keyword 객체 가져오기
          // 삭제 기능을 위해 kid도 불러와야 해서 해당 기능 추가
          serviesGetKid(
            setCompanyDetailKeyword,
            res.data.keywords,
            allKeywordData
          );
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("새로운 사업자 회원입니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  // detailInfo input onChange 이벤트
  function onChange(e) {
    setCompanyDetailInfo({
      ...companyDetailInfo,
      [e.target.id]: e.target.value,
    });
  }

  // useFlag ridio onChange 이벤트
  function onChangeUseFlag(e) {
    setUseFlagCheck(e.target.value);
  }

  // form submit 이벤트
  const addUserEvent = () => {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);
    // 서버에 keywords의 keyword value만을 보내기 위해 실행하는 함수
    serviesGetKeywords(keywordValue, companyDetailKeyword);
    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      name: companyDetailInfo.name,
      comment: companyDetailInfo.comment,
      location: companyDetailInfo.location,
      address: companyDetailInfo.address,
      registration: companyDetailInfo.registration,
      workTime: companyDetailInfo.workTime,
      offer: companyDetailInfo.offer,
      titleImg: titleImg ? titleImg[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
      longitude: mapcoor.current.longitude,
      latitude: mapcoor.current.latitude,
      telnum: companyDetailInfo.telnum,
      mobilenum: companyDetailInfo.mobilenum,
      email: companyDetailInfo.email,
      extnum: companyDetailInfo.extnum,
      keywords: keywordValue.toString() || "",
      tags: companyDetailInfo.tags,
      useFlag: useFlagCheck,
    })
      .then((res) => {
        if (res.status === "success") {
          alert("완료되었습니다.");
          window.location.href = cid ? `/company/${cid}` : "CompanyMyDetail";
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  function UserDetailInfoSubmit(e) {
    // companyDetailInfo.address가 입력되어 있으면 위도경도 구하는 함수 실행(내부에 addUserEvent이벤트 실행 코드 있음)
    companyDetailInfo.address ? callMapcoor() : addUserEvent();
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
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <fieldset className="formContentWrapWithRadio">
            <div className="listSearchWrap">
              <div className="blockLabel">회원관리</div>
              <div className="formContentWrapWithRadioValue">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={useFlagCheck == 0}
                  name="_useFlag"
                  value="0"
                  id="0"
                  {...register("_useFlag", {
                    onChange: onChangeUseFlag,
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="0">
                  휴면
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={useFlagCheck == 1}
                  name="_useFlag"
                  value="1"
                  id="1"
                  {...register("_useFlag", {
                    onChange: onChangeUseFlag,
                  })}
                />
                <label className="listSearchRadioLabel" htmlFor="1">
                  사용
                </label>
              </div>
            </div>
            <div />
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
              value={companyDetailInfo.name || ""}
              {...register("_name", {
                onChange: onChange,
                required: "입력되지 않았습니다.",
                maxLength: {
                  value: 16,
                  message: "16자 이하의 글자만 사용가능합니다.",
                },
                minLength: {
                  value: 2,
                  message: "2자 이상의 글자만 사용가능합니다.",
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

          <div className="formContentWrap">
            <label htmlFor="registration" className=" blockLabel">
              사업자 등록 번호
            </label>
            <input
              type="text"
              id="registration"
              name="_registration"
              placeholder="사업자 등록 번호를 입력해 주세요. (예시 000-00-00000)"
              value={companyDetailInfo.registration || ""}
              {...register("_registration", {
                onChange: onChange,
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
              value={companyDetailInfo.mobilenum || ""}
              placeholder="핸드폰번호를 입력해 주세요. (예시 000-0000-0000)"
              {...register("_mobilenum", {
                onChange: onChange,
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
              value={companyDetailInfo.telnum || ""}
              {...register("_telnum", {
                onChange: onChange,
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
              onChange={onChange}
              value={companyDetailInfo.extnum || ""}
              {...register("_extnum", {
                onChange: onChange,
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
              value={companyDetailInfo.location || ""}
              {...register("_location", {
                onChange: onChange,
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
              value={companyDetailInfo.address || ""}
              {...register("_address", {
                onChange: onChange,
                required: "입력되지 않았습니다.",
                maxLength: {
                  value: 50,
                  message: "50자 이하의 글자만 사용가능합니다.",
                },
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

          <div className="formContentWrap">
            <label htmlFor="email" className=" blockLabel">
              이메일
            </label>
            <input
              type="text"
              id="email"
              name="_email"
              placeholder="이메일을 입력해 주세요."
              onChange={onChange}
              value={companyDetailInfo.email || ""}
              {...register("_email", {
                onChange: onChange,
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
              value={companyDetailInfo.comment || ""}
              {...register("_comment", {
                onChange: onChange,
                maxLength: {
                  value: 300,
                  message: "300자 이하의 글자만 사용가능합니다.",
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
            <label htmlFor="workTime" className=" blockLabel">
              근무 시간
            </label>
            <input
              type="text"
              id="workTime"
              name="_workTime"
              placeholder="근무 시간을 입력해 주세요."
              value={companyDetailInfo.workTime || ""}
              {...register("_workTime", {
                onChange: onChange,
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
            getData={companyDetailInfo}
            id="titleImg"
            title="대표 이미지"
            getDataFinish={getDataFinish.current}
          />

          <SetImage
            imgs={imgs}
            setImgs={setImgs}
            id="imgs"
            title="상세 이미지"
            getData={companyDetailInfo}
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
              onChange={onChange}
              value={companyDetailInfo.offer || ""}
              {...register("_offer", {
                onChange: onChange,
                maxLength: {
                  value: 500,
                  message: "500자 이하의 글자만 사용가능합니다.",
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
              getDataKeyword={companyDetailInfo && companyDetailInfo.keywords}
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
              onChange={onChange}
              value={
                (companyDetailInfo.tags &&
                  companyDetailInfo.tags.replace(" ", ",")) ||
                ""
              }
              {...register("_tags", {
                onChange: onChange,
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
    </>
  );
}
