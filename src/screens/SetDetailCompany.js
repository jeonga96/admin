import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { servicesPostData } from "../Services/importData";
import { servicesGetImgsIid } from "../Services/useData";
import { urlGetCompanyDetail, urlSetCompanyDetail } from "../Services/string";
import SetImage from "../components/common/SetImage";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetCompanyDetail() {
  const { cid } = useParams();

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
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState(null);
  const getDataFinish = useRef(null);
  const mapcoor = useRef({ longitude: "", latitude: "" });
  const arrImgs = [];

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

  function onChange(e) {
    setCompanyData({ ...companyData, [e.target.id]: e.target.value });
  }

  console.log("ddd", titleImg, imgs);

  const addUserEvent = () => {
    servicesGetImgsIid(arrImgs, imgs);

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
      imgs: setImgs ? arrImgs.toString() : "",
      longitude: mapcoor.current.longitude,
      latitude: mapcoor.current.latitude,
      telnum: companyData.telnum,
      mobilenum: companyData.mobilenum,
      email: companyData.email,
      extnum: companyData.extnum,
      keywords: companyData.keywords,
      tags: companyData.tags,
      useFlag: 1,
    })
      .then((res) => {
        if (res.status === "success") {
          alert("작업이 완료되었습니다.");
          console.log("mapcoor.current.longitude", mapcoor.current.longitude);
          window.location.href = cid ? `/company/${cid}` : "CompanyMyDetail";
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
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={AddUserSubmit}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="name" className="blockLabel">
              사업자명
            </label>
            <input
              type="text"
              id="name"
              placeholder="사업자명을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? companyData.name
                  : companyData.name || ""
              }
            />
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
            <label htmlFor="offer" className="blockLabel">
              사업자 소개글
            </label>
            <textarea
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
          </div>

          <SetImage
            img={titleImg}
            setImg={setTitleImg}
            getData={companyData}
            id="titleImg"
            title="대표 이미지"
            getDataFinish={getDataFinish.current}
          />

          <SetImage
            imgs={imgs}
            setImgs={setImgs}
            id="imgs"
            title="상세설명 이미지"
            getData={companyData}
            getDataFinish={getDataFinish.current}
          />

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
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
          </div>

          <div className="formContentWrap">
            <label htmlFor="tags" className=" blockLabel">
              태그
            </label>
            <input
              type="text"
              id="tags"
              placeholder="태그를 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? companyData.tags
                  : companyData.tags || ""
              }
            />
          </div>
        </form>
      </div>
    </>
  );
}
