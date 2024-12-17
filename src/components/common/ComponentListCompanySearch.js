import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as FM from "../../service/useData/format";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

import * as PAGE from "../../action/page";

export default function ComponentListCompanySearch({ setCompanyList }) {
  const { register, getValues, watch, reset, setValue, handleSubmit } = useForm(
    {
      defaultValues: {
        _useFlag: "",
      },
    }
  );
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);
  const listFilterData = useSelector(
    (state) => state.page.listFilterData,
    shallowEqual
  );

  // searchClick을 클릭한 (true) 상태에서 동작
  useEffect(() => {
    if (Object.keys(listFilterData).length > 2) {
      setValue("_cid", listFilterData.cid);
      setValue("_cdname", listFilterData.cdname);
      setValue("_name", listFilterData.name);
      setValue("_registration", listFilterData.registration);
      setValue("_telnum", listFilterData.telnum);
      setValue("_status", listFilterData.status);
      setValue("_useFlag", listFilterData.useFlag);
      setValue("_taxBillApply", listFilterData.taxBillApply);
      setValue("_isGongsa", listFilterData.isGongsa);
      setValue("_remarks", listFilterData.remarks);
      setValue("_customerType", listFilterData.customerType);
      setValue("_adressSearch", listFilterData.adressSearch);
      setValue(
        "_createTime",
        listFilterData.createTime && listFilterData.createTime.split("T")[0]
      );
      SearchSubmit();
    } else {
      SearchSubmit();
    }
  }, [pageData.activePage]);

  // 상위 컴포넌트에게 전달받은 useState의 set 함수
  // setCompanyList가 set으로 전달받은 후 사용하기 위해 && 사용
  const fncompanyList = (res) => {
    setCompanyList && setCompanyList(res);
  };

  // submit 이벤트
  function SearchSubmit(isNewSearch = false) {
    const requestData = {
      offset: isNewSearch ? 0 : pageData.getPage,
      size: 15,
    };

    if (getValues("_cid")) {
      requestData.cid = getValues("_cid");
    }

    if (getValues("_cdname")) {
      requestData.cdname = getValues("_cdname");
    }

    if (getValues("_name")) {
      requestData.name = getValues("_name");
    }

    if (getValues("_registration")) {
      requestData.registration = getValues("_registration");
    }

    if (getValues("_telnum")) {
      const number = watch("_telnum").replace("-", "");
      requestData.telnum = FM.serviesFormatPhoneNumber(number);
    }

    if (getValues("_status")) {
      requestData.status = getValues("_status");
    }

    if (getValues("_adressSearch")) {
      requestData.adressSearch = getValues("_adressSearch");
    }

    if (getValues("_useFlag")) {
      requestData.useFlag = getValues("_useFlag");
    }

    if (getValues("_customerType")) {
      requestData.customerType = getValues("_customerType");
    }

    if (getValues("_createTime")) {
      requestData.createTime = FM.serviesDatetoISOString(
        getValues("_createTime")
      );
    }

    if (getValues("_taxBillApply")) {
      requestData.taxBillApply = getValues("_taxBillApply");
    }

    if (getValues("_srname")) {
      requestData.srname = getValues("_srname");
    }

    if (getValues("_isGongsa")) {
      requestData.isGongsa = getValues("_isGongsa");
    }

    if (getValues("_remarks")) {
      requestData.remarks = getValues("_remarks");
    }

    dispatch(PAGE.setListFilter(requestData));
    console.log(requestData);
    console.log(getValues("_telnum"));

    // API 호출을 수행합니다.
    API.servicesPostData(APIURL.urlCompanylist, requestData).then((res) => {
      if (res.status === "fail") {
        if (isNewSearch) {
          TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
          onResetHandle();
        }
      }
      if (res.status === "success") {
        const uniqueData = res.data.filter(
          (v, i, a) => a.findIndex((t) => t.cid === v.cid) === i
        );

        fncompanyList(uniqueData);
        dispatch(PAGE.setListPage(res.page));

        if (isNewSearch && uniqueData.length === 0) {
          TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        } else if (isNewSearch) {
          TOA.servicesUseToast("완료되었습니다.", "s");
        }
      }
    });
  }

  // 초기화 이벤트
  function onResetHandle(e) {
    reset();
    SearchSubmit();
  }

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form
        className="formLayout"
        onSubmit={handleSubmit(() => SearchSubmit(true))}
      >
        <div className="listSearchForm SearchFormNew">
          <div className="listSearchWrap">
            <label htmlFor="cid">
              <span>사업자 관리번호</span>
            </label>
            <div>
              <input
                type="text"
                id="cid"
                {...register("_cid", {
                  pattern: {
                    value: /[0-9]/,
                    message: "숫자만 입력할 수 있습니다.",
                  },
                })}
              />
            </div>
          </div>

          <div className="listSearchWrap">
            <label htmlFor="cdname">
              <span>상호명</span>
            </label>

            <div>
              <input type="text" id="cdname" {...register("_cdname")} />
            </div>
          </div>

          <div className="listSearchWrap">
            <label htmlFor="name">
              <span>계약자</span>
            </label>

            <div>
              <input type="text" id="name" {...register("_name")} />
            </div>
          </div>

          <div className="listSearchWrap">
            <label htmlFor="telnum">
              <span>연락처 번호</span>
            </label>

            <div>
              <input
                type="text"
                id="telnum"
                maxLength={14}
                value={
                  (watch("_telnum") &&
                    FM.serviesFormatPhoneNumber(watch("_telnum"))) ||
                  ""
                }
                {...register("_telnum")}
              />
            </div>
          </div>
        </div>

        {/* 주요 검색창 아래 부분 ====================================================================== */}

        <div className="SearchFormNewSub">
          {/* 활성화 계정 */}
          <div className="listSearchWrap">
            <div className="blockLabel listLabelNew">
              <span>활성화 계정</span>
            </div>
            <div className="listSearchButtonWrap">
              <input
                className="listSearchRadioInput"
                type="radio"
                id="useFlag0"
                value="0"
                checked={watch("_useFlag") === "0"}
                {...register("_useFlag")}
              />
              <label className="listSearchRadioLabel" htmlFor="useFlag0">
                비활성화
              </label>
              <input
                className="listSearchRadioInput"
                type="radio"
                id="useFlag1"
                value="1"
                checked={watch("_useFlag") === "1"}
                {...register("_useFlag")}
              />
              <label className="listSearchRadioLabel" htmlFor="useFlag1">
                활성화
              </label>
            </div>
          </div>

          {/* 계약일 */}
          <div className="listSearchWrap">
            <label className="blockLabel listLabelNew" htmlFor="createTime">
              <span>계약일</span>
            </label>

            <div>
              <input
                id="createTime"
                type="date"
                date="yyyy-mm-dd"
                {...register("_createTime")}
              ></input>
            </div>
          </div>

          {/*  주소 검색 */}
          <div className="listSearchWrap">
            <label className="blockLabel listLabelNew" htmlFor="adressSearch">
              <span>지역 ( 주소 ) 검색</span>
            </label>
            <div>
              <input
                type="text"
                id="adressSearch"
                placeholder="주소 사이에 띄어쓰기 해주세요. ( 예 : 서울시 양천구 ) ( 도 / 시 / 군 / 구 검색 가능 )"
                {...register("_adressSearch")}
              />
            </div>
          </div>

          {/* >사업자 등록번호 */}
          <div className="listSearchWrap">
            <label className="blockLabel listLabelNew" htmlFor="registration">
              <span>사업자 등록번호</span>
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
                {...register("_registration")}
              />
            </div>
          </div>

          {/* 가입자 구분  */}
          <div className="listSearchWrap">
            <div className="blockLabel listLabelNew">
              <span>가입자 구분 </span>
            </div>
            <div className="listSearchButtonWrap">
              <input
                type="radio"
                value="무료"
                id="무료"
                className="listSearchRadioInput customerTypeview_free"
                {...register("_customerType")}
              />
              <label htmlFor="무료" className="listSearchRadioLabel">
                무료
              </label>

              <div
                style={{
                  width: "1px",
                  backgroundColor: "rgba(0,0,0,0.15)",
                  height: "60%",
                  marginTop: "5px",
                }}
              ></div>

              <input
                type="radio"
                value="와해"
                id="와해"
                className="listSearchRadioInput  customerTypeview_wz"
                {...register("_customerType")}
              />
              <label htmlFor="와해" className="listSearchRadioLabel">
                와해
              </label>
              <input
                type="radio"
                value="와유"
                id="와유"
                className="listSearchRadioInput  customerTypeview_wz"
                {...register("_customerType")}
              />
              <label htmlFor="와유" className="listSearchRadioLabel">
                와유
              </label>

              <input
                type="radio"
                value="와가"
                id="와가"
                className="listSearchRadioInput  customerTypeview_wz"
                {...register("_customerType")}
              />
              <label htmlFor="와가" className="listSearchRadioLabel">
                와가
              </label>

              <div
                style={{
                  width: "1px",
                  backgroundColor: "rgba(0,0,0,0.15)",
                  height: "60%",
                  marginTop: "5px",
                }}
              ></div>

              <input
                type="radio"
                value="콕해"
                id="콕해"
                className="listSearchRadioInput customerTypeview_cok"
                {...register("_customerType")}
              />
              <label htmlFor="콕해" className="listSearchRadioLabel">
                콕해
              </label>

              <input
                type="radio"
                value="노출"
                id="노출"
                className="listSearchRadioInput customerTypeview_cok"
                {...register("_customerType")}
              />
              <label htmlFor="노출" className="listSearchRadioLabel">
                노출
              </label>

              <input
                type="radio"
                value="판매"
                id="판매"
                className="listSearchRadioInput  customerTypeview_cok"
                {...register("_customerType")}
              />
              <label htmlFor="판매" className="listSearchRadioLabel">
                판매
              </label>
              <input
                type="radio"
                value="배너"
                id="배너"
                className="listSearchRadioInput customerTypeview_cok"
                {...register("_customerType")}
              />
              <label htmlFor="배너" className="listSearchRadioLabel">
                배너
              </label>
            </div>
          </div>

          {/* 회원연결 */}
          <div className="listSearchWrap">
            <div className="blockLabel listLabelNew">
              <span>회원연결</span>
            </div>

            <div className="listSearchButtonWrap">
              <input
                className="listSearchRadioInput"
                type="radio"
                id="status2"
                value="2"
                checked={watch("_status") === "2"}
                {...register("_status")}
              />
              <label className="listSearchRadioLabel" htmlFor="status2">
                대기
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                id="status1"
                value="1"
                checked={watch("_status") === "1"}
                {...register("_status")}
              />
              <label className="listSearchRadioLabel" htmlFor="status1">
                완료
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                id="status3"
                value="3"
                checked={watch("_status") === "3"}
                {...register("_status")}
              />
              <label className="listSearchRadioLabel" htmlFor="status3">
                거절
              </label>

              <div
                style={{
                  width: "1px",
                  backgroundColor: "rgba(0,0,0,0.15)",
                  height: "60%",
                  marginTop: "5px",
                }}
              ></div>

              <input
                className="listSearchRadioInput"
                type="radio"
                id="status4"
                value="4"
                checked={watch("_status") === "4"}
                {...register("_status")}
              />
              <label className="listSearchRadioLabel" htmlFor="status4">
                생성
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                id="status5"
                value="5"
                checked={watch("_status") === "5"}
                {...register("_status")}
              />
              <label className="listSearchRadioLabel" htmlFor="status5">
                대용량
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                id="status6"
                value="6"
                checked={watch("_status") === "6"}
                {...register("_status")}
              />
              <label className="listSearchRadioLabel" htmlFor="status6">
                입력
              </label>
            </div>
          </div>

          {/* 공사업체 확인 */}
          <div className="listSearchWrap">
            <div className="blockLabel listLabelNew">
              <span>공사업체 확인</span>
            </div>
            <div className="listSearchButtonWrap">
              <input
                className="listSearchRadioInput"
                type="radio"
                id="_isGongsa1"
                value="1"
                checked={watch("_isGongsa") === "1"}
                {...register("_isGongsa")}
              />
              <label className="listSearchRadioLabel" htmlFor="_isGongsa1">
                예
              </label>
              <input
                className="listSearchRadioInput"
                type="radio"
                id="_isGongsa0"
                value="0"
                checked={watch("_isGongsa") === "0"}
                {...register("_isGongsa")}
              />
              <label className="listSearchRadioLabel" htmlFor="_isGongsa0">
                아니요
              </label>
            </div>
          </div>

          {/* 세금계산서 발급 */}
          <div className="listSearchWrap">
            <label className="blockLabel listLabelNew">
              <span>세금계산서 발급</span>
            </label>
            <div className="listSearchButtonWrap">
              <input
                className="listSearchRadioInput"
                type="radio"
                id="taxBillApplyY"
                value="Y"
                checked={watch("_taxBillApply") === "Y"}
                {...register("_taxBillApply")}
              />
              <label
                className="listSearchRadioLabel"
                style={{ outline: "0" }}
                htmlFor="taxBillApplyY"
              >
                발급
              </label>
              <input
                className="listSearchRadioInput"
                type="radio"
                id="taxBillApplyN"
                value="N"
                checked={watch("_taxBillApply") === "N"}
                {...register("_taxBillApply")}
              />
              <label
                className="listSearchRadioLabel"
                style={{ outline: "0" }}
                htmlFor="taxBillApplyN"
              >
                미발급
              </label>
            </div>
          </div>

          {/* >영업 담당자 */}
          <div className="listSearchWrap" style={{ border: "none" }}>
            <label className="blockLabel listLabelNew" htmlFor="srname">
              <span>영업 담당자</span>
            </label>
            <div>
              <input type="text" id="srname" {...register("_srname")} />
            </div>
          </div>

          {/* 비고 */}
          <div className="listSearchWrap" style={{ border: "none" }}>
            <label className="blockLabel listLabelNew" htmlFor="remarks">
              <span>비고</span>
            </label>

            <div>
              <input id="remarks" type="text" {...register("_remarks")}></input>
            </div>
          </div>
          {/* listSearchWrap의 마지막칸 혹은 마지막 두칸은 style={{ border: "none" }}를 작성 */}
        </div>
        {/* listSearchWrap 마지막 */}

        {/* 버튼 묶음 */}
        <div
          className="listSearchButtonWrap"
          style={{ padding: "10px", marginTop: "0" }}
        >
          <button
            type="reset"
            value="초기화"
            style={{ backgroundColor: "var(--color-bggray)" }}
            onClick={(e) => {
              e.preventDefault();
              onResetHandle();
            }}
          >
            초기화
          </button>
          <button
            type="submit"
            value="검색"
            style={{ backgroundColor: "var(--color-bggray)" }}
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
}
