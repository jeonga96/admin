// -- 사용예시 : SetDeatilCompany --

// <PieceRegisterSearchPopUp />
// react-redux를 사용하여 주소 관련을 useDispatch, useSelector에 할당

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useEffect, useLayoutEffect } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useForm } from "react-hook-form";

export default function ServiceRegisterSearchPopUp({ userComponent }) {
  const dispatch = useDispatch();
  const { register, setValue, watch } = useForm({});

  // 다음 주소 검색 API 주소
  const scriptUrl =
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  // eact-daum-postcode의 popup 방식 사용
  const open = useDaumPostcodePopup(scriptUrl);
  const getedData = useSelector((state) => state.getedData, shallowEqual);

  const multilAddress = useSelector(
    (state) => state.multilAddressData,
    shallowEqual
  );

  const fnDetailAddr = (state) => {
    setValue("_address", state.address);
    setValue("_detailaddress", state.detailaddress);
    setValue("_oldaddress", state.oldaddress);
    setValue("_zipcode", state.zipcode);
    setValue("_latitude", state.latitude);
    setValue("_longitude", state.longitude);
  };
  const fnSimpleAddr = (state) => {
    setValue("_address", state.address);
    setValue("_detailaddress", state.detailaddress);
  };

  useEffect(() => {
    !!userComponent ? fnSimpleAddr(getedData) : fnDetailAddr(getedData);
  }, []);

  useEffect(() => {
    !!userComponent ? fnSimpleAddr(multilAddress) : fnDetailAddr(multilAddress);
  }, [multilAddress]);

  useEffect(() => {
    dispatch({
      type: "serviceMultilAddressData",
      payload: {
        ...multilAddress,
        ...{
          detailaddress: watch("_detailaddress"),
        },
      },
    });
  }, [watch("_detailaddress")]);

  // 카카오 API, 주소를 위도 경도로 변환
  const callMapcoor = (res) => {
    var geocoder = new window.kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 공사콕에서 사용하는 key와 다음 카카오의 키가 다름!
        // 다음 카카오 신주소 : roadAddress, 구주소 :jibunAddress, 우편번호 : zonecode
        if (!!res.postcode) {
          dispatch({
            type: "serviceMultilAddressData",
            payload: {
              address: res.roadAddress,
              detailaddress: res.detailaddress,
              oldaddress: res.jibunAddress,
              zipcode: res.zonecode,
              latitude: Math.floor(result[0].y * 100000),
              longitude: Math.floor(result[0].x * 100000),
            },
          });
        } else {
          dispatch({
            type: "serviceMultilAddressData",
            payload: {
              ...multilAddress,
              ...{
                address: result[0].address_name,
                detailaddress: getedData.detailaddress,
                zipcode: result[0].road_address.zone_no,
                oldaddress: result[0].address.address_name,
                latitude: Math.floor(result[0].y * 100000),
                longitude: Math.floor(result[0].x * 100000),
              },
            },
          });
        }
      }
    };

    geocoder.addressSearch(res.address, callback);
  };

  useLayoutEffect(() => {
    if (getedData !== []) {
      callMapcoor(getedData);
    }

    // setUser는 주소값만 저장함
    if (getedData !== [] && userComponent) {
      dispatch({
        type: "serviceMultilAddressData",
        payload: {
          address: getedData.address,
          detailaddress: getedData.detailaddress,
        },
      });
    }

    // setCompany는 아래와 같은 정보가 필요함
    if (getedData !== [] && !userComponent) {
      dispatch({
        type: "serviceMultilAddressData",
        payload: {
          address: getedData.address,
          detailaddress: getedData.detailaddress,
          oldaddress: getedData.oldaddress,
          zipcode: getedData.zipcode,
          longitude: getedData.longitude,
          latitude: getedData.latitude,
        },
      });
    }
  }, [getedData]);

  // 팝업 입력창에 값을 입력하면 작동하는 함수
  const handleOnComplete = (data) => {
    // setUser는 주소값만 저장함
    if (!!userComponent) {
      dispatch({
        type: "serviceMultilAddressData",
        payload: {
          address: data.roadAddress,
          detailaddress: getedData.detailaddress,
        },
      });
    }

    // setCompany는 아래와 같은 정보가 필요함
    // 팝업 입력창에 값을 입력하면 해당 주소로 좌표를 구함
    if (!userComponent) {
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
              {...register("_address")}
              disabled
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
              {...register("_detailaddress")}
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
                disabled
                {...register("_zipcode")}
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
                {...register("_address")}
                disabled
                style={{ width: "49.8%", marginBottom: 0 }}
              />

              <input
                type="text"
                id="detailaddress"
                placeholder="상세주소를 입력해 주세요."
                {...register("_detailaddress")}
                style={{ width: "49.8%" }}
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
                    {...register("_latitude")}
                    defaultValue={multilAddress.latitude || ""}
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
                    {...register("_longitude")}
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
