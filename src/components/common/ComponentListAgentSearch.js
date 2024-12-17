import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as PAGE from "../../action/page";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as CLEAN from "../../service/useData/cleanup";

export default function ComponentListAgentSearch({ setUserList }) {
  // react-hook-form 라이브러리
  const { register, getValues, setValue, watch, reset, handleSubmit } = useForm(
    {}
  );
  // const location = useLocation();
  const location = useLocation();
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);
  const listFilterData = useSelector(
    (state) => state.page.listFilterData,
    shallowEqual
  );

  const CK_AGENT_SD = location.pathname.includes("agentsd");
  const CK_AGENT_AG = location.pathname.includes("agentag");
  let userrole;

  if (CK_AGENT_SD) {
    userrole = "SD";
  } else if (CK_AGENT_AG) {
    userrole = "AG";
  } else {
    userrole = "EM";
  }

  const watchedMobile = watch("_mobile");

  useEffect(() => {
    if (!watchedMobile) return;
    let value = watchedMobile.replace(/\D/g, "");
    if (value.length === 11) {
      value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (value.length === 10) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (value.length === 8) {
      value = value.replace(/(\d{4})(\d{4})/, "$1-$2");
    }

    setValue("_mobile", value);
  }, [watchedMobile]);

  useEffect(() => {
    // searchClick을 클릭한 (true) 상태에서 동작
    // searchClick === true && SearchSubmit();
    if (Object.keys(listFilterData).length > 3) {
      setValue("_userid", listFilterData.userid);
      setValue("_name", listFilterData.name);
      setValue("_situation", listFilterData.useFlag);
      setValue("_mobile", listFilterData.mobile);
      SearchSubmit();
    } else {
      SearchSubmit();
    }
  }, [pageData.activePage]);

  const userList = (res) => {
    if (res && Array.isArray(res)) {
      setUserList && setUserList(res);
    }
  };

  // submit 이벤트
  function SearchSubmit(event, isNewSearch = false) {
    const requestData = {
      offset: isNewSearch ? 0 : pageData.getPage,
      size: 15,
      managetype: userrole,
    };

    if (!!getValues("_searchInput")) {
      if (getValues("_searchBox") === "name") {
        requestData.name = getValues("_searchInput");
      } else if (getValues("_searchBox") === "userid") {
        requestData.userid = getValues("_searchInput");
      } else if (getValues("_searchBox") === "phonenum") {
        requestData.phonenum = getValues("_searchInput");
      } else if (getValues("_searchBox") === "cname") {
        requestData.cname = getValues("_searchInput");
      }
    }

    if (event) {
      if (event?.target.name === "_situation" && !!event?.target.value) {
        requestData.situation = event?.target.value;
      }
      if (event?.target.name === "_afflname" && !!event?.target.value) {
        requestData.afflname = event?.target.value;
      }
      if (event?.target.name === "_headquaterGubun" && !!event?.target.value) {
        requestData.headquaterGubun = event?.target.value;
      }
    } else {
      if (getValues("_situation")) {
        requestData.situation = getValues("_situation");
      }
      if (event && getValues("_afflname")) {
        requestData.afflname = getValues("_afflname");
      }
      if (event && getValues("_headquaterGubun")) {
        requestData.headquaterGubun = getValues("_headquaterGubun");
      }
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
    API.servicesPostData(APIURL.urlListDistribution, requestData).then(
      (res) => {
        if (res?.status === "fail") {
          if (isNewSearch) {
            TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
            onResetHandle();
          }
        }
        if (res?.status === "success") {
          if (!res.data || !Array.isArray(res.data)) {
            return TOA.servicesUseToast(
              "데이터 포맷이 올바르지 않습니다.",
              "e"
            );
          }
          userList(res.data);
          dispatch(PAGE.setListPage(res.page));
        }
      }
    );
  }

  // 초기화 이벤트
  function onResetHandle(e) {
    reset();
    SearchSubmit();
    CLEAN.serviesPaginationCleanup(dispatch);
  }
  // formWrap

  const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    let managetype;

    if (userrole === "AG") {
      managetype = "SD";
    } else {
      managetype = "AG,SD";
    }

    API.servicesPostData(APIURL.urlListDistribution, {
      offset: 0,
      size: 100,
      managetype: managetype,
    }).then((res) => {
      if (res.status === "success") {
        const uniqueAfflNames = res.data.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.afflname === item.afflname)
        );

        const sortedData = uniqueAfflNames.sort((a, b) => {
          // '['로 시작하는 항목을 우선시
          const aStartsWithBracket = a.afflname?.startsWith("[");
          const bStartsWithBracket = b.afflname?.startsWith("[");

          if (aStartsWithBracket && !bStartsWithBracket) {
            return -1; // a가 먼저 온다
          } else if (!aStartsWithBracket && bStartsWithBracket) {
            return 1; // b가 먼저 온다
          } else {
            return a.afflname?.localeCompare(b.afflname);
          }
        });

        setAgentList(sortedData);
      }
    });
  }, []);

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form
        className="formLayout SearchFormAgent"
        onSubmit={handleSubmit(() => SearchSubmit(true))}
      >
        <div>
          {userrole === "SD" ? (
            <select {...register("_headquaterGubun")}>
              <option value="">총판운영형태</option>
              <option value="1">본사직영총판</option>
              <option value="0">개별총판</option>
            </select>
          ) : (
            <select {...register("_afflname")}>
              <option value="">
                {userrole === "EM" ? "유통망 선택" : "소속총판"}
              </option>
              {agentList.map((item, key) => (
                <option key={key} value={item.afflname}>
                  {item.afflname}
                </option>
              ))}
            </select>
          )}

          <select
            {...register("_situation")}
            onChange={(e) => SearchSubmit(e, true)}
          >
            <option value="approval">
              {userrole === "EM" ? "사원상태" : "대리점상태"}
            </option>
            <option value="">전체보기</option>
            <option value="stop">중지</option>
          </select>
        </div>

        <div>
          {userrole === "SD" ? (
            <select {...register("_searchBox")}>
              <option value="cname">사업장명</option>
              <option value="name">대표자</option>
              <option value="phonenum">연락처</option>
            </select>
          ) : (
            <select {...register("_searchBox")}>
              <option value="name">사원명</option>
              <option value="userid">ID</option>
              <option value="phonenum">연락처</option>
            </select>
          )}

          <input {...register("_searchInput")} />

          <div className="listSearchButtonWrap">
            <button type="submit" value="검색">
              검색
            </button>
            <button type="reset" value="초기화" onClick={onResetHandle}>
              초기화
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
