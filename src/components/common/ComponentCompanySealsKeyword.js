import { FaMapMarkerAlt } from "react-icons/fa";

import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import * as API from "../../service/api";
import * as RAN from "../../service/useData/rander";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

import ServiceModalSaleskeywordAllKeyword from "../services/ServiceModalSaleskeywordAllKeyword";
import ServiceModalSaleskeywordRecommendKeyword from "../services/ServiceModalSaleskeywordRecommendKeyword";
import ServiceModalSaleskeywordRankKeyword from "../services/ServiceModalSaleskeywordRankKeyword";

export function ChildKeyword({ index, data, onDelete }) {
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
      API.servicesPostData(APIURL.urlSetSalesKeyword, {
        skid: childInput.skid,
        rcid: childInput.rcid,
        prior: childInput.prior,
        useFlag: 1,
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
    } else if (childInput.keyword !== "") {
      // 추가
      API.servicesPostData(APIURL.urlAddSalesKeyword, {
        keyword: childInput.keyword,
        rcid: cid,
        prior: childInput.prior,
      }).then((res) => {
        if (res.status === "fail") {
          !!childInput.keyword && !!childInput.prior
            ? TOA.servicesUseToast("작업에 실패했습니다.", "e")
            : TOA.servicesUseToast("모든 정보를 입력해주세요.", "e");
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
        API.servicesPostData(APIURL.urlSetSalesKeyword, {
          skid: childInput.skid,
          prior: childInput.prior,
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
      {recommendClick && (
        <ServiceModalSaleskeywordRecommendKeyword
          click={recommendClick}
          setClick={setRecommendClick}
          inputData={childInput.keyword}
          fn={fnRecommendChoose}
        />
      )}

      {rankClick && (
        <ServiceModalSaleskeywordRankKeyword
          click={rankClick}
          setClick={setRankClick}
          inputData={childInput.keyword}
          fn={fnRankChoose}
        />
      )}

      <ul>
        <li style={{ width: "3%" }}>
          <span style={{ minWidth: "32px" }}>{index + 1}</span>
        </li>

        <li style={{ width: "66%" }}>
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
            onClick={() => setRankClick(!rankClick)}
          >
            키워드 순위 확인
          </button>
        </li>

        <li style={{ width: "13%", paddingRight: "10px" }}>
          <span>순위</span>
          <input
            type="text"
            id="prior"
            value={childInput.prior || ""}
            onChange={(e) => fnInput(e)}
            style={{ width: "68px" }}
            disabled
          />
        </li>

        <li style={{ width: "10%" }}>
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

        <li style={{ width: "8%" }}>
          <button
            type="button"
            className="formContentBtn"
            onClick={() => setRecommendClick(!recommendClick)}
            disabled={!!childInput.skid ? true : false}
            style={{ width: "100%" }}
          >
            키워드 추천
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
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);

  const [keywordInput, setKeywordInput] = useState([]);
  const [address, setAddress] = useState("서울양천구");
  const { cid } = useParams();
  const [clickModal, setClickModal] = useState(false);

  useEffect(() => {
    API.servicesPostData(APIURL.urlListAdminSalesKeyword, { rcid: cid }).then(
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

  useEffect(() => {
    const ADRESS = getedData.address;
    // 정규식을 사용하여 '구'까지의 정보 추출
    if (!!ADRESS) {
      const match = ADRESS.match(/([가-힣]+구)/);
      if (getedData.address.includes("구로구")) {
        setAddress("서울구로구");
      } else if (match && match[1]) {
        setAddress(match[1]);
      } else {
        setAddress("서울양천구");
      }
    }
  }, [getedData.address]);

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
      TOA.servicesUseToast("키워드는 최대 7개까지 입력 가능합니다.", "e");
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
      TOA.servicesUseToast("키워드는 최대 7개까지 입력 가능합니다.", "e");
    }
  };

  return (
    <>
      {/* 견적 관리 링크 이동 ================================================================ */}
      <fieldset>
        <h3> 판매키워드 ( 상위노출 )</h3>
        <ul className="companyWrap-keyword-buttonWrap">
          <li>
            <button
              style={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                width: "155px",
                backgroundColor: "#757575",
                color: "#fff",
              }}
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `https://map.naver.com/p/search/${address}`,
                  "팝업",
                  "width=1300,height=1000"
                );
              }}
            >
              {/* 주소 링크 */}
              <FaMapMarkerAlt style={{ marginTop: "5px" }} />
              <span style={{ textAlign: "left", width: "auto", color: "#fff" }}>
                {address}
              </span>
            </button>
          </li>
          <li style={{ width: "82%", paddingRight: "1%" }}>
            <span>
              * 등록된 키워드는 수정하실 수 없습니다. 삭제 후 이용해주세요.
            </span>
          </li>
          <li style={{ width: "10%" }}>
            <button id="allkeywordBtn" onClick={fnViewKeyword}>
              모든 키워드 보기
            </button>
          </li>
          <li style={{ width: "8%" }}>
            <button onClick={fnAddKeyword}>추가 입력</button>
          </li>
        </ul>

        {clickModal && (
          <ServiceModalSaleskeywordAllKeyword
            fn={fnAllKeywordChoose}
            clickModal={clickModal}
            setClickModal={setClickModal}
          />
        )}

        <div className="detailContent companyWrap-keyword-inputWrap">
          {keywordInput.map((data, i) => (
            <ChildKeyword key={i} data={data} index={i} />
          ))}
        </div>
      </fieldset>
    </>
  );
}
