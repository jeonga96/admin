import { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

import ServiceModalUserSetRcidAdd from "../services/ServiceModalCompanySetRuidAdd";

export default function ComponentSetUser({ setUserData, userData, checkBtn }) {
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      _useFlag: "1",
    },
  });
  const { uid } = useParams();
  const location = useLocation();
  const CK_AGENT = location.pathname.includes("agent");
  const [click, setClick] = useState(false);

  // 회원활성화, 회원권한 상위 컴포넌트 전달
  function fnSetUserData() {
    setUserData({
      ...userData,
      useFlag: getValues("_useFlag"),
      userrole: getValues("_userrole"),
      userid: getValues("_userid"),
    });
  }

  useEffect(() => {
    if (!uid && !!watch("_userid") && !!watch("_passwd")) {
      API.servicesPostData(STR.urlAdduser, {
        userid: watch("_userid"),
        passwd: watch("_passwd"),
      }).then(fnSetUserData());
    }
  }, [checkBtn]);

  // 회원활성화, 회원권한 기존 값 있다면 표시
  useLayoutEffect(() => {
    API.servicesPostData(STR.urlGetUser, {
      uid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          // uid에 연결된 cid 여부 체크
          API.servicesPostData(STR.urlGetUserCid, { uid: uid }).then((res2) => {
            if (res2.status === "success") {
              setValue("_rcid", res2.data.cid);
            }
          });
          setValue("_userrole", res.data.userrole.toString() || "ROLE_USER");
          setValue("_useFlag", res.data.useFlag.toString() || "1");
          setValue("_userid", res.data.userid.toString() || "");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  // 비밀번호 변경
  const handleChangePasswd = () => {
    API.servicesPostData(STR.urlSetUser, {
      uid: uid,
      passwd: watch("_passwd"),
    }).then((res) => {
      if (res.status === "success") {
        UD.servicesUseToast("비밀번호 변경이 완료되었습니다.", "s");
      }
    });
  };

  // 회원관리번호 > 검색 모달창에서 선택 함수
  const fnSelect = (res) => {
    console.log(res);
    // 선택한 사업자 관리번호가 이미 연결된 관리번호인지 확인
    API.servicesPostData(STR.urlGetCompany, { cid: res.cid }).then((res2) => {
      if (!res2.data.ruid) {
        setValue("_rcid", res.cid);
        setClick(false);
      } else if (!!res2.data.ruid) {
        UD.servicesUseToast("이미 연결된 회원 관리번호 입니다.", "s");
        setClick(false);
      }
      return;
    });
  };

  // 사업자관리번호 저장
  const fnLinkedRcid = (e) => {
    e.preventDefault();
    API.servicesPostData(STR.urlSetCompany, {
      cid: getValues("_rcid"),
      ruid: uid,
    }).then((res) => {
      if (res.status === "success") {
        UD.servicesUseToast("관리번호가 저장되었습니다.", "s");
      }
    });
  };

  return (
    <>
      <div className="formContentWrap">
        <div className="blockLabel">
          <span>회원 활성화</span>
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
            {CK_AGENT ? "승인" : "활성화"}
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
            {CK_AGENT ? "퇴사" : "비활성화"}
          </label>
        </div>
      </div>

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>{CK_AGENT ? "관리자레벨" : "회원 권한"}</span>
        </div>
        {CK_AGENT ? (
          <div className="formPaddingWrap">
            <input
              className="listSearchRadioInput"
              type="radio"
              checked={watch("_userrole") === "ROLE_USER,ROLE_ADMIN"}
              value="ROLE_USER,ROLE_ADMIN"
              id="ROLE_ADMIN"
              {...register("_userrole", {
                onChange: fnSetUserData,
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="ROLE_ADMIN">
              관리자
            </label>
            <input
              className="listSearchRadioInput"
              type="radio"
              checked={watch("_userrole") === "ROLE_USER,ROLE_ADMIN_AG"}
              value="ROLE_USER,ROLE_ADMIN_AG"
              id="ROLE_ADMIN_AG"
              {...register("_userrole", {
                onChange: fnSetUserData,
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="ROLE_ADMIN_AG">
              지점 (대리점) 관리
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              checked={watch("_userrole") === "ROLE_USER,ROLE_ADMIN_SD"}
              value="ROLE_USER,ROLE_ADMIN_SD"
              id="ROLE_ADMIN_SD"
              {...register("_userrole", {
                onChange: fnSetUserData,
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="ROLE_ADMIN_SD">
              지사 (총판) 관리
            </label>
          </div>
        ) : (
          <div className="formPaddingWrap">
            <input
              className="listSearchRadioInput"
              type="radio"
              checked={watch("_userrole") === "ROLE_USER"}
              value="ROLE_USER"
              id="ROLE_USER"
              {...register("_userrole", {
                onChange: fnSetUserData,
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="ROLE_USER">
              일반회원
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              checked={watch("_userrole") === "ROLE_USER,ROLE_ADMIN"}
              value="ROLE_USER,ROLE_ADMIN"
              id="ROLE_ADMIN"
              {...register("_userrole", {
                onChange: fnSetUserData,
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="ROLE_ADMIN">
              관리자
            </label>
          </div>
        )}
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
                disabled
                {...register("_userid", {})}
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
        <div className="blockLabel">
          <span>사업자 관리번호</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <input
            type="text"
            id="rcid"
            style={{
              width: "68%",
            }}
            disabled
            placeholder={!watch("_rcid") && "사업자 회원이 아닙니다."}
            {...register("_rcid")}
          />

          <button
            type="button"
            onClick={() => {
              setClick(true);
            }}
            className="formContentBtn"
            style={{
              width: "65px",
              backgroundColor: "#757575",
              color: "rgb(255, 255, 255)",
            }}
          >
            검색
          </button>

          <button
            type="button"
            onClick={fnLinkedRcid}
            className="formContentBtn"
            style={{
              width: "65px",
              backgroundColor: "rgb(155, 17, 30)",
              color: "rgb(255, 255, 255)",
            }}
          >
            저장
          </button>

          <ServiceModalUserSetRcidAdd
            click={click}
            setClick={setClick}
            fn={fnSelect}
          />
        </div>
      </div>
    </>
  );
}
