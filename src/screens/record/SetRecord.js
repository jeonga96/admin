import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ServiceModalsealManager from "../../components/services/ServiceModalsealManager";

import * as API from "../../service/api";
import * as FM from "../../service/useData/format";
import * as STO from "../../service/useData/storage";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";
import * as MO from "../../service/library/modal";

export default function SetRecord() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cid, fid } = useParams();
  const CK_ADDPAGE = location.pathname.includes("add");

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {},
  });

  // 외부 API 사용 및 인터넷 환경에 따른 로딩시간 지연에 따른 로딩중 상태변경
  // 안심번호 검색 모달창
  const [click, setClick] = useState(false);
  const [submitCk, setSubmitCk] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPrev, setAudioPrev] = useState(null);
  const uid = useRef("");
  const res_cid = useRef("");

  CUS.useMountEffect(() => {
    // const offset = new Date();
    const TODAY = FM.serviesDatetoISOString();
    console.log(cid, fid);
    if (fid === "add") {
      setValue("_recordName", STO.servicesGetStorage("writer"));
      uid.current = STO.servicesGetStorage("uid");
      setValue("_date", TODAY.split("T")[0]);
      setValue("_time", TODAY.split("T")[1].slice(0, 5));
    }

    if (!!cid && fid === "add") {
      API.servicesPostData(APIURL.urlGetCompanyDetail, { rcid: cid }).then(
        (res) => {
          const RES = res.data;
          setValue("_cname", RES.name);
          setValue("_phoneNumber", RES.mobilenum || RES.telnum);
        }
      );
    }

    if (fid !== "add") {
      API.servicesPostData(APIURL.urlGetRecord, { fid: fid }).then((res) => {
        const RES = res.data;
        setValue("_recordType", RES.recordType);
        console.log(RES);
        uid.current = RES.recordUid;
        res_cid.current = RES.cid;
        setValue("_recordName", RES.recordName);
        setValue("_recordContents", RES.recordContents);
        setValue("_fileName", RES.fileName);
        setValue("_cname", RES.cname);
        setValue("_phoneNumber", RES.phoneNumber);
        setValue("_date", RES.telRecordTime?.split(" ")[0]);
        setValue("_time", RES.telRecordTime?.split(" ")[1]);
        setAudioPrev(RES.storagePath);
      });
    }
  });

  // 영업 담당자 조회 선택 함수
  const fnSelectAgent = async (item) => {
    console.log(item.ruid);
    console.log(item.name);
    uid.current = item.ruid;
    setValue("_recordName", item.name);
    setClick(false);
  };

  const fnRemove = () => {
    MO.servicesRecordModalRemoveCk(async () => {
      const formData = new FormData();
      formData.append("fid", fid);
      formData.append("useFlag", "0");

      await API.servicesPostDataForm(APIURL.urlSetRecord, formData);

      TOA.servicesUseToast("삭제되었습니다.", "s");
      if (cid) {
        setTimeout(() => navigate(`/company/${cid}/record`), 1000);
      } else {
        setTimeout(() => navigate(`/record`), 1000);
      }
    });
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // 파일 확장자 추출
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // 허용할 음성 파일 확장자 목록
      const allowedExtensions = [
        "mp3",
        "wav",
        "wav",
        "dsd",
        "pcm",
        "m4a",
        "aac",
        "flac",
        "aiff",
        "alac",
      ];

      // 파일 확장자가 허용된 음성 파일인지 확인
      if (allowedExtensions.includes(fileExtension)) {
        const fileURL = URL.createObjectURL(file); // 브라우저에서 미리보기 위해 사용
        setAudioPrev(fileURL);
        setAudioFile(file); // 파일 객체 저장
      } else {
        alert("음성 파일만 업로드할 수 있습니다.");
      }
    }
  };

  const fnSubmit = async () => {
    if (submitCk) return;

    if (!getValues("_recordType")) {
      TOA.servicesUseToast("녹취종류가 입력되지 않았습니다.", "e");
      return;
    }

    if (!audioPrev) {
      TOA.servicesUseToast("녹취파일을 업로드 해주세요.", "e");
      return;
    }

    setSubmitCk(true);

    const formData = new FormData();
    !CK_ADDPAGE && formData.append("fid", fid);
    audioFile && formData.append("files", audioFile);
    console.log(audioFile);
    formData.append("cid", cid || res_cid.current);
    formData.append("category", "통화녹취");
    formData.append("recordType", getValues("_recordType"));
    formData.append("recordUid", uid.current);
    formData.append("recordName", getValues("_recordName"));
    formData.append("recordContents", getValues("_recordContents"));
    formData.append("cname", getValues("_cname"));
    formData.append("phoneNumber", getValues("_phoneNumber"));
    formData.append(
      "telRecordTime",
      `${getValues("_date")} ${getValues("_time")}`
    );

    try {
      const response = await API.servicesPostDataForm(
        CK_ADDPAGE ? APIURL.urlAddRecord : APIURL.urlSetRecord,
        formData
      );

      if (response.status === "success") {
        TOA.servicesUseToast("완료되었습니다.", "s");
        if (cid) {
          setTimeout(() => navigate(`/company/${cid}/record`), 1000);
        } else {
          setTimeout(() => navigate(`/record`), 1000);
        }
      } else {
        TOA.servicesUseToast(response.message, "e");
      }
    } catch (error) {
      console.error("Error during record submission :", error);
      TOA.servicesUseToast(error.message, "e");
      setSubmitCk(false);
      if (error.response && error.response.data) {
        console.error("Server error message:", error.response.data);
      }
    }
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
          <ul className="tableTopWrap tableTopBorderWrap">
            <LayoutTopButton
              url={cid ? `/company/${cid}/record` : `/record`}
              text="목록으로 가기"
            />
            <LayoutTopButton text={"삭제"} fn={fnRemove} />

            <LayoutTopButton text={"완료"} isSubmitting={isSubmitting} />
          </ul>

          <div className="formWrap">
            <div className="formContainer">
              <h3>녹취록 관리</h3>
              <fieldset id="CompanyDetail_1">
                <h3>녹취록 기본 정보</h3>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>녹취종류</span>
                  </div>
                  <div className="formPaddingWrap">
                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_recordType") == "계약"}
                      value="계약"
                      id="recordType1"
                      {...register("_recordType")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="recordType1"
                    >
                      계약
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_recordType") == "민원"}
                      value="민원"
                      id="recordType2"
                      {...register("_recordType")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="recordType2"
                    >
                      민원
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_recordType") == "해지"}
                      value="해지"
                      id="recordType3"
                      {...register("_recordType")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="recordType3"
                    >
                      해지
                    </label>

                    <input
                      className="listSearchRadioInput"
                      type="radio"
                      checked={watch("_recordType") == "기타"}
                      value="기타"
                      id="recordType4"
                      {...register("_recordType")}
                    />
                    <label
                      className="listSearchRadioLabel"
                      htmlFor="recordType4"
                    >
                      기타
                    </label>
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "50%" }}>
                  <label htmlFor="recordName" className="blockLabel">
                    <span>녹취자</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      id="recordName"
                      disabled
                      {...register("_recordName")}
                    />
                    <button
                      type="button"
                      className="formContentBtn"
                      style={{
                        width: "160px",
                        backgroundColor: "#757575",
                        color: "#fff",
                      }}
                      onClick={() => setClick(!click)}
                    >
                      녹취자 조회
                    </button>
                    {click && (
                      <ServiceModalsealManager
                        fn={fnSelectAgent}
                        setClick={setClick}
                        click={click}
                      />
                    )}
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="date" className="blockLabel">
                    <span>녹취일시</span>
                  </label>
                  <div>
                    <input
                      type="date"
                      id="date"
                      style={{ width: "50%", marginBottom: "0" }}
                      {...register("_date")}
                    />
                    <input
                      type="time"
                      step="60"
                      id="time"
                      style={{ width: "50%" }}
                      {...register("_time")}
                    />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>녹취내용</span>
                  </div>
                  <div className="formPaddingWrap">
                    <textarea {...register("_recordContents")} />
                  </div>
                </div>

                <div className="formContentWrap" style={{ width: "100%" }}>
                  <div className="blockLabel">
                    <span>녹취파일 업로드</span>
                  </div>
                  <div style={{ display: "flex" }}>
                    {CK_ADDPAGE && (
                      <>
                        <input
                          type="file"
                          id="audio-upload"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="audio-upload"
                          style={{
                            cursor: "pointer",
                            padding: "0 20px",
                            lineHeight: "28px",
                            backgroundColor: "rgb(241,243,244)",
                            border: "solid 1px rgb(200, 200, 200)",
                            color: "#222",
                            borderRadius: "2px",
                            display: "inline-block",
                          }}
                        >
                          {audioPrev ? "녹취록 수정" : "녹취록 업로드"}
                        </label>
                      </>
                    )}
                    {audioPrev && <audio controls src={audioPrev} />}
                    {audioPrev && (
                      <span style={{ lineHeight: "30px", color: "#888" }}>
                        오른쪽의 점 세개 아이콘을 클릭하시면 보이는 다운로드
                        버튼으로 다운로드 가능
                      </span>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset id="CompanyDetail_2">
                <h3>사업자 회원 정보</h3>

                <div className="formContentWrap">
                  <label htmlFor="cname" className="blockLabel">
                    <span>상호명</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="cname"
                      disabled={CK_ADDPAGE ? false : true}
                      {...register("_cname")}
                    />
                  </div>
                </div>

                <div className="formContentWrap">
                  <label htmlFor="phoneNumber" className="blockLabel">
                    <span>휴대폰</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="phoneNumber"
                      maxLength={13}
                      disabled={CK_ADDPAGE ? false : true}
                      value={
                        (watch("_phoneNumber") &&
                          watch("_phoneNumber")
                            .replace(/[^0-9]/g, "")
                            .replace(
                              /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                              "$1-$2-$3"
                            )
                            .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
                            .replace("--", "-")) ||
                        ""
                      }
                      {...register("_phoneNumber")}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
