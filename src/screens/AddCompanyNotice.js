import { useState, useRef } from "react";
import { urlSetNotice, urlUpImages } from "../Services/string";
import { servicesPostData, servicesPostDataForm } from "../Services/importData";
import { useNavigate } from "react-router-dom";
import { BiUpload } from "react-icons/bi";

import LayoutTopButton from "../components/common/LayoutTopButton";
import SetImage from "../components/common/ImageSet";

export default function AddCompanyNotice() {
  const [imgs, setImgs] = useState([]);
  const imgsIid = useRef([]);
  const [userDetail, setUserDetail] = useState({
    title: "",
    content: "",
    imgs: "",
  });

  function onChange(e) {
    setUserDetail({ ...userDetail, [e.target.id]: e.target.value });
  }

  const addUserEvent = () => {
    servicesPostData(urlSetNotice, {
      title: userDetail.title,
      content: userDetail.content,
      imgs: imgsIid ? imgsIid.current.toString() : "",
    })
      .then((res) => {
        console.log("axios 성공!", res);
        if (res.status === "fail" && res.emsg === "not valid company user.") {
          alert("사업자 회원이 아닙니다.");
        }
        if (res.status === "success") {
          alert("작성이 완료되었습니다!");
          window.location.href = `/company/44/notice`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
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
            />
          </div>

          <SetImage
            img={imgs}
            setImg={setImgs}
            id="imgs"
            title="이미지 추가"
            imgsIid={true}
          />

          <div className="formContentWrap">
            <label htmlFor="title" className="blockLabel">
              내용
            </label>
            <textarea
              id="content"
              placeholder="내용을 입력해 주세요."
              onChange={onChange}
            />
          </div>
        </form>
      </div>
    </>
  );
}
