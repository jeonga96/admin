/*
안내 :

안심번호를 가지고 오는 list가 없어서 시작 번호부터 count로 배열을 만들어 작성하였습니다. 
  (fetchData 함수 내부에 변수 작성)
안심번호 리스트가 변경되면 이에 따라 수정하여야 안심번호 검색 기능이 제대로 작동합니다.
할당 받은 안심번호 리스트에서 사업자 관리 목록의 번호 중 0507이 들어가는 telnum을 제외하여 배열을 만드는 조건으로 작성하였기 때문에 이에 따른 오류가 생길 수도 있습니다.
또한 공사콕 - 사업자 데이터를 기반으로 사용 검색을 하고 있기 때문에 웹에서 등록한 후 관리자 페이지에서 등록하지 않은 경우 제대로 검색되지 않을 수 있습니다.
*/

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import * as API from "../../service/api";
import * as STR from "../../service/string";
import * as UD from "../../service/useData";

export default function ServiceModalUseSafeNumber({ click, setClick, fn }) {
  const { vno } = useParams();
  const [list, setList] = useState([]);
  const [select, setSelect] = useState(false);

  // 사용 가능한 안심번호 리스트 가지고 오기
  const fetchData = useCallback(() => {
    const useSearchSafeNum = [];
    try {
      API.servicesPostData(STR.urlCompanylist, {
        offset: 0,
        size: 1000,
        telnum: "0507",
      }).then((res) => {
        if (res.status === "fail") {
          UD.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        }
        if (res.status === "success") {
          const startNumber = "050701769000";
          const numCount = 1000;

          useSearchSafeNum.push(...res.data);
          const SafeNumber = UD.gserviesGnerateNumbers(startNumber, numCount);
          setList(
            SafeNumber.filter(
              (number) =>
                !useSearchSafeNum.some(
                  (obj) => obj.extnum === number.toString()
                )
            )
          );
        }
      });
    } catch (error) {
      setList([]);
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // 추가 시 : click이 변경될 때 fetchData 함수 실행
    if (click || !vno) {
      fetchData();
    }
  }, [click]);

  // 추가 시 : 안심번호 검색을 누르지 않은 경우 && 리스트에서 안심번호를 선택하지 않은 경우
  // list의 가장 적은 수 입력
  useEffect(() => {
    if (!click && select === false) {
      fn(list[0]);
    }
  }, [list]);

  return (
    click &&
    list.length > 0 && (
      <>
        <div className="clickModal">
          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "492px" }}>사용가능한 안심번호</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td
                        style={{ width: "492px" }}
                        onClick={(event) => {
                          fn(item, event);
                          setSelect(true);
                        }}
                      >
                        {item}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <button
            type="button"
            className="formContentBtn"
            onClick={() => setClick(false)}
          >
            닫기
          </button>
        </div>
      </>
    )
  );
}
