import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { urlSetCompany, urlGetCompany } from "../../Services/string";

export default function ComponentSetCompany({ companyData, setCompanyData }) {
  const { cid } = useParams();

  // react-hook-form 라이브러리
  const {
    register,
    setValue,
    // formState: { isSubmitting, errors },
  } = useForm();

  function fnSetCompanyrData(res) {
    setCompanyData({ ...companyData, ...res });
  }

  // const [linkUid, setLinkUid] = useState("");
  const [useFlag, setUseFlag] = useState("1");
  // const [name, setName] = useState("");

  useEffect(() => {
    // 기본 회사정보 불러오기
    servicesPostData(urlGetCompany, {
      cid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          // setCompanyInfo(res.data);
          fnSetCompanyrData({
            name: res.data.name,
            ruid: res.data.ruid,
            useFlag: res.data.useFlag,
          });
          setValue("_name", res.data.name);
          setValue("_ruid", res.data.ruid);
        }
      })
      .catch((res) => console.log(res));
  }, []);

  return (
    <fieldset className="formContentWrapWithRadio">
      <div className="listSearchWrap">
        <div className="blockLabel">계약자</div>
        <div>
          <input
            className="formContentInput"
            type="text"
            name="_name"
            id="name"
            {...register("_name", {
              onChange: (e) => {
                fnSetCompanyrData({ [e.target.id]: e.target.value });
              },
            })}
          />
        </div>
      </div>

      <div className="listSearchWrap">
        <div className="blockLabel">사업자 활성화</div>
        <div className="formContentWrapWithRadioValue">
          <input
            className="listSearchRadioInput"
            type="radio"
            checked={companyData.useFlag == "1"}
            name="_useFlag"
            value="1"
            id="useFlag1"
            {...register("_useFlag", {
              onChange: (e) => {
                fnSetCompanyrData({ useFlag: e.target.value });
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag1">
            활성화
          </label>

          <input
            className="listSearchRadioInput"
            type="radio"
            checked={companyData.useFlag == "0"}
            name="_useFlag"
            value="0"
            id="useFlag0"
            {...register("_useFlag", {
              onChange: (e) => {
                fnSetCompanyrData({ useFlag: e.target.value });
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
        <div>
          <input
            className="formContentInput"
            type="text"
            name="_ruid"
            id="ruid"
            {...register("_ruid", {
              onChange: (e) => {
                fnSetCompanyrData({ [e.target.id]: e.target.value });
              },
            })}
          />
        </div>
      </div>
    </fieldset>
  );
}
