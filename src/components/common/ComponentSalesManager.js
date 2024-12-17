import { useParams } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as RAN from "../../service/useData/rander";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as STR from "../../service/string/stringtoconst";
import * as ST from "../../service/useData/storage";

import * as DATA from "../../action/data";
import ServiceModalsealManager from "../services/ServiceModalsealManager";

export default function ComponentSalesManager() {
  const dispatch = useDispatch();
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const getedSummaryData = useSelector(
    (state) => state.data.getedSummaryData,
    shallowEqual
  );
  const location = useLocation();
  const [click, setClick] = useState(false);
  const { register, setValue } = useForm({});
  const CK_ADDPAGE = location.pathname.includes("add");

  const { cid } = useParams();
  // 부모에게 전달받은 setCompanyData 수정하는 함수

  // 영업 담당자 조회 선택 함수
  const fnSelectAgent = async (item) => {
    if (cid) {
      console.log(item.ruid);
      const response1 = await API.servicesPostData(APIURL.urlSetCompany, {
        cid: cid,
        sruid: item.ruid,
      });

      if (response1.status === "success") {
        // console.log("2");
        TOA.servicesUseToast("영업담당자가 변경되었습니다.", "s");
        RAN.serviesAfter1secondReload();
      } else {
        TOA.servicesUseToast(
          "저장에 문제가 생겼습니다. 같은 문제가 계속 발생하면 담당자에게 전달해 주십시오.",
          "e"
        );
      }
    } else {
      fnsetUserDetail(item);
      setClick(false);
    }
  };

  // 영업담당자, 영업담당자 연락처 수정
  const fnsetUserDetail = (daid) => {
    // fnSetCompanyrData({ sruid: daid.ruid });
    dispatch(
      DATA.serviceGetedSummaryData({ ...getedSummaryData, sruid: daid.ruid })
    );

    setValue("_name", daid.name);
    setValue("_tel", daid.adphonenum || daid.adsepphonenum);

    setValue(
      "_team",
      daid.managetype === "SD"
        ? `${daid.cname}`
        : daid.managetype === "AG"
        ? `${daid.afflname}  /  ${daid.cname}`
        : daid.afflname
    );
    setValue("_teamTel", daid.phonenum || daid.sepphonenum);
  };

  // 로그인된 uid 확인 & 처음 등록시 화면
  CUS.useMountEffect(() => {
    // 필수 페이지에서 등록할 때 로그인되어있는 회원 유저 정보가 저장되도록 코드 설정
    if (CK_ADDPAGE) {
      const userId = ST.servicesGetStorage(STR.USERID);
      API.servicesPostData(APIURL.urlListDistribution, {
        offset: 0,
        size: 15,
        userid: userId,
      }).then((res) => {
        if (res.status === "success") fnsetUserDetail(res?.data[0]);
      });
    }
    // 필수 입력페이지가 아닐 때
  }, []);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!getedSummaryData.sruid) return;

    const ckAppandbigdata = () => {
      if (!isInitialMount.current) return;
      isInitialMount.current = false;

      // 영업담당자가 지정되지 않은 경우만 렌더링
      if (!!getedData.email && !!getedSummaryData.ruid) {
        setValue("_name", "공사콕 앱에서 등록된 회원입니다.");
      } else if (!getedSummaryData.ruid) {
        setValue("_name", "대용량 데이터 추가로 입력된 회원입니다.");
      }
    };

    if (getedSummaryData?.sruid && !CK_ADDPAGE) {
      API.servicesPostData(APIURL.urlUserlist, {
        offset: 0,
        size: 15,
        uid: getedSummaryData.sruid,
      }).then((res) => {
        if (res.status === "fail") {
          ckAppandbigdata();
          return;
        }

        API.servicesPostData(APIURL.urlListDistribution, {
          offset: 0,
          size: 15,
          userid: res.data[0].userid,
        }).then((res2) => {
          fnsetUserDetail(!!res2.data ? res2.data[0] : []);
        });
      });
    } else {
      // urlGetCompany.sruid 정보가 없다면 앱, 대용량 데이타로 추가된 데이터인지 확인하는 함수
      ckAppandbigdata();
    }
  }, [getedSummaryData]);

  return (
    <fieldset id="CompanyDetail_4">
      <h3>영업 ( 담당 ) 자 정보</h3>

      <div className="formContentWrap" style={{ width: "50%" }}>
        <label htmlFor="team" className="blockLabel">
          <span>소속</span>
        </label>
        <div>
          <input type="team" id="team" disabled {...register("_team")} />
        </div>
      </div>

      <div className="formContentWrap" style={{ width: "50%" }}>
        <label htmlFor="teamTel" className="blockLabel">
          <span>소속 연락처</span>
        </label>
        <div>
          <input
            type="teamTel"
            id="teamTel"
            disabled
            {...register("_teamTel")}
          />
        </div>
      </div>

      <div className="formContentWrap" style={{ width: "50%" }}>
        <label htmlFor="name" className="blockLabel">
          <span>영업 ( 담당 ) 자</span>
        </label>
        <div style={{ display: "flex" }}>
          <input type="name" id="name" disabled {...register("_name")} />
          <button
            type="button"
            className="formContentBtn"
            style={{
              width: "160px",
              backgroundColor: "#757575",
              color: "#fff",
            }}
            onClick={() => setClick(!click)}
          >
            영업 담당자 조회
          </button>
          {click && (
            <ServiceModalsealManager
              fn={fnSelectAgent}
              setClick={setClick}
              click={click}
            />
          )}
        </div>
      </div>

      <div className="formContentWrap" style={{ width: "50%" }}>
        <label htmlFor="tel" className="blockLabel">
          <span>영업 ( 담당 ) 자 연락처</span>
        </label>
        <div>
          <input type="tel" id="tel" disabled {...register("_tel")} />
        </div>
      </div>
    </fieldset>
  );
}
