import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { urlSetCompany } from "../../Services/string";

import LayoutTopButton from "./LayoutTopButton";

export default function ComponentSetCompany() {
  const { cid } = useParams();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm();

  const [linkUid, setLinkUid] = useState("");
  const [useFlag, setUseFlag] = useState("1");
  const [passwd, setPasswd] = useState("");
  const [name, setName] = useState("");

  function serviesSetUser(useData) {
    servicesPostData(urlSetCompany, {
      cid: cid,
      ...useData,
    }).then((res) => console.log(res));
    alert("변경되었습니다.");
  }
  return (
    <div className="commonBox">
      <form className="formLayout">
        <fieldset className="formContentWrapWithRadio">
          <div className="listSearchWrap">
            <div className="blockLabel">계약자</div>
            <div className="formContentWrapWithTextValue">
              <input
                className="formContentInput"
                type="text"
                name="_name"
                id="name"
                value={name || ""}
                {...register("_name", {
                  onChange: (e) => {
                    setName(e.target.value);
                  },
                })}
              />
              <button
                name="_passwdSave"
                onClick={(e) => {
                  e.preventDefault();
                  serviesSetUser({ name: name, jtoken: "" });
                }}
              >
                저장
              </button>
            </div>
          </div>

          <div className="listSearchWrap">
            <div className="blockLabel">사업자 활성화</div>
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
            <div className="blockLabel">회원 연결</div>
            <div className="formContentWrapWithTextValue">
              <input
                className="formContentInput"
                type="text"
                name="_ruid"
                id="ruid"
                value={linkUid || ""}
                {...register("_ruid", {
                  onChange: (e) => {
                    setLinkUid(e.target.value);
                  },
                })}
              />
              <button
                name="_passwdSave"
                onClick={(e) => {
                  e.preventDefault();
                  serviesSetUser({ ruid: linkUid, jtoken: "" });
                }}
              >
                저장
              </button>
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
