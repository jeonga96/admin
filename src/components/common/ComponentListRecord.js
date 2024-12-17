import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as FM from "../../service/useData/format";
import * as CUS from "../../service/customHook";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as CLEAN from "../../service/useData/cleanup";

import * as PAGE from "../../action/page";

export default function ComponentListUserSearch({ setList, COMPANY, cid }) {
  // react-hook-form 라이브러리
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);
  const listFilterData = useSelector(
    (state) => state.page.listFilterData,
    shallowEqual
  );

  const { register, watch, reset, getValues, setValue, handleSubmit } = useForm(
    {}
  );

  CUS.useCleanupEffect(() => {
    if (Object.keys(listFilterData).length > 2) {
      setValue("_recordName", listFilterData.recordName);
      fnSubmit();
    } else {
      fnSubmit();
    }
  }, [pageData.activePage]);

  // 상위 컴포넌트에게 전달받은 useState의 set 함수
  // setUserList가 set으로 전달받은 후 사용하기 위해 && 사용
  const userList = (res) => {
    setList && setList(res);
  };
  console.log(getValues("_date"));
  console.log(getValues("_time"));

  // submit 이벤트
  function fnSubmit(isNewSearch = false) {
    // if (isNewSearch) {
    //   setPage({ getPage: 0, activePage: 1 });
    // }

    const requestData = {
      offset: isNewSearch ? 0 : pageData.getPage,
      size: 15,
      category: "통화녹취",
      cid: cid,
    };

    if (getValues("_recordName")) {
      requestData.recordName = getValues("_recordName");
    }
    if (getValues("_date")) {
      requestData.telRecordTime = `${getValues("_date")} ${getValues("_time")}`;
    }
    if (getValues("_cname")) {
      requestData.cname = getValues("_cname");
    }
    if (getValues("_cid")) {
      requestData.cid = getValues("_cid");
    }

    if (isNewSearch === true) {
      // input에 입력 값이 있다면 offset을 0으로 검색
      requestData.offset = 0;
      dispatch(
        PAGE.setPage({
          getPage: requestData.offset,
          activePage: requestData.offset / 15 + 1,
        })
      );
    }

    dispatch(PAGE.setListFilter(requestData));
    API.servicesPostData(APIURL.urlListRecord, requestData).then((res) => {
      if (res.status === "fail") {
        if (isNewSearch) {
          TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        }
      }
      if (res.status === "success") {
        userList(res.data);
        dispatch(PAGE.setListPage(res.page));
      }
    });
  }

  // 초기화 이벤트
  function handleReset(e) {
    API.servicesPostData(APIURL.urlListRecord, {
      offset: pageData.getPage,
      size: 15,
      category: "통화녹취",
    }).then((res) => {
      if (res.status === "fail") {
        alert("초기화가 완료되지 않았습니다.");
      }
      if (res.status === "success") {
        userList(res.data);
        dispatch(PAGE.setListPage(res.page));

        reset();
        CLEAN.serviesPaginationCleanup(dispatch);
      }
    });
  }

  return (
    !COMPANY && (
      <div className="commonBox">
        <h3 className="blind">사업자관리 검색 필터</h3>
        <form
          className="formLayout"
          onSubmit={handleSubmit(() => fnSubmit(true))}
        >
          <fieldset>
            <div className="listSearchForm SearchFormNew">
              <div className="listSearchWrap">
                <label htmlFor="recordName">
                  <span>녹취자 이름</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="recordName"
                    {...register("_recordName", {
                      pattern: {
                        value: /[0-9]/,
                        message: "숫자만 입력할 수 있습니다.",
                      },
                    })}
                  />
                </div>
              </div>

              <div className="listSearchWrap">
                <label htmlFor="cname">
                  <span>상호명</span>
                </label>

                <div>
                  <input type="text" id="cname" {...register("_cname")} />
                </div>
              </div>

              <div className="listSearchWrap">
                <label htmlFor="cid">
                  <span>사업자 관리번호</span>
                </label>

                <div>
                  <input type="text" id="cid" {...register("_cid")} />
                </div>
              </div>

              <div className="listSearchWrap">
                <label htmlFor="telnum">
                  <span>녹취일</span>
                </label>

                <div>
                  <input type="date" id="date" {...register("_date")} />
                  <input type="time" id="time" {...register("_time")} />
                </div>
              </div>
            </div>
          </fieldset>

          <div className="listSearchButtonWrap">
            <button type="reset" value="초기화" onClick={handleReset}>
              초기화
            </button>
            <button type="submit" value="검색">
              검색
            </button>
          </div>
        </form>
      </div>
    )
  );
}
