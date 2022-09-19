import { useState, useRef } from "react";
import { urlSetNotice, urlUpImages } from "../Services/string";
import { servicesPostData, servicesPostDataForm } from "../Services/importData";
import { useNavigate } from "react-router-dom";
import { BiUpload } from "react-icons/bi";

export default function AddCompanyNotice() {
  const [imgs, setImgs] = useState(null);
  const imgsIid = useRef([]);
  const [userDetail, setUserDetail] = useState({
    title: "",
    content: "",
    imgs: "",
  });

  const fileSelectEvent = (event) => {
    event.preventDefault();
    const files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      console.log(i, "titleUpload click-->", files[i]);
      formData.append("Imgs", files[i]);
    }
    servicesPostDataForm(urlUpImages, formData).then((res) => {
      setImgs(res.data);
      for (let i = 0; i < res.data.length; i++) {
        imgsIid.current.push(res.data[i].iid);
      }
    });
  };

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
      <div className="commonBox formBox">
        <form
          className="detailFormLayout inputFormLayout"
          onSubmit={AddUserSubmit}
        >
          <label htmlFor="title" className="blockLabel">
            제목
          </label>
          <input
            type="text"
            id="title"
            placeholder="제목을 입력해 주세요."
            onChange={onChange}
          />

          <div className="blockLabel">이미지 추가</div>
          {imgs && (
            <ul className="imgsThumbnail">
              {imgs.map((item, key) => (
                <li key={key}>
                  <img src={item.storagePath} alt="사업자 상세 이미지" />
                </li>
              ))}
            </ul>
          )}
          <label htmlFor="imgs" className="blockLabel fileboxLabel">
            <BiUpload /> 사진 업로드
          </label>
          <input
            type="file"
            id="imgs"
            name="Imgs"
            accept="image/*"
            multiple
            className="blind"
            onChange={fileSelectEvent}
          />

          <label htmlFor="title" className="blockLabel">
            내용
          </label>
          <textarea
            id="content"
            placeholder="내용을 입력해 주세요."
            onChange={onChange}
          />

          <button type="submit" className="widthFullButton">
            작성 완료
          </button>
        </form>
      </div>
    </>
  );
}
