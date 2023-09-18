// 공사콕 앱 관리 > 이벤트 관리 > 이벤트 작성 (contid를 기준으로 추가 및 수정)

import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useParams } from "react-router-dom";

import * as STR from "../../service/string";
import * as API from "../../service/api";
import * as UD from "../../service/useData";

import LayoutTopButton from "../../components/layout/LayoutTopButton";

export default function SetEvent() {
  const { contid } = useParams();
  const [useFlag, setUseFlag] = useState(true);
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      // _category: "wzEvent",
    },
  });

  useLayoutEffect(() => {
    // contid가 있으면 기존에 입력된 값을 가져옴
    if (!!contid) {
      API.servicesPostData(STR.urlGetContent, {
        contid: contid,
      })
        .then((res) => {
          if (res.status === "success") {
            // setValue("_category", res.data.category || "wzEvent");
            setValue("_contentString", res.data.contentString || "");
            setValue("_contentDetail", res.data.contentDetail || "");
            setUseFlag(res.data.useFlag == 1 ? true : false);
          }
        })
        .catch((res) => console.log(res));
    }
  }, []);

  const onClickLink = (e) => {
    e.preventDefault();
    window.open("about:blank").location.href = watch("_contentDetail");
  };

  const AddUserSubmit = (e) => {
    API.servicesPostData(
      STR.urlSetContent,
      !!contid
        ? // contid여부 확인하여 contid가 있으면 수정
          {
            contid: contid,
            category: "wzEvent",
            // category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail").includes("https")
              ? getValues("_contentDetail")
              : "https://" + getValues("_contentDetail"),
          }
        : // contid가 없으면 새로 작성
          {
            category: "wzEvent",
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail").includes("https")
              ? getValues("_contentDetail")
              : "https://" + getValues("_contentDetail"),
          }
    )
      .then((res) => {
        if (res.status === "success") {
          UD.servicesUseToast("입력이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/event`;
          }, 2000);
          return;
        }
        if (res.status === "fail") {
          UD.servicesUseToast("입력에 실패했습니다.", "e");
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  const fnUseFlag = () => {
    API.servicesPostData(STR.urlSetContent, {
      contid: contid,
      category: "wzEvent",
      contentString: getValues("_contentString"),
      contentDetail: getValues("_contentDetail"),
      useFlag: useFlag == true ? "0" : "1",
    })
      .then((res) => {
        if (res.status === "success") {
          UD.servicesUseToast("수정이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/event`;
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
            <LayoutTopButton text="목록으로 가기" url="/event" />
            <LayoutTopButton
              text={useFlag == true ? "이벤트 종료" : "이벤트 활성화"}
              fn={fnUseFlag}
            />
            <LayoutTopButton
              text={contid ? "수정" : "완료"}
              disabled={isSubmitting}
            />
          </ul>

          <div className="formWrap">
            <div
              className="formContentWrap"
              style={{ marginTop: "0", width: "100%" }}
            >
              <label htmlFor="title" className="blockLabel">
                <span>미리보기</span>
              </label>
              <div>
                <div
                  className="contentInnerTag"
                  dangerouslySetInnerHTML={{
                    __html: watch("_contentString"),
                  }}
                />
              </div>
            </div>

            <div
              className="formContentWrap"
              style={{ marginTop: "0", width: "100%" }}
            >
              <label htmlFor="title" className="blockLabel">
                <span>제목</span>
              </label>
              <div>
                <div className="contentInnerManual contentInnerManualEg">
                  <span>전체 문구는 p 태그로 감싼다.</span>
                  <span>
                    색, 글자 크기 변경은 span 태그로 감싼 후 속성을 추가한다.
                  </span>
                  <span>
                    색 변경 속성: [ span style="color:blue" ] [ span
                    style="color:#000" ] 크기 변경 속성: [ span
                    style="font-size:22px" ]
                  </span>
                </div>

                <input
                  type="text"
                  id="contentString"
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

            {/* <div
              className="formContentWrap"
              style={{ marginTop: "0", width: "100%" }}
            >
              <label htmlFor="title" className="blockLabel">
                <span>카테고리</span>
              </label>

              <div className="filterWrap">
                <label className="listSearchRadioLabel" htmlFor="wzEvent">
                  <input
                    type="radio"
                    checked={watch("_category") == "wzEvent"}
                    value="wzEvent"
                    id="wzEvent"
                    {...register("_category")}
                  />
                  <span>와짱 이벤트</span>
                </label> 
                 <label className="listSearchRadioLabel" htmlFor="businessEvent">
                  <input
                    type="radio"
                    checked={watch("_category") == "businessEvent"}
                    value="businessEvent"
                    id="businessEvent"
                    {...register("_category")}
                  />
                  <span>고객 ( 사용자 ) 이벤트</span>
                </label>
              </div>
            </div> */}

            <div className="formContentWrap formContentWideWrap">
              <label htmlFor="title" className="blockLabel">
                <span>연결 URL</span>
              </label>
              <div className="flexBox">
                <input
                  type="text"
                  id="contentDetail"
                  placeholder="연결할 URL을 입력해 주세요."
                  {...register("_contentDetail", {
                    required: "입력되지 않았습니다.",
                    pattern: {
                      value: /^https/,
                      message: "연결될 링크는 https://로 시작되야 합니다.",
                    },
                    minLength: {
                      value: 2,
                      message: "2자 이상의 글자만 사용가능합니다.",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={onClickLink}
                  className="formButton"
                  style={{ width: "200px", marginLeft: "4px" }}
                >
                  해당 페이지로 이동
                </button>
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
