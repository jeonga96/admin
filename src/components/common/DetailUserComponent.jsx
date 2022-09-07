import { useState } from "react";
import { useDidMountEffect } from "../../Services/importData";

export default function DetailUserComponent({ userDetail }) {
  const [mapLinkAddress, setMapLinkAddress] = useState("");

  useDidMountEffect(() => {
    if (!!userDetail.address) {
      setMapLinkAddress(userDetail.address.replace(/ /gi, "+"));
    }
  }, [userDetail]);

  return (
    userDetail && (
      <ul>
        {userDetail.updateTime && (
          <li className="detailSpan detailTime">
            <div>{`${userDetail.updateTime.slice(
              0,
              10
            )} ${userDetail.updateTime.slice(11, 19)}`}</div>
          </li>
        )}
        <li className="detailContentText" style={{ padding: "20px 0" }}>
          <div className="detailHead">
            <h4>이름</h4>
            <span>{userDetail.name}</span>
          </div>
          <div className="detailHead">
            <h4>핸드폰 번호</h4>
            <span>{userDetail.mobile}</span>
          </div>
          <div className="detailHead">
            <h4>메일</h4>
            <span>{userDetail.mail}</span>
          </div>
          <div className="detailHead">
            <h4>주소 - 동 정보</h4>
            <span>{userDetail.location}</span>
          </div>
          <div className="detailHead">
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
          </div>
        </li>
      </ul>
    )
  );
}
