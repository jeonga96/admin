import { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as STR from "../../service/string";
import * as UD from "../../service/useData";

export default function ServiceModalCustomer({ click, setClick, CCID }) {
  const { cid, uid } = useParams();
  const { register, setValue, getValues, watch } = useForm({});

  // 수정 모달인지 확인하는 함수
  const fnCheckModify = useCallback(() => {
    // CCID 값은 부모에게 전달 받았다.
    if (!!CCID) {
      API.servicesPostData(STR.urlGetCustomerConsult, {
        ccid: CCID,
      }).then((res) => {
        console.log(res.data.changeDate);

        setValue("_type", res.data.type);
        setValue("_addServices", res.data.addServices);
        setValue("_content", res.data.content);
        setValue("_realNumber", res.data.realNumber);
        setValue("_safeNumber", res.data.safeNumber);
        setValue("_writer", res.data.writer);
        setValue(
          "_changeDate",
          res.data.changeDate && res.data.changeDate.slice(0, 10)
        );
      });
    }
  }, []);

  // click이 변경될 때 fnCheckModify 함수 실행
  useEffect(() => {
    setValue("_type", "일반");
    if (click) {
      fnCheckModify();
    }
  }, [click, fnCheckModify]);

  // 고객상담 내용 입력하여 post 보내는 함수
  const fnSubmit = (e) => {
    e.preventDefault();
    // 변경 일자를 ISO 형식으로 변환
    let CHANGEDATE;
    let addData = {};
    let setData = {};

    const TODAYDATE = new Date().toISOString();
    if (!!getValues("_changeDate")) {
      CHANGEDATE = new Date(getValues("_changeDate")).toISOString();
    }
    // 수정 시 부모 컴포넌트에게 할당 받은 CCID를 사용하여 전달
    if (!!CCID) {
      setData = {
        ccid: CCID,
        type: getValues("_type"),
        addServices: getValues("_addServices") || "",
        content: getValues("_content"),
        realNumber: getValues("_realNumber"),
        safeNumber: getValues("_safeNumber"),
        writer: localStorage.getItem(STR.WRITER),
        useFlag: 1,
        changeDate: !!CHANGEDATE ? CHANGEDATE : TODAYDATE,
      };
    } else {
      // CCID가 없을 시, 추가 등록 진행
      if (!!uid) {
        // useParams를 이용하여 uid 존재 확인
        addData = {
          uid: uid,
          type: getValues("_type"),
          addServices: getValues("_addServices") || "",
          content: getValues("_content"),
          realNumber: getValues("_realNumber"),
          safeNumber: getValues("_safeNumber"),
          writer: localStorage.getItem(STR.WRITER),
          changeDate: !!CHANGEDATE ? CHANGEDATE : TODAYDATE,
        };
      } else if (!!cid) {
        // useParams를 이용하여 cid 존재 확인
        addData = {
          cid: cid,
          type: getValues("_type"),
          addServices: getValues("_addServices") || "",
          content: getValues("_content"),
          realNumber: getValues("_realNumber"),
          safeNumber: getValues("_safeNumber"),
          writer: localStorage.getItem(STR.WRITER),
          changeDate: !!CHANGEDATE ? CHANGEDATE : TODAYDATE,
        };
      }
    }

    API.servicesPostData(
      STR.urlSetCustomerConsult,
      !!CCID ? setData : addData
    ).then(() => {
      // 값 전송 후 모달 내부의 input 빈값으로 변경
      setClick(false);

      setValue("_content", "");
      setValue("_type", "일반");
      setValue("_realNumber", "");
      setValue("_safeNumber", "");
      setValue("_changeDate", TODAYDATE);
      if (!!CCID) {
        setTimeout(() => {
          document.location.reload();
        }, 1000);
      }
    });
  };

  return (
    click && (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>고객상담 등록</h2>
          </div>

          <div id="modal-body">
            <div className="formContentWrap" style={{ width: "100%" }}>
              <div className="blockLabel">
                <span>상담유형</span>
              </div>
              <div className="formPaddingWrap">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  name="counselingType"
                  value="일반"
                  id="nonm"
                  {...register("_type")}
                />
                <label className="listSearchRadioLabel" htmlFor="nonm">
                  일반
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  name="counselingType"
                  value="요금"
                  id="fee"
                  {...register("_type")}
                />
                <label className="listSearchRadioLabel" htmlFor="fee">
                  요금
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  name="counselingType"
                  value="변경"
                  id="change"
                  {...register("_type")}
                />
                <label className="listSearchRadioLabel" htmlFor="change">
                  변경
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  name="counselingType"
                  value="민원"
                  id="complaint"
                  {...register("_type")}
                />
                <label className="listSearchRadioLabel" htmlFor="complaint">
                  민원
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  name="counselingType"
                  value="해지"
                  id="end"
                  {...register("_type")}
                />
                <label className="listSearchRadioLabel" htmlFor="end">
                  해지
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  name="counselingType"
                  value="기타"
                  id="etc"
                  {...register("_type")}
                />
                <label className="listSearchRadioLabel" htmlFor="etc">
                  기타
                </label>
              </div>
            </div>

            <div className="formContentWrap" style={{ width: "100%" }}>
              <div className="blockLabel">
                <span>추가 서비스</span>
              </div>
              <div className="formPaddingWrap">
                <input
                  type="radio"
                  value="safetyNumber"
                  id="safetyNumber"
                  className="listSearchRadioInput"
                  {...register("_addServices")}
                />
                <label htmlFor="safetyNumber" className="listSearchRadioLabel">
                  안심번호
                </label>
                <input
                  type="radio"
                  value="event"
                  id="event"
                  className="listSearchRadioInput"
                  {...register("_addServices")}
                />
                <label htmlFor="event" className="listSearchRadioLabel">
                  이벤트
                </label>
              </div>
            </div>

            <div className="formContentWrap" style={{ width: "100%" }}>
              <div className="blockLabel">
                <span>안심번호 처리정보</span>
              </div>
              <ul className="detailContent">
                <li style={{ width: "40%" }}>
                  <div>
                    <span>착신번호</span>
                    <input
                      style={{ margin: "0" }}
                      type="text"
                      id="realNumber"
                      value={
                        (watch("_realNumber") &&
                          watch("_realNumber")
                            .replace(/[^0-9]/g, "")
                            .replace(
                              /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace("--", "-")) ||
                        ""
                      }
                      {...register("_realNumber")}
                    />
                  </div>
                </li>
                <li style={{ width: "40%" }}>
                  <div>
                    <span>안심번호</span>
                    <input
                      type="text"
                      id="safeNumber"
                      maxLength={14}
                      value={
                        (watch("_safeNumber") &&
                          watch("_safeNumber")
                            .replace(/[^0-9]/g, "")
                            .replace(
                              /(^[0-9]{4})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace("--", "-")) ||
                        ""
                      }
                      {...register("_safeNumber")}
                    />
                  </div>
                </li>
                <li style={{ width: "20%" }}>
                  <div>
                    <input
                      style={{ width: "100%" }}
                      type="date"
                      id="changeDate"
                      {...register("_changeDate")}
                    />
                  </div>
                </li>
              </ul>
            </div>

            <div className="formContentWrap" style={{ width: "100%" }}>
              <label htmlFor="remarks" className="blockLabel">
                <span>상담 내용</span>
              </label>
              <div>
                <textarea
                  className="section-content counseling-content"
                  id="content"
                  {...register("_content")}
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
              취소
            </button>
            <button onClick={fnSubmit}>등록</button>
          </div>
        </div>
      </div>
    )
  );
}
