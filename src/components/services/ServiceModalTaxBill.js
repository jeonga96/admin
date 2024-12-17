import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

export default function ServiceModalTaxBill({ click, setClick, TBID }) {
  const { cid } = useParams();
  const { register, setValue, getValues, watch } = useForm({
    defaultValues: {
      _registration: "",
      _name: "",
      _address: "",
      _job: "",
      _email: "",
      _price: "",
      _industry: "",
    },
  });

  // 수정 모달인지 확인하는 함수
  const fnCheckModify = useCallback(() => {
    if (TBID) {
      API.servicesPostData(APIURL.urlsetTaxBill, {
        tbid: TBID,
      }).then((res) => {
        console.log(res.data);
        setValue(
          "_registration",
          String(res.data.registration)
            .replace(/[^0-9]/g, "")
            .replace(/([0-9]{3})([0-9]{2})([0-9]+)/, "$1-$2-$3")
            .replace(/--/g, "-")
        );
        setValue("_name", res.data.name);
        setValue("_industry", res.data.industry);
        setValue("_address", res.data.address);
        setValue("_job", res.data.job);
        setValue("_email", res.data.email);
        setValue(
          "_price",
          String(res.data.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      });
    }
  }, [TBID, setValue]);

  useEffect(() => {
    if (click) {
      fnCheckModify();
    }
  }, [click, fnCheckModify]);

  // // 세금계산서 내용 입력하여 post 보내는 함수
  const fnSubmit = (e) => {
    e.preventDefault();

    const registrationWithoutHyphens = getValues("_registration").replace(
      /-/g,
      ""
    );
    const priceWithoutCommas = String(getValues("_price").replace(/,/g, ""));
    // const priceWithoutCommas = String(Number(getValues("_price").replace(/,/g, "")));
    console.log(priceWithoutCommas);

    if (TBID !== undefined && TBID !== null) {
      API.servicesPostData(APIURL.urlsetTaxBill, {
        rcid: cid,
        tbid: TBID,
        registration: registrationWithoutHyphens,
        name: getValues("_name"),
        address: getValues("_address"),
        industry: getValues("_industry"),
        job: getValues("_job"),
        email: getValues("_email"),
        price: priceWithoutCommas,
        useFlag: 1,
      })
        .then(() => {
          console.log("수정 완료");
          setTimeout(() => {
            document.location.reload();
          }, 500);
        })
        .catch((error) => {
          console.error("에러", error);
        });
    } else {
      API.servicesPostData(APIURL.urladdTaxBill, {
        rcid: cid,
        registration: registrationWithoutHyphens,
        name: getValues("_name"),
        address: getValues("_address"),
        industry: getValues("_industry"),
        job: getValues("_job"),
        email: getValues("_email"),
        price: priceWithoutCommas,
        useFlag: 1,
      })
        .then(() => {
          console.log("추가 완료");
          setTimeout(() => {
            document.location.reload();
          }, 500);
        })
        .catch((error) => {
          console.error("에러", error);
        });
    }
  };

  return (
    click && (
      <div className="modal">
        <div
          className="modal-content"
          style={{ maxHeight: "40.25rem", width: "30rem", left: "35rem" }}
        >
          <div className="modal-header">
            <h2>세금계산서</h2>
          </div>
          <div id="modal-body">
            <div className="formContentWrap" style={{ width: "100%" }}>
              <label className="blockLabel">
                <span>사업자등록번호</span>
              </label>
              <div>
                <input
                  type="text"
                  id="registration"
                  maxLength="12"
                  value={
                    (watch("_registration") &&
                      watch("_registration")
                        .replace(/[^0-9]/g, "")
                        .replace(/([0-9]{3})([0-9]{2})([0-9]+)/, "$1-$2-$3")
                        .replace("--", "-")) ||
                    ""
                  }
                  {...register("_registration", {
                    pattern: {
                      value: /^[0-9]{3}-[0-9]{2}-[0-9]{5}/,
                      message: "형식에 맞지 않습니다.",
                    },
                  })}
                />
              </div>
            </div>
            <div className="formContentWrap" style={{ width: "100%" }}>
              <label className="blockLabel">
                <span>상호명 / 대표자명</span>
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  placeholder="상호명 / 대표자명 모두 입력해주세요."
                  {...register("_name")}
                />
              </div>
            </div>
            <div className="formContentWrap" style={{ width: "100%" }}>
              <label className="blockLabel">
                <span>주소</span>
              </label>
              <div>
                <input type="text" id="address" {...register("_address")} />
              </div>
            </div>
            <div className="formContentWrap" style={{ width: "100%" }}>
              <label className="blockLabel">
                <span>업태</span>
              </label>
              <div>
                <input type="text" id="industry" {...register("_industry")} />
              </div>
            </div>
            <div className="formContentWrap" style={{ width: "100%" }}>
              <label className="blockLabel">
                <span>종목</span>
              </label>
              <div>
                <input type="text" id="job" {...register("_job")} />
              </div>
            </div>
            <div className="formContentWrap" style={{ width: "100%" }}>
              <label className="blockLabel">
                <span>이메일</span>
              </label>
              <div>
                <input
                  type="text"
                  id="email"
                  placeholder="영문,숫자로만 입력해 주세요."
                  value={
                    (watch("_email") &&
                      watch("_email").replace(/[^\\!-z]/gi, "")) ||
                    ""
                  }
                  {...register("_email", {
                    pattern: {
                      value:
                        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                      message: "이메일 형식에 맞지 않습니다.",
                    },
                  })}
                />
              </div>
            </div>
            <div className="formContentWrap" style={{ width: "100%" }}>
              <label className="blockLabel">
                <span>금액</span>
              </label>
              <div>
                <input
                  type="text"
                  id="price"
                  maxLength="16"
                  value={
                    (watch("_price") &&
                      watch("_price")
                        .replace(/[^0-9]/g, "")
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                    ""
                  }
                  {...register("_price", {
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "숫자만 입력해 주세요.",
                    },
                  })}
                />
              </div>
            </div>
          </div>
          <div className="listSearchButtonWrap">
            <button
              onClick={(e) => {
                e.preventDefault();
                setClick(false);
              }}
            >
              {" "}
              취소
            </button>
            <button onClick={fnSubmit}>등록</button>
          </div>
        </div>
      </div>
    )
  );
}
