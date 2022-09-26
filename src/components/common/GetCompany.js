import { useState, useRef } from "react";
import { useDidMountEffect, useGetImage } from "../../Services/customHook";

export default function GetCompany({ companyDetail }) {
  const [image, setImage] = useState();
  const [images, setImages] = useState();
  const mapLinkAdress = useRef("");
  const keyword = useRef("");

  useDidMountEffect(() => {
    if (!!companyDetail.address) {
      mapLinkAdress.current = companyDetail.address.replace(/ /gi, "+");
    }
    if (companyDetail.keywords) {
      keyword.current = companyDetail.keywords.split(",");
    }
    if (companyDetail.imgs) {
      setImages(companyDetail.imgs);
    }
  }, [companyDetail]);
  useGetImage(setImage, companyDetail);

  return (
    <div className="detailPageLayout">
      <li className="detailTime">
        <div>
          <em>작성 시간</em>
          <span>
            {companyDetail.createTime &&
              companyDetail.createTime.slice(0, 10) +
                " " +
                companyDetail.createTime.slice(11, 19)}
          </span>
        </div>
        <div>
          <em>수정 시간</em>
          <span>
            {companyDetail.updateTime &&
              companyDetail.updateTime.slice(0, 10) +
                " " +
                companyDetail.updateTime.slice(11, 19)}
          </span>
        </div>
      </li>

      <div className="formContentWrap">
        <h4>이름</h4>
        <span>{companyDetail.name}</span>
      </div>

      <div className="formContentWrap">
        <h4>사업자 소개글</h4>
        <p>{companyDetail.comment}</p>
      </div>

      <div className="formContentWrap">
        <h4>영업 시간</h4>
        <span>{companyDetail.workTime}</span>
      </div>

      <div className="formContentWrap">
        <h4>연락처 정보</h4>
        <ul className="detailWidthContent">
          <li>
            <em>전화 번호</em>
            <span>{companyDetail.telnum}</span>
          </li>
          <li>
            <em>핸드폰 번호</em>
            <span>{companyDetail.mobilenum}</span>
          </li>
          <li>
            <em>추가 번호</em>
            <span>{companyDetail.extnum}</span>
          </li>
        </ul>
      </div>

      <div className="formContentWrap">
        <h4>대표 이미지</h4>
        <div className="detailWidthContent">
          {image && (
            <div
              className="img"
              style={{
                backgroundImage: `url("${image && image[0].storagePath}")`,
              }}
            >
              <span className="blind">사업자 대표 이미지</span>
            </div>
          )}
        </div>
      </div>

      <div className="formContentWrap">
        <h4>사업자 상세 이미지</h4>
        <ul className="detailWidthContent" style={{ justifyContent: "left" }}>
          {images &&
            images.map((item) => (
              <li
                key={item.iid}
                className="img"
                style={{
                  backgroundImage: `url("${image && item.storagePath}")`,
                }}
              >
                <span className="blind">사업자 상세 이미지 </span>
              </li>
            ))}
        </ul>
      </div>

      <div className="formContentWrap">
        <h4>이메일</h4>
        <span>{companyDetail.email}</span>
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
        <h4>사업자 소개글</h4>
        <span>{companyDetail.offer}</span>
      </div>

      <div className="formContentWrap">
        <h4>사업자 등록 번호</h4>
        <span>{companyDetail.registration}</span>
      </div>

      <div className="formContentWrap">
        <h4>키워드</h4>
        <ul className="detailContent hashTag">
          {keyword.current &&
            keyword.current.map((item, key) => <li key={key}># {item}</li>)}
        </ul>
      </div>
    </div>
  );
}
