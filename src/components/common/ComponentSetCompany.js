import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

import ServiceModalCompanySetRuidAdd from "../services/ServiceModalCompanySetRuidAdd";

export default function ComponentSetCompany({ companyData, setCompanyData }) {
  const { cid } = useParams();
  // react-hook-form 라이브러리
  const { register, setValue, getValues } = useForm();
  const [click, setClick] = useState(false);

  // 계약자, 사업자 활성화, 회원연결 입력 이벤트
  const fnSetCompanyrData = (res) => {
    setCompanyData({ ...companyData, ...res });
  };

  const fnSelect = (res) => {
    API.servicesPostData(STR.urlGetUserCid, { uid: res.uid }).then((res2) => {
      console.log(res);
      if (res2.emsg === "process failed.") {
        // fnSetCompanyrData({ ruid: res.uid });
        setValue("_ruid", res.uid);
        setClick(false);
      } else {
        if (res2.data.cid === cid) {
          UD.servicesUseToast("기존에 연결된 회원 관리번호 입니다.", "s");
          setClick(false);
        } else {
          UD.servicesUseToast("이미 사용된 회원 관리번호입니다.");
        }
      }
      return;
    });
  };

  const fnSubmit = (e) => {
    e.preventDefault();

    API.servicesPostData(STR.urlSetCompany, {
      cid: cid,
      ruid: getValues("_ruid"),
    }).then((res) => {
      if (res.status === "success") {
        UD.servicesUseToast("관리번호가 저장되었습니다.", "s");
      }
    });
  };

  useLayoutEffect(() => {
    // 기본 회사정보 불러오기
    API.servicesPostData(STR.urlGetCompany, {
      cid: cid,
    })
      .then((res) => {
        if (res.status === "success") {
          fnSetCompanyrData({
            name: res.data.name,
            ruid: res.data.ruid,
            useFlag: String(res.data.useFlag) || "1",
          });
          setValue("_name", res.data.name);
          setValue("_ruid", res.data.ruid);
        }
      })
      .catch((res) => console.log(res));
  }, []);

  return (
    <>
      <div className="formContentWrap">
        <div className="blockLabel">
          <span>계약자</span>
        </div>
        <div>
          <input
            className="formContentInput"
            type="text"
            id="name"
            {...register("_name", {
              onChange: (e) => {
                fnSetCompanyrData({ [e.target.id]: e.target.value });
              },
            })}
          />
        </div>
      </div>

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>사업자 활성화</span>
        </div>
        <div className="formPaddingWrap">
          <input
            className="listSearchRadioInput"
            type="radio"
            checked={companyData.useFlag == "0"}
            value="0"
            id="useFlag0"
            {...register("_useFlag", {
              onChange: (e) => {
                fnSetCompanyrData({ useFlag: e.target.value });
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag0">
            <span>비활성화</span>
          </label>

          <input
            className="listSearchRadioInput"
            type="radio"
            checked={companyData.useFlag == "1"}
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
        </div>
      </div>

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>회원 관리번호</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <input
            type="text"
            id="ruid"
            style={{
              width: "68%",
            }}
            disabled
            {...register("_ruid")}
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
            onClick={fnSubmit}
            className="formContentBtn"
            style={{
              width: "65px",
              backgroundColor: "rgb(155, 17, 30)",
              color: "rgb(255, 255, 255)",
            }}
          >
            저장
          </button>

          <ServiceModalCompanySetRuidAdd
            click={click}
            setClick={setClick}
            fn={fnSelect}
          />
        </div>
      </div>
    </>
  );
}
