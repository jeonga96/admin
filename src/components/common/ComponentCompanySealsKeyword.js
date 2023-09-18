import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

import ServiceModalSaleskeywordAllKeyword from "../services/ServiceModalSaleskeywordAllKeyword";
import ServiceModalSaleskeywordRecommendKeyword from "../services/ServiceModalSaleskeywordRecommendKeyword";
import ServiceModalSaleskeywordRankKeyword from "../services/ServiceModalSaleskeywordRankKeyword";

export function ChildKeyword({ index, data }) {
  const { cid } = useParams();
  const [recommendClick, setRecommendClick] = useState(false);
  const [rankClick, setRankClick] = useState(false);

  const [childInput, setChildInput] = useState({});

  useEffect(() => {
    setChildInput(data);
  }, [data]);

  // 입력이벤트
  const fnInput = (e) => {
    setChildInput({
      ...childInput,
      rcid: cid,
      [e.target.id]: e.target.value.replace(" ", ""),
    });
  };

  // 키워드 수정 및 추가
  const fnSubmitKeyword = (e) => {
    // 저장
    e.preventDefault();
    if (childInput.skid !== "") {
      // 수정
      API.servicesPostData(STR.urlSetSalesKeyword, {
        skid: childInput.skid,
        rcid: childInput.rcid,
        prior: childInput.prior,
        useFlag: 1,
      }).then((res) => {
        if (res.status === "fail") {
          UD.servicesUseToast(
            "작업에 실패했습니다. 동일한 순위일 경우 저장이 불가능합니다.",
            "e"
          );
        } else {
          UD.servicesUseToast("완료되었습니다!", "s");
          UD.serviesAfter2secondReload();
        }
      });
    } else if (childInput.keyword !== "") {
      // 추가
      API.servicesPostData(STR.urlAddSalesKeyword, {
        keyword: childInput.keyword,
        rcid: cid,
        prior: childInput.prior,
      }).then((res) => {
        if (res.status === "fail") {
          !!childInput.keyword && !!childInput.prior
            ? UD.servicesUseToast("작업에 실패했습니다.", "e")
            : UD.servicesUseToast("모든 정보를 입력해주세요.", "e");
        } else {
          UD.servicesUseToast("완료되었습니다!", "s");
          UD.serviesAfter2secondReload();
        }
      });
    }
  };

  // 키워드 삭제
  const fnClearKeyword = () => {
    // 삭제
    if (childInput.skid !== "") {
      API.servicesPostData(STR.urlSetSalesKeyword, {
        skid: childInput.skid,
        prior: childInput.prior,
        useFlag: 0,
      }).then((res) => {
        if (res.status === "fail") {
          UD.servicesUseToast("작업에 실패했습니다.", "e");
        } else {
          UD.servicesUseToast("완료되었습니다!", "s");
          UD.serviesAfter2secondReload();
        }
      });
    } else {
      UD.servicesUseToast("저장되지 않은 키워드입니다. ", "e");
    }
  };

  // ServiceModalSaleskeywordRecommendKeyword 선택하면 모달창이 꺼지고, 추천 키워드 입력
  const fnRecommendChoose = (e) => {
    setRecommendClick(false);
    setChildInput({
      ...childInput,
      rcid: cid,
      keyword: e.keyword,
    });
  };

  const fnRankChoose = (e) => {
    setRankClick(false);
    setChildInput({
      ...childInput,
      rcid: cid,
      prior: e,
    });
  };

  return (
    <>
      <ServiceModalSaleskeywordRecommendKeyword
        click={recommendClick}
        setClick={setRecommendClick}
        inputData={childInput.keyword}
        fn={fnRecommendChoose}
      />

      <ServiceModalSaleskeywordRankKeyword
        click={rankClick}
        setClick={setRankClick}
        inputData={childInput.keyword}
        fn={fnRankChoose}
      />

      <ul>
        <li style={{ width: "3%" }}>
          <span style={{ minWidth: "32px" }}>{index + 1}</span>
        </li>

        <li style={{ width: "67%" }}>
          <span>키워드</span>
          <input
            type="text"
            id="keyword"
            value={childInput.keyword || ""}
            onChange={(e) => fnInput(e)}
            disabled={!!childInput.skid ? true : false}
          />
          <button
            type="button"
            className="formContentBtn"
            onClick={() => setRecommendClick(!recommendClick)}
            disabled={!!childInput.skid ? true : false}
          >
            키워드 추천
          </button>
        </li>

        <li style={{ width: "22%" }}>
          <span>순위</span>
          <input
            type="numver"
            id="prior"
            value={childInput.prior || ""}
            onChange={(e) => fnInput(e)}
          />
          <button
            type="button"
            className="formContentBtn"
            onClick={() => setRankClick(!rankClick)}
          >
            키워드 순위 확인
          </button>
        </li>

        <li style={{ width: "8%" }}>
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
            저장
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
    </>
  );
}

//==========================================================================================
// 부모
//==========================================================================================

export default function ComponentCompanySealsKeyword() {
  const [keywordInput, setKeywordInput] = useState([]);
  const { cid } = useParams();
  const [clickModal, setClickModal] = useState(false);

  useEffect(() => {
    API.servicesPostData(STR.urlListAdminSalesKeyword, { rcid: cid }).then(
      (res) => {
        if (res.status === "success") {
          if (res.data.length < 7) {
            setKeywordInput([
              ...res.data,
              {
                keyword: "",
                skid: "",
                prior: "",
              },
            ]);
          } else {
            setKeywordInput(res.data);
          }
        } else {
          setKeywordInput([
            {
              keyword: "",
              skid: "",
              prior: "",
            },
          ]);
        }
      }
    );
  }, []);

  // 추가 입력 버튼 이벤트
  // 조건:7개 이상 추가 금지
  const fnAddKeyword = (e) => {
    // 추가 입력
    e.preventDefault();
    if (keywordInput.length < 7) {
      setKeywordInput([
        ...keywordInput,
        {
          keyword: "",
          skid: "",
          prior: "",
        },
      ]);
    } else {
      UD.servicesUseToast("키워드는 최대 7개까지 입력 가능합니다.", "e");
    }
  };

  // 모든 키워드 보기 버튼 이벤트
  const fnViewKeyword = (e) => {
    // 모든 키워드 보기
    e.preventDefault();
    setClickModal(!clickModal);
  };

  // 모든 키워드보기 > 선택 이벤트
  // 조건:7개 이상 추가 금지
  const fnAllKeywordChoose = (item) => {
    if (keywordInput.length < 7) {
      setKeywordInput((prevKeywordInput) => {
        const updatedKeywordInput = prevKeywordInput.filter(
          (data) => data.keyword !== ""
        );

        return [
          ...updatedKeywordInput,
          {
            keyword: item.keyword,
            skid: "",
            prior: "",
          },
        ];
      });
      setClickModal(false);
    } else {
      UD.servicesUseToast("키워드는 최대 7개까지 입력 가능합니다.", "e");
    }
  };

  return (
    <>
      {/* 견적 관리 링크 이동 ================================================================ */}
      <fieldset id="CompanyDetail_7">
        <h3>판매 키워드</h3>
        <div className="companyWrap-keyword-buttonWrap">
          <button onClick={fnAddKeyword}>추가 입력</button>
          <button id="allkeywordBtn" onClick={fnViewKeyword}>
            모든 키워드 보기
          </button>
          <span>
            * 등록된 키워드는 수정하실 수 없습니다. 삭제 후 이용해주세요.
          </span>
        </div>

        <ServiceModalSaleskeywordAllKeyword
          fn={fnAllKeywordChoose}
          clickModal={clickModal}
          setClickModal={setClickModal}
        />

        <div className="detailContent companyWrap-keyword-inputWrap">
          {keywordInput.map((data, i) => (
            <ChildKeyword key={i} data={data} index={i} />
          ))}
        </div>
      </fieldset>
    </>
  );
}
