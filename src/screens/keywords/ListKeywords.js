// 회원관리 > 통합회원 상세정보

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";
import ServicesPaginationButtonAllKeyword from "../../components/services/ServicesPaginationButtonAllKeyword";
// import LayoutTopButton from "../../components/layout/LayoutTopButton";

function ImageComponent({ item, index }) {
  const [list, setList] = useState([]);

  const fetchData = useCallback(() => {
    API.servicesPostData(APIURL.urlListIsSalesKeyword, {
      keyword: item.keyword,
    })
      .then((res) => {
        if (res.status === "success") {
          console.log("쓴 게 있음");
          const usedPriors = res.data.map((item) => item.prior);
          const useOkPriors = Array.from(
            { length: 7 },
            (_, index) => index + 1
          ).filter((prior) => !usedPriors.includes(prior));
          return setList(useOkPriors);
        } else {
          console.log("사용된 거 없음");
          return setList([1, 2, 3, 4, 5, 6, 7]);
        }
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
        setList([]);
      });
  }, []);

  // click이 변경될 때 fetchData 함수 실행
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <tr className={list.length < 1 ? "propsosalFlageN" : ""}>
      <td>{index + 1}</td>
      <td>{item.keyword}</td>
      <td>
        {list.length < 1 ? (
          <span>전체 판매된 키워드</span>
        ) : (
          list.map((item, key) => <i key={key}>{item}</i>)
        )}
      </td>
      <td>{list.length}</td>
    </tr>
  );
}

// ====================================================================================

export default function ListImgs() {
  const { register, getValues, handleSubmit } = useForm();

  const [tableTopScrollBtnData, setTableTopScrollBtnData] = useState([]);
  const [list, setList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [clickAll, setClickAll] = useState(false);

  // pagination 버튼 관련 ------------------------------------------------------------------------

  useEffect(() => {
    setTableTopScrollBtnData([
      {
        idName: "CompanyDetail",
        text: `검색된 키워드 개수 : ${
          clickAll
            ? list.length * 100 + list[list.length - 1].length
            : list.length
        } 개`,
      },
    ]);
  }, [list]);

  const fnAll = () => {
    setClickAll(true);
    API.servicesPostData(APIURL.urlAllKeyword, {}).then((res) => {
      const lists = [{}];
      const resData = res.data;
      if (res !== undefined && res.status === "success") {
        console.log("fnall", resData);
        // setList(res.data);
        // for (let i = 0; i < res.data.length; i += 100) {
        //   lists.push(res.data.slice(i, i + 100));
        // }
        for (let i = 0; i < resData.length; i += 100) {
          lists.push(resData.slice(i, i + 100));
        }
        setList(lists);
      }
    });
  };

  const fnSearch = () => {
    setClickAll(false);
    if (!!getValues("_keyword")) {
      API.servicesPostData(APIURL.urlLikeKeyword, {
        keyword: getValues("_keyword"),
      })
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            setList(res.data);
          }
        })
        .catch((res) => console.log("urllistTagImages : ", res));
    } else {
      TOA.servicesUseToast("검색어를 입력해 주세요.", "e");
    }
  };

  return (
    <div className="commonBox">
      <form className="formLayout" onSubmit={handleSubmit(fnSearch)}>
        <ul className="tableTopWrap tableTopBorderWrap">
          <ComponentTableTopScrollBtn data={tableTopScrollBtnData} noHover />
        </ul>

        <div className="formWrap">
          <div className="formContainer">
            <div className="imageSetWrap">
              <div
                className="addImgsSearchWrap"
                style={{ borderBottom: "none", marginBottom: "10px" }}
              >
                <div>
                  <input {...register("_keyword")} />
                  <button type="submit">검색</button>
                  <button
                    type="button"
                    onClick={fnAll}
                    style={{ backgroundColor: "#555" }}
                  >
                    모두보기
                  </button>
                </div>
              </div>

              {list.length === 0 ? (
                <div style={{ textAlign: "center", lineHeight: "140px" }}>
                  검색된 키워드가 없습니다.
                </div>
              ) : (
                <table className="commonTable">
                  <thead>
                    <tr>
                      <th style={{ width: "10% " }}>번호</th>
                      <th style={{ width: "40%" }}>키워드</th>
                      <th style={{ width: "40% " }}>미사용 순위</th>
                      <th style={{ width: "10% " }}>미사용 개수</th>
                    </tr>
                  </thead>
                  <tbody className="listKeyword">
                    {clickAll
                      ? Array.isArray(list[activePage]) &&
                        list[activePage].map((item, key) => (
                          <ImageComponent
                            key={item.kid}
                            item={item}
                            index={key}
                          />
                        ))
                      : list.map((item, key) => (
                          <ImageComponent
                            key={item.kid}
                            item={item}
                            index={item.kid}
                          />
                        ))}
                  </tbody>
                </table>
              )}
            </div>
            {clickAll && list.length > 0 && (
              <ServicesPaginationButtonAllKeyword
                total={list.length * 100 + list[list.length - 1].length}
                setActivePage={setActivePage}
                activePage={activePage}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
