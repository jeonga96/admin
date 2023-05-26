import { useState, useLayoutEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { urlCompanyGetNotice, urlCompanySetNotice } from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { servicesUseToast, serviesGetImgsIid } from "../Services/useData";
import { useParams } from "react-router-dom";

import SetImage from "../components/piece/ServicesImageSetPreview";
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

  // 데이터 ------------------------------------------------------------------------
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  // 하위 이미지 컴포넌트에게 데이터 넘기기 위해 사용
  const [noticeDetail, setNoticeDetail] = useState({});
  // const [useFlag, setUseFlag] = useState(true);

  // 이미지 ------------------------------------------------------------------------
  // imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [imgs, setImgs] = useState([]);
  const imgsIid = [];

  useLayoutEffect(() => {
    servicesPostData(urlCompanyGetNotice, {
      comnid: comnid,
    })
      .then((res) => {
        if (res.status === "success") {
          setNoticeDetail(res.data);
          setValue("_title", res.data.title || "");
          setValue("_content", res.data.content || "");
          // setUseFlag(res.data.useFlag == 1 ? true : false);
          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function fnSubmit(e) {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);

    servicesPostData(
      urlCompanySetNotice,
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
          servicesUseToast("입력에 실패했습니다.", "e");
        }
        if (res.status === "success") {
          servicesUseToast("수정이 완료되었습니다.", "s");
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
          <ul className="tableTopWrap">
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
