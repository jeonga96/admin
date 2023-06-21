import { useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { servicesUseToast } from "../../Services/useData";
import { urlUserlist } from "../../Services/string";

export default function ComponentListAgentSearch({
  setUserList,
  setListPage,
  searchClick,
  setSearchClick,
  page,
}) {
  // react-hook-form 라이브러리
  const { register, setValue, getValues, watch, reset, handleSubmit } = useForm(
    {
      defaultValues: {
        _useFlag: "1",
      },
    }
  );
  const { uid } = useParams();

  useEffect(() => {
    // searchClick을 클릭한 (true) 상태에서 동작
    searchClick === true && SearchSubmit();
  }, [page.activePage || searchClick]);

  // 상위 컴포넌트에게 전달받은 useState의 set 함수
  // setUserList가 set으로 전달받은 후 사용하기 위해 && 사용
  const userList = (res) => {
    setUserList && setUserList(res);
  };
  const listPage = (res) => {
    setListPage && setListPage(res);
  };

  // submit 이벤트
  function SearchSubmit() {
    servicesPostData(urlUserlist, {
      offset: page.getPage,
      size: 15,
      userid: getValues("_userid"),
      name: getValues("_name"),
      mobile: getValues("_mobile"),
      userrole: "ROLE_ADMIN" || "ROLE_ADMINAG" || "ROLE_ADMINSD",
      useFlag: getValues("_useFlag"),
    }).then((res) => {
      if (res.status === "fail") {
        servicesUseToast("검색하신 데이터가 없습니다.", "e");
      }
      if (res.status === "success") {
        userList(res.data);
        listPage(res.page);
        setSearchClick(true);
        servicesUseToast("완료되었습니다.", "s");
      }
    });
  }

  // 초기화 이벤트
  function onResetHandle(e) {
    reset();
    setSearchClick(false);
    SearchSubmit();
  }
  // formWrap

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form
        className="listSearchForm formLayout"
        onSubmit={handleSubmit(SearchSubmit)}
      >
        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>아이디</span>
          </label>
          <div>
            <input
              type="text"
              id="userid"
              placeholder="아이디를 입력해 주세요."
              {...register("_userid")}
            />
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>이름</span>
          </label>
          <div>
            <input
              type="text"
              id="name"
              placeholder="이름을 입력해 주세요."
              {...register("_name")}
            />
          </div>
        </div>

        {/* <div className="listSearchWrap">
          <div className="blockLabel">
            <span>회원권한</span>
          </div>
          <div>
            <input
              className="listSearchRadioInput"
              type="radio"
              id="userroleUser"
              value="ROLE_USER"
              checked={watch("_userrole") == "ROLE_USER"}
              {...register("_userrole")}
            />
            <label className="listSearchRadioLabel" htmlFor="userroleUser">
              일반
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
        </div> */}

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>핸드폰번호</span>
          </label>
          <div>
            <input
              type="text"
              id="mobile"
              placeholder="핸드폰 번호를 입력해 주세요."
              {...register("_mobile")}
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
              id="useFlag1"
              value="1"
              checked={watch("_useFlag") === "1"}
              {...register("_useFlag")}
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag1">
              승인
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
              퇴사
            </label>
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
