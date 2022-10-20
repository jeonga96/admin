import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { urlSetUserRole, urlSetUser } from "../../Services/string";

export default function ComponentSetUser() {
  const { uid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm();

  const [userrole, setUserrole] = useState("ROLE_USER");
  const [useFlag, setUseFlag] = useState("1");
  const [passwd, setPasswd] = useState("");
  function serviesSetUser(useData) {
    servicesPostData(urlSetUser, {
      uid: uid,
      ...useData,
    });
    alert("변경되었습니다.");
  }
  return (
    <div className="commonBox">
      <form className="formLayout">
        <fieldset className="formContentWrapWithRadio">
          <div className="listSearchWrap">
            <div className="blockLabel">회원 활성화</div>
            <div className="formContentWrapWithRadioValue">
              <input
                className="listSearchRadioInput"
                type="radio"
                checked={useFlag === "1"}
                name="_useFlag"
                value="1"
                id="useFlag1"
                {...register("_useFlag", {
                  onChange: (e) => {
                    setUseFlag(e.target.value);
                    serviesSetUser({ useFlag: e.target.value });
                  },
                })}
              />
              <label className="listSearchRadioLabel" htmlFor="useFlag1">
                활성화
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                checked={useFlag === "0"}
                name="_useFlag"
                value="0"
                id="useFlag0"
                {...register("_useFlag", {
                  onChange: (e) => {
                    setUseFlag(e.target.value);
                    serviesSetUser({ useFlag: e.target.value });
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
                checked={userrole === "ROLE_USER"}
                name="_userrole"
                value="ROLE_USER"
                id="ROLE_USER"
                {...register("_userrole", {
                  onChange: (e) => {
                    setUserrole(e.target.value);
                    serviesSetUser({ userrole: e.target.value });
                  },
                })}
              />
              <label className="listSearchRadioLabel" htmlFor="ROLE_USER">
                일반회원
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                checked={userrole === "ROLE_USER,ROLE_ADMIN"}
                name="_userrole"
                value="ROLE_USER,ROLE_ADMIN"
                id="ROLE_ADMIN"
                {...register("_userrole", {
                  onChange: (e) => {
                    setUserrole(e.target.value);
                    serviesSetUser({ userrole: e.target.value });
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
            <div className="formContentWrapWithTextValue">
              <input
                className="formContentInput"
                type="text"
                name="_passwd"
                id="passwd"
                value={passwd || ""}
                {...register("_passwd", {
                  onChange: (e) => {
                    setPasswd(e.target.value);
                  },
                })}
              />
              <button
                name="_passwdSave"
                onClick={(e) => {
                  e.preventDefault();
                  serviesSetUser({ passwd: passwd, jtoken: "" });
                }}
              >
                저장
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
