import { useEffect, useState, useRef } from "react";
import { BiUpload } from "react-icons/bi";
import { useParams } from "react-router-dom";
import {
  servicesPostDataForm,
  servicesPostData,
  useDidMountEffect,
} from "../Services/importData";
import {
  urlSetCompanyDetail,
  urlGetCompanyDetail,
  urlGetImages,
  urlUpImages,
} from "../Services/string";

function SetCompanyDetail() {
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
  const getDataFinish = useRef(null);
  const mapcoor = useRef({ longitude: "", latitude: "" });

  const callMapcoor = () => {
    console.debug("callMapcoor");
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        mapcoor.current.longitude = Math.floor(result[0].x * 100000);
        mapcoor.current.latitude = Math.floor(result[0].y * 100000);
        console.log("kako map API 이상없음!", mapcoor.current);
      }
      addUserEvent();
    };
    geocoder.addressSearch(companyData.address, callback);
  };

  useEffect(() => {
    servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          setCompanyData(res.data);
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("기존에 입력된 데이터가 없습니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  useDidMountEffect(() => {
    companyData.titleImg &&
      servicesPostData(urlGetImages, {
        imgs: companyData.titleImg,
      }).then((res) => {
        setTitleImg(res.data);
        console.log("titleImg", res.data);
      });

    companyData.imgs &&
      servicesPostData(urlGetImages, {
        imgs: companyData.imgs,
      }).then((res) => {
        setImgs(res.data);
        console.log("imgs", res.data);
      });
  }, [getDataFinish.current]);

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

    servicesPostDataForm(urlUpImages, formData).then((res) => {
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

  const addUserEvent = () => {
    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      name: companyData.name,
      comment: companyData.comment,
      location: companyData.location,
      address: companyData.address,
      registration: companyData.registration,
      workTime: companyData.workTime,
      offer: companyData.offer,
      titleImg: titleImg ? titleImg[0].iid : "",
      imgs: imgsIid ? imgsIid.current.toString() : "",
      longitude: mapcoor.current.longitude,
      latitude: mapcoor.current.latitude,
      telnum: companyData.telnum,
      mobilenum: companyData.mobilenum,
      email: companyData.email,
      extnum: companyData.extnum,
      keywords: companyData.keywords,
      tags: companyData.tags,
      useFlag: cid,
    })
      .then((res) => {
        console.log("axios 성공!", res);
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          console.log("mapcoor.current.longitude", mapcoor.current.longitude);
          window.location.href = `/company/${cid}`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  function AddUserSubmit(e) {
    e.preventDefault();
    companyData.address ? callMapcoor() : addUserEvent();
  }

  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <form
          className="inputFormLayout detailFormLayout"
          onSubmit={AddUserSubmit}
        >
          <label htmlFor="name" className=" blockLabel">
            사업자명
          </label>
          <input
            type="text"
            id="name"
            placeholder="사업자명을 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current ? companyData.name : companyData.name || ""
            }
          />
          <label htmlFor="comment" className=" blockLabel">
            소개글
          </label>
          <input
            type="text"
            id="comment"
            placeholder="사업자에 대한 짧은 소개글을 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.comment
                : companyData.comment || ""
            }
          />
          <label htmlFor="location" className=" blockLabel">
            위치
          </label>
          <input
            type="text"
            id="location"
            placeholder="사업자의 위치를 입력해 주세요. ex.ㅇㅇ구, ㅇㅇ동"
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.location
                : companyData.location || ""
            }
          />
          <label htmlFor="address" className=" blockLabel">
            주소
          </label>
          <input
            type="text"
            id="address"
            placeholder="주소를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.address
                : companyData.address || ""
            }
          />
          <label htmlFor="registration" className=" blockLabel">
            사업자 등록 번호
          </label>
          <input
            type="text"
            id="registration"
            placeholder="사업자 등록 번호를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.registration
                : companyData.registration || ""
            }
          />
          <label htmlFor="workTime" className=" blockLabel">
            근무 시간
          </label>
          <input
            type="text"
            id="workTime"
            placeholder="근무 시간을 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.workTime
                : companyData.workTime || ""
            }
          />
          <label htmlFor="offer" className="blockLabel">
            사업자 소개글
          </label>
          <input
            type="text"
            id="offer"
            placeholder="사업자 소개글을 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.offer
                : companyData.offer || ""
            }
          />

          <div className="blockLabel">대표 이미지</div>
          {titleImg && (
            <div className="imgsThumbnail">
              <img src={titleImg[0].storagePath} alt="사업자 상세 이미지" />
            </div>
          )}
          <label htmlFor="imgs" className="blockLabel fileboxLabel">
            <BiUpload /> 사진 업로드
          </label>
          <input
            type="file"
            id="titleImg"
            name="Imgs"
            accept="image/*"
            className="blind"
            onChange={fileSelectEvent}
          />

          <div className="blockLabel">업체 상세 이미지</div>
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

          <label htmlFor="telnum" className=" blockLabel">
            전화번호
          </label>
          <input
            type="text"
            id="telnum"
            placeholder="전화번호를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.telnum
                : companyData.telnum || ""
            }
          />
          <label htmlFor="mobilenum" className=" blockLabel">
            핸드폰번호
          </label>
          <input
            type="text"
            id="mobilenum"
            placeholder="핸드폰번호를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.mobilenum
                : companyData.mobilenum || ""
            }
          />
          <label htmlFor="email" className=" blockLabel">
            이메일
          </label>
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.email
                : companyData.email || ""
            }
          />
          <label htmlFor="extnum" className=" blockLabel">
            추가 번호
          </label>
          <input
            type="text"
            id="extnum"
            placeholder="추가 번호를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.extnum
                : companyData.extnum || ""
            }
          />
          <label htmlFor="keywords" className=" blockLabel">
            키워드
          </label>
          <input
            type="text"
            id="keywords"
            placeholder="키워드를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current
                ? companyData.keywords
                : companyData.keywords || ""
            }
          />
          <label htmlFor="tags" className=" blockLabel">
            태그
          </label>
          <input
            type="text"
            id="tags"
            placeholder="태그를 입력해 주세요."
            onChange={onChange}
            value={
              getDataFinish.current ? companyData.tags : companyData.tags || ""
            }
          />
          <button type="submit" className="loginBtn">
            사용자 추가하기
          </button>
        </form>
      </div>
    </div>
  );
}
export default SetCompanyDetail;
