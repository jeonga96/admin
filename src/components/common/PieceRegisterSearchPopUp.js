import { useLayoutEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

export default function Postcode({
  userComponent,
  setMultilAddress,
  multilAddress,
  getedData,
  autoKey,
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

  function onChange(e) {
    setMultilAddress({ ...multilAddress, [e.target.id]: e.target.value });
  }

  // 카카오 API, 주소를 위도 경도로 변환
  const callMapcoor = (res) => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 공사콕에서 사용하는 key와 다음 카카오의 키가 다름!
        // 다음 카카오 신주소 : roadAddress, 구주소 :jibunAddress, 우편번호 : zonecode
        autoKey
          ? fnSetAddress({
              ...{
                address: result[0].address_name,
                detailaddress: getedData.detailaddress,
                zipcode: result[0].road_address.zone_no,
                oldaddress: result[0].address.address_name,
                latitude: Math.floor(result[0].y * 100000),
                longitude: Math.floor(result[0].x * 100000),
              },
            })
          : fnSetAddress({
              address: res.roadAddress,
              detailaddress: res.detailaddress,
              oldaddress: res.jibunAddress,
              zipcode: res.zonecode,
              latitude: Math.floor(result[0].y * 100000),
              longitude: Math.floor(result[0].x * 100000),
            });
      }
    };
    autoKey
      ? geocoder.addressSearch(res, callback)
      : geocoder.addressSearch(res.address, callback);
  };

  useLayoutEffect(() => {
    if (getedData !== [] && !!autoKey) {
      callMapcoor(getedData.address);
    }

    // setUser는 주소값만 저장함
    if (getedData !== [] && userComponent) {
      fnSetAddress({
        address: getedData.address,
        detailaddress: getedData.detailaddress,
      });
    }

    // setCompany는 아래와 같은 정보가 필요함
    if (getedData !== [] && !userComponent && !autoKey) {
      //  신주소 : address, 구주소 :oldaddress, 우편번호 : zipcode
      fnSetAddress({
        address: getedData.address,
        detailaddress: getedData.detailaddress,
        oldaddress: getedData.oldaddress,
        zipcode: getedData.zipcode,
        longitude: getedData.longitude,
        latitude: getedData.latitude,
      });
    }
  }, [getedData]);

  // 팝업 입력창에 값을 입력하면 작동하는 함수
  const handleOnComplete = (data) => {
    // setUser는 주소값만 저장함
    if (!!userComponent) {
      fnSetAddress({
        address: data.roadAddress,
        detailaddress: getedData.detailaddress,
      });
    }

    // setCompany는 아래와 같은 정보가 필요함
    if (!userComponent) {
      // 팝업 입력창에 값을 입력하면 해당 주소로 좌표를 구함
      callMapcoor(data);
    }
  };

  const handleClick = () => {
    open({ onComplete: handleOnComplete });
  };

  // setUser
  if (!!userComponent) {
    return (
      <div className="formContentWrap" style={{ width: "100%" }}>
        <label htmlFor="address" className=" blockLabel">
          <span>주소</span>
        </label>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <input
              type="text"
              id="address"
              disabled
              value={multilAddress.address || ""}
              style={{
                width: "94%",
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

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type="text"
              id="detailaddress"
              placeholder="상세주소를 입력해주세요."
              value={multilAddress.detailaddress || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    );
  }

  // setCompany
  if (!userComponent) {
    return (
      <>
        <div className="formContentWrap" style={{ width: "100%" }}>
          <label htmlFor="address" className=" blockLabel">
            <span>주소</span>
          </label>
          <div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <input
                type="text"
                id="zipcode"
                value={multilAddress.zipcode || ""}
                disabled
                style={{
                  width: "155px",
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

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input
                type="text"
                id="roadAddress"
                disabled
                value={multilAddress.address || ""}
                style={{ width: "49.8%", marginBottom: 0 }}
              />

              <input
                type="text"
                id="detailaddress"
                placeholder="상세주소를 입력해 주세요."
                defaultValue={multilAddress.detailaddress || ""}
                style={{ width: "49.8%" }}
                onChange={onChange}
              />
            </div>

            <ul
              className="detailContent"
              style={{ width: "100%", border: "none", padding: "4px 0 2px" }}
            >
              <li style={{ width: "240px", paddingLeft: "0" }}>
                <div>
                  <span>위도</span>
                  <input
                    id="latitude"
                    type="text"
                    placeholder="위도 값이 없습니다."
                    defaultValue={multilAddress.latitude || ""}
                    onChange={onChange}
                  />
                </div>
              </li>
              <li style={{ width: "240px" }}>
                <div>
                  <span>경도</span>
                  <input
                    id="longitude"
                    type="text"
                    placeholder="경도 값이 없습니다."
                    defaultValue={multilAddress.longitude || ""}
                    onChange={onChange}
                  />
                </div>
              </li>
              <li>
                <a
                  className="formContentBtn"
                  target="_blank"
                  href="https://www.google.co.kr/maps"
                  rel="noopener noreferrer"
                >
                  좌표검색
                </a>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}
