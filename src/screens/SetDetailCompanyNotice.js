import { useState, useEffect, useRef } from "react";
import { urlSetNotice, urlGetNotice } from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { useParams } from "react-router-dom";

import SetImage from "../components/common/ImageSet";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetDetailCompanyNotice() {
  const id = useParams();

  const [imgs, setImgs] = useState(null);
  const imgsIid = useRef([]);
  const getDataFinish = useRef(null);
  const [noticeDetail, setNoticeDetail] = useState({
    comnid: "",
    useFlag: "",
    title: "",
    content: "",
    imgs: "",
  });

  useEffect(() => {
    servicesPostData(urlGetNotice, {
      comnid: id.comnid,
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
  }, []);

  function onChange(e) {
    setNoticeDetail({ ...noticeDetail, [e.target.id]: e.target.value });
  }

  const addUserEvent = () => {
    console.log(id.comnid);

    servicesPostData(urlSetNotice, {
      comnid: id.comnid,
      useFlag: 1,
      title: noticeDetail.title,
      content: noticeDetail.content,
      imgs: imgsIid.current.toString(),
    })
      .then((res) => {
        console.log("axios 성공!", res);
        if (res.status === "fail" && res.emsg === "not valid company user.") {
          alert("사업자 회원이 아닙니다.");
        }
        if (res.status === "success") {
          alert("수정이 완료되었습니다!");
          window.location.href = `/company/${id.cid}/notice`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패ㅜ", error.response));
  };

  function AddUserSubmit(e) {
    e.preventDefault();
    addUserEvent();
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={AddUserSubmit}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="title" className="blockLabel">
              제목
            </label>
            <input
              type="text"
              id="title"
              placeholder="제목을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? noticeDetail.title
                  : noticeDetail.title || ""
              }
            />
          </div>

          <SetImage
            img={imgs}
            setImg={setImgs}
            id="imgs"
            title="이미지 추가"
            imgsIid={true}
            getData={noticeDetail}
            getDataFinish={getDataFinish.current}
          />

          <div className="formContentWrap">
            <label htmlFor="title" className="blockLabel">
              내용
            </label>
            <textarea
              id="content"
              placeholder="내용을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? noticeDetail.content
                  : noticeDetail.content || ""
              }
            />
          </div>
        </form>
      </div>
    </>
  );
}
