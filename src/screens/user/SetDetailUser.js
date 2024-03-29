// 회원관리 > 통합회원 상세정보

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLayoutEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

import PieceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp";
import ImageSet from "../../components/services/ServicesImageSetPreview";

import DetailUserComponent from "../../components/common/ComponentSetUser";
import CustomerCounseling from "../../components/common/CustomerCounseling";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentTableTopNumber from "../../components/piece/PieceTableTopNumber";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";

export default function SetDetailUser() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      _nationality: "내국인",
      _sex: "male",
    },
  });

  // 데이터 ------------------------------------------------------------------------
  // 하위 컴포넌트에서 전달 받은 값이기 떄문에 useState로 작성
  const [userData, setUserData] = useState({});
  const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_1", text: "사용자 회원 정보 수정" },
    { idName: "CompanyDetail_8", text: "고객상담" },
  ]);
  // 이미지 ------------------------------------------------------------------------
  // img:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시
  const titleImg = useSelector((state) => state.imgData, shallowEqual);
  // 주소 ------------------------------------------------------------------------
  // address:신주소,  oldaddress:구주소,  zipcode:우편번호,  latitude:위도,  longitude:경도
  const multilAddress = useSelector(
    (state) => state.multilAddressData,
    shallowEqual
  );

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useLayoutEffect(() => {
    API.servicesPostData(STR.urlGetUserDetail, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 이미지 iid를 가지고 오기 위해 (imgs, img) 사용
          dispatch({
            type: "serviceGetedData",
            payload: { ...res.data },
          });
          // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
          setValue("_nationality", res.data.nationality);
          setValue("_sex", res.data.sex);
          setValue("_age", res.data.age);
          setValue("_name", res.data.name || "");
          setValue("_nick", res.data.nick || "");
          setValue("_mobile", res.data.mobile || "");
          setValue("_location", res.data.location || "");
          setValue("_mail", res.data.mail || "");
        }
      })
      .catch((res) => console.log("wrror", res));
  }, []);

  // 수정 완료 이벤트
  function fnSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    // serviesGetImgsIid(imgsIid, imgs);

    API.servicesPostData(STR.urlSetUser, {
      uid: uid,
      ...userData,
    });
    // setUserDetailInfo 수정
    API.servicesPostData(STR.urlSetUserDetail, {
      ruid: uid,
      name: getValues("_name"),
      nick: getValues("_nick"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
      mobile: getValues("_mobile"),
      nationality: getValues("_nationality"),
      sex: getValues("_sex"),
      age: getValues("_age"),
      location: getValues("_location"),
      mail: getValues("_mail"),
      titleImg: titleImg ? titleImg[0].iid : "",
    })
      .then((res) => {
        if (res.status === "fail") {
          UD.servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          UD.servicesUseToast("완료되었습니다!", "s");
          return;
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="commonBox">
      <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
        <ul className="tableTopWrap tableTopBorderWrap">
          <ComponentTableTopScrollBtn data={tableTopScrollBtnData.current} />
          <ComponentTableTopNumber title="회원 관리번호" text={uid} />
          <LayoutTopButton url="/user" text="목록으로 가기" />
          <LayoutTopButton text="완료" disabled={isSubmitting} />
        </ul>
        <div className="formWrap">
          <fieldset id="CompanyDetail_1">
            <h3>사용자 회원 정보 수정</h3>
            {/* setUser (회원활성화, 회원권한, 비밀번호관리) ================================================================ */}
            <DetailUserComponent
              setUserData={setUserData}
              userData={userData}
            />

            <div className="formContentWrap">
              <div className="blockLabel">
                <span>분류</span>
              </div>
              <div className="formPaddingWrap">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={watch("_nationality") == "내국인"}
                  value="내국인"
                  id="nationality0"
                  {...register("_nationality", {})}
                />
                <label className="listSearchRadioLabel" htmlFor="nationality0">
                  내국인
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={watch("_nationality") == "외국인"}
                  value="외국인"
                  id="nationality1"
                  {...register("_nationality", {})}
                />
                <label className="listSearchRadioLabel" htmlFor="nationality1">
                  외국인
                </label>
              </div>
            </div>

            <div className="formContentWrap">
              <div className="blockLabel">
                <span>성별</span>
              </div>
              <div className="formPaddingWrap">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={watch("_sex") == "male"}
                  value="male"
                  id="male"
                  {...register("_sex")}
                />
                <label className="listSearchRadioLabel" htmlFor="male">
                  남자
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={watch("_sex") == "female"}
                  value="female"
                  id="female"
                  {...register("_sex")}
                />
                <label className="listSearchRadioLabel" htmlFor="female">
                  여자
                </label>
              </div>
            </div>

            {/* setDetailUserInfo  ================================================================ */}
            <div className="formContentWrap">
              <label htmlFor="name" className=" blockLabel">
                <span>이름</span>
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="이름을 입력해 주세요."
                  {...register("_name", {
                    required: "입력되지 않았습니다.",
                    maxLength: {
                      value: 8,
                      message: "8자 이하의 글자만 사용가능합니다.",
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
              <label htmlFor="nick" className="blockLabel">
                <span>별명</span>
              </label>
              <div>
                <input
                  type="text"
                  id="nick"
                  placeholder="별명을 입력해 주세요."
                  maxLength={8}
                  {...register("_nick", {
                    maxLength: {
                      value: 8,
                      message: "8자 이하의 글자만 사용가능합니다.",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
                      message: "형식에 맞지 않습니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_nick"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            <div className="formContentWrap">
              <label htmlFor="location" className=" blockLabel">
                <span>키워드 주소</span>
              </label>
              <div>
                <input
                  type="text"
                  id="location"
                  placeholder="주소를 입력해 주세요. (ㅇㅇ구, ㅇㅇ동)"
                  maxLength={50}
                  {...register("_location", {
                    maxLength: {
                      value: 50,
                      message: "50자 이하의 글자만 사용가능합니다.",
                    },
                    pattern: {
                      value: /^[0-9가-힣]/,
                      message: "형식에 맞지 않습니다.",
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
            <PieceRegisterSearchPopUp userComponent />

            <div className="formContentWrap">
              <label htmlFor="mobile" className="blockLabel">
                <span>휴대폰</span>
              </label>
              <div>
                <input
                  type="text"
                  id="mobile"
                  placeholder="핸드폰 번호 (예시 000-0000-0000)"
                  maxLength={13}
                  value={
                    (watch("_mobile") &&
                      watch("_mobile")
                        .replace(/[^0-9]/g, "")
                        .replace(
                          /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                          "$1-$2-$3"
                        )
                        .replace("--", "-")) ||
                    ""
                  }
                  {...register("_mobile", {
                    required: "입력되지 않았습니다.",
                    pattern: {
                      value: /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/,
                      message: "형식에 맞지 않습니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_mobile"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            <div className="formContentWrap">
              <label htmlFor="mail" className=" blockLabel">
                <span>이메일</span>
              </label>
              <div>
                <input
                  type="text"
                  id="mail"
                  placeholder="이메일을 입력해 주세요."
                  value={
                    (watch("_mail") &&
                      watch("_mail").replace(/[^\\!-z]/gi, "")) ||
                    ""
                  }
                  {...register("_mail", {
                    pattern: {
                      value:
                        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                      message: "형식에 맞지 않습니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_mail"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            <ImageSet id="titleImg" title="대표 이미지" />
          </fieldset>

          <CustomerCounseling />
        </div>
      </form>
    </div>
  );
}
