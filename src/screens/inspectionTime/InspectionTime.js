// 대기 상태 사업자 회원 관리

// import { useDispatch, useSelector, shallowEqual } from "react-redux";
// import { Link } from "react-router-dom";
// import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";

// 부모 ==============================================================================
export default function InspectionTime() {
  const [data, setData] = useState("");
  const { register, setValue, getValues } = useForm();

  useEffect(() => {
    API.servicesPostData(APIURL.urlGetInspectionTime, {}).then((res) => {
      if (res !== undefined && !!res.data) {
        const fetchData = res.data;
        console.log(fetchData);
        const startDate = fetchData.startTime
          .split("/")[0]
          .trim()
          .replaceAll(" ", "-");
        const endDate = fetchData.endTime
          .split("/")[0]
          .trim()
          .replaceAll(" ", "-");
        setValue("_startDate", startDate);
        setValue("_endDate", endDate);

        setValue(
          "_endTime",
          fetchData.endTime.split("/")[1].trim().replaceAll(" ", "")
        );

        setValue(
          "_startTime",
          fetchData.startTime.split("/")[1].trim().replaceAll(" ", "")
        );
        setData(fetchData);
        setValue("_description", fetchData.description);
      }
    });
  }, []);

  const fnModify = () => {
    API.servicesPostData(APIURL.urlSetInspectionTime, {
      itid: data.itid,
      useFlag: 0,
    }).then((res) => {
      if (res.status === "success") {
        TOA.servicesUseToast("점검 예고가 비활성화 되었습니다.", "s");
        window.location.reload();
      }
    });
  };

  const fnAdd = () => {
    if (!getValues("_startDate") || !getValues("_startTime"))
      return TOA.servicesUseToast("점검 시작시간을 입력해 주세오.");

    if (!getValues("_endDate") || !getValues("_endTime"))
      return TOA.servicesUseToast("점검 종료시간을 입력해 주세오.");

    const startDate = getValues("_startDate").replaceAll("-", " ");
    const startTime_T = getValues("_startTime").split(":")[0];
    const startTime_M = getValues("_startTime").split(":")[1];

    const entDate = getValues("_endDate").replaceAll("-", " ");
    const endTime_T = getValues("_endTime").split(":")[0];
    const endTime_M = getValues("_endTime").split(":")[1];

    API.servicesPostData(APIURL.urlAddInspectionTime, {
      startTime: `${startDate} / ${startTime_T} : ${startTime_M} : 00`,
      endTime: `${entDate} / ${endTime_T} : ${endTime_M} : 00`,
      description: getValues("_description"),
    }).then((res) => {
      if (res.status === "success") {
        TOA.servicesUseToast("점검예고가 등록되었습니다.", "s");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        TOA.servicesUseToast(
          "활성화된 점검 예고가 있으면 새로운 점검 예고가 저장되지 않습니다.",
          "e"
        );
      }
    });
  };

  return (
    <div className="imspectionTimeWrap">
      <div className="btnWrap">
        {data ? (
          <button onClick={fnModify}>비활성화</button>
        ) : (
          <button onClick={fnAdd}>추가</button>
        )}
      </div>
      <div className="contentWrap">
        <div className="contentInnerManual" style={{ marginBottom: "30px" }}>
          <span>
            - 점검일은 화면에 표시되는 시간일 뿐 자동으로 비활성화되지 않습니다.
            점검이 완료되면 직접 비활성화를 해주셔야 합니다.
          </span>
          <span>
            - 알림문구를 입력하지 않으면 기본설정된 문구로 표시됩니다.
          </span>
        </div>

        <div className="timeContent">
          <div>
            <h4>점검 시작시간</h4>
            <input
              type="date"
              {...register("_startDate")}
              disabled={!!data && true}
            />
            <input
              type="time"
              disabled={!!data && true}
              {...register("_startTime")}
            />
          </div>
          <div>
            <h4>점검 종료시간</h4>
            <input
              type="date"
              disabled={!!data && true}
              {...register("_endDate")}
            />
            <input
              type="time"
              disabled={!!data && true}
              {...register("_endTime")}
            />
          </div>
        </div>
        <div className="description">
          <h4>알림문구</h4>
          {/* <span>
            * 알림문구를 입력하지 않으면 기본설정된 문구로 표시됩니다.
          </span> */}
          <input
            disabled={!!data && true}
            maxLength={30}
            placeholder="서비스를 최적화하기 위해 점검중이니 사용에 참고하시길 바랍니다."
            {...register("_description")}
          />
        </div>
      </div>
    </div>
  );
}
