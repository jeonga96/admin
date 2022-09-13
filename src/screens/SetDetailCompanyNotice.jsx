import { useState, useEffect, useRef } from "react";
import {
  urlSetNotice,
  urlGetNotice,
  urlUpImages,
  urlGetImages,
} from "../Services/string";
import {
  servicesPostData,
  servicesPostDataForm,
  useDidMountEffect,
} from "../Services/importData";
import { useParams } from "react-router-dom";
import { BiUpload } from "react-icons/bi";

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

  useDidMountEffect(() => {
    noticeDetail.imgs &&
      servicesPostData(urlGetImages, {
        imgs: noticeDetail.imgs,
      }).then((res) => {
        setImgs(res.data);
        for (let i = 0; i < res.data.length; i++) {
          imgsIid.current.push(res.data[i].iid);
        }
      });
  }, [getDataFinish.current]);

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
    <div className="mainWrap formCommonWrap">
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
            value={
              getDataFinish.current
                ? noticeDetail.title
                : noticeDetail.title || ""
            }
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
            value={
              getDataFinish.current
                ? noticeDetail.content
                : noticeDetail.content || ""
            }
          />

          <button type="submit" className="loginBtn">
            확인
          </button>
        </form>
      </div>
    </div>
  );
}
