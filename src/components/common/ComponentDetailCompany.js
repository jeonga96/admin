import { useState, useRef, useEffect } from "react";
import { useGetImage } from "../../Services/customHook";
import ServicesImageOnClick from "./ServicesImageOnClick";

export default function ComponentDetailCompany({ companyDetail }) {
  // image:대표이미지, images:상세이미지 mapLinkAdress는 클릭 시 네이버 지도로 가기 위한 변수
  const [image, setImage] = useState([]);
  const [images, setImages] = useState(null);
  const mapLinkAdress = useRef("");
  const keyword = useRef("");

  // 해당 회원의 데이터가 companyDetail에 저장되면 아래 기능 수행
  useEffect(() => {
    if (!!companyDetail.address) {
      mapLinkAdress.current = companyDetail.address.replace(/ /gi, "+");
    }
    if (companyDetail.keywords) {
      keyword.current = companyDetail.keywords.split(",");
    }
  }, [companyDetail]);

  // 서버에서 이미지를 한 번에 가져오기 위해 image에 대표이미지와 상세이미지를 담았음.
  // images에 상세이미지를 저장하기 위해 첫번째 이미지 제거
  useEffect(() => {
    if (companyDetail.titleImg) {
      image && setImages(image.filter((_, index) => index !== 0));
    } else {
      setImages(image);
    }
  }, [image]);

  // 서버에서 image를 가져오는 customHook titleImg와 imgs를 한번에 가져온다.
  useGetImage(setImage, companyDetail);

  return (
    <div className="detailPageLayout">
      <div className="formContentWrap">
        <h4>상호</h4>
        <span>{companyDetail.name}</span>
      </div>

      <div className="formContentWrap">
        <h4>사업자 등록 번호</h4>
        <span>{companyDetail.registration}</span>
      </div>

      <div className="formContentWrap">
        <h4>연락처 정보</h4>
        <ul className="detailWidthContent detailWidthContentCallNum">
          <li>
            <em>전화 번호</em>
            <span>{companyDetail.telnum}</span>
          </li>
          <li>
            <em>핸드폰 번호</em>
            <span>{companyDetail.mobilenum}</span>
          </li>
          <li>
            <em>안심 번호</em>
            <span>{companyDetail.extnum}</span>
          </li>
        </ul>
      </div>

      <div className="formContentWrap">
        <h4>주소</h4>
        <span>
          {companyDetail.address}
          {!!companyDetail.address && (
            <a
              className="linkAnchorBg"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://map.kakao.com/?map_type=TYPE_MAP&q=${mapLinkAdress.current}&urlLevel=2&urlX=469847&urlY=1057028`}
            >
              지도 링크이동
            </a>
          )}
        </span>
      </div>

      <div className="formContentWrap">
        <h4>이메일</h4>
        <span>{companyDetail.email}</span>
      </div>

      <div className="formContentWrap">
        <h4>사업자 한줄 소개</h4>
        <p>{companyDetail.comment}</p>
      </div>

      <div className="formContentWrap">
        <h4>영업 시간</h4>
        <span>{companyDetail.workTime}</span>
      </div>

      <div className="formContentWrap">
        <h4>대표 이미지</h4>
        <div className="detailWidthContent detailWidthContentImg">
          {!!image[0] && (
            <ServicesImageOnClick
              getData={image}
              url={image[0].storagePath}
              text="사업자 대표 이미지"
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
                text="사업자 상세 이미지"
              />
            ))}
        </div>
      </div>

      <div className="formContentWrap">
        <h4>사업자 소개글</h4>
        <p>{companyDetail.offer}</p>
      </div>

      <div className="formContentWrap">
        <h4>키워드</h4>
        <ul className="detailContent hashTag">
          {keyword.current &&
            keyword.current.map((item, key) => <li key={key}># {item}</li>)}
        </ul>
      </div>

      <div className="formContentWrap">
        <h4>계약일</h4>
        <ul className="detailWidthContent detailWidthContentCallNum">
          <li>
            <em>계약일</em>
            <span>
              {" "}
              {companyDetail.createTime &&
                companyDetail.createTime.slice(0, 10) +
                  " " +
                  companyDetail.createTime.slice(11, 19)}
            </span>
          </li>
          <li>
            {companyDetail.useFlag === 0 ? <em>휴면일</em> : <em>수정일</em>}
            <span>
              {" "}
              {companyDetail.updateTime &&
                companyDetail.updateTime.slice(0, 10) +
                  " " +
                  companyDetail.updateTime.slice(11, 19)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
