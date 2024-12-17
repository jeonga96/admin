import { useForm } from "react-hook-form";
import { useState } from "react";
import { MdError, MdCheckCircle } from "react-icons/md";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";
import * as SAFE from "../../service/useData/safenumber";
import * as CUS from "../../service/customHook";
import * as MO from "../../service/library/modal";

import ComponentLoading from "../../components/piece/PieceLoadingDetail";
import * as STR from "../../service/string/stringtoconst";

export default function SafeNumberUpload() {
  const { register, watch, reset, setValue } = useForm();

  const [loading, setLoading] = useState([]);
  const [removeloading, setRemoveLoading] = useState(false);
  const [errorWrap, setErrorWrap] = useState([]);
  const [successWrap, setSuccessWrap] = useState([]);

  const FROMCID = watch("_fromCid") * 1;
  const TOCID = watch("_toCid") * 1;
  let RemoveCount = 0;

  CUS.useCleanupEffect(() => {
    if (FROMCID) {
      setValue("_toCid", FROMCID);
    }
  }, [FROMCID]);

  function handleReset() {
    reset();
    setErrorWrap([]);
    setSuccessWrap([]);
    setLoading([]);
  }

  async function handleModalOpen(e) {
    e.preventDefault();

    if (!FROMCID || !TOCID) {
      TOA.servicesUseToast("값이 입력되지 않았습니다.", "e");
      return;
    }

    if (TOCID - FROMCID >= 100) {
      TOA.servicesUseToast(
        "한 번에 100개 이하의 번호만 입력할 수 있습니다.",
        "e"
      );
      return;
    }

    if (FROMCID > TOCID) {
      TOA.servicesUseToast("두번째 입력 칸의 값이 더 커야 합니다.", "e");
      return;
    }

    // for...of 루프 사용
    const numberArray = Array.from(
      { length: TOCID - FROMCID + 1 },
      (_, index) => FROMCID + index
    );

    for (let i of numberArray) {
      console.log("!!", i, numberArray[numberArray.length - 1]);
      try {
        const res = await API.servicesPostData(APIURL.urlGetCompanyDetail, {
          rcid: i,
        });

        if (res.status === "fail") {
          setErrorWrap((res) => [
            ...res,
            { cid: i, message: "존재하지 않는 사업자 관리번호입니다." },
          ]);
          setLoading((res) => [...res, i]);
        } else if (!res.data.mobilenum && !res.data.telnum) {
          setErrorWrap((res) => [
            ...res,
            {
              cid: i,
              message: "휴대폰와 일반번호가 입력되지 않았습니다.",
            },
          ]);
          setLoading((res) => [...res, i]);
        } else if (res.data.extnum) {
          setErrorWrap((res) => [
            ...res,
            {
              cid: i,
              message: "안심번호가 연결되어 있습니다.",
            },
          ]);
          setLoading((res) => [...res, i]);
        } else if (
          res.data.mobilenum &&
          res.data.mobilenum.endsWith("9999-9999") &&
          res.data.telnum &&
          res.data.telnum.endsWith("9999-9999")
        ) {
          setErrorWrap((res) => [
            ...res,
            {
              cid: i,
              message: "9999-9999로 작성된 임시 번호입니다.",
            },
          ]);
          setLoading((res) => [...res, i]);
        } else {
          await SAFE.serviesSafeNumBigDataSetting(
            i,
            res.data,
            setLoading,
            setErrorWrap,
            setSuccessWrap
          );
        }
      } catch (error) {
        console.error(`${i}번에서 오류가 발생했습니다.`, error);
      }
    }
  }

  function handleRemove() {
    setRemoveLoading(true);
    const fnRemove = async () => {
      const responese = await API.servicesPostData(
        APIURL.urlCompanylist,

        {
          offset: 0,
          size: STR.FIRST_SAFENUM_1000 + STR.SECOND_SAFENUM_10000 * 2,
          // size: 10000,
          telnum: "0507",
        }
      );
      const data = responese.data;

      for (let i = 0; i < data.length; i++) {
        let res;
        if (!!data[i].extnum) {
          res = await API.servicesPostData(APIURL.urlClear050, {
            vno: data[i].extnum.replaceAll("-", ""),
          });
        }
        if (res && res.status === "success") {
          const companyDetailRes = await API.servicesPostData(
            APIURL.urlSetCompanyDetail,
            { rcid: data[i].cid, extnum: "" }
          );

          if (companyDetailRes.status === "success") {
            setSuccessWrap((res) => [
              ...res,
              {
                cid: data[i].cid,
                message: `${data[i].extnum} : 삭제처리 되었습니다.`,
              },
            ]);
          } else {
            setErrorWrap((res) => [
              ...res,
              {
                cid: data[i].cid,
                message: `관리자 페이지에서 오류가 발생했습니다. `,
              },
            ]);
          }
        } else {
          setErrorWrap((res) => [
            ...res,
            {
              cid: data[i].cid,
              message: data[i].extnum
                ? res.emsg
                : "안심번호가 저장되지 않은 사업자관리번호 입니다.",
            },
          ]);
        }
      }

      setRemoveLoading(false);
      alert("안심번호가 모두 삭제되었습니다.");
    };

    MO.servicesUseModalExtnumDelete(
      "안심번호를 모두 삭제하시겠습니까?",
      "삭제된 후에는 되돌릴 수 없습니다. 다시 확인해 주세요.",
      fnRemove,
      () => {}
    );
  }

  return (
    <div className="commonBox" style={{ position: "relative" }}>
      <h3 className="blind">사업자관리 검색 필터</h3>
      {RemoveCount > 0 ? (
        <ComponentLoading allFileCount={RemoveCount} loading={loading} />
      ) : (
        <ComponentLoading
          allFileCount={TOCID - FROMCID + 1}
          loading={loading}
        />
      )}

      <div className="contentInnerManual">
        {APIURL.urlPrefix !== "https://releaseawsback.gongsacok.com" && (
          <span style={{ color: "red" }}>
            - 개발서버, 테스트 서버에선 해당 기능을 사용할 수 없습니다.
          </span>
        )}
        <span>- 사업자 회원 관리번호를 이용하여 안심번호를 생성합니다.</span>
        <span>
          - 사업자 상세 회원 관리의 휴대폰, 일반전화, 홍보용 상호를 이용하여
          안심번호를 생성합니다.
        </span>
      </div>

      <form className="formLayout">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="safenumUpload">
            <span>사업자 관리 번호</span>
            <input type="number" required {...register("_fromCid")} />
            <span>번 부터</span>
            <input type="number" required {...register("_toCid")} />
            <span>번 까지</span>
          </div>
          <div className="safenumTextWrap">
            {removeloading && <div className="safenumContnetBg"></div>}
            <p>
              <MdCheckCircle style={{ color: "green" }} />
              <span style={{ color: "green" }}>완료</span>
            </p>
            <div className="safenumContnetWrap">
              {successWrap.length > 0 ? (
                successWrap.map((item, key) => (
                  <div key={key}>
                    <span style={{ backgroundColor: "green" }}>{item.cid}</span>
                    <span>{item.message}</span>
                  </div>
                ))
              ) : (
                <div>
                  <div>완료된 관리번호가 없습니다.</div>
                </div>
              )}
            </div>
          </div>
          <div className="safenumTextWrap">
            {removeloading && <div className="safenumContnetBg"></div>}
            <p>
              <MdError style={{ color: "#da3933" }} />
              <span style={{ color: "#da3933" }}>오류</span>
            </p>
            <div className="safenumContnetWrap">
              {errorWrap.length > 0 ? (
                errorWrap.map((item, key) => (
                  <div key={key}>
                    <span>{item.cid}</span>
                    <span>{item.message}</span>
                  </div>
                ))
              ) : (
                <div>
                  <div>거부된 관리번호가 없습니다.</div>
                </div>
              )}
            </div>
          </div>
        </div>
        {APIURL.urlPrefix === "https://releaseawsback.gongsacok.com" && (
          <div className="listSearchButtonWrap">
            <button
              type="button"
              onClick={handleReset}
              style={{ width: "135px" }}
            >
              초기화
            </button>

            <button
              type="button"
              onClick={handleModalOpen}
              style={{
                width: "135px",
                backgroundColor: "green",
                color: "white",
              }}
            >
              안심번호 등록
            </button>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                width: "135px",
                backgroundColor: "#da3933",
                color: "white",
              }}
            >
              안심번호 전체 삭제
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
