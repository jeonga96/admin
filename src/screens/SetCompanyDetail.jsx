import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  axiosPostToken,
  axiosPostForm,
  getStorage,
} from "../Services/importData";
import {
  urlSetCompanyDetail,
  urlGetCompanyDetail,
  urlUpImages,
  ISLOGIN,
} from "../Services/string";

function Company() {
  const { cid } = useParams();

  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState(null);
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
    telnum: "",
    mobilenum: "",
    email: "",
    extnum: "",
    keywords: "",
    tags: "",
    useFlag: "",
  });
  const imgsIid = useRef([]);
  const mapcoor = useRef({ longitude: "", latitude: "" });

  const token = getStorage(ISLOGIN);

  useEffect(() => {
    axiosPostToken(
      urlGetCompanyDetail,
      {
        rcid: cid,
      },
      token
    ).then((res) => {
      if (res.status === "success") {
        setCompanyData(res.data);
        return;
      }
    });
  }, []);

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
          imgsIid.current.push(res.data[i].iid);
        }
      }
    });
  };

  function onChange(e) {
    setCompanyData({ ...companyData, [e.target.id]: e.target.value });
  }
  const callMapcoor = async () => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        mapcoor.current.longitude = Math.floor(result[0].x * 100000);
        mapcoor.current.latitude = Math.floor(result[0].y * 100000);
        console.log("kako map API 이상없음!", mapcoor.current);
      }
    };
    geocoder.addressSearch(companyData.address, callback);
  };

  const addUserEvent = async () => {
    const token = getStorage(ISLOGIN);

    await callMapcoor();
    await axiosPostToken(
      urlSetCompanyDetail,
      {
        rcid: cid,
        name: companyData.name,
        comment: companyData.comment,
        location: companyData.location,
        address: companyData.address,
        registration: companyData.registration,
        workTime: companyData.workTime,
        offer: companyData.offer,
        titleImg: titleImg[0].iid,
        imgs: imgsIid.current.toString(),
        longitude: mapcoor.current.longitude,
        latitude: mapcoor.current.latitude,
        telnum: companyData.telnum,
        mobilenum: companyData.mobilenum,
        email: companyData.email,
        extnum: companyData.extnum,
        keywords: companyData.keywords,
        tags: companyData.tags,
        useFlag: cid,
      },
      token
    )
      .then((res) => {
        console.log("axios 성공!", res);
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          console.log(
            res.data,
            "mapcoor.current.longitude",
            mapcoor.current.longitude
          );
          // window.location.href = `/company/${cid}`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  const AddUserSubmit = (e) => {
    e.preventDefault();
    addUserEvent();
  };

  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <form className="formLayout detailFormLayout" onSubmit={AddUserSubmit}>
          <label htmlFor="name" className=" userIdLabel">
            사업자명
          </label>
          <input
            type="text"
            id="name"
            placeholder="사업자명을 입력해 주세요."
            onChange={onChange}
            value={companyData.name}
          />

          <label htmlFor="comment" className=" userIdLabel">
            소개글
          </label>
          <input
            type="text"
            id="comment"
            placeholder="사업자에 대한 짧은 소개글을 입력해 주세요."
            onChange={onChange}
            value={companyData.comment}
          />

          <label htmlFor="location" className=" userIdLabel">
            위치
          </label>
          <input
            type="text"
            id="location"
            placeholder="사업자의 위치를 입력해 주세요. ex.ㅇㅇ구, ㅇㅇ동"
            onChange={onChange}
            value={companyData.location}
          />

          <label htmlFor="address" className=" userIdLabel">
            주소
          </label>
          <input
            type="text"
            id="address"
            placeholder="주소를 입력해 주세요."
            onChange={onChange}
            value={companyData.address}
          />

          <label htmlFor="registration" className=" userIdLabel">
            사업자 등록 번호
          </label>
          <input
            type="text"
            id="registration"
            placeholder="사업자 등록 번호를 입력해 주세요."
            onChange={onChange}
            value={companyData.registration}
          />

          <label htmlFor="workTime" className=" userIdLabel">
            근무 시간
          </label>
          <input
            type="text"
            id="workTime"
            placeholder="근무 시간을 입력해 주세요."
            onChange={onChange}
            value={companyData.workTime}
          />

          <label htmlFor="offer" className=" userIdLabel">
            사업자 소개글
          </label>
          <input
            type="text"
            id="offer"
            placeholder="사업자 소개글을 입력해 주세요."
            onChange={onChange}
            value={companyData.offer}
          />

          <label htmlFor="titleImg" className=" userIdLabel">
            대표이미지
          </label>
          <input
            type="file"
            id="titleImg"
            name="Imgs"
            accept="image/*"
            onChange={fileSelectEvent}
            // value={companyData.titleImg}
          />
          {titleImg && (
            <div className="imgsThumbnail">
              <img src={titleImg[0].storagePath} alt="사업자 상세 이미지" />
            </div>
          )}

          <label htmlFor="imgs" className=" userIdLabel">
            회사 홍보 이미지
          </label>
          <input
            type="file"
            id="imgs"
            name="Imgs"
            accept="image/*"
            multiple
            onChange={fileSelectEvent}
            // value={companyData.imgs}
          />
          {imgs && (
            <ul className="imgsThumbnail">
              {imgs.map((item, key) => (
                <li key={key}>
                  <img src={item.storagePath} alt="사업자 상세 이미지" />
                </li>
              ))}
            </ul>
          )}

          <label htmlFor="telnum" className=" userIdLabel">
            전화번호
          </label>
          <input
            type="text"
            id="telnum"
            placeholder="전화번호를 입력해 주세요."
            onChange={onChange}
            value={companyData.telnum}
          />

          <label htmlFor="mobilenum" className=" userIdLabel">
            핸드폰번호
          </label>
          <input
            type="text"
            id="mobilenum"
            placeholder="핸드폰번호를 입력해 주세요."
            onChange={onChange}
            value={companyData.mobilenum}
          />

          <label htmlFor="email" className=" userIdLabel">
            이메일
          </label>
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력해 주세요."
            onChange={onChange}
            value={companyData.email}
          />

          <label htmlFor="extnum" className=" userIdLabel">
            추가 번호
          </label>
          <input
            type="text"
            id="extnum"
            placeholder="추가 번호를 입력해 주세요."
            onChange={onChange}
            value={companyData.extnum}
          />

          <label htmlFor="keywords" className=" userIdLabel">
            키워드
          </label>
          <input
            type="text"
            id="keywords"
            placeholder="키워드를 입력해 주세요."
            onChange={onChange}
            value={companyData.keywords}
          />

          <label htmlFor="tags" className=" userIdLabel">
            태그
          </label>
          <input
            type="text"
            id="tags"
            placeholder="태그를 입력해 주세요."
            onChange={onChange}
            value={companyData.tags}
          />

          <button type="submit" className="loginBtn">
            사용자 추가하기
          </button>
        </form>
      </div>
    </div>
  );
}
export default Company;
