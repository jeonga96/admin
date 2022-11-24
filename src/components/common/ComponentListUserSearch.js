import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { urlUserlist } from "../../Services/string";

export default function ComponentListUserSearch({
  setUserList,
  setListPage,
  searchClick,
  setSearchClick,
  page,
}) {
  // react-hook-form 라이브러리
  const { register, reset, handleSubmit } = useForm({});

  const [searchData, setSearchData] = useState({});
  const [userrole, setUserrole] = useState("ROLE_USER");
  const [useFlag, setUseFlag] = useState("1");

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
    // input에 입력된 값을 없애도 useState에 담긴 키가 사라지지 않아, 해당 값이 빈칸이라면 키를 제거하기 위해 filter 사용
    const searchDataObj = Object.entries(searchData);
    const searchDataFilter = searchDataObj.filter((it) => it[1] !== "");
    const searchDataReq = Object.fromEntries(searchDataFilter);

    servicesPostData(urlUserlist, {
      offset: page.getPage,
      size: 15,
      useFlag: useFlag,
      userrole: userrole,
      ...searchDataReq,
    }).then((res) => {
      if (res.status === "fail") {
        alert("검색하신 데이터가 없습니다.");
      }
      if (res.status === "success") {
        userList(res.data);
        listPage(res.page);
        setSearchClick(true);
      }
    });
  }

  // 입력 이벤트
  function onChangeHandle(e) {
    // input Type = "date"
    if (e.target.id === "createTime") {
      // 날짜 포맷에 맞게 전송하기 위해 처리
      const pickDate = new Date(e.target.value);
      setSearchData({
        ...searchData,
        [e.target.id]: pickDate.toISOString().slice(0, 19),
      });
    } else {
      // input Type = "date" 외의 나머지 코드 (text etc.)
      setSearchData({
        ...searchData,
        [e.target.id]: e.target.value,
      });
    }
  }

  // 초기화 이벤트
  function onResetHandle(e) {
    reset();
    setSearchData({});
    setUseFlag("1");
    setUserrole("ROLE_USER");
    setSearchClick(false);
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
            <span>관리번호</span>
          </label>
          <div>
            <input
              type="text"
              id="uid"
              name="_uid"
              placeholder="관리번호를 입력해 주세요."
              {...register("_uid", {
                onChange: onChangeHandle,
                pattern: {
                  value: /[0-9]/,
                  message: "숫자만 입력할 수 있습니다.",
                },
              })}
            />
          </div>
        </div>
        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>아이디</span>
          </label>
          <div>
            <input
              type="text"
              id="userid"
              name="_userid"
              placeholder="아이디를 입력해 주세요."
              {...register("_userid", {
                onChange: onChangeHandle,
              })}
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
              name="_name"
              placeholder="이름을 입력해 주세요."
              {...register("_name", {
                onChange: onChangeHandle,
              })}
            />
          </div>
        </div>

        <div className="listSearchWrap">
          <div className="blockLabel">
            <span>회원권한</span>
          </div>
          <div>
            <input
              className="listSearchRadioInput"
              type="radio"
              id="userroleUser"
              name="_userrole"
              value="ROLE_USER"
              checked={userrole === "ROLE_USER"}
              {...register("_userrole", {
                onChange: (e) => setUserrole(e.target.value),
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="userroleUser">
              일반
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              id="userroleAdmin"
              name="_userrole"
              value="ROLE_USER,ROLE_ADMIN"
              checked={userrole === "ROLE_USER,ROLE_ADMIN"}
              {...register("_userrole", {
                onChange: (e) => setUserrole(e.target.value),
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="userroleAdmin">
              관리자
            </label>
          </div>
        </div>

        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>핸드폰번호</span>
          </label>
          <div>
            <input
              type="text"
              id="mobile"
              name="_mobile"
              placeholder="핸드폰 번호를 입력해 주세요."
              {...register("_mobile", {
                onChange: onChangeHandle,
              })}
            />
          </div>
        </div>
        <div className="listSearchWrap">
          <label className="blockLabel">
            <span>계약일</span>
          </label>
          <div>
            <input
              type="date"
              id="createTime"
              name="_createTime"
              {...register("_createTime", {
                onChange: onChangeHandle,
              })}
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
              name="_userUseFlag"
              value="1"
              checked={useFlag === "1"}
              {...register("_userUseFlag", {
                onChange: (e) => setUseFlag(e.target.value),
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag1">
              회원
            </label>

            <input
              className="listSearchRadioInput"
              type="radio"
              id="useFlag0"
              name="_userUseFlag"
              value="0"
              checked={useFlag === "0"}
              {...register("_userUseFlag", {
                onChange: (e) => setUseFlag(e.target.value),
              })}
            />
            <label className="listSearchRadioLabel" htmlFor="useFlag0">
              해지
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
