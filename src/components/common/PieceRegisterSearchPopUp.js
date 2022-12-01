import React from "react";
import { useEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

export default function Postcode({
  siteAddress,
  userComponent,
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
  const callMapcoor = (res) => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 공사콕에서 사용하는 key와 다음 카카오의 키가 다름!
        // 다음 카카오 신주소 : roadAddress, 구주소 :jibunAddress, 우편번호 : zonecode
        fnSetAddress({
          address: res.roadAddress,
          oldaddress: res.jibunAddress,
          zipcode: res.zonecode,
          latitude: Math.floor(result[0].y * 100000),
          longitude: Math.floor(result[0].x * 100000),
        });
      }
    };
    geocoder.addressSearch(res.address, callback);
  };

  useEffect(() => {
    // siteAddress는 주소값만 저장함
    if (getedData !== [] && siteAddress) {
      fnSetAddress({
        siteAddress: getedData.siteAddress,
      });
    }

    // setUser는 주소값만 저장함
    if (getedData !== [] && userComponent) {
      fnSetAddress({
        address: getedData.address,
      });
    }

    // setCompany는 아래와 같은 정보가 필요함
    if (getedData !== [] && !userComponent && !siteAddress) {
      //  신주소 : address, 구주소 :oldaddress, 우편번호 : zipcode

      fnSetAddress({
        address: getedData.address,
        oldaddress: getedData.oldaddress,
        zipcode: getedData.zipcode,
        longitude: getedData.longitude,
        latitude: getedData.latitude,
      });
    }
  }, [getedData]);

  // 팝업 입력창에 값을 입력하면 작동하는 함수
  const handleComplete = (data) => {
    console.log(data);
    // siteAddress 주소값만 저장함
    if (!!siteAddress) {
      fnSetAddress({
        siteAddress: data.roadAddress,
      });
    }

    // setUser는 주소값만 저장함
    if (!!userComponent) {
      fnSetAddress({
        address: data.roadAddress,
      });
    }
    // setCompany는 아래와 같은 정보가 필요함
    if (!userComponent && !siteAddress) {
      // 팝업 입력창에 값을 입력하면 해당 주소로 좌표를 구함
      callMapcoor(data);
    }
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  // siteAddress
  if (!!siteAddress) {
    return (
      <div className="formContentWrap">
        <label htmlFor="address" className=" blockLabel">
          <span>방문 요청 주소</span>
        </label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            id="roadAddress"
            disabled
            value={multilAddress.siteAddress || ""}
            style={{
              width: "86%",
            }}
          />
          <button
            type="button"
            onClick={handleClick}
            className="formContentBtn"
          >
            주소검색
          </button>
        </div>
      </div>
    );
  }

  // setUser
  if (!!userComponent) {
    return (
      <div className="formContentWrap">
        <label htmlFor="address" className=" blockLabel">
          <span>주소</span>
        </label>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            id="roadAddress"
            disabled
            value={multilAddress.address || ""}
            style={{
              width: "86%",
            }}
          />
          <button
            type="button"
            onClick={handleClick}
            className="formContentBtn"
          >
            주소검색
          </button>
        </div>
      </div>
    );
  }

  // setCompany
  if (!userComponent) {
    return (
      <>
        <div className="formContentWrap">
          <label htmlFor="address" className=" blockLabel">
            <span>주소</span>
          </label>
          <div>
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
              style={{
                width: "155px",
                float: "left",
                marginRight: "5px",
              }}
            />

            <button
              type="button"
              onClick={handleClick}
              className="formContentBtn"
            >
              주소검색
            </button>
          </div>
        </div>

        <div className="formContentWrap">
          <label htmlFor="address" className=" blockLabel">
            <span>좌표</span>
          </label>
          <ul className="detailContent">
            <li>
              <div>
                <span>위도</span>
                <input
                  type="text"
                  disabled
                  placeholder="위도 값이 없습니다."
                  value={multilAddress.latitude || ""}
                />
              </div>
            </li>
            <li>
              <div>
                <span>경도</span>
                <input
                  type="text"
                  disabled
                  placeholder="경도 값이 없습니다."
                  value={multilAddress.longitude || ""}
                />
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }
}
