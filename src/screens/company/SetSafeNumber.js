import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import PieceLoading from "../../components/piece/PieceLoading";
import ServiceModalUseSafeNumber from "../../components/services/ServiceModalUseSafeNumber";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

export default function Set050Biz() {
  const navigate = useNavigate();
  const { cid, vno } = useParams();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      _colorringIdx: 119158,
      _rcvMentIdx: 119159,
      _bizEndMentIdx: 119160,
      _holiMentIdx: 119161,
      _bizStartTime: "00:00",
      _bizEndTime: "23:59",
      _status: "Y",
      _holiWeek1: 1,
      _holiWeek2: 1,
      _holiWeek3: 1,
      _holiWeek4: 1,
      _holiWeek5: 1,
      _holiDay7: 1,
      _holiDay1: 1,
      _holiDay2: 1,
      _holiDay3: 1,
      _holiDay4: 1,
      _holiDay5: 1,
      _holiDay6: 1,
      _recType: 1,
    },
  });

  // holiWeek, HoliDay의 전달 규칙 -> "11100"
  const arrHoliWeek = [
    getValues("_holiWeek1"),
    getValues("_holiWeek2"),
    getValues("_holiWeek3"),
    getValues("_holiWeek4"),
    getValues("_holiWeek5"),
  ];
  const arrHoliDay = [
    getValues("_holiDay1"),
    getValues("_holiDay2"),
    getValues("_holiDay3"),
    getValues("_holiDay4"),
    getValues("_holiDay5"),
    getValues("_holiDay6"),
    getValues("_holiDay7"),
  ];

  // 외부 API 사용 및 인터넷 환경에 따른 로딩시간 지연에 따른 로딩중 상태변경
  const [loading, setLoading] = useState(false);
  // 안심번호 검색 모달창
  const [click, setClick] = useState(false);

  // arrHoliWeek, arrHoliDay의 string 값을 각각의 register에 할당
  const fnArrToSetValue = (arr) => {
    arr.forEach((el, i) => {
      arr.length === 5
        ? setValue(`_holiWeek${i + 1}`, el)
        : setValue(`_holiDay${i + 1}`, el);
    });
  };

  // 안심번호 삭제
  const fnClear = () => {
    API.servicesPostData(STR.urlClear050, { vno: vno }).then((res) => {
      if (res.status === "success") {
        API.servicesPostData(STR.urlSetCompanyDetail, {
          rcid: cid,
          extnum: "",
        }).then((res) => {
          setLoading(true);
          if (res.status === "success") {
            setLoading(false);
            UD.servicesUseToast("삭제가 완료되었습니다.", "s");
            setTimeout(() => {
              navigate(`/company/${cid}`);
            }, 2000);
            return;
          }
        });
      } else {
        UD.servicesUseToast(
          "삭제가 진행되지 않았습니다. 관리자에게 문의해 주십시오.",
          "e"
        );
      }
    });
  };

  // 안심번호 검색 & 사용할 수 있는 안심번호 리스트 중 가장 앞 작은 안심번호 사지고 오기
  const fnSelectSafeNum = (selectNum, e) => {
    if (e !== undefined) {
      setClick(false);
    }
    setValue("_vno", selectNum);
  };

  // 수정 & 추가 버튼 클릭 이벤트
  const fnSubmit = () => {
    const HOLIDAY = UD.serviesBoolToNumber(arrHoliDay);
    const HOLIWEEK = UD.serviesBoolToNumber(arrHoliWeek);

    const VNO = getValues("_vno").replaceAll("-", "").toString();
    const RCVNO1 = getValues("_rcvNo1").replaceAll("-", "").toString();
    const RCVNO2 = !!getValues("_rcvNo2")
      ? getValues("_rcvNo2").replaceAll("-", "").toString()
      : "";
    return API.servicesPostData(!!vno ? STR.urlUpdate050 : STR.urlCreate050, {
      channelId: "wazzang",
      vno: VNO,
      vnoName: getValues("_vnoName"),
      status: getValues("_status"),
      rcvNo1: RCVNO1,
      rcvNo2: RCVNO2,
      bizStartTime: getValues("_bizStartTime").replace(":", "").toString(),
      bizEndTime: getValues("_bizEndTime").replace(":", "").toString(),
      colorringIdx: getValues("_colorringIdx"),
      rcvMentIdx: getValues("_rcvMentIdx"),
      bizEndMentIdx: getValues("_bizEndMentIdx"),
      holiMentIdx: getValues("_holiMentIdx"),
      holiWeek: HOLIWEEK,
      holiDay: HOLIDAY,
      holidaySet: "N",
      recType: getValues("_recType"),
    })
      .then((res) => {
        if (res.status === "success") {
          API.servicesPostData(STR.urlSetCompanyDetail, {
            rcid: cid,
            extnum: getValues("_vno"),
          }).then((res) => {
            setLoading(true);
            if (res.status === "success") {
              setLoading(false);
              UD.servicesUseToast("완료되었습니다!", "s");
              setTimeout(() => {
                navigate(`/company/${cid}`);
              }, 2000);
              return;
            }
          });
        } else {
          UD.servicesUseToast(res.emsg, "e");
        }
      })
      .catch((error) => {
        console.log(error);
        UD.servicesUseToast("작업이 완료되지 않았습니다.", "e");
      });
  };

  // 첫 랜더링 시
  // 안심번호 추가 : 서버에 저장된 cid에 저장된 값을 가지고 오거나
  // 안심번호 수정 : 서버에 저장된 vno값 가지고 온다
  useEffect(() => {
    if (!!cid && !vno) {
      API.servicesPostData(STR.urlGetCompanyDetail, { rcid: cid }).then(
        (res) => {
          setValue("_vnoName", res.data.name || "");
          setValue("_rcvNo1", res.data.mobilenum || "");
          setValue("_rcvNo2", res.data.telnum || "");
        }
      );
    }

    if (!!vno) {
      setLoading(true);
      API.servicesPostData(STR.urlGet050, { vno: vno }).then((res) => {
        setLoading(false);
        setValue("_regDate", res.data.regDate || "");
        setValue("_vno", res.data.vno || "");
        setValue("_status", res.data.status || "Y");
        setValue("_vnoName", res.data.vnoName || "");
        setValue("_rcvNo1", res.data.rcvNo1 || "");
        setValue("_rcvNo2", res.data.rcvNo2 || "");

        setValue("_colorringIdx", res.data.colorringIdx);
        setValue("_rcvMentIdx", res.data.rcvMentIdx);
        setValue("_bizEndMentIdx", res.data.bizEndMentIdx);
        setValue("_holiMentIdx", res.data.holiMentIdx);

        setValue(
          "_bizStartTime",
          UD.serviesStringToTime(res.data.bizStartTime) || "00:00"
        );
        setValue(
          "_bizEndTime",
          UD.serviesStringToTime(res.data.bizEndTime) || "23:59"
        );
        fnArrToSetValue(UD.serviesNumberToBool(res.data.holiWeek));
        fnArrToSetValue(UD.serviesNumberToBool(res.data.holiWeek));
        setValue("_recType", res.data.recType || "");
      });
    }
  }, []);

  return (
    <>
      <PieceLoading loading={loading} bg />

      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            <LayoutTopButton url={`/company/${cid}`} text="상세정보 가기" />
            <LayoutTopButton fn={fnClear} text="안심번호 삭제" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>기본 안심번호 정보</h3>

              <ServiceModalUseSafeNumber
                click={click}
                setClick={setClick}
                fn={fnSelectSafeNum}
              />

              {/* setDetailUserInfo  ================================================================ */}
              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="vno" className=" blockLabel">
                  <span>안심번호</span>
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    id="vno"
                    maxLength="14"
                    value={
                      (watch("_vno") &&
                        watch("_vno")
                          .replace(/[^0-9]/g, "")
                          .replace(/(^[0-9]{4})([0-9]+)([0-9]{4}$)/, "$1-$2-$3")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_vno")}
                    disabled={!!vno ? true : false}
                  />
                  <button
                    type="button"
                    className="formContentBtn"
                    onClick={() => setClick(!click)}
                    disabled={!!vno ? true : false}
                  >
                    안심번호 검색
                  </button>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="vnoName" className="blockLabel">
                  <span>별칭</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="vnoName"
                    maxLength={20}
                    {...register("_vnoName")}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>사용여부</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_status") == "Y"}
                    value="Y"
                    id="statusY"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="statusY">
                    사용
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_status") == "N"}
                    value="N"
                    id="statusN"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="statusN">
                    미사용
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="rcvNo1" className="blockLabel">
                  <span>[ 필수 ] 착신번호 1</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="rcvNo1"
                    maxLength={13}
                    value={
                      (watch("_rcvNo1") &&
                        watch("_rcvNo1")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_rcvNo1")}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="rcvNo2" className="blockLabel">
                  <span>착신번호 2</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="rcvNo2"
                    maxLength={13}
                    value={
                      (watch("_rcvNo2") &&
                        watch("_rcvNo2")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_rcvNo2")}
                  />
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <div className="blockLabel">
                  <span>녹음선택</span>
                </div>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_recType") == 0}
                    value="0"
                    id="recType0"
                    {...register("_recType")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="recType0">
                    미사용
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_recType") == 1}
                    value="1"
                    id="recType1"
                    {...register("_recType")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="recType1">
                    일반녹취
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_recType") == 2}
                    value="2"
                    id="recType2"
                    {...register("_recType")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="recType2">
                    수발신 분리녹취
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <h3>전화연결 문구 관리</h3>
              <div className="formContentWrap" style={{ width: "50%" }}>
                <label htmlFor="_colorringIdx" className="blockLabel">
                  <span>컬러링</span>
                </label>
                <div>
                  <select
                    {...register("_colorringIdx")}
                    style={{ width: "100%" }}
                  >
                    <option value="119158">기본 컬러링 - 공사콕 문의</option>
                    <option value="0">사용안함</option>
                  </select>
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "50%" }}>
                <label htmlFor="_rcvMentIdx" className="blockLabel">
                  <span>착신멘트</span>
                </label>
                <div>
                  <select
                    {...register("_rcvMentIdx")}
                    style={{ width: "100%" }}
                  >
                    <option value="119159">기본 착신멘트 - 공사콕 문의</option>
                    <option value="0">사용안함</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <h3>휴일 관리</h3>
              <div className="formContentWrap">
                <label htmlFor="bizStartTime" className="blockLabel">
                  <span>업무시작시간</span>
                </label>
                <div>
                  <input
                    type="time"
                    id="bizStartTime"
                    {...register("_bizStartTime")}
                  />
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="bizEndTime" className="blockLabel">
                  <span>업무종료시간</span>
                </label>
                <div>
                  <input
                    type="time"
                    id="bizEndTime"
                    {...register("_bizEndTime")}
                  />
                </div>
              </div>
              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="bizEndMentIdx" className="blockLabel">
                  <span>업무외시간 안내멘트</span>
                </label>
                <div>
                  <select id="bizEndMentIdx" {...register("_bizEndMentIdx")}>
                    <option value="119160">
                      기본 안내멘트 - 오늘 영업시간이 종료되었습니다
                    </option>
                    <option value="0">사용안함</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <h3>휴일 관리</h3>
              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="holiWeek" className="blockLabel">
                  <span>영업 주 선택</span>
                </label>
                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiWeek1"
                    {...register("_holiWeek1")}
                  />
                  <label htmlFor="holiWeek1" className="listSearchRadioLabel">
                    첫주
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiWeek2"
                    {...register("_holiWeek2")}
                  />
                  <label htmlFor="holiWeek2" className="listSearchRadioLabel">
                    두번째주
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiWeek3"
                    {...register("_holiWeek3")}
                  />
                  <label htmlFor="holiWeek3" className="listSearchRadioLabel">
                    세번째주
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiWeek4"
                    {...register("_holiWeek4")}
                  />
                  <label htmlFor="holiWeek4" className="listSearchRadioLabel">
                    네번째주
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiWeek5"
                    {...register("_holiWeek5")}
                  />
                  <label htmlFor="holiWeek5" className="listSearchRadioLabel">
                    다섯번째주
                  </label>
                </div>
              </div>

              {/* 휴무 - 요일 선택 */}
              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="rcvNo1" className="blockLabel">
                  <span>엽업 요일 선택</span>
                </label>

                <div className="formPaddingWrap">
                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiDay1"
                    {...register("_holiDay1")}
                  />
                  <label htmlFor="holiDay1" className="listSearchRadioLabel">
                    일
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiDay2"
                    {...register("_holiDay2")}
                  />
                  <label htmlFor="holiDay2" className="listSearchRadioLabel">
                    월
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiDay3"
                    {...register("_holiDay3")}
                  />
                  <label htmlFor="holiDay3" className="listSearchRadioLabel">
                    화
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiDay4"
                    {...register("_holiDay4")}
                  />
                  <label htmlFor="holiDay4" className="listSearchRadioLabel">
                    수
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiDay5"
                    {...register("_holiDay5")}
                  />
                  <label htmlFor="holiDay5" className="listSearchRadioLabel">
                    목
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiDay6"
                    {...register("_holiDay6")}
                  />
                  <label htmlFor="holiDay6" className="listSearchRadioLabel">
                    금
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="checkbox"
                    id="holiDay7"
                    {...register("_holiDay7")}
                  />
                  <label htmlFor="holiDay7" className="listSearchRadioLabel">
                    토
                  </label>
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="holiMentIdx" className="blockLabel">
                  <span>휴일 안내멘트</span>
                </label>
                <div>
                  <select id="holiMentIdx" {...register("_holiMentIdx")}>
                    <option value="119161">
                      공사콕 기본 안내멘트 - 죄송합니다. 오늘은 휴일입니다.
                    </option>
                    <option value="0">사용안함</option>
                  </select>
                </div>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
