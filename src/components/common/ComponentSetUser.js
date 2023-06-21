import { useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { servicesUseToast } from "../../Services/useData";
import { urlGetUser, urlSetUser, urlAdduser } from "../../Services/string";

export default function ComponentSetUser({ setUserData, userData, checkBtn }) {
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      _userrole: "ROLE_USER,ROLE_ADMIN",
      _useFlag: "1",
    },
  });
  const { uid } = useParams();
  const location = useLocation();
  const CHAGENT = location.pathname.includes("agent");

  // 회원활성화, 회원권한 상위 컴포넌트 전달
  function fnSetUserData(e) {
    setUserData({
      ...userData,
      useFlag: getValues("_useFlag"),
      userrole: getValues("_userrole"),
      userid: getValues("_userid"),
    });
  }

  useEffect(() => {
    if (!uid && !!watch("_userid") && !!watch("_passwd")) {
      servicesPostData(urlAdduser, {
        userid: watch("_userid"),
        passwd: watch("_passwd"),
      }).then(fnSetUserData());
    }
  }, [checkBtn]);

  // 회원활성화, 회원권한 기존 값 있다면 표시
  useLayoutEffect(() => {
    servicesPostData(urlGetUser, {
      uid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          setValue("_userrole", res.data.userrole.toString() || "ROLE_USER");
          setValue("_useFlag", res.data.useFlag.toString() || "1");
          setValue("_userid", res.data.userid.toString() || "");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  // 비밀번호 변경
  const handleChangePasswd = () => {
    servicesPostData(urlSetUser, {
      uid: uid,
      passwd: watch("_passwd"),
    }).then((res) => {
      if (res.status === "success") {
        servicesUseToast("비밀번호 변경이 완료되었습니다.", "s");
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
            {CHAGENT ? "승인" : "활성화"}
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
            {CHAGENT ? "퇴사" : "비활성화"}
          </label>
        </div>
      </div>

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>{CHAGENT ? "관리자레벨" : "회원 권한"}</span>
        </div>
        {CHAGENT ? (
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
            {/* 
            <input
              className="listSearchRadioInput"
              type="radio"
              checked={watch("_userrole") === "ROLE_USER,ROLE_ADMIN_AG"}
              value="ROLE_USER,ROLE_ADMIN_AG"
              id="OLE_ADMIN_AG"
              {...register("_userrole", {
                onChange: fnSetUserData,
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="OLE_ADMIN_AG">
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
            </label> */}
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
        <div className="blockLabel">
          <span>아이디</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            id="userid"
            disabled={CHAGENT ? false : true}
            {...register("_userid")}
          />
        </div>
      </div>

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>비밀번호 관리</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            id="passwd"
            style={
              !!uid
                ? {
                    width: "86%",
                  }
                : { width: "100%" }
            }
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
    </>
  );
}
