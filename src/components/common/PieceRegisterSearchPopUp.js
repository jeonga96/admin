import React from "react";
import { useEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

export default function Postcode({
  setMultilAddress,
  multilAddress,
  getedData,
}) {
  // 다음 주소 검색 API 주소
  const scriptUrl =
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  // eact-daum-postcode의 popup 방식 사용
  const open = useDaumPostcodePopup(scriptUrl);
  // 부모 컴포넌트에게 값을 전달하기 위해 함수로 사용
  function fnSetAddress(address) {
    setMultilAddress(address);
  }

  // 카카오 API, 주소를 위도 경도로 변환
  const callMapcoor = (data) => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 공사콕에서 사용하는 key와 다음 카카오의 키가 다름!
        // 다음 카카오 신주소 : roadAddress, 구주소 :jibunAddress, 우편번호 : zonecode
        fnSetAddress({
          address: data.roadAddress,
          oldaddress: data.jibunAddress,
          zipcode: data.zonecode,
          latitude: Math.floor(result[0].y * 100000),
          longitude: Math.floor(result[0].x * 100000),
        });
      }
    };
    geocoder.addressSearch(multilAddress.address, callback);
  };

  useEffect(() => {
    //  신주소 : address, 구주소 :oldaddress, 우편번호 : zipcode
    fnSetAddress({
      address: getedData.address,
      oldaddress: getedData.oldaddress,
      zipcode: getedData.zipcode,
      longitude: getedData.longitude,
      latitude: getedData.latitude,
    });
  }, [getedData]);

  // 팝업 입력창에 값을 입력하면 작동하는 함수
  const handleComplete = (data) => {
    // 팝업 입력창에 값을 입력하면 해당 주소로 좌표를 구함
    callMapcoor(data);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  console.log("address.zipcode ", multilAddress.zipcode);

  return (
    <>
      <input
        type="text"
        id="roadAddress"
        disabled
        value={multilAddress.address || ""}
      />
      <input
        type="text"
        id="zipcode"
        value={multilAddress.zipcode || ""}
        disabled
      />

      <button
        type="button"
        onClick={handleClick}
        style={{ backgroundColor: "red" }}
      >
        Open
      </button>

      <div className="formContentWrap">
        <label htmlFor="address" className=" blockLabel">
          좌표
        </label>
        <ul className="detailContent" style={{ display: "flex" }}>
          <li>
            <span>위도</span>
            <input
              type="text"
              disabled
              placeholder="위도 값이 없습니다."
              value={multilAddress.latitude || ""}
            />
          </li>
          <li>
            <span>경도</span>
            <input
              type="text"
              disabled
              placeholder="경도 값이 없습니다."
              value={multilAddress.longitude || ""}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
