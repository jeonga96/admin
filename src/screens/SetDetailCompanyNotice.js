// 공사콕 앱관리 > 공지사항 관리 > 공사콕 공지사항 작성 (comnid를 기준으로 작성, 수정 구분)

import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useParams } from "react-router-dom";

import * as STR from "../service/string";
import * as API from "../service/api";
import * as UD from "../service/useData";

import SetImage from "../components/services/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetDetailCompanyNotice() {
  const { cid, comnid } = useParams();
  const dispatch = useDispatch();
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();

  // 이미지 ------------------------------------------------------------------------
  // imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const imgs = useSelector((val) => val.imgsData);
  const imgsIid = [];

  useLayoutEffect(() => {
    API.servicesPostData(STR.urlCompanyGetNotice, {
      comnid: comnid,
    })
      .then((res) => {
        if (res.status === "success") {
          dispatch({
            type: "serviceGetedData",
            payload: { ...res.data },
          });
          setValue("_title", res.data.title || "");
          setValue("_content", res.data.content || "");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function fnSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    UD.serviesGetImgsIid(imgsIid, imgs);
    API.servicesPostData(
      STR.urlCompanySetNotice,
      !!comnid
        ? {
            comnid: comnid,
            rcid: cid,
            useFlag: 1,
            title: getValues("_title"),
            content: getValues("_content}"),
            imgs: imgs ? imgsIid.toString() : "",
          }
        : {
            rcid: cid,
            title: getValues("_title"),
            content: getValues("_content"),
            imgs: imgs ? imgsIid.toString() : "",
          }
    )
      .then((res) => {
        if (res.status === "fail") {
          UD.servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          UD.servicesUseToast("수정이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/company/${cid}/notice/${res.data.comnid}`;
          }, 2000);
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopWhiteWrap">
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formContentWrap formContentWideWrap">
            <label htmlFor="title" className="blockLabel">
              <span>제목</span>
            </label>
            <div>
              <input
                type="text"
                id="title"
                placeholder="제목을 입력해 주세요."
                minLength={2}
                {...register("_title", {
                  required: "입력되지 않았습니다.",
                })}
              />
            </div>
          </div>

          <SetImage id="imgs" title="공지사항 이미지" />

          <div className="formContentWrap formContentWideWrap">
            <label htmlFor="title" className="blockLabel">
              <span>내용</span>
            </label>
            <div>
              <textarea
                id="content"
                placeholder="내용을 입력해 주세요."
                minLength={10}
                style={{ height: "400px" }}
                {...register("_content", {
                  equired: "입력되지 않았습니다.",
                  minLength: {
                    value: 10,
                    message: "10자 이상의 글자만 사용가능합니다.",
                  },
                })}
              />

              <ErrorMessage
                errors={errors}
                name="_content"
                render={({ message }) => (
                  <span className="errorMessageWrap">{message}</span>
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
