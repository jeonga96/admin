import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../../Services/importData";
import { urlUserlist } from "../../Services/string";

export default function ComponentListUserSearch({ setUserList, setListPage }) {
  // react-hook-form 라이브러리
  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _uid: "",
      _userid: "",
      _name: "",
      _userrole: "ROLE_USER",
      _mobile: "",
      _createTime: "",
      _userUseFlag: "1",
    },
  });

  const [searchData, setSearchData] = useState({});
  const [userrole, setUserrole] = useState("ROLE_USER");
  const [useFlag, setUseFlag] = useState("1");

  console.log("searchData", searchData);
  const userList = (res) => {
    setUserList && setUserList(res);
  };
  const listPage = (res) => {
    setListPage && setListPage(res);
  };

  function SearchSubmit() {
    // input에 입력된 값을 업애도 useState에 담긴 키가 사라지지 않아, 해당 칸이 비어있으면 키를 제거
    const searchDataObj = Object.entries(searchData);
    const searchDataFilter = searchDataObj.filter((it) => it[1] !== "");
    const searchDataReq = Object.fromEntries(searchDataFilter);

    servicesPostData(urlUserlist, {
      offset: 0,
      size: 15,
      useFlag: useFlag,
      userrole: userrole,
      ...searchDataReq,
    }).then((res) => {
      console.log("d", res);
      if (res.status === "fail") {
        alert("검색하신 데이터가 없습니다.");
      }
      if (res.status === "success") {
        userList(res.data);
        listPage(res.page);
      }
      // reset();
    });
  }

  function onChangeHandle(e) {
    if (e.target.id === "createTime") {
      const pickDate = new Date(e.target.value);
      setSearchData({
        ...searchData,
        [e.target.id]: pickDate.toISOString().slice(0, 19),
      });
    } else {
      setSearchData({
        ...searchData,
        [e.target.id]: e.target.value,
      });
    }
  }

  function onResetHandle(e) {
    reset();
    setSearchData({});
    setUseFlag("1");
    setUserrole("ROLE_USER");
  }

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form className="listSearchForm" onSubmit={handleSubmit(SearchSubmit)}>
        <div className="listSearchWrap">
          <label className="blockLabel">관리번호</label>
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
          <label className="blockLabel">아이디</label>
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
          <label className="blockLabel">이름</label>
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
          <div className="blockLabel">회원권한</div>
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
          <label className="blockLabel">핸드폰번호</label>
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
          <label className="blockLabel">계약일</label>
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
          <div className="blockLabel">계약관리</div>
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
          <input type="reset" value="초기화" onClick={onResetHandle} />
          <input type="submit" value="검색" />
        </div>
      </form>
    </div>
  );
}
