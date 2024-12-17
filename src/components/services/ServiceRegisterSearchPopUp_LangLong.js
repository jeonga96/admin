// -- 사용예시 : SetDeatilCompany --

// <PieceRegisterSearchPopUp />
// react-redux를 사용하여 주소 관련을 useDispatch, useSelector에 할당

// 주소 검색, 우편번호 검색은 다음 우편번호 검색 & react-daum-postcode기능 사용
// 카카오 API는 주소를 위도, 경도로 변환할 때 사용

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useForm } from "react-hook-form";

import * as DATA from "../../action/data";

export default function ServiceRegisterSearchPopUp() {
  const dispatch = useDispatch();
  const { register, setValue } = useForm({});

  // 다음 주소 검색 API 주소
  const scriptUrl =
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  // eact-daum-postcode의 popup 방식 사용
  const open = useDaumPostcodePopup(scriptUrl);
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);

  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );
  console.log("multilAddress", multilAddress);

  const fnDetailAddr = (state) => {
    setValue("_location", state?.location || "");
    setValue("_latitude", state?.latitude || "");
    setValue("_longitude", state?.longitude || "");
  };

  useEffect(() => {
    if (multilAddress) {
      fnDetailAddr(multilAddress);
    }
    if (!multilAddress) {
      fnDetailAddr(getedData);
    }
  }, [multilAddress]);

  useEffect(() => {
    if (getedData) {
      callMapcoor();
      const payload = {
        location: getedData.location,
        longitude: getedData.longitude * 1,
        latitude: getedData.latitude * 1,
      };
      dispatch(DATA.serviceMultilAddressData(payload));
    }
  }, [getedData]);

  // 카카오 API, 주소를 위도 경도로 변환
  const callMapcoor = (res) => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 공사콕에서 사용하는 key와 다음 카카오의 키가 다름!

        // 팝업 이벤트 값이 없는 경우
        if (!res) {
          // 도로명 주소가 있는 경우
          console.log("1");
          if (!!result[0].road_address) {
            console.log("2");
            const payload = {
              ...multilAddress,
              ...{
                location:
                  result[0].road_address?.address_name || getedData.address,

                latitude: Math.floor(result[0].y * 100000),
                longitude: Math.floor(result[0].x * 100000),
              },
            };
            dispatch(DATA.serviceMultilAddressData(payload));
          } // 도로명 주소가 있는 경우 끝
        } else {
          // 팝업 이벤트 값이 있는 경우
          console.log("3");
          const payload = {
            latitude: Math.floor(result[0].y * 100000),
            longitude: Math.floor(result[0].x * 100000),
            location: res.address,
          };
          dispatch(DATA.serviceMultilAddressData(payload));
        }
      }
    };
    if (!res) {
      geocoder.addressSearch(getedData.address, callback);
    } else {
      geocoder.addressSearch(res.roadAddress, callback);
    }
  };

  // 팝업 입력창에 값을 입력하면 작동하는 함수
  const handleOnComplete = (data) => {
    callMapcoor(data);
  };

  const handleClick = () => {
    open({ onComplete: handleOnComplete });
  };

  return (
    <>
      <div className="formContentWrap" style={{ width: "100%" }}>
        <label htmlFor="address" className=" blockLabel">
          <span>지역 정보</span>
        </label>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <input
              type="text"
              id="location"
              disabled
              {...register("_location")}
              style={{
                width: "350px",
                marginRight: "2px",
              }}
            />

            <ul
              className="detailContent"
              style={{
                width: "auto",
                border: "none",
                margin: "0",
                padding: "0",
              }}
            >
              <li style={{ height: "28.8px" }}>
                <div>
                  <span
                    style={{
                      width: "40%",
                      height: "28.8px",
                      minWidth: "40%",
                    }}
                  >
                    위도
                  </span>
                  <input
                    style={{ width: "60%" }}
                    id="latitude"
                    placeholder="-"
                    disabled
                    {...register("_latitude")}
                    defaultValue={multilAddress?.latitude || ""}
                  />
                </div>
              </li>
              <li style={{ height: "28.8px" }}>
                <div>
                  <span
                    style={{
                      width: "40%",
                      height: "28.8px",
                      minWidth: "40%",
                    }}
                  >
                    경도
                  </span>
                  <input
                    style={{ width: "60%" }}
                    id="longitude"
                    placeholder="-"
                    disabled
                    defaultValue={multilAddress?.longitude || ""}
                    {...register("_longitude")}
                  />
                </div>
              </li>
            </ul>
            <button
              type="button"
              onClick={handleClick}
              className="formContentBtn"
              style={{
                marginRight: "4px",
              }}
            >
              주소검색
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
