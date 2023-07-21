// 공사콕 앱 관리 > 공지사항 관리 > 공사콕 공지사항 수정

import { useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";

import * as STR from "../Services/string";
import * as API from "../Services/api";
import * as UD from "../Services/useData";

import SetImage from "../components/services/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetDetailAdminNotice() {
  const { contid } = useParams();
  const dispatch = useDispatch();
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      _category: "notice",
    },
  });
  const [useFlag, setUseFlag] = useState(true);

  // 이미지 ------------------------------------------------------------------------
  const multiImgs = useSelector((state) => state.multiImgsData, shallowEqual);
  const imgsIid = [];

  useLayoutEffect(() => {
    // contid가 있으면 기존에 입력된 값을 가져옴
    if (!!contid) {
      API.servicesPostData(STR.urlGetContent, {
        contid: contid,
      })
        .then((res) => {
          if (res.status === "success") {
            dispatch({
              type: "getedData",
              payload: { ...res.data },
            });

            setValue("_category", res.data.category || "notice");
            setValue("_contentString", res.data.contentString || "");
            setValue("_contentDetail", res.data.contentDetail || "");
            setUseFlag(res.data.useFlag == 1 ? true : false);
          }
        })
        .catch((res) => console.log(res));
    }
  }, []);

  console.log("multiImgs", multiImgs);

  function AddUserSubmit(e) {
    UD.serviesGetImgsIid(imgsIid, multiImgs);
    API.servicesPostData(
      STR.urlSetContent,
      !!contid
        ? // contid여부 확인하여 contid가 있으면 수정
          {
            contid: contid,
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            imgString: multiImgs ? imgsIid.toString() : "",
          }
        : // contid가 없으면 새로 작성
          {
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            imgString: multiImgs ? imgsIid.toString() : "",
          }
    )
      .then((res) => {
        if (res.status === "success") {
          UD.servicesUseToast("입력이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `notice/${res.data.contid}`;
          }, 2000);
          return;
        }
        if (res.status === "fail") {
          UD.servicesUseToast("입력에 실패했습니다.", "e");
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  const fnUseFlag = () => {
    API.servicesPostData(STR.urlSetContent, {
      contid: contid,
      category: getValues("_category"),
      contentString: getValues("_contentString"),
      contentDetail: getValues("_contentDetail"),
      useFlag: useFlag == true ? "0" : "1",
    })
      .then((res) => {
        if (res.status === "success") {
          UD.servicesUseToast("수정이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/notice`;
          }, 2000);
          return;
        }
        if (res.status === "fail") {
          UD.servicesUseToast("입력에 실패했습니다.", "e");
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddUserSubmit)}>
          <ul className="tableTopWrap tableTopWhiteWrap">
            <LayoutTopButton
              text={useFlag == true ? "비공개" : "공개"}
              fn={fnUseFlag}
            />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
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
                  placeholder="제목을 입력해 주세요."
                  minLength={2}
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

            <div className="formContentWrap" style={{ width: "100%" }}>
              <label htmlFor="title" className="blockLabel">
                <span>카테고리</span>
              </label>

              <div className="filterWrap">
                <label className="listSearchRadioLabel" htmlFor="notice">
                  <input
                    type="radio"
                    checked={watch("_category") === "notice"}
                    value="notice"
                    id="notice"
                    {...register("_category")}
                  />
                  <span>전체 회원 공지</span>
                </label>

                <label
                  className="listSearchRadioLabel"
                  htmlFor="noticeTocompany"
                >
                  <input
                    type="radio"
                    checked={watch("_category") === "noticeTocompany"}
                    value="noticeTocompany"
                    id="noticeTocompany"
                    {...register("_category")}
                  />
                  <span>사업자 회원 공지</span>
                </label>
              </div>
            </div>

            <SetImage id="imgString" title="공지사항 이미지" />

            <div className="formContentWrap formContentWideWrap">
              <label htmlFor="title" className="blockLabel">
                <span>내용</span>
              </label>
              <div>
                <textarea
                  id="contentDetail"
                  placeholder="내용을 입력해 주세요."
                  style={{ height: "400px" }}
                  minLength={10}
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
