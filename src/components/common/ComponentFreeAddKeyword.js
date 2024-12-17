import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import * as API from "../../service/api";
import * as RAN from "../../service/useData/rander";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

export function ChildKeyword({ index, data, preData }) {
  const { cid } = useParams();

  const [childInput, setChildInput] = useState({});

  useEffect(() => {
    setChildInput(data);
  }, [data]);

  function fnSearchEnter(f) {
    if (f.keyCode == 13) {
      fnSubmitKeyword(f);
    }
  }

  // 입력이벤트
  const fnInput = (e) => {
    setChildInput({
      ...childInput,
      rcid: cid,
      [e.target.id]: e.target.value,
    });
  };

  // 키워드 수정 및 추가
  const fnSubmitKeyword = (e) => {
    e.preventDefault();

    if (!childInput.keyword) {
      return TOA.servicesUseToast("키워드를 입력해 주세요.", "e");
    }

    for (let i = 0; i < preData.length; i++) {
      if (preData[i].keyword === childInput.keyword) {
        return TOA.servicesUseToast("이미 입력된 키워드 입니다.", "e");
      }
    }

    // 저장 =================================================
    if (!childInput.csid) {
      API.servicesPostData(APIURL.urlAddCompanyKeyword, {
        rcid: cid,
        keyword: childInput.keyword,
      }).then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast(
            "작업에 실패했습니다. 동일한 순위일 경우 저장이 불가능합니다.",
            "e"
          );
        } else {
          TOA.servicesUseToast("완료되었습니다!", "s");
          RAN.serviesAfter2secondReload();
        }
      });
      // 수정 =================================================
    } else {
      API.servicesPostData(APIURL.urlSetCompanyKeyword, {
        rcid: cid,
        csid: childInput.csid,
        keyword: childInput.keyword,
      }).then((res) => {
        if (res.status === "fail") {
          TOA.servicesUseToast(
            "작업에 실패했습니다. 동일한 순위일 경우 저장이 불가능합니다.",
            "e"
          );
        } else {
          TOA.servicesUseToast("완료되었습니다!", "s");
          RAN.serviesAfter2secondReload();
        }
      });
    }
  };

  // 키워드 삭제
  const fnClearKeyword = () => {
    if (childInput.skid !== "") {
      if (window.confirm("정말로 이 키워드를 삭제하시겠습니까?")) {
        API.servicesPostData(APIURL.urlSetCompanyKeyword, {
          csid: childInput.csid,
          keyword: childInput.keyword,
          useFlag: 0,
        }).then((res) => {
          if (res.status === "fail") {
            TOA.servicesUseToast("작업에 실패했습니다.", "e");
          } else {
            TOA.servicesUseToast("완료되었습니다!", "s");
            RAN.serviesAfter2secondReload();
          }
        });
      }
    } else {
      TOA.servicesUseToast("저장되지 않은 키워드입니다. ", "e");
    }
  };

  return (
    <ul>
      <li style={{ width: "4%" }}>
        <span
          style={{
            minWidth: "100%",
            backgroundColor: "gray",
            textAlign: "center",
            color: "white",
            lineHeight: "28px",
            borderRadius: "2px",
          }}
        >
          {childInput.csid ? index : "+"}
        </span>
      </li>

      <li style={{ width: "80%" }}>
        <input
          style={{ width: "100%" }}
          type="text"
          id="keyword"
          value={childInput.keyword || ""}
          onChange={(e) => fnInput(e)}
          onKeyDown={(e) => fnSearchEnter(e)}
          disabled={!!childInput.skid ? true : false}
          placeholder="추가할 키워드를 입력해 주세요 ( 띄어쓰기 포함 20자 이내 )"
          maxLength={20}
        />
      </li>
      <li style={{ width: "15%" }}>
        <button
          type="button"
          className="formContentBtn"
          style={{
            backgroundColor: "#33447c",
            color: "#fff",
            marginRight: "4px",
          }}
          onClick={fnSubmitKeyword}
        >
          {/* 저장 */}
          {childInput.csid ? "저장 / 수정" : "추가"}
        </button>
        <button
          type="button"
          className="formContentBtn"
          onClick={fnClearKeyword}
          style={{
            backgroundColor: "#9b111e",
            color: "#fff",
          }}
        >
          삭제
        </button>
      </li>
    </ul>
  );
}

//==========================================================================================
// 부모
//==========================================================================================

export default function ComponentFreeAddKeyword() {
  const { cid } = useParams();

  const [keywordInput, setKeywordInput] = useState([
    {
      keyword: "",
      csid: "",
      cid: cid,
      useFlag: 1,
    },
  ]);

  useEffect(() => {
    API.servicesPostData(APIURL.urlListCompanyKeyword, {
      rcid: cid,
      offset: 0,
      size: 20,
      useFlag: 1,
    }).then((res) => {
      if (res.status === "success") {
        if (res.data.length < 20) {
          setKeywordInput([
            {
              keyword: "",
              csid: "",
              cid: cid,
            },
            ...res.data,
          ]);
        } else {
          setKeywordInput(res.data);
        }
      } else {
        setKeywordInput([
          {
            keyword: "",
            csid: "",
            cid: cid,
          },
        ]);
      }
    });
  }, []);

  return (
    <>
      <div className="formContentWrap" style={{ width: "100%" }}>
        <label htmlFor="keyword" className="blockLabel">
          <span style={{ marginBottom: "4px" }}>APP 검색창 </span>
          <span style={{ marginBottom: "4px" }}>노출키워드 추가</span>
          <span>( 최대 20개 가능 )</span>
        </label>
        <div className="companyWrap-freekeyword-inputWrap">
          <div>
            {keywordInput.map((data, i) => (
              <ChildKeyword
                key={i}
                data={data}
                index={i}
                preData={keywordInput}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
