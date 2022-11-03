import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import {
  urlSetUserDetail,
  urlGetUserDetail,
  urlSetUser,
} from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ImageSet from "../components/common/ServicesImageSetPreview";
import DetailUserComponent from "../components/common/ComponentSetUser";

export default function SetDetailUser() {
  const { uid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  // mapcoor:위도 경도 저장,
  const [getIid, setGetIid] = useState([]);
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const getDataFinish = useRef(false);
  const imgsIid = [];
  // setUser 수정, 비밀번호는 기본값 설정되면 안 되기 때문에 X
  const [userData, setUserData] = useState({
    userrole: "ROLE_USER",
    useFlag: "1",
  });

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 이미지 iid를 가지고 오기 위해 (imgs, titleImg) 사용
          setGetIid(res.data);
          // 값이 있다면 inputValue에 저장한 후 getDataFinish 값을 변경
          setValue("_name", res.data.name || "");
          setValue("_nick", res.data.nick || "");
          setValue("_address", res.data.address || "");
          setValue("_mobile", res.data.mobile || "");
          setValue("_location", res.data.location || "");
          setValue("_mail", res.data.mail || "");
          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function AddUserSubmit(e) {
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
      address: getValues("_address"),
      mobile: getValues("_mobile"),
      location: getValues("_location"),
      mail: getValues("_mail"),
      titleImg: titleImg ? titleImg[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
    })
      .then((res) => {
        if (res.status === "success") {
          alert("완료되었습니다!");
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }
  console.log(userData);
  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddUserSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton url="/user" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <DetailUserComponent setUserData={setUserData} userData={userData} />

          <div className="formContentWrap">
            <label htmlFor="name" className=" blockLabel">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="_name"
              placeholder="이름을 입력해 주세요."
              {...register("_name", {
                required: "입력되지 않았습니다.",
                maxLength: {
                  value: 8,
                  message: "8자 이하의 글자만 사용가능합니다.",
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
            <label htmlFor="nick" className="blockLabel">
              별명
            </label>
            <input
              type="text"
              id="nick"
              name="_nick"
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
          </div>
          <ErrorMessage
            errors={errors}
            name="_nick"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="location" className=" blockLabel">
              주소 (ㅇㅇ구, ㅇㅇ동)
            </label>
            <input
              type="text"
              id="location"
              name="_location"
              placeholder="주소를 입력해 주세요."
              {...register("_location", {
                maxLength: {
                  value: 20,
                  message: "20자 이하의 글자만 사용가능합니다.",
                },
                pattern: {
                  value: /^[a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
                  message: "형식에 맞지 않습니다.",
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
            <label htmlFor="comment" className=" blockLabel">
              상세 주소
            </label>
            <input
              type="text"
              id="address"
              name="_address"
              placeholder="상세주소를 입력해 주세요."
              {...register("_address")}
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="mobile" className="blockLabel">
              핸드폰 번호
            </label>
            <input
              type="text"
              id="mobile"
              name="_mobile"
              placeholder="핸드폰 번호 (예시 000-0000-0000)"
              {...register("_mobile", {
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
            name="_mobile"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <div className="formContentWrap">
            <label htmlFor="mail" className=" blockLabel">
              이메일
            </label>
            <input
              type="text"
              id="mail"
              name="_mail"
              placeholder="이메일을 입력해 주세요."
              {...register("_mail", {
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
            name="_mail"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <ImageSet
            img={titleImg}
            setImg={setTitleImg}
            getData={getIid}
            id="titleImg"
            title="대표 이미지"
            getDataFinish={getDataFinish.current}
          />

          <ImageSet
            imgs={imgs}
            setImgs={setImgs}
            id="imgs"
            title="상세 이미지"
            getData={getIid}
            getDataFinish={getDataFinish.current}
          />
        </form>
      </div>
    </>
  );
}
