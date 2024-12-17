import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as MO from "../../service/library/modal";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as RAN from "../../service/useData/rander";
import * as RC from "../../service/useData/roleCheck";
import * as TOKEN from "../../service/useData/token";

import * as DATA from "../../action/data";

import ServiceModalCompanySetRuidAdd from "../services/ServiceModalCompanySetRuidAdd";
import { ManualView, SetStatus } from "./ComponentStatusManualView";

export default function ComponentSetCompany({
  companyData,
  setCompanyData,
  extnum,
}) {
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const getedSummaryData = useSelector(
    (state) => state.data.getedSummaryData,
    shallowEqual
  );
  const { cid } = useParams();
  const dispatch = useDispatch();
  // react-hook-form 라이브러리
  const { register, setValue, getValues, watch } = useForm();
  const [click, setClick] = useState(false);
  const [manualview, setManualview] = useState(false);

  // 계약자, 사업자 활성화, 회원연결 입력 이벤트
  const fnSetCompanyrData = (res) => {
    // dispatch(DATA.serviceGetedSummaryData({ ...getedSummaryData, ...res }));
    setCompanyData({ ...companyData, ...res });
  };

  const fnDelete = () => {
    const VNO = extnum.replaceAll("-", "").toString();
    MO.servicesUseModalExtnumDelete(
      `안심번호를 삭제하시겠습니까?`,
      "안심번호 삭제 후 휴면 처리가 가능합니다.",
      async () => {
        try {
          const clear050Response = await API.servicesPostData(
            APIURL.urlClear050,
            {
              vno: VNO,
            }
          );

          if (clear050Response.status === "success") {
            const setCompanyResponse = await API.servicesPostData(
              APIURL.urlSetCompany,
              {
                cid: cid,
                useFlag: "0",
              }
            );
            const previousCustomerType =
              getValues("_customerType") || getedData.customerType;

            setValue("_remarks", getedData.remarks);
            const newRemark = `[ 관리자 알림 ] 비활성화로 인해 가입자 구분이 "${previousCustomerType}"에서 "콕해"로 변경되었습니다.`;
            let currentRemarks = watch("_remarks") || "";

            const remarkRegex =
              /[ 관리자 알림 ] 비활성화로 인해 가입자 구분이 ".*?"에서 "콕해"로 변경되었습니다\./;

            if (!remarkRegex.test(currentRemarks)) {
              currentRemarks = `${
                currentRemarks ? currentRemarks + "\n" : ""
              }${newRemark}`;
            }

            setValue("_remarks", currentRemarks);
            setValue("_customerType", previousCustomerType);
            // API 요청
            const setCompanyDetailResponse = await API.servicesPostData(
              APIURL.urlSetCompanyDetail,
              {
                rcid: cid,
                extnum: "",
                useFlag: 0,
                status: getValues("_ruid") ? "2" : "4",
                customerType: "콕해",
                remarks: currentRemarks,
              }
            );

            if (setCompanyResponse.status === "fail") {
              alert(
                `공사콕 서버의 삭제가 진행되지 않았습니다. 안심번호 : ${extnum}를 관리자에게 전달해 주십시오.`
              );
              RAN.serviesAfter1secondReload();
            } else if (setCompanyDetailResponse.status === "fail") {
              alert(
                `공사콕 상세정보의 삭제가 진행되지 않았습니다. 안심번호 : ${extnum}를 관리자에게 전달해 주십시오.`
              );
              RAN.serviesAfter1secondReload();
            } // (setCompanyDetailResponse.status === "success")
            else {
              TOA.servicesUseToast("안심번호 삭제가 완료되었습니다.", "s");
              RAN.serviesAfter2secondReload();
            }
          } //(clear050Response.status === "success")
          // (clear050Response.status !== "success")
          else {
            TOA.servicesUseToast(
              `안심번호 삭제가 진행되지 않았습니다. 안심번호 : ${extnum}를 관리자에게 전달해 주십시오.`,
              "e"
            );
          }
        } catch (error) {
          console.error("Error during deletion:", error);
          TOA.servicesUseToast(
            `삭제 중 오류가 발생했습니다. 안심번호 : ${extnum}를 관리자에게 전달해 주십시오.`,
            "e"
          );
        }
      },
      () => {}
    );
  };

  const handleSetAfterRcid = (uid) => {
    const STATUS = RC.serviesCheckSafeNum(
      getedData.mobilenum,
      getedData.telnum,
      true,
      getedData.extnum
    );

    console.log(uid);
    MO.servicesUseModalSetCid(
      `해당 사업자 관리번호의 내용을\n 덮어쓰기 하시겠습니까?`,
      `덮어쓰기를 누르시면 입력된 사업자 상세정보 데이터가 추가됩니다.`,
      () => {
        // 덮어쓰기
        API.servicesPostData(APIURL.urlGetUserDetail, {
          ruid: uid,
        }).then((resDetailUser) => {
          const payload = {
            regOwner: resDetailUser.data.name,
            mobilenum: resDetailUser.data.mobile,
            email: resDetailUser.data.mail,
            location: resDetailUser.data.location,
            address: resDetailUser.data.address,
            oldaddress: resDetailUser.data.address,
            detailaddress: resDetailUser.data.detailaddress,
            titleImg: resDetailUser.data.titleImg,
            imgs: resDetailUser.data.imgs,
            age: resDetailUser.data.age,
            status: getedData.titleImg ? STATUS : 2,
          };
          dispatch(DATA.serviceGetedData(payload));

          fnSetCompanyrData({
            ...getedSummaryData,
            name: resDetailUser.data.name,
          });

          setValue("_ruid", uid);
          setValue("_name", resDetailUser.data.name);
          API.servicesPostData(APIURL.urlSetCompanyDetail, {
            rcid: cid,
            titleImg: resDetailUser.data.imgs,
            ...payload,
          });
          TOKEN.serviesSetToken(cid);
          setClick(false);
        });
      },
      () => {
        const payload = {
          ...getedData,
          status: getedData.titleImg ? STATUS : 2,
        };
        dispatch(DATA.serviceGetedData(payload));
        setValue("_ruid", uid);
        API.servicesPostData(APIURL.urlSetCompanyDetail, {
          rcid: cid,
          status: getedData.titleImg ? STATUS : 2,
        });
        TOKEN.serviesSetToken(cid);
        setClick(false);
      }
    );
  };

  const handleRemove = () => {
    if (!getValues("_ruid")) {
      return;
    }

    const STATUS = RC.serviesCheckSafeNum(
      getedData.mobilenum,
      getedData.telnum,
      false,
      getedData.extnum
    );

    TOKEN.serviesSetToken(cid);
    API.servicesPostData(APIURL.urlSetCompanyDetail, {
      rcid: cid,
      status: getedData.titleImg ? STATUS : 4,
    });

    API.servicesPostData(APIURL.urlSetCompanyRemoveRuid, {
      cid: cid,
    }).then(RAN.serviesAfter1secondReload());
  };

  const fnSelect = async (res) => {
    await API.servicesPostData(APIURL.urlSetCompany, {
      cid: cid,
      ruid: res.uid || res.ruid,
    }).then((res) => {
      if (res.emsg === "ruid duplicate") {
        return TOA.servicesUseToast("이미 연결된 회원 관리번호 입니다.", "s");
      }
      if (res.emsg === "ruid already connected to company") {
        return TOA.servicesUseToast("이미 연결된 사업자 관리번호 입니다.", "s");
      } else {
        handleSetAfterRcid(res.data.ruid || res.data.uid);
      }
    });
  };

  useEffect(() => {
    // 기본 회사정보 불러오기
    if (!getedSummaryData.ruid) return;

    fnSetCompanyrData({
      name: getedSummaryData.name,
      ruid: getedSummaryData.ruid,
      useFlag: String(getedSummaryData.useFlag),
    });

    setValue("_ruid", getedSummaryData.ruid);

    API.servicesPostData(APIURL.urlGetUser, {
      uid: getedSummaryData.ruid,
    }).then((urlGetUserRes) => {
      if (urlGetUserRes.status === "success") {
        setValue("_userid", urlGetUserRes.data.userid.toString() || "");
        API.servicesPostData(APIURL.urlGetUserDetail, {
          ruid: getedSummaryData.ruid,
        }).then((res) => {
          if (res.data) {
            setValue("_name", res.data.name);
          }
        });
      }
    });
  }, [getedSummaryData]);

  return (
    <>
      <div className="formContentWrap" style={{ width: "50%" }}>
        <div className="blockLabel">
          <span>회원 이름</span>
        </div>
        <div>
          <input
            className="formContentInput"
            type="text"
            id="name"
            placeholder={
              getValues("_ruid")
                ? "회원 정보에 이름이 입력되지 않았습니다."
                : "회원 관리번호가 연결되어 있지 않으면 계약자가 표시되지 않습니다."
            }
            disabled
            {...register("_name", {
              onChange: (e) => {
                fnSetCompanyrData({ [e.target.id]: e.target.value });
              },
            })}
          />
        </div>
      </div>

      <div className="formContentWrap">
        <div className="blockLabel">
          <span>활성화 계정</span>
        </div>
        <div className="formPaddingWrap">
          <input
            className="listSearchRadioInput"
            type="radio"
            checked={companyData.useFlag == "0"}
            value="0"
            id="useFlag0"
            {...register("_useFlag", {
              onChange: (e) => {
                fnSetCompanyrData({ useFlag: String(e.target.value) });
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag0">
            <span>비활성화</span>
          </label>

          <input
            className="listSearchRadioInput"
            type="radio"
            checked={companyData.useFlag == "1"}
            value="1"
            id="useFlag1"
            {...register("_useFlag", {
              onChange: (e) => {
                if (extnum) {
                  fnDelete();
                } else {
                  fnSetCompanyrData({ useFlag: e.target.value });
                }
              },
            })}
          />
          <label className="listSearchRadioLabel" htmlFor="useFlag1">
            활성화
          </label>
        </div>
      </div>

      <div className="formContentWrap">
        <label htmlFor="address" className=" blockLabel">
          <span>계정관리</span>
        </label>
        <ul className="detailContent">
          <li style={{ width: "50%" }}>
            <div>
              <span>아이디</span>
              <input
                type="text"
                id="userid"
                placeholder={!getedSummaryData.ruid ? "미등록 회원" : ""}
                disabled
                {...register("_userid", {})}
              />
            </div>
          </li>
          <li style={{ width: "50%" }}>
            <div>
              <span>비밀번호</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <input
                  type="text"
                  id="passwd"
                  style={{
                    width: "80%",
                  }}
                  disabled={!getedSummaryData.ruid && true}
                  placeholder={!getedSummaryData.ruid ? "미등록 회원" : ""}
                  {...register("_passwd")}
                />
                <button
                  type="button"
                  disabled={!getedSummaryData.ruid && true}
                  onClick={() => {
                    API.servicesPostData(APIURL.urlSetUser, {
                      // uid: ruid.current,
                      uid: getedSummaryData.ruid,
                      passwd: getValues("_passwd"),
                    }).then((res) => {
                      if (res.status === "success") {
                        TOA.servicesUseToast(
                          "비밀번호 변경이 완료되었습니다.",
                          "s"
                        );
                        RAN.serviesAfter2secondReload();
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
      <div className="formContentWrap">
        <div className="blockLabel tipTh" style={{ flexDirection: "row" }}>
          <span
            style={{
              display: "inline-block",
              width: "auto",
            }}
          >
            회원 관리번호
          </span>
          <i onClick={() => setManualview(!manualview)}>!</i>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {manualview && <ManualView />}
          {SetStatus(getedData.status)}
          <input
            type="text"
            id="ruid"
            style={{
              width: "calc(100% - 156px)",
            }}
            disabled
            {...register("_ruid")}
          />

          <button
            type="button"
            onClick={() => {
              setClick(true);
            }}
            className="formContentBtn"
            style={{
              width: "50px",
              backgroundColor: "#757575",
              color: "rgb(255, 255, 255)",
            }}
          >
            검색
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="formContentBtn"
            style={{
              width: "50px",
              backgroundColor: "#da3933",
              color: "rgb(255, 255, 255)",
            }}
          >
            해지
          </button>
          {click && (
            <ServiceModalCompanySetRuidAdd
              click={click}
              setClick={setClick}
              fn={fnSelect}
            />
          )}
        </div>
      </div>
    </>
  );
}
