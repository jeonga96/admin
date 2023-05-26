import { useState, useLayoutEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { urlSetContent, urlGetContent } from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid, servicesUseToast } from "../Services/useData";
import { useParams } from "react-router-dom";

import SetImage from "../components/piece/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetDetailAdminNotice() {
  const { contid } = useParams();

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

  // 데이터 ------------------------------------------------------------------------
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  // 하위 컴포넌트에게 이미지 iid 전달
  const [noticeDetail, setNoticeDetail] = useState({});
  const [useFlag, setUseFlag] = useState(true);

  // 이미지 ------------------------------------------------------------------------
  // imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [imgs, setImgs] = useState([]);
  const imgsIid = [];

  useLayoutEffect(() => {
    // contid가 있으면 기존에 입력된 값을 가져옴
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
            setUseFlag(res.data.useFlag == 1 ? true : false);
            getDataFinish.current = true;
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
        ? // contid여부 확인하여 contid가 있으면 수정
          {
            contid: contid,
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            imgString: setImgs ? imgsIid.toString() : "",
          }
        : // contid가 없으면 새로 작성
          {
            category: getValues("_category"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            imgString: setImgs ? imgsIid.toString() : "",
          }
    )
      .then((res) => {
        if (res.status === "success") {
          servicesUseToast("입력이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `notice/${res.data.contid}`;
          }, 2000);
          return;
        }
        if (res.status === "fail") {
          servicesUseToast("입력에 실패했습니다.", "e");
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  const fnUseFlag = () => {
    servicesPostData(urlSetContent, {
      contid: contid,
      category: getValues("_category"),
      contentString: getValues("_contentString"),
      contentDetail: getValues("_contentDetail"),
      useFlag: useFlag == true ? "0" : "1",
    })
      .then((res) => {
        if (res.status === "success") {
          servicesUseToast("수정이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/notice`;
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
                    checked={watch("_category") == "notice"}
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
                    checked={watch("_category") == "noticeTocompany"}
                    value="noticeTocompany"
                    id="noticeTocompany"
                    {...register("_category")}
                  />
                  <span>사업자 회원 공지</span>
                </label>
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
                  placeholder="내용을 입력해 주세요."
                  style={{ height: "400px" }}
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
