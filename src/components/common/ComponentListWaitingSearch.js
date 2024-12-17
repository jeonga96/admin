import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import * as PAGE from "../../action/page";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

export default function ComponentListAgentSearch({ setWaitinglist }) {
  // react-hook-form 라이브러리
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      // _situation: "approval",
    },
  });

  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);
  const listFilterData = useSelector(
    (state) => state.page.listFilterData,
    shallowEqual
  );

  const fnList = (res) => {
    if (res && Array.isArray(res)) {
      setWaitinglist && setWaitinglist(res);
    }
  };

  // submit 이벤트
  function SearchSubmit(event, isNewSearch = false) {
    const statusValue = event ? event.target.value : watch("_status");

    const requestData = {
      offset: isNewSearch ? 0 : pageData.getPage,
      size: 15,
      status: statusValue,
    };

    dispatch(PAGE.setListFilter(requestData));
    fnList([]);

    API.servicesPostData(APIURL.urlCompanylist, requestData).then((res) => {
      if (res.status === "fail") {
        TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
      }
      if (res.status === "success") {
        if (!res.data || !Array.isArray(res.data)) {
          return TOA.servicesUseToast("데이터 포맷이 올바르지 않습니다.", "e");
        }
        fnList(res.data);
        dispatch(PAGE.setListPage(res.page));
      }
    });
  }

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form className="formLayout SearchFormAgent">
        <div></div>
        <div>
          <select
            {...register("_status")}
            onChange={(e) => SearchSubmit(e, true)}
          >
            <option value="2">대기</option>
            <option value="3">거절</option>
          </select>
        </div>
      </form>
    </div>
  );
}
