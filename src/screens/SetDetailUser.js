import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid, servicesUseToast } from "../Services/useData";
import {
  urlSetUserDetail,
  urlGetUserDetail,
  urlSetUser,
} from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ImageSet from "../components/common/ServicesImageSetPreview";
import DetailUserComponent from "../components/common/ComponentSetUser";
import PieceRegisterSearchPopUp from "../components/common/PieceRegisterSearchPopUp";

export default function SetDetailUser() {
  const { uid } = useParams();
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
  // 하위 컴포넌트에서 전달 받은 값이기 떄문에 useState로 작성
  const [userData, setUserData] = useState({});
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);

  // 이미지 ------------------------------------------------------------------------
  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  // imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const imgsIid = [];

  // 주소 ------------------------------------------------------------------------
  // address:신주소,  oldaddress:구주소,  zipcode:우편번호,  latitude:위도,  longitude:경도
  const [multilAddress, setMultilAddress] = useState({});

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 이미지 iid를 가지고 오기 위해 (imgs, titleImg) 사용
          setGetedData(res.data);
          // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
          setValue("_name", res.data.name || "");
          setValue("_nick", res.data.nick || "");
          setValue("_mobile", res.data.mobile || "");
          setValue("_location", res.data.location || "");
          setValue("_mail", res.data.mail || "");
          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

  // 수정 완료 이벤트
  function handleSumbit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);

    // setUser 수정 (회원활성화, 비밀번호, userrole)
    // DetailUserComponent
    servicesPostData(urlSetUser, {
      uid: uid,
      ...userData,
    });

    // setUserDetailInfo 수정
    servicesPostData(urlSetUserDetail, {
      ruid: uid,
      name: getValues("_name"),
      nick: getValues("_nick"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
      mobile: getValues("_mobile"),
      location: getValues("_location"),
      mail: getValues("_mail"),
      titleImg: titleImg ? titleImg[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
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
      .catch((error) => console.log(error));
  }

  console.log("multilAddress", multilAddress);

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(handleSumbit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton url="/user" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formWrap">
            {/* setUser (회원활성화, 회원권한, 비밀번호관리) ================================================================ */}
            <DetailUserComponent
              setUserData={setUserData}
              userData={userData}
            />

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
              <label htmlFor="nick" className="blockLabel">
                <span>별명</span>
              </label>
              <div>
                <input
                  type="text"
                  id="nick"
                  placeholder="별명을 입력해 주세요."
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
            <PieceRegisterSearchPopUp
              userComponent
              setMultilAddress={setMultilAddress}
              multilAddress={multilAddress}
              getedData={getedData}
            />

            <div className="formContentWrap">
              <label htmlFor="mobile" className="blockLabel">
                <span>핸드폰 번호</span>
              </label>
              <div>
                <input
                  type="text"
                  id="mobile"
                  placeholder="핸드폰 번호 (예시 000-0000-0000)"
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

            <ImageSet
              img={titleImg}
              setImg={setTitleImg}
              getData={getedData}
              id="titleImg"
              title="대표 이미지"
              getDataFinish={getDataFinish.current}
            />

            <ImageSet
              imgs={imgs}
              setImgs={setImgs}
              id="imgs"
              title="상세 이미지"
              getData={getedData}
              getDataFinish={getDataFinish.current}
            />
          </div>
        </form>
      </div>
    </>
  );
}
