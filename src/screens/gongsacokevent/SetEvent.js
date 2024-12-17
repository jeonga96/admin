// 리액트의 useEffect 및 useState 훅을 임포트합니다.
import { useState } from "react";
// react-hook-form의 useForm 훅을 임포트합니다.
import { useForm } from "react-hook-form";
// react-hook-form의 ErrorMessage 컴포넌트를 임포트합니다.
import { ErrorMessage } from "@hookform/error-message";
// 리액트 라우터 돔의 useParams 훅을 임포트합니다.
import { useParams } from "react-router-dom";

// 서비스 문자열 관련 상수들을 임포트합니다.
import * as APIURL from "../../service/string/apiUrl";
// customhook 관련 상수들을 임포트합니다.
import * as CUS from "../../service/customHook";
// API 호출 관련 함수들을 임포트합니다.
import * as API from "../../service/api";
// 토스트 알림 서비스 관련 함수들을 임포트합니다.
import * as TOA from "../../service/library/toast";

// 레이아웃 상단 버튼 컴포넌트를 임포트합니다.
import LayoutTopButton from "../../components/layout/LayoutTopButton";

// 이벤트 설정 컴포넌트를 정의합니다.
export default function SetEvent() {
  // URL 파라미터로부터 contid 값을 추출합니다.
  const { contid } = useParams();
  // 이벤트 활성화 상태를 관리하는 상태 변수를 선언합니다.
  const [useFlag, setUseFlag] = useState(true);
  // useForm 훅을 사용하여 폼 관련 변수들을 초기화합니다.
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {},
  });
  const [submitCk, setSubmitCk] = useState(false);

  // 컴포넌트가 마운트될 때 기존 이벤트 데이터를 불러오는 효과를 정의합니다.
  CUS.useCleanupEffect(() => {
    if (contid) {
      API.servicesPostData(APIURL.urlGetContent, { contid })
        .then((res) => {
          if (res.status === "success") {
            setValue("_contentString", res.data.contentString || "");
            setValue("_contentDetail", res.data.contentDetail || "");
            setUseFlag(res.data.useFlag === 1);
          }
        })
        .catch((res) => console.error(res));
    }
  }, [contid]);

  // 링크 클릭 핸들러를 정의합니다.
  const onClickLink = (e) => {
    e.preventDefault();
    window.open("about:blank").location.href = watch("_contentDetail");
  };

  // 이벤트 추가 및 수정 제출 핸들러를 정의합니다.
  const AddUserSubmit = (data) => {
    if (submitCk) return;

    setSubmitCk(true);

    API.servicesPostData(
      APIURL.urlSetContent,
      contid
        ? {
            contid,
            category: "wzEvent",
            contentString: data._contentString,
            contentDetail: data._contentDetail.startsWith("https")
              ? data._contentDetail
              : `https://${data._contentDetail}`,
          }
        : {
            category: "wzEvent",
            contentString: data._contentString,
            contentDetail: data._contentDetail.startsWith("https")
              ? data._contentDetail
              : `https://${data._contentDetail}`,
          }
    )
      .then((res) => {
        // 처리 결과에 따라 토스트 알림을 보여주고 페이지를 이동합니다.
        if (res.status === "success") {
          TOA.servicesUseToast("입력이 완료되었습니다.", "s");
          setTimeout(() => (window.location.href = "/event"), 2000);
        } else if (res.status === "fail") {
          setSubmitCk(false);
          TOA.servicesUseToast("입력에 실패했습니다", "e");
        }
      })
      .catch((error) => console.error("axios failed", error.response));
  };

  // 사용 플래그 토글 핸들러를 정의합니다.
  const fnUseFlag = () => {
    API.servicesPostData(APIURL.urlSetContent, {
      contid,
      category: "wzEvent",
      contentString: getValues("_contentString"),
      contentDetail: getValues("_contentDetail"),
      useFlag: useFlag ? "0" : "1",
    })
      .then((res) => {
        // 처리 결과에 따라 토스트 알림을 보여주고 페이지를 이동합니다.
        if (res.status === "success") {
          TOA.servicesUseToast("수정이 완료되었습니다.", "s");
          setTimeout(() => (window.location.href = "/event"), 2000);
        } else if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다", "e");
        }
      })
      .catch((error) => console.error("axios 실패", error.response));
  };

  // 컴포넌트의 렌더링 부분을 정의합니다.
  return (
    <>
      {/* 상단 버튼 영역 */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ul className="tableTopWrap tableTopWhiteWrap">
          <LayoutTopButton text="목록으로 가기" url="/event" />
        </ul>
      </div>
      {/* 폼 영역 */}
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddUserSubmit)}>
          {/* 이벤트 활성화 및 수정 완료 버튼 */}
          <ul className="tableTopWrap tableTopWhiteWrap">
            <LayoutTopButton
              text={useFlag ? "이벤트 종료" : "이벤트 활성화"}
              fn={fnUseFlag}
            />
            <LayoutTopButton
              text={contid ? "수정" : "완료"}
              isSubmitting={isSubmitting}
            />
          </ul>
          {/* 폼 입력 영역 */}
          <div className="formWrap">
            {/* 미리보기 영역 */}
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
                  dangerouslySetInnerHTML={{ __html: watch("_contentString") }}
                  style={{ textIndent: "0.5rem" }}
                />
              </div>
            </div>

            {/* 제목 입력 영역 */}
            <div
              className="formContentWrap"
              style={{ marginTop: "0", width: "100%" }}
            >
              <label htmlFor="title" className="blockLabel">
                <span>제목 *</span>
              </label>
              <div>
                <div className="contentInnerManual contentInnerManualEg">
                  <span>
                    1. 텍스트를 단락 태그 <code>{"<p></p>"}</code>로 감싸십시오.
                    <br />
                  </span>
                  <span>목적 : p 태그는 단락을 정의하는 데 사용됩니다.</span>
                  <span>
                    2. 색상이나 글꼴 크기를 변경하려면 span 태그로 감싸고 속성을
                    추가하십시오.
                  </span>
                  <span>
                    색상 변경 속성:{" "}
                    <code>{'<span style="color:blue">Blue</span>'}</code>
                  </span>
                  {/* <code>{"<span style=\"color:#000\">Black</span>"}</code> <br/> */}
                  <span>
                    크기 변경 속성:{" "}
                    <code>
                      {'<span style="font-size:22px">Larger text</span>'}
                    </code>
                  </span>
                  <span
                    className="envent_text"
                    style={{
                      backgroundColor: "gray",
                      color: "var(--color-white)",
                    }}
                  >
                    속성 예시코드 :<code>{'<span style="color:orange">'}</code>
                    <span style={{ color: "#ff8d30" }}> 주황색 글자</span>
                    <code>{"</span>"}</code>
                  </span>
                  <span
                    className="envent_text"
                    style={{
                      backgroundColor: "gray",
                      color: "var(--color-white)",
                    }}
                  >
                    실사용 예시코드 :
                    <code>{'<p><span style="color:orange">'}</code>
                    <span style={{ color: "#ff8d30" }}>블로그 포스팅</span>
                    <code>{"</span>"}</code>
                    <span style={{ color: "#000" }}> 30% 할인</span>
                    <code>{"</p>"}</code>
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
                      message: "2자 이상으로 입력해주세요.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_contentString"
                  render={({ message }) => (
                    <p className="errorMessageWrap">{message}</p>
                  )}
                />
              </div>
            </div>

            {/* 연결 URL 입력 영역 */}
            <div className="formContentWrap formContentWideWrap">
              <label htmlFor="title" className="blockLabel">
                <span>연결 URL *</span>
              </label>
              <div className="flexBox">
                {/* 입력 필드와 오류 메시지 */}
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
                      message: "2자 이상으로 입력해주세요.",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="_contentDetail"
                  as="p"
                  className="errorMessageWrap"
                  style={{ marginRight: "17%" }}
                />
                <button
                  type="button"
                  onClick={onClickLink}
                  className="formButton"
                  style={{ width: "200px", marginLeft: "4px" }}
                >
                  해당 페이지로 이동
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
