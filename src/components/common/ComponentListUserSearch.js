import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as CLEAN from "../../service/useData/cleanup";
import * as FM from "../../service/useData/format";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

import * as PAGE from "../../action/page";

export default function ComponentListUserSearch({ setUserList }) {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  const listFilterData = useSelector(
    (state) => state.page.listFilterData,
    shallowEqual
  );

  // react-hook-form 라이브러리
  const { register, setValue, getValues, watch, reset, handleSubmit } = useForm(
    {
      defaultValues: {
        _userrole: "ROLE_USER",
        _useFlag: "1",
      },
    }
  );
  const watchedMobile = watch("_mobile");

  useEffect(() => {
    if (watchedMobile) {
      let value = watchedMobile.replace(/\D/g, "");
      if (value.length === 11) {
        value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      } else if (value.length === 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      } else if (value.length === 8) {
        value = value.replace(/(\d{4})(\d{4})/, "$1-$2");
      }

      setValue("_mobile", value);
    }
  }, [watchedMobile]);

  // listFilterData에 입력된 내용이 있다면 필터 검색창에 setting & submit
  useEffect(() => {
    if (Object.keys(listFilterData).length > 4) {
      setValue("_uid", listFilterData.uid);
      setValue("_userid", listFilterData.userid);
      setValue("_name", listFilterData.name);
      setValue("_userrole", listFilterData.userrole);
      setValue("_mobile", listFilterData.mobile);
      setValue(
        "_createTime",
        listFilterData.createTime && listFilterData.createTime.split("T")[0]
      );
      setValue("_isCid", listFilterData.isCid);
      setValue("_useFlag", listFilterData.useFlag);
      SearchSubmit();
    } else {
      SearchSubmit();
    }
  }, [pageData.getPage]);

  // 상위 컴포넌트에게 전달받은 useState의 set 함수
  // setUserList가 set으로 전달받은 후 사용하기 위해 && 사용
  const fnuserList = (res) => {
    setUserList(res);
  };

  // submit 이벤트
  function SearchSubmit(isNewSearch = false) {
    // if (isNewSearch) {
    //   setPage({ getPage: 0, activePage: 1 });
    // }

    const requestData = {
      offset: isNewSearch ? 0 : pageData.getPage,
      size: 15,
    };

    if (getValues("_uid")) {
      requestData.uid = getValues("_uid");
    }

    if (getValues("_userid")) {
      requestData.userid = getValues("_userid");
    }

    if (getValues("_name")) {
      requestData.name = getValues("_name");
    }

    if (getValues("_userrole")) {
      requestData.userrole = getValues("_userrole");
    }

    if (getValues("_mobile")) {
      const number = watch("_mobile").replace("-", "");
      requestData.mobile = FM.serviesFormatPhoneNumber(number);
    }

    if (getValues("_createTime")) {
      requestData.createTime = FM.serviesDatetoISOString(
        getValues("_createTime")
      );
    }

    if (getValues("_isCid")) {
      requestData.isCid = getValues("_isCid");
    }

    if (getValues("_useFlag")) {
      requestData.useFlag = getValues("_useFlag");
    }

    // input에 입력 값이 있다면 offset을 0으로 검색
    if (isNewSearch === true) {
      requestData.offset = 0;
      dispatch(
        PAGE.setPage({
          getPage: requestData.offset,
          activePage: requestData.offset / 15 + 1,
        })
      );
    }

    dispatch(PAGE.setListFilter(requestData));
    // fnuserList([]);
    // API 호출을 수행합니다.
    API.servicesPostData(APIURL.urlUserlist, requestData).then((res) => {
      if (res.status === "fail") {
        TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        onResetHandle();
      }
      if (res.status === "success") {
        fnuserList(res.data);
        dispatch(PAGE.setListPage(res.page));

        if (isNewSearch && res.page.length === 0) {
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
    CLEAN.serviesPaginationCleanup(dispatch);
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
            <label>
              <span>관리번호</span>
            </label>
            <div>
              <input
                type="text"
                id="uid"
                {...register("_uid", {
                  pattern: {
                    value: /[0-9]/,
                    message: "숫자만 입력할 수 있습니다.",
                  },
                })}
              />
            </div>
          </div>

          <div className="listSearchWrap">
            <label>
              <span>아이디</span>
            </label>
            <div>
              <input type="text" id="userid" {...register("_userid")} />
            </div>
          </div>

          <div className="listSearchWrap">
            <label>
              <span>이름</span>
            </label>
            <div>
              <input type="text" id="name" {...register("_name")} />
            </div>
          </div>

          <div className="listSearchWrap">
            <div>
              <span>회원 권한</span>
            </div>
            <div
              className="listSearchButtonWrap"
              style={{
                marginTop: "0",
                backgroundColor: "#fff",
                height: "28px",
                borderRadius: "2px",
              }}
            >
              <input
                className="listSearchRadioInput"
                type="radio"
                id="userroleUser"
                value="ROLE_USER"
                checked={watch("_userrole") == "ROLE_USER"}
                {...register("_userrole")}
              />
              <label className="listSearchRadioLabel" htmlFor="userroleUser">
                전체
              </label>

              <input
                className="listSearchRadioInput"
                type="radio"
                id="userroleAdmin"
                value="ROLE_USER,ROLE_ADMIN"
                checked={watch("_userrole") === "ROLE_USER,ROLE_ADMIN"}
                {...register("_userrole")}
              />
              <label className="listSearchRadioLabel" htmlFor="userroleAdmin">
                관리자
              </label>
            </div>
          </div>
        </div>

        {/* 주요 검색창 아래 부분 ====================================================================== */}
        <div className="SearchFormNewSub">
          <div className="listSearchWrap">
            <label className="blockLabel listLabelNew" htmlFor="mobile">
              <span>휴대폰</span>
            </label>
            <div>
              <input
                type="text"
                id="mobile"
                maxLength="13"
                {...register("_mobile")}
              />
            </div>
          </div>

          <div className="listSearchWrap">
            <label className="blockLabel listLabelNew">
              <span>계약일</span>
            </label>
            <div>
              <input
                type="date"
                id="createTime"
                {...register("_createTime", {
                  onChange: (e) => {
                    const pickDate = new Date(e.target.value);
                    setValue(
                      "_createTime",
                      pickDate.toISOString().split("T")[0]
                    );
                  },
                })}
              />
            </div>
          </div>

          {/* listSearchWrap의 마지막칸 혹은 마지막 두칸은 style={{ border: "none" }}를 작성 */}
          <div className="listSearchWrap" style={{ border: "none" }}>
            <div className="blockLabel listLabelNew">
              <span>회원정보</span>
            </div>

            <div className="listSearchButtonWrap">
              <input
                className="listSearchRadioInput"
                type="radio"
                id="isCid0"
                value="0"
                {...register("_isCid")}
              />
              <label className="listSearchRadioLabel" htmlFor="isCid0">
                일반회원
              </label>
              <input
                className="listSearchRadioInput"
                type="radio"
                id="isCid1"
                value="1"
                {...register("_isCid")}
              />
              <label className="listSearchRadioLabel" htmlFor="isCid1">
                사업자회원
              </label>
            </div>
          </div>

          <div className="listSearchWrap" style={{ border: "none" }}>
            <div className="blockLabel listLabelNew">
              <span>활성화 계정</span>
            </div>
            <div className="listSearchButtonWrap">
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
            </div>
          </div>
        </div>

        <div className="listSearchButtonWrap">
          <button
            type="reset"
            value="초기화"
            onClick={(e) => {
              e.preventDefault();
              onResetHandle();
            }}
          >
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
