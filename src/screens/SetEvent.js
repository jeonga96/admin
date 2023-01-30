import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { urlSetContent, urlGetContent } from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { servicesUseToast } from "../Services/useData";
import { useParams } from "react-router-dom";

import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetEvent() {
  const { contid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  useLayoutEffect(() => {
    // contid가 있으면 기존에 입력된 값을 가져옴
    if (!!contid) {
      servicesPostData(urlGetContent, {
        contid: contid,
      })
        .then((res) => {
          if (res.status === "success") {
            setValue("_category", res.data.category || "wzEvent");
            setValue("_contentString", res.data.contentString || "");
            setValue("_contentDetail", res.data.contentDetail || "");
          } else if (res.data === "fail") {
            console.log("기존에 입력된 데이터가 없습니다.");
          }
        })
        .catch((res) => console.log(res));
    }
  }, []);

  const onClickLink = () => {
    if (!getValues("_contentDetail")) {
      return servicesUseToast("URL이 입력되지 않았습니다.", "e");
    } else if (
      !!watch("_contentDetail") &&
      watch("_contentDetail").includes("https://")
    ) {
      return (window.location.href = watch("_contentDetail"));
    } else if (
      !!watch("_contentDetail") &&
      watch("_contentDetail").includes("http")
    ) {
      return (window.location.href = watch("_contentDetail").replace(
        "http",
        "https"
      ));
    } else if (
      !!watch("_contentDetail") &&
      !watch("_contentDetail").includes("http://")
    ) {
      return (window.location.href = `https://${watch("_contentDetail")}`);
    } else {
      return servicesUseToast("URL이 잘못 입력되었습니다.", "e");
    }
  };

  const AddUserSubmit = (e) => {
    servicesPostData(
      urlSetContent,
      !!contid
        ? // contid여부 확인하여 contid가 있으면 수정
          {
            contid: contid,
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail").includes("https")
              ? getValues("_contentDetail")
              : "https://" + getValues("_contentDetail"),
          }
        : // contid가 없으면 새로 작성
          {
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail").includes("https")
              ? getValues("_contentDetail")
              : "https://" + getValues("_contentDetail"),
          }
    )
      .then((res) => {
        if (res.status === "success") {
          servicesUseToast("입력이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/event`;
          }, 2000);
          return;
        }
        if (res.status === "fail") {
          servicesUseToast("입력에 실패했습니다.", "e");
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddUserSubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="목록으로 가기" url="/event" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            <div className="filterWrap">
              <select {...register("_category")}>
                <option value="wzEvent">와짱 이벤트</option>
                <option value="businessEvent">고객 ( 사용자 ) 이벤트</option>
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

            <div className="formContentWrap formContentWideWrap">
              <label htmlFor="title" className="blockLabel">
                <span>URL 연결</span>
              </label>
              <div className="flexBox">
                <input
                  type="text"
                  id="contentDetail"
                  placeholder="연결할 URL을 입력해 주세요."
                  {...register("_contentDetail", {
                    required: "입력되지 않았습니다.",
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
