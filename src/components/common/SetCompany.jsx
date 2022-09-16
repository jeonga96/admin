import { useEffect, useState, useRef } from "react";
import { BiUpload } from "react-icons/bi";
import {
  servicesPostDataForm,
  servicesPostData,
  useSetImage,
} from "../../Services/importData";
import { urlGetImages, urlUpImages } from "../../Services/string";
import SetImage from "../common/SetImage";
import { useDidMountEffect } from "../../Services/customHook";

export default function SetCompany({ cid, getAPI, setAPI }) {
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
    servicesPostData(getAPI, {
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

  function removeImageHandle(event) {
    event.preventDefault();
  }

  // function setImageHandle(event) {
  //   event.preventDefault();
  //   console.log("이미지 클릭", event.target.files);
  //   const files = event.target.files;
  //   const formData = new FormData();
  //   if (event.target.id === "titleImg") {
  //     console.log("titleUpload click-->", files[0]);
  //     formData.append("Imgs", files[0]);
  //   } else {
  //     for (let i = 0; i < files.length; i++) {
  //       console.log(i, "titleUpload click-->", files[i]);
  //       formData.append("Imgs", files[i]);
  //     }
  //   }

  //   servicesPostDataForm(urlUpImages, formData).then((res) => {
  //     if (res.data.length === 1) {
  //       setTitleImg(res.data);
  //     } else {
  //       setImgs(res.data);
  //       for (let i = 0; i < res.data.length; i++) {
  //         imgsIid.current.push(res.data[i].iid);
  //       }
  //     }
  //   });
  // }

  function onChange(e) {
    setCompanyData({ ...companyData, [e.target.id]: e.target.value });
  }

  const addUserEvent = () => {
    console.log("로로로로로그그그그인");
  };

  function AddUserSubmit(e) {
    e.preventDefault();
    companyData.address ? callMapcoor() : addUserEvent();
  }

  function handleSetImage(event) {
    event.preventDefault();
    const files = event.target.files;
    console.log("이미지 클릭", files);
    console.log("이미지 클릭2", event);
  }

  return (
    <form className="inputFormLayout detailFormLayout" onSubmit={AddUserSubmit}>
      {/* <SetImage title="대표 이미지" img={titleImg} setImg={setTitleImg} />*/}
      <div>
        <div className="blockLabel">"ㅇㅇㅇㅇ"</div>
        <label htmlFor="imgs" className="blockLabel fileboxLabel">
          <BiUpload /> 사진 업로드
        </label>
        <input
          type="file"
          id="titleImg"
          name="Imgs"
          accept="image/*"
          className="blind"
          onClick={handleSetImage}
        />
        {titleImg && titleImg.length === 1 ? (
          <div className="imgsThumbnail">
            <img src={titleImg[0].storagePath} alt="사업자 상세 이미지" />
          </div>
        ) : null}
      </div>

      {/* <div>
        <div className="blockLabel">대표 이미지</div>
        <label htmlFor="imgs" className="blockLabel fileboxLabel">
          <BiUpload /> 사진 업로드
        </label>
        <input
          type="file"
          id="titleImg"
          name="Imgs"
          accept="image/*"
          className="blind"
          onClick={useSetImage}
        />
        {titleImg && (
          <div className="imgsThumbnail">
            <img src={titleImg[0].storagePath} alt="사업자 상세 이미지" />
          </div>
        )}
      </div>

      <div>
        <div className="blockLabel">업체 상세 이미지</div>
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
          onClick={useSetImage}
        />
      </div>
      {imgs && (
        <ul className="imgsThumbnail">
          {imgs.map((item, key) => (
            <li key={key}>
              <img src={item.storagePath} alt="사업자 상세 이미지" />
            </li>
          ))}
        </ul>
      )} */}

      <button type="submit" className="loginBtn">
        사용자 추가하기
      </button>
    </form>
  );
}
