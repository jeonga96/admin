import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentTableTopNumber from "../components/common/ComponentTableTopNumber";

import { servicesPost050biz, servicesPostData } from "../Services/importData";
import {
  servicesUseToast,
  serviesBoolToNumber,
  serviesStringToTime,
  serviesNumberToBool,
} from "../Services/useData";
import {
  urlCreate050,
  urlUpdate050,
  urlGet050,
  urlSetCompanyDetail,
} from "../Services/string";

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
      _status: 1,
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
    },
  });

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

  const fnArrToSetValue = (arr) => {
    arr.forEach((el, i) => {
      arr.length === 5
        ? setValue(`_holiWeek${i + 1}`, el)
        : setValue(`_holiDay${i + 1}`, el);
    });
  };

  useEffect(() => {
    if (!!vno) {
      servicesPost050biz(urlGet050, { vno: vno }).then((res) => {
        setValue("_regDate", res.data.regDate || "");
        setValue("_vno", res.data.vno || "");
        setValue("_vnoName", res.data.vnoName || "");
        setValue("_rcvNo1", res.data.rcvNo1 || "");
        setValue("_rcvNo2", res.data.rcvNo2 || "");
        setValue("_rcvNo2", res.data.rcvNo2 || "");
        setValue("_colorringIdx", res.data.colorringIdx || "");
        setValue("_rcvMentIdx", res.data.rcvMentIdx || "");
        setValue("_bizEndMentIdx", res.data.bizEndMentIdx || "");
        setValue("_holiMentIdx", res.data.holiMentIdx || "");
        setValue(
          "_bizStartTime",
          serviesStringToTime(res.data.bizStartTime) || ""
        );
        setValue("_bizEndTime", serviesStringToTime(res.data.bizEndTime) || "");
        fnArrToSetValue(serviesNumberToBool(res.data.holiWeek));
        fnArrToSetValue(serviesNumberToBool(res.data.holiWeek));
        setValue("_recType", res.data.recType || "");
      });
    }
  }, []);

  // 수정 & 추가 버튼 클릭 이벤트
  function fnSubmit(e) {
    const HOLIDAY = serviesBoolToNumber(arrHoliDay);
    const HOLIWEEK = serviesBoolToNumber(arrHoliWeek);

    const STARTTIME = getValues("_bizStartTime").replace(":", "");
    const ENDTIME = getValues("_bizEndTime").replace(":", "");

    const VNO = getValues("_vno").replace("-", "");
    const RCVNO1 = getValues("_rcvNo1").replace("-", "");
    const RCVNO2 = getValues("_rcvNo2").replace("-", "");

    servicesPost050biz(!!vno ? `${urlUpdate050}/${vno}` : urlCreate050, {
      channelId: "gongsacok-basic",
      vno: VNO,
      vnoName: getValues("_vnoName"),
      rcvNo1: RCVNO1,
      rcvNo2: RCVNO2,
      colorringIdx: getValues("_colorringIdx"),
      rcvMentIdx: getValues("_rcvMentIdx"),
      bizEndMentIdx: getValues("_bizEndMentIdx"),
      holiMentIdx: getValues("_holiMentIdx"),
      bizStartTime: STARTTIME,
      bizEndTime: ENDTIME,
      holiWeek: HOLIWEEK,
      holiDay: HOLIDAY,
      recType: getValues("_recType"),
    }).then((res) => {
      if (res.status === "success") {
        servicesPostData(urlSetCompanyDetail, {
          rcid: cid,
          extnum: getValues("_vno"),
        }).then((res) => {
          if (res.status === "success") {
            servicesUseToast("완료되었습니다!", "s");
            setTimeout(() => {
              navigate(`company/${cid}`);
            }, 2000);
            return;
          }
        });
      }
    });
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            {vno && (
              <ComponentTableTopNumber
                title="등록일자"
                text={"20232312323"}
                // text={watch("_regDate")}
              />
            )}
            <LayoutTopButton url={`/company/${cid}`} text="상세정보 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formWrap">
            <fieldset id="CompanyDetail_1">
              <h3>050 서비스</h3>

              {/* setDetailUserInfo  ================================================================ */}
              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="vno" className=" blockLabel">
                  <span>가상번호</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="vno"
                    maxLength="13"
                    value={
                      (watch("_vno") &&
                        watch("_vno")
                          .replace(/[^0-9]/g, "")
                          .replace(/(^[0-9]{3})([0-9]+)([0-9]{4}$)/, "$1-$2-$3")
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_vno")}
                  />
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
                    {...register("_vnoName", {})}
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
                    checked={watch("_status") == 0}
                    value="0"
                    id="status0"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="status0">
                    사용
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_status") == 1}
                    value="1"
                    id="status1"
                    {...register("_status")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="status1">
                    미사용
                  </label>
                </div>
              </div>

              <div className="formContentWrap">
                <label htmlFor="rcvNo1" className="blockLabel">
                  <span>착신번호 1 (필수)</span>
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
                    {...register("_rcvNo1", {})}
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
                      (watch("rcvNo2") &&
                        watch("rcvNo2")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("rcvNo2")}
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

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="_colorringIdx" className="blockLabel">
                  <span>컬러링</span>
                </label>
                <div>
                  <select {...register("_colorringIdx")}>
                    <option value="0">사용안함</option>
                    <option value="1">컬러링 구분은 뭘로 된거지</option>
                  </select>
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="_rcvMentIdx" className="blockLabel">
                  <span>착신멘트</span>
                </label>
                <div>
                  <select {...register("_rcvMentIdx")}>
                    <option value="0">사용안함</option>
                    <option value="2">착신멘트 구분은 뭘로 된거지</option>
                  </select>
                </div>
              </div>

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
                    <option value="0">사용안함</option>
                    <option value="1">다른문구</option>
                  </select>
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="holiMentIdx" className="blockLabel">
                  <span>휴일 안내멘트</span>
                </label>
                <div>
                  <select {...register("_holiMentIdx")}>
                    <option value="0">사용안함</option>
                    <option value="2">다른문구</option>
                  </select>
                </div>
              </div>

              <div className="formContentWrap" style={{ width: "100%" }}>
                <label htmlFor="holiWeek" className="blockLabel">
                  <span>휴무 - 주 선택</span>
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
                  <span>휴무 - 요일 선택</span>
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
                  <span>휴일 안내 멘트</span>
                </label>
                <div>
                  <select id="holiMentIdx" {...register("_holiMentIdx")}>
                    <option value="0">사용안함</option>
                    <option value="1">다른문구</option>
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
