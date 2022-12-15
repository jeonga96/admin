import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { servicesUseToast } from "../Services/useData";
import { urlGetUserDetail } from "../Services/string";
import { useGetImage } from "../Services/customHook";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ServicesImageOnClick from "../components/common/ServicesImageOnClick";
import ComponentErrorNull from "../components/common/ComponentErrorNull";

export default function DetailUser() {
  let { uid } = useParams();
  const [userDetail, setUserDetail] = useState([]);

  // image:대표이미지, images:상세이미지 mapLinkAdress는 클릭 시 네이버 지도로 가기 위한 변수
  const [mapLinkAddress, setMapLinkAddress] = useState("");
  const [image, setImage] = useState([]);
  const [images, setImages] = useState(null);

  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    }).then((res) => {
      if (res.status === "success") {
        setUserDetail(res.data);
        servicesUseToast("완료되었습니다.", "s");
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        servicesUseToast("정보가 없습니다. 사용자정보를 입력해 주세요.");
        window.location.href = `user/${uid}/setUserDetail`;
        return;
      }
    });
  }, []);

  // 서버에서 image를 가져오는 customHook titleImg와 imgs를 한번에 가져온다.
  useGetImage(setImage, userDetail);

  // 첫 렌더링을 막음
  useEffect(() => {
    if (userDetail.address) {
      // 주소를 활용허여 지도 링크로 이동하기 위한 작업
      setMapLinkAddress(userDetail.address.replace(/ /gi, "+"));
    }
  }, [userDetail]);

  useEffect(() => {
    // 서버에서 이미지를 한 번에 가져오기 위해 image에 대표이미지와 상세이미지를 담았음.
    // images에 상세이미지를 저장하기 위해 첫번째 이미지 제거
    if (userDetail.titleImg && userDetail.imgs) {
      const selctImgs = image.filter((_, index) => index !== 0);
      setImages(selctImgs);
      console.log("useEffect userDetail.titleImg", selctImgs);
    } else if (userDetail.imgs) {
      setImages(image);
      console.log("userDetail.imgs", image);
    }
  }, [image]);

  return userDetail && userDetail.length === 0 ? (
    <ComponentErrorNull />
  ) : (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url="/user" text="목록으로 가기" />
        <LayoutTopButton url="setUserDetail" text="수정" />
      </ul>
      <div className="paddingBox commonBox">
        <div className="detailPageLayout">
          <div className="formContentWrap">
            <h4>이름</h4>
            <span>{userDetail.name}</span>
          </div>

          <div className="formContentWrap">
            <h4>별명</h4>
            <span>{userDetail.nick}</span>
          </div>

          <div className="formContentWrap">
            <h4>핸드폰 번호</h4>
            <span>{userDetail.mobile}</span>
          </div>

          <div className="formContentWrap">
            <h4>이메일</h4>
            <span>{userDetail.mail}</span>
          </div>

          <div className="formContentWrap">
            <h4>주소 (ㅇㅇ구, ㅇㅇ동)</h4>
            <span>{userDetail.mobile}</span>
          </div>

          <div className="formContentWrap">
            <h4>상세주소</h4>
            <span>
              {userDetail.address}{" "}
              {!!userDetail.address && (
                <a
                  className="linkAnchorBg"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://map.kakao.com/?map_type=TYPE_MAP&q=${mapLinkAddress}&urlLevel=2&urlX=469847&urlY=1057028`}
                >
                  지도 링크이동
                </a>
              )}
            </span>
          </div>

          <div className="formContentWrap">
            <h4>대표 이미지</h4>
            <div className="detailWidthContent detailWidthContentImg">
              {!!image[0] && (
                <ServicesImageOnClick
                  getData={image}
                  url={image[0].storagePath}
                  text="회원 대표 이미지"
                />
              )}
            </div>
          </div>

          <div className="formContentWrap">
            <h4>상세 이미지</h4>
            <div className="detailWidthContent detailWidthContentImg">
              {images &&
                images.map((item) => (
                  <ServicesImageOnClick
                    key={item.iid}
                    getData={images}
                    url={item.storagePath}
                    text="회원 상세 이미지"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
