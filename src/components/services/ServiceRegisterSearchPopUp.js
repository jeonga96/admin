// -- 사용예시 : SetDeatilCompany --

// <PieceRegisterSearchPopUp />
// react-redux를 사용하여 주소 관련을 useDispatch, useSelector에 할당

// 주소 검색, 우편번호 검색은 다음 우편번호 검색 & react-daum-postcode기능 사용
// 카카오 API는 주소를 위도, 경도로 변환할 때 사용

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useForm } from "react-hook-form";

import * as DATA from "../../action/data";
import * as CUS from "../../service/customHook";

export default function ServiceRegisterSearchPopUp({ req, simpleValue }) {
  const dispatch = useDispatch();
  const { register, setValue, watch } = useForm({});
  const [directInput, setDirectInput] = useState(false);

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

  const fnDetailAddr = (state) => {
    setValue("_address", state?.address);
    setValue("_detailaddress", state?.detailaddress);
    setValue("_oldaddress", state?.oldaddress);
    setValue("_zipcode", state?.zipcode);
    setValue("_latitude", state?.latitude);
    setValue("_longitude", state?.longitude);
  };

  const fnSimpleAddr = (state) => {
    setValue("_address", state?.address);
    setValue("_detailaddress", state?.detailaddress);
  };

  CUS.useCleanupEffect(() => {
    if (directInput === false && !multilAddress) {
      !!simpleValue ? fnSimpleAddr(getedData) : fnDetailAddr(getedData);
    }
  }, []);

  useEffect(() => {
    if (directInput === false && multilAddress) {
      !!simpleValue ? fnSimpleAddr(multilAddress) : fnDetailAddr(multilAddress);
    }
  }, [multilAddress]);

  useEffect(() => {
    if (simpleValue && getedData.address) {
      callMapcoor();
      const payload = {
        address: getedData.address,
        detailaddress: getedData.detailaddress,
      };
      dispatch(DATA.serviceMultilAddressData(payload));
    }

    // setCompany는 아래와 같은 정보가 필요함
    if (!simpleValue && getedData.address) {
      callMapcoor();
      const payload = {
        address: getedData.address,
        detailaddress: getedData.detailaddress,
        oldaddress: getedData.oldaddress,
        zipcode: getedData.zipcode,
        longitude: getedData.longitude * 1,
        latitude: getedData.latitude * 1,
      };
      dispatch(DATA.serviceMultilAddressData(payload));
    }
  }, [getedData]);

  useEffect(() => {
    let payload;
    if (directInput) {
      // 사업자상세 직접 입력
      payload = {
        longitude: Math.floor(watch("_longitude") * 100000),
        latitude: Math.floor(watch("_latitude") * 100000),
        detailaddress: watch("_detailaddress"),
        zipcode: watch("_zipcode"),
        address: watch("_address"),
        oldaddress: watch("_oldaddress"),
      };
      dispatch(DATA.serviceMultilAddressData(payload));
    } else if (simpleValue) {
      // 회원상세
      payload = {
        detailaddress: watch("_detailaddress"),
        address: watch("_address"),
      };
      dispatch(DATA.serviceMultilAddressData(payload));
    } else if (!directInput && !simpleValue) {
      const payload = {
        ...multilAddress,
        ...{
          longitude: watch("_longitude"),
          latitude: watch("_latitude"),
          detailaddress: watch("_detailaddress"),
        },
      };
      dispatch(DATA.serviceMultilAddressData(payload));
    }
  }, [
    watch("_longitude"),
    watch("_latitude"),
    watch("_detailaddress"),
    watch("_zipcode"),
    watch("_address"),
    watch("_oldaddress"),
  ]);

  // 카카오 API, 주소를 위도 경도로 변환
  const callMapcoor = (res) => {
    if (!directInput) {
      var geocoder = new window.kakao.maps.services.Geocoder();
      var callback = function (result, status) {
        // console.log("result", result, status);
        if (status === window.kakao.maps.services.Status.OK) {
          // 공사콕에서 사용하는 key와 다음 카카오의 키가 다름!
          // 다음 카카오 신주소 : roadAddress, 구주소 :jibunAddress, 우편번호 : zonecode

          // 팝업 이벤트 값이 없는 경우
          if (!res) {
            // 도로명 주소가 있는 경우
            if (!!result[0].road_address) {
              const payload = {
                ...multilAddress,
                ...{
                  address:
                    result[0].road_address?.address_name || getedData.address,
                  detailaddress: getedData.detailaddress,
                  zipcode: result[0].road_address?.zone_no || "",
                  oldaddress:
                    result[0].address.address_name || getedData.oldaddress,

                  latitude: Math.floor(result[0].y * 100000),
                  longitude: Math.floor(result[0].x * 100000),
                },
              };
              dispatch(DATA.serviceMultilAddressData(payload));
            } // 도로명 주소가 있는 경우 끝
          } else {
            // 팝업 이벤트 값이 있는 경우

            const payload = {
              address: res.roadAddress,
              detailaddress:
                watch("_detailaddress") || multilAddress.detailaddress,
              oldaddress: res.jibunAddress || res.autoJibunAddress,
              zipcode: res.zonecode,
              latitude: Math.floor(result[0].y * 100000),
              longitude: Math.floor(result[0].x * 100000),
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
    }
  };

  // 팝업 입력창에 값을 입력하면 작동하는 함수
  const handleOnComplete = (data) => {
    // setUser는 주소값만 저장함
    if (simpleValue) {
      const payload = {
        address: data.roadAddress,
        detailaddress: getedData.detailaddress,
      };
      dispatch(DATA.serviceMultilAddressData(payload));
    }

    // setCompany는 아래와 같은 정보가 필요함
    // 팝업 입력창에 값을 입력하면 해당 주소로 좌표를 구함
    if (!simpleValue) {
      callMapcoor(data);
    }
  };

  const handleClick = () => {
    open({ onComplete: handleOnComplete });
  };

  // setUser
  if (!!simpleValue) {
    return (
      <div className="formContentWrap" style={{ width: "100%" }}>
        <label htmlFor="address" className=" blockLabel">
          <span>{req ? "주소 *" : "주소"}</span>
        </label>

        <div>
          <span
            style={{
              display: "inline-block",
              color: "#333",
              margin: "8px 0 8px 4px",
            }}
          >
            <span style={{ color: "red" }}>
              {"<"} 주의 {"> "}
            </span>
            도로명 주소 우선 입력 / 도로명 주소 없을 경우, 지번 주소 입력
          </span>
          <span>주소 검색 결과 값이 없는 경우, 직접 입력해 주세요.</span>
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
              {...register("_address")}
              style={{
                width: "94%",
              }}
            />

            <button
              type="button"
              onClick={handleClick}
              className="formContentBtn"
            >
              주소
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type="text"
              id="detailaddress"
              placeholder="상세주소를 입력해주세요."
              {...register("_detailaddress")}
            />
          </div>
        </div>
      </div>
    );
  }

  // setCompany
  if (!simpleValue) {
    return (
      <>
        <div className="formContentWrap" style={{ width: "100%" }}>
          <label htmlFor="address" className=" blockLabel">
            <span>{req ? "사업장 주소 *" : "사업장 주소"}</span>
          </label>
          <div>
            {directInput ? (
              <>
                <span
                  style={{
                    display: "block",
                    color: "#333",
                    margin: "8px 0 8px 22px",
                  }}
                >
                  <span style={{ color: "red" }}>
                    {"<"} 주의 {"> "}
                  </span>
                  위도와 경도는 소수점자리까지 입력해 주세요.
                </span>
                <span
                  style={{
                    display: "block",
                    color: "#333",
                    margin: "8px 0 8px 22px",
                  }}
                >
                  <span style={{ color: "red" }}>
                    {"<"} 주의 {"> "}
                  </span>
                  주소 검색 입력을 사용하고 싶은 경우, [ 검색 입력 ] 버튼을
                  이용하여 주소 검색 설정으로 변경해 주세요.
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    display: "block",
                    color: "#333",
                    margin: "8px 0 8px 22px",
                  }}
                >
                  <span style={{ color: "red" }}>
                    {"<"} 주의 {"> "}
                  </span>
                  도로명 주소 우선 입력 / 도로명 주소 없을 경우, 지번 주소 입력
                </span>

                <span
                  style={{
                    display: "block",
                    color: "#333",
                    margin: "8px 0 8px 22px",
                  }}
                >
                  <span style={{ color: "red" }}>
                    {"<"} 주의 {"> "}
                  </span>
                  주소를 잘못 입력한 경우, 위도와 경도 값이 0으로 표시됩니다.
                </span>

                <span
                  style={{
                    display: "block",
                    color: "#333",
                    margin: "8px 0 8px 22px",
                  }}
                >
                  <span style={{ color: "red" }}>
                    {"<"} 주의 {"> "}
                  </span>
                  도로명 주소가 없는 경우, 위도와 경도 값이 0으로 표시됩니다. [
                  직접 입력 ] 이용하여 위도와 경도를 직접 입력해 주세요.
                </span>
              </>
            )}

            <div
              style={{
                display: "flex",
                marginBottom: "5px",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <input
                type="text"
                id="zipcode"
                disabled={directInput ? false : true}
                {...register("_zipcode")}
                style={{
                  width: "155px",
                  marginRight: "3px",
                }}
              />
              <button
                type="button"
                onClick={handleClick}
                className="formContentBtn"
                disabled={directInput ? true : false}
                style={{
                  marginRight: "4px",
                }}
              >
                주소검색
              </button>

              <button
                type="button"
                onClick={() => setDirectInput(!directInput)}
                className="formContentBtn"
                style={{
                  marginRight: "4px",
                  backgroundColor: "#084b60",
                }}
              >
                {directInput ? "검색 입력" : "직접 입력"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <div style={{ width: "49.85%", backgroundColor: "#f6f5f4" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "20%",
                    textAlign: "center",
                  }}
                >
                  도로명 주소
                </span>
                <input
                  type="text"
                  id="roadAddress"
                  disabled={directInput ? false : true}
                  {...register("_address")}
                  style={{
                    width: "80%",
                  }}
                />
              </div>

              <div style={{ width: "49.85%", backgroundColor: "#f6f5f4" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "20%",
                    textAlign: "center",
                  }}
                >
                  지번 주소
                </span>
                <input
                  type="text"
                  id="jibunAddress"
                  disabled={directInput ? false : true}
                  {...register("_oldaddress")}
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
              }}
            >
              <input
                type="text"
                id="detailaddress"
                placeholder="상세주소를 입력해 주세요."
                {...register("_detailaddress")}
                style={{ width: "68%", marginRight: "2px" }}
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
                      disabled={directInput ? false : true}
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
                      disabled={directInput ? false : true}
                      defaultValue={multilAddress?.longitude || ""}
                      {...register("_longitude")}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}
