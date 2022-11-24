import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { urlSetContent, urlGetContent } from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import { useParams } from "react-router-dom";

import SetImage from "../components/common/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetDetailAdminNotice() {
  const { contid } = useParams();

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
    if (!!contid) {
      servicesPostData(urlGetContent, {
        contid: contid,
      })
        .then((res) => {
          if (res.status === "success") {
            setNoticeDetail(res.data);
            setValue("_category", res.data.category || "notice");
            setValue("_contentString", res.data.contentString || "");
            setValue("_contentDetail", res.data.contentDetail || "");
            getDataFinish.current = true;
          } else if (res.data === "fail") {
            console.log("기존에 입력된 데이터가 없습니다.");
          }
        })
        .catch((res) => console.log(res));
    }
  }, []);

  function AddUserSubmit(e) {
    serviesGetImgsIid(imgsIid, imgs);
    servicesPostData(
      urlSetContent,
      !!contid
        ? {
            contid: contid,
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            imgString: setImgs ? imgsIid.toString() : "",
          }
        : {
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            imgString: setImgs ? imgsIid.toString() : "",
          }
    )
      .then((res) => {
        if (res.status === "fail") {
          alert("입력에 실패했습니다,");
        }
        if (res.status === "success") {
          alert("완료되었습니다!");
          window.location.href = `/adminnotice/${res.data.contid}`;
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

          <div className="formWrap">
            <div className="filterWrap">
              <select {...register("_category")}>
                <option value="notice">전체 회원 공지</option>
                <option value="noticeTocompany">사업자 회원 공지</option>
              </select>
            </div>

            <div
              className="formContentWrap"
              style={{ marginTop: "0", width: "100%" }}
            >
              <label htmlFor="title" className="blockLabel">
                <span>제목</span>
              </label>
              <div>
                <input
                  type="text"
                  id="contentString"
                  name="_contentString"
                  placeholder="제목을 입력해 주세요."
                  {...register("_contentString", {
                    required: "입력되지 않았습니다.",
                    minLength: {
                      value: 2,
                      message: "2자 이상의 글자만 사용가능합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_contentString"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>

            <SetImage
              imgs={imgs}
              setImgs={setImgs}
              id="imgs"
              title="공지사항 이미지"
              getData={noticeDetail}
              getDataFinish={getDataFinish.current}
            />

            <div className="formContentWrap formContentWideWrap">
              <label htmlFor="title" className="blockLabel">
                <span>내용</span>
              </label>
              <div>
                <textarea
                  id="contentDetail"
                  name="_contentDetail"
                  placeholder="내용을 입력해 주세요."
                  {...register("_contentDetail", {
                    equired: "입력되지 않았습니다.",
                    minLength: {
                      value: 10,
                      message: "10자 이상의 글자만 사용가능합니다.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_contentDetail"
                  render={({ message }) => (
                    <span className="errorMessageWrap">{message}</span>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
