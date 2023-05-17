import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData, servicesGetStorage } from "../Services/importData";

import {
  serviesPostDataSettingRcid,
  servicesUseToast,
  servicesUseModal,
} from "../Services/useData";

import {
  urlGetCompanyDetail,
  urlSetCompanyDetail,
  urlSetCompany,
  urlSetUser,
  urlGetUser,
  urlGetCompany,
  urlGetUserDetail,
} from "../Services/string";
import SetImage from "../components/common/ServicesImageSetPreview";
import LayoutTopButton from "../components/common/LayoutTopButton";
import PieceRegisterSearchPopUp from "../components/common/PieceRegisterSearchPopUp";

export default function SetRequiredCompany() {
  const { cid } = useParams();
  const [UID, SETUID] = useState("");

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      _useFlag: "1",
      _detailUseFlag: "1",
      _status: "2",
    },
  });
  const navigate = useNavigate();

  // 데이터 ------------------------------------------------------------------------
  // 작성된 데이터를 받아옴
  const [getedData, setGetedData] = useState([]);
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  // 이미지 ------------------------------------------------------------------------
  const [titleImg, setTitleImg] = useState(null);
  // 주소 ------------------------------------------------------------------------
  const [multilAddress, setMultilAddress] = useState({});

  // getUser,
  async function fnReadList(res) {
    await setGetedData(res.data);

    await servicesPostData(urlGetUser, {
      uid: UID,
    }).then((res2) => {
      setGetedData({ ...res.data, ...{ userid: res2.data.userid } });
      setValue("_userid", res2.data.userid || "");
    });

    await servicesPostData(urlGetCompanyDetail, {
      rcid: cid,
    }).then((res3) => {
      if (res3.status === "success") {
        if (!getedData.address) {
          setGetedData({
            ...res.data,
            ...{
              address: res3.data.address,
              detailaddress: res3.data.detailaddress,
              oldaddress: res3.data.oldaddress,
              zipcode: res3.data.zipcode,
              longitude: res3.data.longitude,
              latitude: res3.data.latitude,
            },
          });
        }

        setValue("_Cname", res3.data.name);
        setValue("_offer", res3.data.offer || "");
        setValue("_regOwner", res3.data.regOwner || "");
        setValue("_subCategory", res3.data.subCategory || "");
        setValue("_bigCategory", res3.data.bigCategory || "");
        setValue("_ceogreet", res3.data.ceogreet || "");
        setValue("_location", res3.data.location);
      }
    });
  }

  // input ","로 구분된 문자열 최대 입력 개수제한 ========================
  const onChangeValidation = (e) => {
    let arr = e.target.value.split(",");
    if (e.target.id === "tags") {
      if (arr.length > 20) {
        servicesUseToast("최대 20개-까지 입력할 수 있습니다.");
        arr = arr.filter((it, i) => i < 20);
      }
      return setValue("_tag", arr.toString());
    } else {
      if (arr.length > 10) {
        servicesUseToast("최대 10개까지 입력할 수 있습니다.");
        arr = arr.filter((it, i) => i < 10);
      }
      return e.target.id === "bigCategory"
        ? setValue("_bigCategory", arr.toString())
        : setValue("_subCategory", arr.toString());
    }
  };
  console.log(titleImg[0].iid);

  // form submit 이벤트 =========================================
  const handleSubmitEvent = () => {
    servicesPostData(urlSetCompany, {
      cid: cid,
      name: getValues("_name"),
      ruid: getedData.ruid,
      useFlag: getValues("_useFlag"),
    });

    // ComponentSetCompany submit
    // setComapny (계약자명, uid, 사업자 활성화)
    servicesPostData(urlSetCompanyDetail, {
      rcid: cid,
      useFlag: getValues("_detailUseFlag"),
      status: getValues("_status").toString(),
      name: getValues("_Cname"),
      subCategory: getValues("_subCategory"),
      bigCategory: getValues("_bigCategory"),
      regOwner: getValues("_regOwner"),
      mobilenum: getValues("_mobilenum"),
      location: getValues("_location"),
      registration: getValues("_registration"),
      address: multilAddress.address,
      detailaddress: multilAddress.detailaddress,
      oldaddress: multilAddress.oldaddress,
      zipcode: multilAddress.zipcode,
      longitude: multilAddress.longitude,
      latitude: multilAddress.latitude,
      ceogreet: getValues("_ceogreet"),
      offer: getValues("_offer"),
      titleImg: titleImg ? titleImg[0].iid : "",
    })
      .then((res) => {
        if (res.status === "fail") {
          servicesUseToast("잘못된 값을 입력했습니다.", "e");
          return;
        }
        // 정상 등록 완료
        // 디테일 정보를 입력하도록 사업자 상세정보로 이동
        if (res.status === "success") {
          servicesUseModal(
            "사업자 상세정보를 입력하시겠습니까?",
            "확인은 누르시면 사업자 상세정보 입력 페이지로 이동됩니다.",
            () => {
              navigate(`/company/${cid}`);
            },
            () => navigate(`/company`)
          );
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  useEffect(() => {
    servicesPostData(urlGetCompany, {
      cid: cid,
    }).then((res) => {
      setValue("_useFlag", res.data.useFlag.toString() || "1");
      setValue("_name", res.data.name);
      return SETUID(res.data.ruid);
    });
  }, []);

  useEffect(() => {
    servicesPostData(urlGetUserDetail, {
      ruid: UID,
    })
      .then((res) => {
        if (res.status === "success") {
          fnReadList(res);
          setValue("_detailUseFlag", "1");
          setValue("_ruid", UID);
          setValue("_location", res.data.location);
          setValue("_mobilenum", res.data.mobile || "");
          getDataFinish.current = true;
        }
      })
      .catch((res) => console.log(res));
  }, [UID]);

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(handleSubmitEvent)}>
          <ul className="tableTopWrap">
            <LayoutTopButton url="/company" text="목록으로 가기" />
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>

          <div className="formWrap reqFormWrap">
            <fieldset>
              <h3>계약 기본 정보</h3>
              {/* setCompany ============================= */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>계약정보</span>
                </div>

                <ul className="detailContent">
                  {/* ===============계약자=============== */}
                  <li>
                    <div>
                      <span style={{ width: "60px" }}>
                        <label htmlFor="name">계약자</label>
                      </span>
                      <input
                        className="formContentInput"
                        type="text"
                        id="name"
                        {...register("_name", {})}
                      />
                    </div>
                  </li>

                  {/* ===============사업자 활성화=============== */}
                  <li>
                    <div className="detailContentCheck">
                      <span style={{ width: "60px" }}>사업자 활성화</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_useFlag") == "0"}
                          value="0"
                          id="useFlag0"
                          {...register("_useFlag", {})}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="useFlag0"
                        >
                          비활성화
                        </label>
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_useFlag") == "1"}
                          value="1"
                          id="useFlag1"
                          {...register("_useFlag", {})}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="useFlag1"
                        >
                          활성화
                        </label>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              {/* /setCompany ============================= */}

              {/* setDetailCompanyInfo  ================================================================ */}
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>회원관리</span>
                </div>

                <ul className="detailContent">
                  {/* 회원 관리번호 : setCompany ============================= */}
                  <li>
                    <div>
                      <span style={{ width: "60px" }}>
                        <label htmlFor="ruid">회원 관리번호</label>
                      </span>
                      <input
                        className="formContentInput"
                        type="text"
                        id="ruid"
                        {...register("_ruid", {})}
                      />
                    </div>
                  </li>
                  {/* /setCompany ============================= */}

                  {/*=============== 계약관리 ===============*/}
                  <li>
                    <div className="detailContentCheck">
                      <span style={{ width: "60px" }}>계약관리</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_status") == 2}
                          value="2"
                          id="status2"
                          {...register("_status")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="status2"
                        >
                          대기
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_status") == 0}
                          value="0"
                          id="status0"
                          {...register("_status")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="status0"
                        >
                          거절
                        </label>

                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_status") == 1}
                          value="1"
                          id="status1"
                          {...register("_status")}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="status1"
                        >
                          완료
                        </label>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="formContentWrap">
                <label htmlFor="address" className=" blockLabel">
                  <span>계정관리</span>
                </label>
                <ul className="detailContent">
                  {/*=============== 아이디 ===============*/}
                  <li style={{ width: "50%" }}>
                    <div>
                      <span>아이디</span>
                      <input
                        type="text"
                        id="userid"
                        disabled
                        {...register("_userid", {})}
                      />
                    </div>
                  </li>
                  {/*=============== 비밀번호 ===============*/}
                  <li style={{ width: "50%" }}>
                    <div>
                      <span style={{ width: "60px" }}>
                        <label htmlFor="passwd">비밀번호</label>
                      </span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "calc(100% - 60px)",
                        }}
                      >
                        <input
                          type="text"
                          id="passwd"
                          style={{
                            width: "80%",
                          }}
                          {...register("_passwd")}
                        />
                        <button
                          type="button"
                          style={{
                            width: "19%",
                          }}
                          onClick={() => {
                            servicesPostData(urlSetUser, {
                              uid: UID,
                              passwd: watch("_passwd"),
                            }).then((res) => {
                              if (res.status === "success") {
                                servicesUseToast(
                                  "비밀번호 변경이 완료되었습니다.",
                                  "s"
                                );
                              }
                            });
                          }}
                          className="formContentBtn"
                        >
                          변경
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </fieldset>
            {/* 계약기본정보 필드 끝 ==================================================================== */}

            {/* 고객 기본정보 필드 시작 ==================================================================== */}
            <fieldset>
              <h3>사업자 기본 정보</h3>
              <div className="formContentWrap">
                <div className="blockLabel">
                  <span>기본 상세 관리</span>
                </div>

                <ul className="detailContent">
                  {/* 사업자명 */}
                  <li>
                    <div>
                      <span style={{ width: "60px" }}>
                        <label htmlFor="Cname">사업자명</label>
                      </span>
                      <input
                        type="text"
                        id="Cname"
                        placeholder="상호명을 입력해 주세요."
                        {...register("_Cname", {
                          required: "입력되지 않았습니다.",
                          maxLength: {
                            value: 15,
                            message: "15자 이하의 글자만 사용가능합니다.",
                          },
                        })}
                      />
                    </div>
                  </li>

                  {/* 상세정보 관리 */}
                  <li>
                    <div className="detailContentCheck">
                      <span style={{ width: "60px" }}>상세정보 관리</span>
                      <div className="detailContentInputWrap">
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_detailUseFlag") == "0"}
                          value="0"
                          id="DetailUseFlag0"
                          {...register("_detailUseFlag", {})}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="DetailUseFlag0"
                        >
                          휴면
                        </label>
                        <input
                          className="listSearchRadioInput"
                          type="radio"
                          checked={watch("_detailUseFlag") == "1"}
                          value="1"
                          id="DetailUseFlag1"
                          {...register("_detailUseFlag", {})}
                        />
                        <label
                          className="listSearchRadioLabel"
                          htmlFor="DetailUseFlag1"
                        >
                          사용
                        </label>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              {/* 대표업종 */}
              <div className="formContentWrap">
                <label htmlFor="bigCategory" className="blockLabel">
                  <span>대표업종</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="bigCategory"
                    placeholder="대표업종을 입력해 주세요."
                    value={
                      (watch("_bigCategory") &&
                        watch("_bigCategory").replace(" ", ",")) ||
                      ""
                    }
                    {...register("_bigCategory", {
                      required: "입력되지 않았습니다.",
                      onChange: onChangeValidation,
                    })}
                  />
                </div>
              </div>
              {/* 상세업종 */}
              <div className="formContentWrap">
                <label htmlFor="subCategory" className="blockLabel">
                  <span>상세업종</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="subCategory"
                    placeholder="상세업종은 최대 10개까지 입력 가능합니다."
                    value={
                      (watch("_subCategory") &&
                        watch("_subCategory").replace(" ", ",")) ||
                      ""
                    }
                    {...register("_subCategory", {
                      required: "입력되지 않았습니다.",
                      onChange: onChangeValidation,
                    })}
                  />
                </div>
              </div>

              {/* 대표자명 */}
              <div className="formContentWrap">
                <label htmlFor="regOwner" className="blockLabel">
                  <span>대표자명</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="regOwner"
                    placeholder="대표자명을 입력해 주세요."
                    {...register("_regOwner", {
                      required: "입력되지 않았습니다.",
                    })}
                  />
                </div>
              </div>

              {/* 휴대폰 */}
              <div className="formContentWrap">
                <label htmlFor="mobilenum" className="blockLabel">
                  <span>휴대폰</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="mobilenum"
                    placeholder="핸드폰번호를 입력해 주세요. (예시 000-0000-0000)"
                    maxLength={13}
                    value={
                      (watch("_mobilenum") &&
                        watch("_mobilenum")
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                            "$1-$2-$3"
                          )
                          .replace("--", "-")) ||
                      ""
                    }
                    {...register("_mobilenum", {
                      required: "입력되지 않았습니다.",
                      pattern: {
                        value: /^[0-9]{3,4}-[0-9]{3,4}-[0-9]{4}/,
                        message: "형식에 맞지 않습니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_mobilenum"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              {/* 위치 */}
              <div className="formContentWrap">
                <label htmlFor="location" className="blockLabel">
                  <span>위치</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="location"
                    placeholder="사업자의 위치를 입력해 주세요. (예시 ㅇㅇ구, ㅇㅇ동)"
                    {...register("_location", {
                      required: "입력되지 않았습니다.",
                      maxLength: {
                        value: 50,
                        message: "50자 이하의 글자만 사용가능합니다.",
                      },
                    })}
                  />
                </div>
              </div>

              {/* 주소 */}
              <PieceRegisterSearchPopUp
                setMultilAddress={setMultilAddress}
                multilAddress={multilAddress}
                getedData={getedData}
                autoKey
              />

              {/* 대표인사말 */}
              <div className="formContentWrap">
                <label htmlFor="ceogreet" className="blockLabel">
                  <span>대표인사말</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="ceogreet"
                    placeholder="인사말을 입력해 주세요."
                    {...register("_ceogreet", {
                      required: "입력되지 않았습니다.",
                      maxLength: {
                        value: 50,
                        message: "50자 이하의 글자만 사용가능합니다.",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="_ceogreet"
                    render={({ message }) => (
                      <span className="errorMessageWrap">{message}</span>
                    )}
                  />
                </div>
              </div>

              {/* 사업자 소개글 */}
              <div className="formContentWrap">
                <label htmlFor="offer" className="blockLabel">
                  <span>사업자 소개글</span>
                </label>
                <div>
                  <textarea
                    type="text"
                    id="offer"
                    maxLength="100"
                    placeholder="최대 100자까지 입력하실 수 있습니다."
                    {...register("_offer", {
                      required: "입력되지 않았습니다.",
                      maxLength: {
                        value: 100,
                        message: "최대 100자까지 입력하실 수 있습니다.",
                      },
                    })}
                  />
                </div>
              </div>

              {/* "대표 이미지 */}
              <SetImage
                img={titleImg}
                setImg={setTitleImg}
                getData={getedData}
                id="titleImg"
                title="대표 이미지"
                getDataFinish={getDataFinish.current}
              />
            </fieldset>
          </div>
        </form>
      </div>
    </>
  );
}
