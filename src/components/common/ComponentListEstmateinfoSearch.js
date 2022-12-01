import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { servicesPostData } from "../../Services/importData";
import { urlListEstimateInfo } from "../../Services/string";

export default function ComponentListUserSearch({
  setList,
  setListPage,
  searchClick,
  setSearchClick,
  page,
}) {
  // react-hook-form 라이브러리
  const { register, reset, getValues, handleSubmit } = useForm({});

  useEffect(() => {
    // searchClick을 클릭한 (true) 상태에서 동작
    searchClick === true && SearchSubmit();
  }, [page.activePage || searchClick]);

  // 상위 컴포넌트에게 전달받은 useState의 set 함수
  // setUserList가 set으로 전달받은 후 사용하기 위해 && 사용
  const userList = (res) => {
    setList && setList(res);
  };
  const listPage = (res) => {
    setListPage && setListPage(res);
  };

  // submit 이벤트
  function SearchSubmit() {
    servicesPostData(urlListEstimateInfo, {
      offset: page.getPage,
      size: 15,
      fromUid: getValues("_fromUid"),
      toUid: getValues("_toUid"),
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

  // 초기화 이벤트
  function onResetHandle(e) {
    servicesPostData(urlListEstimateInfo, {
      offset: page.getPage,
      size: 15,
    }).then((res) => {
      if (res.status === "fail") {
        alert("초기화가 완료되지 않았습니다.");
      }
      if (res.status === "success") {
        userList(res.data);
        listPage(res.page);
        setSearchClick(false);
        reset();
      }
    });
  }

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <form className="formLayout" onSubmit={handleSubmit(SearchSubmit)}>
        <fieldset>
          <div className="formWrap">
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>견적 요청</span>
              </label>
              <div>
                <input
                  type="text"
                  id="fromUid"
                  placeholder="견적서를 요청한 관리번호를 검색할 때 입력해 주세요."
                  {...register("_fromUid", {
                    pattern: {
                      value: /[0-9]/,
                    },
                  })}
                />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>견적 수령</span>
              </label>
              <div>
                <input
                  type="text"
                  id="toUid"
                  placeholder="견적서를 요청받은 관리번호를 검색할 때 입력해 주세요."
                  {...register("_toUid", {
                    pattern: {
                      value: /[0-9]/,
                    },
                  })}
                />
              </div>
            </div>
          </div>
        </fieldset>

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
