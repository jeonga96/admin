import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData, useDidMountEffect } from "../Services/importData";
import { urlGetCompanyDetail, urlGetImages } from "../Services/string";

function CompanyDetail() {
  let { cid } = useParams();
  const [companyDetail, setCompanyDetail] = useState([]);
  const [image, setImage] = useState();
  const reqImgs = useRef({ titleImg: "", imgsImg: "", totalImg: "" });
  const mapLinkAdress = useRef("");

  useEffect(() => {
    servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    }).then((res) => {
      if (res.status === "success") {
        setCompanyDetail(res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        alert("정보가 없습니다. 사업자 정보를 입력해 주세요!");
        window.location.href = `company/${cid}/setcompanydetail`;
        return;
      }
    });
  }, []);

  useDidMountEffect(() => {
    if (!!companyDetail.address) {
      mapLinkAdress.current = companyDetail.address.replace(/ /gi, "+");
    }
    if (companyDetail.titleImg && companyDetail.imgs) {
      reqImgs.current.totalImg =
        companyDetail.titleImg + "," + companyDetail.imgs;
      servicesPostData(urlGetImages, {
        imgs: reqImgs.current.totalImg,
      }).then((res) => {
        setImage(res.data);
      });
    } else if (companyDetail.titleImg || companyDetail.imgs) {
      reqImgs.current.titleImg = companyDetail.titleImg;
      reqImgs.current.imgsImg = companyDetail.imgs;

      servicesPostData(urlGetImages, {
        imgs: companyDetail.titleImg
          ? reqImgs.current.titleImg
          : reqImgs.current.imgsImg,
      }).then((res) => {
        setImage(res.data);
      });
    }
  }, [companyDetail]);

  return (
    <div className="mainWrap">
      <div>
        <div className="paddingBox commonBox">
          <ul className="detailPageLayout">
            <li className="detailImage">
              <div className="titleImg">
                {image && (
                  <img src={image[0].storagePath} alt="사업자 대표 이미지" />
                )}
              </div>
              <div className="imgsImg">
                <h4>사업자 상세 이미지</h4>
                <div>
                  <ul>
                    {image &&
                      image.map((item, i) => (
                        <li key={item.iid}>
                          <img
                            src={item.storagePath}
                            alt="사업자 상세 이미지"
                          />
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </li>
            <li className="detailText">
              <ul>
                <li className="name">{companyDetail.name}</li>
                <li className="detailSpan detailTime">
                  <div>
                    <em>작성 시간</em>
                    <span>{companyDetail.createTime}</span>
                  </div>
                  <div>
                    <em>수정 시간</em>
                    <span>{companyDetail.updateTime}</span>
                  </div>
                </li>
                <li className="detailHead">
                  <h4>사업자 소개글</h4>
                  <span>{companyDetail.comment}</span>
                </li>
                <li className="detailHead">
                  <h4>영업 시간</h4>
                  <span>{companyDetail.workTime}</span>
                </li>
                <li className="detailHead">
                  <h4>연락처 정보</h4>
                  <ul className="detailSpan">
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
                </li>

                <li className="detailHead">
                  <h4>이메일</h4>
                  <span>{companyDetail.email}</span>
                </li>
                <li className="detailHead">
                  <h4>주소</h4>
                  <span>{companyDetail.address}</span>
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
                </li>
                <li className="detailHead">
                  <h4>사업자 소개글</h4>
                  <span>{companyDetail.offer}</span>
                </li>

                <li className="detailHead">
                  <h4>사업자 등록 번호</h4>
                  <span>{companyDetail.registration}</span>
                </li>

                <li className="detailHead">
                  <h4>키워드</h4>
                  <span>{companyDetail.keywords}</span>
                </li>
                <li>{companyDetail.longitude}</li>
                <li>{companyDetail.latitude}</li>
              </ul>
            </li>
          </ul>
          <div className="bigButton widthCenter">
            <Link className="Link" to="setcompanydetail">
              사업자 정보 수정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CompanyDetail;