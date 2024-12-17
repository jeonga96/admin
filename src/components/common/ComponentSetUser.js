import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as TOKEN from "../../service/useData/token";
import * as API from "../../service/api";
import * as MO from "../../service/library/modal";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as RC from "../../service/useData/roleCheck";
import * as RAN from "../../service/useData/rander";

import * as DATA from "../../action/data";

import ServiceModalUserSetRcidAdd from "../services/ServiceModalUserSetRcidAdd";
import { ManualView, SetStatus } from "./ComponentStatusManualView";

export default function ComponentSetUser({ setUserData, userData, checkBtn }) {
  const dispatch = useDispatch();
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      _useFlag: "1",
    },
  });
  const { uid } = useParams();
  const [click, setClick] = useState(false);
  const [STATUS, setSTATUS] = useState("none");
  const [manualview, setManualview] = useState(false);

  // 회원활성화, 회원권한 상위 컴포넌트 전달
  function fnSetUserData() {
    setUserData({
      ...userData,
      useFlag: getValues("_useFlag"),
      userrole: getValues("_userrole"),
      userid: getValues("_userid"),
      passwd: getValues("_passwd"),
      // rcid: getValues("_rcid"),
    });
  }

  useEffect(() => {
    if (!uid && watch("_userid") && watch("_passwd")) {
      API.servicesPostData(APIURL.urlAdduser, {
        userid: watch("_userid"),
        passwd: watch("_passwd"),
      }).then((res) => {
        if (
          res.status === "fail" &&
          res.emsg === "Database update failure. check duplicate userid"
        ) {
          setUserData({ ...userData, addUserFail: true });
        } else {
          fnSetUserData();
        }
      });
    }
  }, [checkBtn]);

  // 회원활성화, 회원권한 기존 값 있다면 표시
  useEffect(() => {
    API.servicesPostData(APIURL.urlGetUser, {
      uid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          setValue("_userrole", res.data.userrole.toString() || "ROLE_USER");
          setValue("_useFlag", res.data.useFlag.toString() || "1");
          setValue("_userid", res.data.userid.toString() || "");
          // uid에 연결된 cid 여부 체크
          API.servicesPostData(APIURL.urlGetUserCid, { uid: uid }).then(
            (res2) => {
              if (res2 !== undefined && res2.status === "success") {
                setValue("_rcid", res2.data.cid);

                // 사업자.status 가져오기
                API.servicesPostData(APIURL.urlGetCompanyDetail, {
                  rcid: res2.data.cid,
                }).then((res3) => {
                  if (res3 !== undefined && res3.status === "success") {
                    setSTATUS(res3.data.status);
                  }
                });
              }
            }
          );
        }
      })
      .catch((res) => console.log(res));
  }, []);

  useEffect(() => {
    API.servicesPostData(APIURL.urlGetUserCid, { uid: uid }).then((res2) => {
      if (res2 !== undefined && res2.status === "success") {
        setValue("_rcid", res2.data.cid);

        // 사업자.status 가져오기
        API.servicesPostData(APIURL.urlGetCompanyDetail, {
          rcid: res2.data.cid,
        }).then((res3) => {
          if (res3 !== undefined && res3.status === "success") {
            setSTATUS(res3.data.status);
          }
        });
      }
    });
  }, [getValues("_rcid")]);

  const handleChangePasswd = () => {
    // 유효성 검사 수행
    const passwdValue = watch("_passwd");

    if (watch("_userid") === passwdValue) {
      TOA.servicesUseToast("아이디와 동일한 비밀번호 입니다.", "e");
      return;
    }
    // 길이 검사
    if (passwdValue.length < 6) {
      TOA.servicesUseToast("6자 이상으로 입력해주세요.", "e");
      return;
    }

    // 영문, 숫자, 특수문자 검사
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/g.test(passwdValue)) {
      TOA.servicesUseToast("영문, 숫자를 한 개 이상 입력해 주세요.", "e");
      return;
    }

    // 유효성 검사 통과 후 API 호출
    API.servicesPostData(APIURL.urlSetUser, {
      uid: uid,
      passwd: passwdValue,
    }).then((res) => {
      if (res.status === "success") {
        TOA.servicesUseToast("비밀번호 변경이 완료되었습니다.", "s");
      }
    });
  };

  const handleSetAfterRcid = async (resCompany) => {
    const GETCOMPANYDETAIL = await API.servicesPostData(
      APIURL.urlGetCompanyDetail,
      {
        rcid: resCompany.data.cid,
      }
    );

    const STATUS = RC.serviesCheckSafeNum(
      GETCOMPANYDETAIL.data.mobilenum,
      GETCOMPANYDETAIL.data.telnum,
      true,
      GETCOMPANYDETAIL.data.extnum
    );

    MO.servicesUseModalSetCid(
      `해당 사업자 관리번호의 내용을\n 덮어쓰기 하시겠습니까?`,
      `덮어쓰기를 누르시면 입력된\n 사업자 상세정보 데이터가 추가됩니다.`,
      () => {
        const payload = {
          ...GETCOMPANYDETAIL.data,
          name: resCompany.data.name,
          nick: GETCOMPANYDETAIL.data.name,
          mobile: GETCOMPANYDETAIL.data.mobilenum,
          mail: GETCOMPANYDETAIL.data.email,
          titleImg: GETCOMPANYDETAIL.data.titleImg,
          location: GETCOMPANYDETAIL.data.location,
          cdid: GETCOMPANYDETAIL.data.cdid,
        };
        dispatch(DATA.serviceGetedData(payload));

        API.servicesPostData(APIURL.urlSetCompanyDetail, {
          rcid: resCompany.data.cid,
          status: GETCOMPANYDETAIL.data.titleImg ? STATUS : 2,
        });

        // 선택 후 관리번호 저장 & 모달창 닫기
        setValue("_rcid", resCompany.data.cid);
        TOKEN.serviesSetToken(resCompany.data.cid);
        setClick(false);
      },
      () => {
        // 선택 후 관리번호 저장 & 모달창 닫기
        setValue("_rcid", resCompany.data.cid);
        API.servicesPostData(APIURL.urlSetCompanyDetail, {
          rcid: resCompany.data.cid,
          status: GETCOMPANYDETAIL.data.titleImg ? STATUS : 2,
        });
        TOKEN.serviesSetToken(resCompany.data.cid);
        setClick(false);
        RAN.serviesAfter1secondReload();
      }
    );
  };

  const handleRemove = async () => {
    if (!!getValues("_rcid")) {
      TOKEN.serviesSetToken(getValues("_rcid"));

      const GETCOMPANYDETAIL = await API.servicesPostData(
        APIURL.urlGetCompanyDetail,
        {
          rcid: getValues("_rcid"),
        }
      );

      console.log("GETCOMPANYDETAIL", GETCOMPANYDETAIL);

      const STATUS = RC.serviesCheckSafeNum(
        GETCOMPANYDETAIL.data.mobilenum,
        GETCOMPANYDETAIL.data.telnum,
        false,
        GETCOMPANYDETAIL.data.extnum
      );

      console.log("STATUS", STATUS);

      await API.servicesPostData(APIURL.urlSetCompanyDetail, {
        rcid: getValues("_rcid"),
        status: GETCOMPANYDETAIL.data.titleImg ? STATUS : 4,
      });

      await API.servicesPostData(APIURL.urlSetCompanyRemoveRuid, {
        cid: getValues("_rcid"),
      });

      setValue("_rcid", "");
    }
  };

  // 회원관리번호 > 검색 모달창에서 선택 함수
  const fnSelect = async (res) => {
    await API.servicesPostData(APIURL.urlSetCompany, {
      cid: res.cid,
      ruid: uid,
    }).then((SetCompanyData) => {
      if (SetCompanyData.emsg === "ruid duplicate") {
        return TOA.servicesUseToast("이미 연결된 회원 관리번호 입니다.", "s");
      }
      if (SetCompanyData.emsg === "ruid already connected to company") {
        return TOA.servicesUseToast("이미 연결된 사업자 관리번호 입니다.", "s");
      } else {
        handleSetAfterRcid(SetCompanyData);
      }
    });
  };

  return (
    <>
      <div className="formContentWrap">
        <div className="blockLabel">
          <span>활성화 계정</span>
        </div>
        <div className="formPaddingWrap">
          <input
            className="listSearchRadioInput"
            type="radio"
            checked={watch("_useFlag") == "1"}
            value="1"
            id="useFlag1"
            {...register("_useFlag", {
              onChange: fnSetUserData,
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag1">
            활성화
          </label>

          <input
            className="listSearchRadioInput"
            type="radio"
            checked={watch("_useFlag") == "0"}
            value="0"
            id="useFlag0"
            {...register("_useFlag", {
              onChange: fnSetUserData,
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag0">
            비활성화
          </label>
        </div>
      </div>

      <div className="formContentWrap">
        <label htmlFor="address" className=" blockLabel">
          <span>계정관리</span>
        </label>
        <ul className="detailContent">
          <li style={{ width: "50%" }}>
            <div>
              <span>아이디</span>
              <input
                type="text"
                id="userid"
                maxLength={16}
                {...register("_userid")}
                disabled={uid ? true : false}
              />
            </div>
          </li>
          <li style={{ width: "50%" }}>
            <div>
              <span>비밀번호</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <input
                  type="text"
                  id="passwd"
                  maxLength={16}
                  style={{
                    width: "86%",
                  }}
                  {...register("_passwd")}
                />
                {!!uid && (
                  <button
                    type="button"
                    onClick={handleChangePasswd}
                    className="formContentBtn"
                  >
                    변경
                  </button>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className="formContentWrap">
        <div
          className="blockLabel tipTh"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <span>사업자 관리번호</span>
          <i onClick={() => setManualview(!manualview)}>!</i>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {SetStatus(STATUS)}
          <input
            type="text"
            id="rcid"
            style={{
              width: "calc(100% - 156px)",
            }}
            disabled
            placeholder={!watch("_rcid") ? "사업자 회원이 아닙니다." : null}
            {...register("_rcid")}
          />

          <button
            type="button"
            onClick={() => {
              setClick(true);
            }}
            className="formContentBtn"
            style={{
              width: "50px",
              backgroundColor: "#757575",
              color: "rgb(255, 255, 255)",
            }}
          >
            검색
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="formContentBtn"
            style={{
              width: "50px",
              backgroundColor: "#da3933",
              color: "rgb(255, 255, 255)",
            }}
          >
            해지
          </button>

          {click && (
            <ServiceModalUserSetRcidAdd
              click={click}
              setClick={setClick}
              fn={fnSelect}
            />
          )}
        </div>
      </div>
      {manualview && <ManualView style={{ top: "104px", left: "154px" }} />}
    </>
  );
}
