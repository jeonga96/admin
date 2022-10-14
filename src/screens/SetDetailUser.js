import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import {
  urlSetUserRole,
  urlSetUserDetail,
  urlGetUserDetail,
} from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ImageSet from "../components/common/ServicesImageSetPreview";
import DetailUserComponent from "../components/common/ComponentSetDetailUser";

export default function SetDetailUser() {
  const { uid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm();

  const [userDetail, setUserDetail] = useState({
    name: "",
    address: "",
    mobile: "",
    location: "",
    mail: "",
    titleImg: "",
    imgs: "",
    nick: "",
  });

  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  // mapcoor:위도 경도 저장,
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const getDataFinish = useRef(false);
  const imgsIid = [];

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 값이 있다면 comapnyData에 저장한 후 getDataFinish 값을 변경
          setUserDetail(res.data);
          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function onChange(e) {
    setUserDetail({ ...userDetail, [e.target.id]: e.target.value });
  }

  function AddUserSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);

    // getDataFinish값이 false라면 수정이 아닌, 생성이므로 userole의 기본값을 입력한다.
    if (!getDataFinish) {
      servicesPostData(urlSetUserRole, {
        uid: uid,
        userrole: "ROLE_USER",
      });
    }

    servicesPostData(urlSetUserDetail, {
      ruid: uid,
      name: userDetail.name,
      address: userDetail.address,
      mobile: userDetail.mobile,
      location: userDetail.location,
      mail: userDetail.mail,
      titleImg: titleImg ? titleImg[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
      nick: userDetail.nick,
    })
      .then((res) => {
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          window.location.href = `/user/${uid}`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  return (
    <>
      <DetailUserComponent />
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddUserSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formContentWrap">
            <label htmlFor="name" className=" blockLabel">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="_name"
              placeholder="이름을 입력해 주세요."
              value={userDetail.name || ""}
              {...register("_name", {
                onChange: onChange,
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
              value={userDetail.nick || ""}
              {...register("_nick", {
                onChange: onChange,
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
              value={userDetail.location || ""}
              {...register("_location", {
                onChange: onChange,
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
              value={userDetail.address || ""}
              {...register("_address", {
                onChange: onChange,
              })}
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
              value={
                userDetail.mobile
                  .replace(/[^0-9]/g, "")
                  .replace(/^(\d{3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) || ""
              }
              {...register("_mobile", {
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
              value={userDetail.mail || ""}
              {...register("_mail", {
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
            name="_mail"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <ImageSet
            img={titleImg}
            setImg={setTitleImg}
            getData={userDetail}
            id="titleImg"
            title="대표 이미지"
            getDataFinish={getDataFinish.current}
          />

          <ImageSet
            imgs={imgs}
            setImgs={setImgs}
            id="imgs"
            title="상세설명 이미지"
            getData={userDetail}
            getDataFinish={getDataFinish.current}
          />
        </form>
      </div>
    </>
  );
}
