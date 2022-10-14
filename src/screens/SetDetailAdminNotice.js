import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { urlSetContent, urlGetContent } from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import { useParams } from "react-router-dom";

import SetImage from "../components/common/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetDetailAdminNotice() {
  const { contid } = useParams();

  // react-hook-form 라이브러리
  const { handleSubmit, register } = useForm();

  const [imgs, setImgs] = useState([]);
  const imgsIid = [];
  const getDataFinish = useRef(false);
  const [noticeDetail, setNoticeDetail] = useState({
    contentString: "",
    contentDetail: "",
  });

  useEffect(() => {
    if (!!contid) {
      servicesPostData(urlGetContent, {
        contid: contid,
      })
        .then((res) => {
          if (res.status === "success") {
            setNoticeDetail(res.data);
            getDataFinish.current = true;
          } else if (res.data === "fail") {
            console.log("기존에 입력된 데이터가 없습니다.");
          }
        })
        .catch((res) => console.log(res));
    }
  }, []);

  function onChange(e) {
    setNoticeDetail({ ...noticeDetail, [e.target.id]: e.target.value });
  }

  function AddUserSubmit(e) {
    serviesGetImgsIid(imgsIid, imgs);
    servicesPostData(
      urlSetContent,
      !!contid
        ? {
            contid: contid,
            category: "notice",
            contentString: noticeDetail.contentString,
            contentDetail: noticeDetail.contentDetail,
            imgString: setImgs ? imgsIid.toString() : "",
          }
        : {
            category: "notice",
            contentString: noticeDetail.contentString,
            contentDetail: noticeDetail.contentDetail,
            imgString: setImgs ? imgsIid.toString() : "",
          }
    )
      .then((res) => {
        if (res.status === "fail") {
          alert("입력에 실패했습니다,");
        }
        if (res.status === "success") {
          alert("완료되었습니다!");
          window.location.href = `/admin/notice/${res.data.contid}`;
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
            <LayoutTopButton text="완료" />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="title" className="blockLabel">
              제목
            </label>
            <input
              type="text"
              id="contentString"
              name="_contentString"
              placeholder="제목을 입력해 주세요."
              value={noticeDetail.contentString || ""}
              {...register("_contentString", {
                onChange: onChange,
                minLength: {
                  value: 2,
                  message: "2자 이상의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>

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
              id="contentDetail"
              name="_contentDetail"
              placeholder="내용을 입력해 주세요."
              value={noticeDetail.contentDetail || ""}
              {...register("_contentDetail", {
                onChange: onChange,
                minLength: {
                  value: 2,
                  message: "2자 이상의 글자만 사용가능합니다.",
                },
              })}
            />
          </div>
        </form>
      </div>
    </>
  );
}
