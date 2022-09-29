import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";
import { urlSetUserDetail, urlGetUserDetail } from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import SetImage from "../components/common/ImageSet";
import SelctUserRole from "../components/common/SelectUserRole";

export default function SetDetailUser() {
  const { uid } = useParams();

  const [userDetail, setUserDetail] = useState({
    name: "",
    address: "",
    mobile: "",
    location: "",
    mail: "",
    titleImg: "",
    imgs: "",
    nick: "",
  });
  // titleImg:대표 이미지저장 및 표시, imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  // mapcoor:위도 경도 저장,
  const [titleImg, setTitleImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const getDataFinish = useRef(false);
  const imgsIid = [];

  // 현재 페이지가 렌더링되자마자 기존에 입력된 값의 여부를 확인한다.
  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          // 값이 있다면 comapnyData에 저장한 후 getDataFinish 값을 변경
          setUserDetail(res.data);
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("새로운 회원입니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function onChange(e) {
    setUserDetail({ ...userDetail, [e.target.id]: e.target.value });
  }

  const addUserEvent = () => {
    //서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
    serviesGetImgsIid(imgsIid, imgs);
    servicesPostData(urlSetUserDetail, {
      ruid: uid,
      name: userDetail.name,
      address: userDetail.address,
      mobile: userDetail.mobile,
      location: userDetail.location,
      mail: userDetail.mail,
      titleImg: titleImg ? titleImg[0].iid : "",
      imgs: setImgs ? imgsIid.toString() : "",
      nick: userDetail.nick,
    })
      .then((res) => {
        console.log("axios 성공!", res);
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          window.location.href = `/user/${uid}`;
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
            <label htmlFor="name" className=" blockLabel">
              이름
            </label>
            <input
              type="text"
              id="name"
              placeholder="이름을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current ? userDetail.name : userDetail.name || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="nick" className="blockLabel">
              별명
            </label>
            <input
              type="text"
              id="nick"
              placeholder="별명을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current ? userDetail.nick : userDetail.nick || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="location" className=" blockLabel">
              주소 (ㅇㅇ구, ㅇㅇ동)
            </label>
            <input
              type="text"
              id="location"
              placeholder="주소를 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? userDetail.location
                  : userDetail.location || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="comment" className=" blockLabel">
              상세 주소
            </label>
            <input
              type="text"
              id="address"
              placeholder="상세주소를 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current
                  ? userDetail.address
                  : userDetail.address || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="mobile" className="blockLabel">
              핸드폰 번호
            </label>
            <input
              type="text"
              id="mobile"
              placeholder="핸드폰 번호"
              onChange={onChange}
              value={
                getDataFinish.current
                  ? userDetail.mobile
                  : userDetail.mobile || ""
              }
            />
          </div>

          <div className="formContentWrap">
            <label htmlFor="mail" className=" blockLabel">
              이메일
            </label>
            <input
              type="text"
              id="mail"
              placeholder="이메일을 입력해 주세요."
              onChange={onChange}
              value={
                getDataFinish.current ? userDetail.mail : userDetail.mail || ""
              }
            />
          </div>

          <SetImage
            img={titleImg}
            setImg={setTitleImg}
            getData={userDetail}
            id="titleImg"
            title="대표 이미지"
            getDataFinish={getDataFinish.current}
          />

          <SetImage
            imgs={imgs}
            setImgs={setImgs}
            id="imgs"
            title="상세설명 이미지"
            getData={userDetail}
            getDataFinish={getDataFinish.current}
          />
        </form>
      </div>
      <div className="commonBox">
        <ul className="detailContentCenter">
          <li className="detailHead">
            <h4>회원 권한 설정</h4>
            <SelctUserRole uid={uid} />
          </li>
        </ul>
      </div>
    </>
  );
}
