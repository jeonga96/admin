// 공사콕 앱관리 > 공지사항 관리 > 공사콕 공지사항 작성 (comnid를 기준으로 작성, 수정 구분)

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useParams } from "react-router-dom";

import * as APIURL from "../../service/string/apiUrl";
import * as API from "../../service/api";
import * as UDIMAGE from "../../service/useData/image";
import * as CUS from "../../service/customHook";
import * as TOA from "../../service/library/toast";

import * as DATA from "../../action/data";

import SetImage from "../../components/services/ServicesImageSetPreview";
import LayoutTopButton from "../../components/layout/LayoutTopButton";

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
  const imgs = useSelector((val) => val.image.imgsData);
  const [submitCk, setSubmitCk] = useState(false);
  const imgsIid = [];

  CUS.useCleanupEffect(() => {
    API.servicesPostData(APIURL.urlCompanyGetNotice, {
      comnid: comnid,
    })
      .then((res) => {
        if (res.status === "success") {
          dispatch(DATA.serviceGetedData(res.data));
          setValue("_title", res.data.title || "");
          setValue("_content", res.data.content || "");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function fnSubmit(e) {
    if (submitCk) return;

    setSubmitCk(true);
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    UDIMAGE.serviesGetImgsIid(imgsIid, imgs);
    API.servicesPostData(
      APIURL.urlCompanySetNotice,
      !!comnid
        ? {
            comnid: comnid,
            rcid: cid,
            useFlag: 1,
            title: getValues("_title"),
            content: getValues("_content"),
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
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
          setSubmitCk(false);
        }
        if (res.status === "success") {
          TOA.servicesUseToast("수정이 완료되었습니다.", "s");
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
            <LayoutTopButton text="완료" isSubmitting={isSubmitting} />
          </ul>
          <div className="formContentWrap formContentWideWrap">
            <label htmlFor="title" className="blockLabel">
              <span>제목</span>
            </label>
            <div>
              <input
                type="text"
                id="title"
                placeholder="제목을 입력해 주세요.(20자이내)"
                minLength={2}
                maxLength={20}
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
                placeholder="내용을 입력해 주세요.(900자 이내)"
                minLength={10}
                maxLength={900}
                style={{ height: "400px" }}
                {...register("_content", {
                  equired: "입력되지 않았습니다.",
                  minLength: {
                    value: 10,
                    message: "10자 이상으로 입력해주세요.",
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
