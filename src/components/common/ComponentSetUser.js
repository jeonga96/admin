import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { urlGetUser, urlSetUser } from "../../Services/string";

export default function ComponentSetUser({ setUserData, userData }) {
  const { uid } = useParams();

  function fnSetUserData(res) {
    setUserData({ ...userData, ...res });
  }

  // react-hook-form 라이브러리
  const { register, setValue } = useForm();

  useEffect(() => {
    servicesPostData(urlGetUser, {
      uid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          setValue("_passwd", res.data.passwd || "");
          fnSetUserData({
            userrole: res.data.userrole,
            useFlag: res.data.useFlag,
          });
        }
      })
      .catch((res) => console.log(res));
  }, []);

  return (
    <fieldset className="formContentWrapWithRadio">
      <div className="listSearchWrap">
        <div className="blockLabel">회원 활성화</div>
        <div className="formContentWrapWithRadioValue">
          <input
            className="listSearchRadioInput"
            type="radio"
            checked={userData.useFlag == "1"}
            name="_useFlag"
            value="1"
            id="useFlag1"
            {...register("_useFlag", {
              onChange: (e) => {
                fnSetUserData({ useFlag: e.target.value });
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag1">
            활성화
          </label>

          <input
            className="listSearchRadioInput"
            type="radio"
            checked={userData.useFlag == "0"}
            name="_useFlag"
            value="0"
            id="useFlag0"
            {...register("_useFlag", {
              onChange: (e) => {
                fnSetUserData({ useFlag: e.target.value });
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag0">
            비활성화
          </label>
        </div>
      </div>

      <div className="listSearchWrap">
        <div className="blockLabel">회원 권한</div>
        <div className="formContentWrapWithRadioValue">
          <input
            className="listSearchRadioInput"
            type="radio"
            checked={userData.userrole === "ROLE_USER"}
            name="_userrole"
            value="ROLE_USER"
            id="ROLE_USER"
            {...register("_userrole", {
              onChange: (e) => {
                fnSetUserData({ userrole: e.target.value });
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="ROLE_USER">
            일반회원
          </label>

          <input
            className="listSearchRadioInput"
            type="radio"
            checked={userData.userrole === "ROLE_USER,ROLE_ADMIN"}
            name="_userrole"
            value="ROLE_USER,ROLE_ADMIN"
            id="ROLE_ADMIN"
            {...register("_userrole", {
              onChange: (e) => {
                fnSetUserData({ userrole: e.target.value });
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="ROLE_ADMIN">
            관리자
          </label>
        </div>
      </div>

      <div className="listSearchWrap">
        <div className="blockLabel">비밀번호 관리</div>
        <div>
          <input
            className="formContentInput"
            type="text"
            name="_passwd"
            id="passwd"
            {...register("_passwd", {
              onChange: (e) => {
                fnSetUserData({ passwd: e.target.value });
              },
            })}
          />
        </div>
      </div>
    </fieldset>
  );
}
