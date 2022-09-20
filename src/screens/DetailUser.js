import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetUserDetail } from "../Services/string";
import { useDidMountEffect } from "../Services/customHook";

import LayoutTopButton from "../components/common/LayoutTopButton";

export default function DetailUser() {
  let { uid } = useParams();
  const [userDetail, setUserDetail] = useState([]);
  const [mapLinkAddress, setMapLinkAddress] = useState("");

  // 주소를 활용허여 지도 링크로 이동하기 위한 작업
  useDidMountEffect(() => {
    if (!!userDetail.address) {
      setMapLinkAddress(userDetail.address.replace(/ /gi, "+"));
    }
  }, [userDetail]);

  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: uid,
    }).then((res) => {
      if (res.status === "success") {
        setUserDetail(res.data);
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        alert("정보가 없습니다. 사용자정보를 입력해 주세요.");
        window.location.href = `user/${uid}/setUserDetail`;
        return;
      }
    });
  }, []);

  return (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url="setUserDetail" text="수정" />
      </ul>
      <div className="paddingBox commonBox">
        {/* {userDetail.updateTime && (
              <li className="detailSpan detailTime">
                <div>{`${userDetail.updateTime.slice(
                  0,
                  10
                )} ${userDetail.updateTime.slice(11, 19)}`}</div>
              </li>
            )} */}
        <div className="detailPageLayout">
          <div className="formContentWrap">
            <h4>이름</h4>
            <span>{userDetail.name}</span>
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
        </div>
      </div>
    </>
  );
}
