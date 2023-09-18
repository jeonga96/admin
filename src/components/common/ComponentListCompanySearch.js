import { useEffect } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

export default function ComponentListCompanySearch({
  setCompanyList,
  setListPage,
  searchClick,
  setSearchClick,
  page,
}) {
  const { register, getValues, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      _useFlag: "1",
    },
  });

  useEffect(() => {
    // searchClick을 클릭한 (true) 상태에서 동작
    searchClick === true && SearchSubmit();
  }, [page.activePage || searchClick]);

  // 상위 컴포넌트에게 전달받은 useState의 set 함수
  // setCompanyList가 set으로 전달받은 후 사용하기 위해 && 사용
  const fncompanyList = (res) => {
    setCompanyList && setCompanyList(res);
  };
  const listPage = (res) => {
    setListPage && setListPage(res);
  };

  // submit 이벤트
  function SearchSubmit() {
    API.servicesPostData(STR.urlCompanylist, {
      offset: page.getPage,
      size: 15,
      cid: getValues("_cid"),
      cdname: getValues("_cdname"),
      name: getValues("_name"),
      registration: getValues("_registration"),
      telnum: getValues("_telnum"),
      status: getValues("_status"),
      useFlag: getValues("_useFlag"),
      createTime: !!watch("_createTime")
        ? UD.serviesDatetoISOString(getValues("_createTime"))
        : "",
    }).then((res) => {
      if (res.status === "fail") {
        UD.servicesUseToast("검색하신 데이터가 없습니다.", "e");
      }
      if (res.status === "success") {
        console.log("page", res, getValues("_status"));
        fncompanyList(res.data);
        listPage(res.page);
        setSearchClick(true);
        UD.servicesUseToast("완료되었습니다.", "s");
      }
    });
  }

  // 초기화 이벤트
  function onResetHandle(e) {
    reset();
    setSearchClick(false);
    SearchSubmit();
  }

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form
        className="listSearchForm formLayout"
        onSubmit={handleSubmit(SearchSubmit)}
      >
        <div className="listSearchWrap">
          <label className="blockLabel" htmlFor="cid">
            <span>사업자 관리번호</span>
          </label>
          <div>
            <input
              type="text"
              id="cid"
              placeholder="사업자 관리번호를 입력해 주세요."
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
          <label className="blockLabel" htmlFor="cdname">
            <span>사업자명</span>
          </label>
          <div>
            <input
              type="text"
              id="cdname"
              placeholder="사업자명을 입력해 주세요."
              {...register("_cdname")}
            />
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel" htmlFor="registration">
            <span>사업자 등록번호</span>
          </label>
          <div>
            <input
              type="text"
              id="registration"
              placeholder="사업자 등록번호를 입력해 주세요."
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

        <div className="listSearchWrap">
          <label className="blockLabel" htmlFor="telnum">
            <span>연락처 번호</span>
          </label>
          <div>
            <input
              type="text"
              id="telnum"
              placeholder="연락처 번호를 입력해 주세요."
              maxLength={14}
              value={
                (watch("_telnum") &&
                  watch("_telnum")
                    .replace(/[^0-9]/g, "")
                    .replace(
                      /(^02|^0505|^0507|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                      "$1-$2-$3"
                    )
                    .replace("--", "-")) ||
                ""
              }
              {...register("_telnum")}
            />
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel" htmlFor="name">
            <span>계약자</span>
          </label>
          <div>
            <input
              type="text"
              id="name"
              placeholder="계약자를 입력해 주세요."
              {...register("_name")}
            />
          </div>
        </div>

        <div className="listSearchWrap">
          <div className="blockLabel">
            <span>계약관리</span>
          </div>
          <div>
            <input
              className="listSearchRadioInput"
              type="radio"
              id="useFlag0"
              value="0"
              checked={watch("_useFlag") === "0"}
              {...register("_useFlag")}
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag0">
              해지
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
              정상
            </label>
          </div>
        </div>

        <div className="listSearchWrap">
          <div className="blockLabel">
            <span>회원상태</span>
          </div>
          <div>
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
              id="status0"
              value="0"
              checked={watch("_status") === "0"}
              {...register("_status")}
            />
            <label className="listSearchRadioLabel" htmlFor="status0">
              거절
            </label>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>계약일</span>
          </label>
          <div>
            <input
              id="createTime"
              type="date"
              date="yyyy/mm/dd"
              {...register("_createTime")}
            ></input>
          </div>
        </div>

        <div className="listSearchButtonWrap">
          <button type="reset" value="초기화" onClick={onResetHandle}>
            초기화
          </button>
          <button type="submit" value="검색">
            검색
          </button>
        </div>
      </form>
    </div>
  );
}
