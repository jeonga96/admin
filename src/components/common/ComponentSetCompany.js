import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { servicesPostData } from "../../Services/importData";
import { urlGetCompany, urlGetUserCid } from "../../Services/string";

export default function ComponentSetCompany({ companyData, setCompanyData }) {
  const { cid } = useParams();
  // react-hook-form 라이브러리
  const { register, setValue } = useForm();

  // 계약자, 사업자 활성화, 회원연결 입력 이벤트
  const fnSetCompanyrData = (res) => {
    setCompanyData({ ...companyData, ...res });
  };

  // 회원연결 시 사용된 cid 중복 입력 불가능하도록 설정하는 조건
  const userLinkedCidCk = (e) => {
    // 입력한 uid와 연결된 cid가 있는지 확인 후 값이 없다면 입력
    // 현재 cid와 동일한 값을 입력했을 경우 입력 아닐 시 오류 확인
    servicesPostData(urlGetUserCid, { uid: e.target.value }).then((res) => {
      if (res.emsg === "process failed.") {
        fnSetCompanyrData({ [e.target.id]: e.target.value });
      } else {
        if (res.data.cid == cid) {
          fnSetCompanyrData({ [e.target.id]: e.target.value });
        } else {
          document.getElementById("ruid").focus();

          toast.warn("이미 연결된 회원 관리번호입니다.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
      return;
    });
  };

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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="formContentWrap">
        <div className="blockLabel">
          <span>계약자</span>
        </div>
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

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>사업자 활성화</span>
        </div>
        <div className="formPaddingWrap">
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
            <span>비활성화</span>
          </label>

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
        </div>
      </div>

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>회원 연결</span>
        </div>
        <div>
          <input
            className="formContentInput"
            type="text"
            name="_ruid"
            id="ruid"
            {...register("_ruid", {
              onBlur: userLinkedCidCk,
            })}
          />
        </div>
      </div>
    </>
  );
}
