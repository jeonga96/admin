import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import {
  urlGetCompanyDetail,
  urlSetCompanyDetail,
  urlGetCompany,
  urlSetCompany,
} from "../Services/string";
import SetImage from "../components/common/ImageSet";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function SetCompanyDetail() {
  const { cid } = useParams();

  //"/admin/setCompany" 로 보내기 위한 기본 회사정보
  const [companyInfo, setCompanyInfo] = useState({
    cid: "",
    name: "",
  });

  ///"/admin/setCompanyDetailInfo" 로 보내기 위한 상세 회사 정보
  const [companyDetailInfo, setCompanyDetailInfo] = useState({
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
  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  // mapcoor:위도 경도 저장,
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const getDataFinish = useRef(false);
  const mapcoor = useRef({ longitude: "", latitude: "" });
  const imgsIid = [];

  // 카카오 API, 주소를 위도 경도로 변환
  const callMapcoor = () => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        mapcoor.current.longitude = Math.floor(result[0].x * 100000);
        mapcoor.current.latitude = Math.floor(result[0].y * 100000);
        console.log("kako map API 이상없음!", mapcoor.current);
      }
      addUserEvent();
    };
    geocoder.addressSearch(companyDetailInfo.address, callback);
  };

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    // 기본 회사정보 불러오기
    servicesPostData(urlGetCompany, {
      cid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          setCompanyInfo(res.data);
          console.log("불러왔다!!", companyInfo);
        }
      })
      .catch((res) => console.log(res));

    // 상세 회사정보 불러오기 기존 값이 없다면 새로운 회원이다. 새로 작성함
    servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 값이 있다면 comapnyData에 저장한 후 getDataFinish 값을 변경
          setCompanyDetailInfo(res.data);
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("새로운 사업자 회원입니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  // input onChange 이벤트
  function onChangeComapnyInfo(e) {
    setCompanyInfo({
      ...companyInfo,
      [e.target.id]: e.target.value,
    });
  }

  // detailInfo input onChange 이벤트
  function onChange(e) {
    setCompanyDetailInfo({
      ...companyDetailInfo,
      [e.target.id]: e.target.value,
    });
  }

  // form submit 이벤트
  const addUserEvent = () => {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);
    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      name: companyDetailInfo.name,
      comment: companyDetailInfo.comment,
      location: companyDetailInfo.location,
      address: companyDetailInfo.address,
      registration: companyDetailInfo.registration,
      workTime: companyDetailInfo.workTime,
      offer: companyDetailInfo.offer,
      titleImg: titleImg ? titleImg[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
      longitude: mapcoor.current.longitude,
      latitude: mapcoor.current.latitude,
      telnum: companyDetailInfo.telnum,
      mobilenum: companyDetailInfo.mobilenum,
      email: companyDetailInfo.email,
      extnum: companyDetailInfo.extnum,
      keywords: companyDetailInfo.keywords,
      tags: companyDetailInfo.tags,
      useFlag: 1,
    })
      .then((res) => {
        if (res.status === "success") {
          alert("완료되었습니다.");
          window.location.href = cid ? `/company/${cid}` : "CompanyMyDetail";
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  };
  function UserInfoSubmit(e) {
    e.preventDefault();
    servicesPostData(urlSetCompany, {
      cid: cid,
      name: companyInfo.name,
    })
      .then((res) => {
        if (res.status === "success") {
          alert("수정 되었습니다.");
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  }

  function UserDetailInfoSubmit(e) {
    e.preventDefault();
    // companyDetailInfo.address가 입력되어 있으면 위도경도 구하는 함수 실행(내부에 addUserEvent이벤트 실행 코드 있음)
    companyDetailInfo.address ? callMapcoor() : addUserEvent();
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={UserInfoSubmit}>
          <div className="formContentWrapWithButton">
            <label htmlFor="name" className="blockLabel">
              계약자명
            </label>
            <input
              type="text"
              id="name"
              placeholder="고객명을 입력해 주세요."
              onChange={onChangeComapnyInfo}
              value={companyInfo.name || ""}
            />
            <button type="submit">수정</button>
          </div>
        </form>
      </div>
      <div className="commonBox">
        <form className="formLayout" onSubmit={UserDetailInfoSubmit}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="name" className="blockLabel">
              업체 이름
            </label>
            <input
              type="text"
              id="name"
              placeholder="업체 이름을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? companyDetailInfo.name
                  : companyDetailInfo.name || ""
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
                  ? companyDetailInfo.comment
                  : companyDetailInfo.comment || ""
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
                  ? companyDetailInfo.location
                  : companyDetailInfo.location || ""
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
                  ? companyDetailInfo.address
                  : companyDetailInfo.address || ""
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
                  ? companyDetailInfo.registration
                  : companyDetailInfo.registration || ""
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
                  ? companyDetailInfo.workTime
                  : companyDetailInfo.workTime || ""
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
                  ? companyDetailInfo.offer
                  : companyDetailInfo.offer || ""
              }
            />
          </div>

          <SetImage
            img={titleImg}
            setImg={setTitleImg}
            getData={companyDetailInfo}
            id="titleImg"
            title="대표 이미지"
            getDataFinish={getDataFinish.current}
          />

          <SetImage
            imgs={imgs}
            setImgs={setImgs}
            id="imgs"
            title="상세설명 이미지"
            getData={companyDetailInfo}
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
                  ? companyDetailInfo.telnum
                  : companyDetailInfo.telnum || ""
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
                  ? companyDetailInfo.mobilenum
                  : companyDetailInfo.mobilenum || ""
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
                  ? companyDetailInfo.email
                  : companyDetailInfo.email || ""
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
                  ? companyDetailInfo.extnum
                  : companyDetailInfo.extnum || ""
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
                  ? companyDetailInfo.keywords
                  : companyDetailInfo.keywords || ""
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
                  ? companyDetailInfo.tags
                  : companyDetailInfo.tags || ""
              }
            />
          </div>
        </form>
      </div>
    </>
  );
}
