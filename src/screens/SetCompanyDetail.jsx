import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  axiosPostToken,
  axiosPostForm,
  getStorage,
} from "../Services/importData";
import { urlSetCompanyDetail, urlUpImages, ISLOGIN } from "../Services/string";

function Company() {
  const { cid } = useParams();

  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState(null);
  const [imgsIid, setImgsIid] = useState([]);

  const [companyData, setCompanyData] = useState({
    name: "",
    comment: "",
    location: "",
    address: "",
    registration: "",
    workTime: "",
    offer: "",
    titleImg: "",
    imgs: "",
    longitude: "",
    latitude: "",
    telnum: "",
    mobilenum: "",
    email: "",
    extnum: "",
    keywords: "",
    tags: "",
    useFlag: "",
  });

  const fileSelectEvent = (event) => {
    event.preventDefault();

    const files = event.target.files;
    const formData = new FormData();
    if (event.target.id === "titleImg") {
      console.log("titleUpload click-->", files[0]);
      formData.append("Imgs", files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        console.log(i, "titleUpload click-->", files[i]);
        formData.append("Imgs", files[i]);
      }
    }

    const token = getStorage(ISLOGIN);
    axiosPostForm(urlUpImages, formData, token).then((res) => {
      console.log(res);
      if (res.data.length === 1) {
        setTitleImg(res.data);
      } else {
        setImgs(res.data);
        for (let i = 0; i < res.data.length; i++) {
          console.log(res.data[i].iid);
          setImgsIid([...imgsIid, res.data[i].iid]);
        }
      }
    });
  };

  console.log(imgs, "imgsIid-->", imgsIid);

  function onChange(e) {
    setCompanyData({ ...companyData, [e.target.id]: [e.target.value] });
  }

  function addUserEvent() {
    const token = getStorage(ISLOGIN);
    axiosPostToken(
      urlSetCompanyDetail,
      {
        rcid: cid,
        name: companyData.name[0],
        comment: companyData.comment[0],
        location: companyData.location[0],
        address: companyData.address[0],
        registration: companyData.registration[0],
        workTime: companyData.workTime[0],
        offer: companyData.offer[0],
        titleImg: titleImg.data[0].iid,
        imgs: companyData.imgs[0],
        longitude: companyData.longitude[0],
        latitude: companyData.latitude[0],
        telnum: companyData.telnum[0],
        mobilenum: companyData.mobilenum[0],
        email: companyData.email[0],
        extnum: companyData.extnum[0],
        keywords: companyData.keywords[0],
        tags: companyData.tags[0],
        useFlag: cid,
      },
      token
    )
      .then((res) => {
        console.log("axios는 성공했는데 말이죠", res);
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          // window.location.href = "/user";
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  }

  const AddUserSubmit = (e) => {
    e.preventDefault();
    addUserEvent();
  };

  return (
    <section className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <h3>사업자 상세정보 수정</h3>

        <form className="formLayout" onSubmit={AddUserSubmit}>
          <input
            type="text"
            id="name"
            placeholder="사업자명을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="name" className="blind userIdLabel">
            사업자명을 입력해 주세요.
          </label>

          <input
            type="text"
            id="comment"
            placeholder="사업자에 대한 짧은 소개글을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="comment" className="blind userIdLabel">
            사업자에 대한 짧은 소개글을 입력해 주세요.
          </label>

          <input
            type="text"
            id="location"
            placeholder="사업자의 위치를 입력해 주세요. ex.ㅇㅇ구, ㅇㅇ동"
            onChange={onChange}
          />
          <label htmlFor="location" className="blind userIdLabel">
            사업자의 위치를 입력해 주세요. ex.ㅇㅇ구, ㅇㅇ동
          </label>

          <input
            type="text"
            id="address"
            placeholder="주소를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="address" className="blind userIdLabel">
            주소를 입력해 주세요.
          </label>

          <input
            type="text"
            id="registration"
            placeholder="사업자 등록 번호를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="registration" className="blind userIdLabel">
            사업자 등록 번호를 입력해 주세요.
          </label>

          <input
            type="text"
            id="workTime"
            placeholder="근무 시간을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="workTime" className="blind userIdLabel">
            근무 시간을 입력해 주세요.
          </label>

          <input
            type="text"
            id="offer"
            placeholder="사업자 소개글을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="offer" className="blind userIdLabel">
            사업자 소개글을 입력해 주세요.
          </label>

          <input
            type="text"
            id="offer"
            placeholder="사업자 소개글을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="offer" className="blind userIdLabel">
            사업자 소개글을 입력해 주세요.
          </label>

          {/* <input
            type="file"
            id="titleImg"
            name="imgs"
            accept="image/*"
            onChange={imgUploadEvent}
          />*/}

          <input
            type="file"
            id="titleImg"
            name="Imgs"
            accept="image/*"
            onChange={fileSelectEvent}
          />
          <label htmlFor="titleImg" className="blind userIdLabel">
            대표이미지 추가하기
          </label>

          <input
            type="file"
            id="imgs"
            name="Imgs"
            accept="image/*"
            multiple
            onChange={fileSelectEvent}
          />
          <label htmlFor="imgs" className="blind userIdLabel">
            회사 홍보 이미지 추가하기
          </label>

          <input
            type="text"
            id="telnum"
            placeholder="전화번호를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="telnum" className="blind userIdLabel">
            전화번호를 입력해 주세요.
          </label>

          <input
            type="text"
            id="mobilenum"
            placeholder="핸드폰번호를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="mobilenum" className="blind userIdLabel">
            핸드폰번호를 입력해 주세요.
          </label>

          <input
            type="text"
            id="email"
            placeholder="이메일을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="email" className="blind userIdLabel">
            이메일을 입력해 주세요.
          </label>

          <input
            type="text"
            id="extnum"
            placeholder="추가 번호를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="extnum" className="blind userIdLabel">
            추가 번호를 입력해 주세요.
          </label>

          <input
            type="text"
            id="keywords"
            placeholder="키워드를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="keywords" className="blind userIdLabel">
            키워드를 입력해 주세요.
          </label>

          <input
            type="text"
            id="tags"
            placeholder="태그를 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="tags" className="blind userIdLabel">
            태그를 입력해 주세요.
          </label>

          <button type="submit" className="loginBtn">
            사용자 추가하기
          </button>
        </form>
      </div>
    </section>
  );
}
export default Company;
