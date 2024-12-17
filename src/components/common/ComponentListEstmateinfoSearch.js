import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as CLEAN from "../../service/useData/cleanup";

import * as PAGE from "../../action/page";

import ServiceModalEstiAndPropSearch from "../services/ServiceModalEstiAndPropSearch";

export default function ComponentListUserSearch({
  setList,

  LISTPROPSOSLINFO,
}) {
  // react-hook-form 라이브러리
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);
  const listFilterData = useSelector(
    (state) => state.page.listFilterData,
    shallowEqual
  );

  const { register, reset, getValues, setValue, handleSubmit } = useForm({});
  const [toClick, setToClick] = useState(false);
  const [fromClick, setFromClick] = useState(false);

  useEffect(() => {
    if (Object.keys(listFilterData).length > 2) {
      setValue("_fromUid", listFilterData.fromUid);
      setValue("_toUid", listFilterData.toUid);
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

  // submit 이벤트
  function fnSubmit(isNewSearch = false) {
    // if (isNewSearch) {
    //   setPage({ getPage: 0, activePage: 1 });
    // }

    const requestData = {
      offset: isNewSearch ? 0 : pageData.getPage,
      size: 15,
    };

    if (getValues("_fromUid")) {
      requestData.fromUid = getValues("_fromUid");
    }

    if (getValues("_toUid")) {
      requestData.toUid = getValues("_toUid");
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
    // userList([]);
    API.servicesPostData(
      !!LISTPROPSOSLINFO
        ? APIURL.urlListProposalInfo
        : APIURL.urlListEstimateInfo,
      requestData
    ).then((res) => {
      if (res.status === "fail") {
        if (isNewSearch) {
          TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        }
      }
      if (res.status === "success") {
        userList(res.data);
        dispatch(PAGE.setListPage(res.page));
        console.log("ddd", res);
      }
    });
  }

  const fnToSelect = (res) => {
    console.log(res);
    setValue("_toUid", res.uid);
    setToClick(false);
    fnSubmit(true);
  };

  const fnFromSelect = (res) => {
    setValue("_fromUid", res.uid);
    setFromClick(false);
    fnSubmit(true);
  };

  // 초기화 이벤트
  function handleReset(e) {
    API.servicesPostData(
      !!LISTPROPSOSLINFO
        ? APIURL.urlListProposalInfo
        : APIURL.urlListEstimateInfo,
      {
        offset: pageData.getPage,
        size: 15,
      }
    ).then((res) => {
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
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form
        className="formLayout"
        onSubmit={handleSubmit(() => fnSubmit(true))}
      >
        <fieldset>
          <div className="formWrap">
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel" id="fromUid">
                <span>작성자</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <input
                  type="text"
                  id="fromUid"
                  placeholder="견적서를 요청한 회원 관리번호를 검색할 때 입력해 주세요."
                  style={{
                    width: "80%",
                  }}
                  {...register("_fromUid", {
                    pattern: {
                      value: /[0-9]/,
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFromClick(true);
                  }}
                  style={{
                    width: "90px",
                    backgroundColor: "#757575",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  검색
                </button>
              </div>
            </div>

            {fromClick && (
              <ServiceModalEstiAndPropSearch
                click={fromClick}
                setClick={setFromClick}
                fn={fnFromSelect}
              />
            )}

            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel" id="toUid">
                <span>수령자</span>
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <input
                  type="text"
                  id="toUid"
                  placeholder="견적서를 요청받은 회원관리번호를 검색할 때 입력해 주세요."
                  style={{
                    width: "80%",
                  }}
                  {...register("_toUid", {
                    pattern: {
                      value: /[0-9]/,
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => {
                    setToClick(true);
                  }}
                  style={{
                    width: "90px",
                    backgroundColor: "#757575",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  검색
                </button>
              </div>
            </div>
          </div>
          {toClick && (
            <ServiceModalEstiAndPropSearch
              click={toClick}
              setClick={setToClick}
              fn={fnToSelect}
            />
          )}
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
  );
}
