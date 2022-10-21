import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { urlCompanyGetNotice, urlCompanySetNotice } from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { useParams } from "react-router-dom";

import SetImage from "../components/common/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetDetailCompanyNotice() {
  const { cid, comnid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  const [imgs, setImgs] = useState([]);
  const imgsIid = [];
  const getDataFinish = useRef(false);

  const [noticeDetail, setNoticeDetail] = useState({});

  useEffect(() => {
    servicesPostData(urlCompanyGetNotice, {
      comnid: comnid,
    })
      .then((res) => {
        if (res.status === "success") {
          setNoticeDetail(res.data);
          setValue("_title", res.data.title || "");
          setValue("_content", res.data.content || "");
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("기존에 입력된 데이터가 없습니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function AddUserSubmit(e) {
    servicesPostData(
      urlCompanySetNotice,
      !!comnid
        ? {
            comnid: comnid,
            rcid: cid,
            useFlag: 1,
            title: getValues("_title"),
            content: getValues("_content}"),
            imgs: setImgs ? imgsIid.toString() : "",
          }
        : {
            rcid: cid,
            title: getValues("_name"),
            content: getValues("_content"),
            imgs: setImgs ? imgsIid.toString() : "",
          }
    )
      .then((res) => {
        if (res.status === "success") {
          alert("완료되었습니다!");
          window.location.href = `/company/${cid}/notice`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddUserSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="title" className="blockLabel">
              제목
            </label>
            <input
              type="text"
              id="title"
              placeholder="제목을 입력해 주세요."
              {...register("_title", {
                required: "입력되지 않았습니다.",
                minLength: {
                  value: 2,
                  message: "2자 이상의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_title"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />

          <SetImage
            imgs={imgs}
            setImgs={setImgs}
            id="imgs"
            title="공지사항 이미지"
            getData={noticeDetail}
            getDataFinish={getDataFinish.current}
          />

          <div className="formContentWrap">
            <label htmlFor="title" className="blockLabel">
              내용
            </label>
            <textarea
              id="content"
              placeholder="내용을 입력해 주세요."
              {...register("_content", {
                equired: "입력되지 않았습니다.",
                minLength: {
                  value: 10,
                  message: "10자 이상의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="_content"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />
        </form>
      </div>
    </>
  );
}
