// 회원관리 > 통합회원 상세정보

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";

import * as DATA from "../../action/data";

import PieceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp";
import ImageSet from "../../components/services/ServicesImageSetPreview";

import DetailUserComponent from "../../components/common/ComponentSetUser";
import CustomerCounseling from "../../components/common/CustomerCounseling";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";
import EventApplyInfo from "../../components/common/EventApplyInfo";
import ComponentTopPageMoveButton from "../../components/common/ComponentTopPageMoveButton";

export default function SetDetailUser() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _nationality: "1",
      _sex: "men",
    },
  });

  // 데이터 ------------------------------------------------------------------------
  // 하위 컴포넌트에서 전달 받은 값이기 떄문에 useState로 작성
  const [userData, setUserData] = useState({});
  const tableTopScrollBtnData = useRef([
    { idName: "CompanyDetail_1", text: "사용자 회원 정보 수정" },
    { idName: "CompanyDetail_8", text: "고객상담" },
    { idName: "CompanyDetail_11", text: "와짱 이벤트 목록" },
  ]);
  // 이미지 ------------------------------------------------------------------------
  // img:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시
  const titleImg = useSelector((state) => state.image.imgData, shallowEqual);
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  // 주소 ------------------------------------------------------------------------
  // address:신주소,  oldaddress:구주소,  zipcode:우편번호,  latitude:위도,  longitude:경도
  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );

  // 다음페이지, 이전페이지 이동을 위해, 현재 list의 가장 마지막 페이지 조회
  const [lastUid, setLastUid] = useState("");

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  CUS.useCleanupEffect(() => {
    API.servicesPostData(APIURL.urlGetUserDetail, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 이미지 iid를 가지고 오기 위해 (imgs, img) 사용
          dispatch(DATA.serviceGetedData(res.data));

          // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
          setValue("_nationality", res.data.nationality);
          setValue("_sex", res.data.sex);
          setValue("_age", res.data.age);
          setValue("_name", res.data.name || "");
          setValue("_nick", res.data.nick || "");
          setValue("_mobile", res.data.mobile || "");
          setValue("_mail", res.data.mail || "");
        }
      })
      .catch((res) => console.log("wrror", res));

    API.servicesPostData(APIURL.urlUserlist, {
      offset: 0,
      size: 1,
    }).then((res) => setLastUid(res.data[0]?.uid));
  }, []);

  useEffect(() => {
    if (!!getedData.cdid) {
      setValue("_nationality", "1");
      // setValue("_sex", res.data.sex);
      // setValue("_age", res.data.age);
      setValue("_name", getedData.name || "");
      setValue("_nick", getedData.nick || "");
      setValue("_mobile", getedData.mobile || "");
      setValue("_mail", getedData.mail || "");
    }
  }, [getedData]);

  // 수정 완료 이벤트
  function fnSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    // serviesGetImgsIid(imgsIid, imgs);

    API.servicesPostData(APIURL.urlSetUser, {
      uid: uid,
      ...userData,
    });

    // setUserDetailInfo 수정
    API.servicesPostData(APIURL.urlSetUserDetail, {
      ruid: uid,
      name: getValues("_name"),
      nick: getValues("_nick"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
      mobile: getValues("_mobile"),
      nationality: getValues("_nationality"),
      sex: getValues("_sex"),
      age: getValues("_age"),
      mail: getValues("_mail"),
      titleImg: titleImg?.length > 0 ? titleImg[0].iid : "",
    })
      .then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          TOA.servicesUseToast("완료되었습니다!", "s");
          return;
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="commonBox">
      <div className="formLayout">
        <ul className="tableTopWrap tableTopBorderWrap">
          <ComponentTableTopScrollBtn data={tableTopScrollBtnData.current} />

          <LayoutTopButton idNum={uid} />
          {getedData
            ? ComponentTopPageMoveButton(uid, lastUid, "user")
            : TOA.servicesUseToast("다음 페이지가 없습니다.", "e")}
          <LayoutTopButton url="/user" text="목록으로 가기" />
          <LayoutTopButton text="완료" fn={handleSubmit(fnSubmit)} />
        </ul>

        <div className="formWrap">
          <div className="formContainer">
            <h3>회원 정보 관리</h3>
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
                    checked={watch("_nationality") == "1"}
                    value="1"
                    id="nationality1"
                    {...register("_nationality", {})}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="nationality1"
                  >
                    내국인
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_nationality") == "2"}
                    value="2"
                    id="nationality2"
                    {...register("_nationality", {})}
                  />
                  <label
                    className="listSearchRadioLabel"
                    htmlFor="nationality2"
                  >
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
                    checked={watch("_sex") == "men"}
                    value="men"
                    id="men"
                    {...register("_sex")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="men">
                    남자
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_sex") == "woman"}
                    value="woman"
                    id="woman"
                    {...register("_sex")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="woman">
                    여자
                  </label>
                </div>
              </div>
              {/* setDetailUserInfo  ================================================================ */}
              <div className="formContentWrap">
                <label htmlFor="name" className=" blockLabel">
                  <span>이름 *</span>
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
                        message: "8자 이하로 입력해주세요.",
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

              {/* 연령 */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>연령</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "10대"}
                    value="10대"
                    id="age10"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age10">
                    10대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "20대"}
                    value="20대"
                    id="age20"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age20">
                    20대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "30대"}
                    value="30대"
                    id="age30"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age30">
                    30대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "40대"}
                    value="40대"
                    id="age40"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age40">
                    40대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "50대"}
                    value="50대"
                    id="age50"
                    {...register("_age")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="age50">
                    50대
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_age") == "60대"}
                    value="60대"
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
                    maxLength={10}
                    {...register("_nick", {
                      maxLength: {
                        value: 10,
                        message: "10자 이하로 입력해주세요.",
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

              {/* 주소 */}
              <PieceRegisterSearchPopUp simpleValue />
              <div className="formContentWrap">
                <label htmlFor="mobile" className="blockLabel">
                  <span>휴대폰 *</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="mobile"
                    placeholder="휴대폰 (예시 000-0000-0000)"
                    maxLength={13}
                    value={
                      (watch("_mobile") &&
                        watch("_mobile")
                          .replace(/[^0-9]/g, "")
                          .replace(/(^02)([0-9]{3,4})([0-9]{4})$/, "$1-$2-$3")
                          .replace(
                            /(^0505|^1[0-9]{3}|^0[1-9][0-9])([0-9]{3,4})([0-9]{4})$/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_mobile", {
                      required: "입력되지 않았습니다.",
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
                    placeholder="영문,숫자로만 입력해 주세요."
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
            <EventApplyInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
