import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData, useDidMountEffect } from "../Services/importData";
import { urlGetUserDetail } from "../Services/string";

function UserDetail() {
  let { uid } = useParams();
  const [userDetail, setUserDetail] = useState([]);
  const [mapLinkAddress, setMapLinkAddress] = useState("");

  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    }).then((res) => {
      if (res.status === "success") {
        setUserDetail(res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        alert("정보가 없습니다. 사업자 정보를 입력해 주세요!");
        window.location.href = `company/${uid}/setUserDetail`;
        return;
      }
    });
  }, []);

  useDidMountEffect(() => {
    if (!!userDetail.address) {
      setMapLinkAddress(userDetail.address.replace(/ /gi, "+"));
    }
  }, [userDetail]);

  return (
    <div className="mainWrap">
      <div>
        <div className="paddingBox commonBox">
          <ul className="detailPageLayout">
            <li className="detailText">
              <ul>
                <li className="name">{userDetail.name}</li>
                <li className="detailSpan detailTime">
                  <div>
                    <em>수정 시간</em>
                    <span>{userDetail.updateTime}</span>
                  </div>
                </li>
                <li className="detailHead">
                  <h4>핸드폰 번호</h4>
                  <span>{userDetail.mobile}</span>
                </li>
                <li className="detailHead">
                  <h4>메일</h4>
                  <span>{userDetail.mail}</span>
                </li>

                <li className="detailHead">
                  <h4>주소 - 동 정보</h4>
                  <span>{userDetail.location}</span>
                </li>
                <li className="detailHead">
                  <h4>주소</h4>
                  <span>{userDetail.address}</span>
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
                </li>
              </ul>
            </li>
          </ul>
          <div className="bigButton widthCenter">
            <Link className="Link" to="setUserDetail">
              사업자 정보 수정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserDetail;
