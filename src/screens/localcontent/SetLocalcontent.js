// 공사콕 앱/웹관리 최신글 관리

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";
import * as API from "../../service/api";
import * as UDIMAGE from "../../service/useData/image";
import * as TOA from "../../service/library/toast";

import * as DATA from "../../action/data";

import * as ST from "../../service/useData/storage";

import PieceRegisterSearchPopUp from "../../components/services/ServiceRegisterSearchPopUp_LangLong";
import SetImage from "../../components/services/ServicesImageSetPreview";
import LayoutTopButton from "../../components/layout/LayoutTopButton";

export default function SetDetailAdminNotice() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      _category: "localcontent",
    },
  });
  const [submitCk, setSubmitCk] = useState(false);
  const navigate = useNavigate();
  const [useFlag, setUseFlag] = useState(true);
  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const multilAddress = useSelector(
    (state) => state.data.multilAddressData,
    shallowEqual
  );
  const RUID = ST.servicesGetStorage("uid");

  // 이미지 ------------------------------------------------------------------------
  const multiImgs = useSelector(
    (state) => state.image.multiImgsData,
    shallowEqual
  );
  const imgsIid = [];

  CUS.useCleanupEffect(() => {
    // contid가 있으면 기존에 입력된 값을 가져옴
    if (!!id) {
      API.servicesPostData(APIURL.urGetlLocalConten, {
        lcid: id,
      })
        .then((res) => {
          console.log(res);
          if (res.status === "success") {
            dispatch(DATA.serviceGetedData(res.data));

            setValue("_category", res.data.category || "localcontent");
            setValue("_contentTitle", res.data.contentTitle || "");
            setValue("_contentString", res.data.contentString || "");
            setValue("_contentDetail", res.data.contentDetail || "");

            setValue("_ruid", res.data.ruid || "");

            setUseFlag(res.data.useFlag == 1 ? true : false);

            API.servicesPostData(APIURL.urlGetNick, {
              uid: res.data.ruid,
            }).then((res2) => setValue("_ruidNick", res2.data.nick));
          }
        })
        .catch((res) => console.log(res));
    } else {
      setValue("_ruid", RUID);
      API.servicesPostData(APIURL.urlGetNick, {
        uid: RUID,
      }).then((res) => setValue("_ruidNick", res.data.nick));
    }
  }, []);

  function AddUserSubmit() {
    if (submitCk) return;

    if (!getValues("_contentTitle"))
      return TOA.servicesUseToast("제목을 입력해 주세요", "e");
    if (!getValues("_contentString"))
      return TOA.servicesUseToast("내용을 입력해 주세요", "e");
    // if (!getValues("_contentDetail"))
    //   return TOA.servicesUseToast("카테고리를 입력해 주세요", "e");
    if (!multilAddress.location)
      return TOA.servicesUseToast("지역정보를 입력해 주세요", "e");

    setSubmitCk(true);

    UDIMAGE.serviesGetImgsIid(imgsIid, multiImgs);
    API.servicesPostData(
      APIURL.urSetlLocalConten,
      !!id
        ? // id여부 확인하여 id가 있으면 수정
          {
            lcid: id,
            ruid: getValues("_ruid"),
            category: getValues("_category"),
            contentTitle: getValues("_contentTitle"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            location: multilAddress.location,
            longitude: multilAddress.longitude,
            latitude: multilAddress.latitude,
            imgString: multiImgs ? imgsIid.toString() : "",
          }
        : // contid가 없으면 새로 작성
          {
            ruid: getValues("_ruid"),
            category: getValues("_category"),
            contentTitle: getValues("_contentTitle"),
            contentString: getValues("_contentString"),
            contentDetail: getValues("_contentDetail"),
            location: multilAddress.location,
            longitude: multilAddress.longitude,
            latitude: multilAddress.latitude,
            imgString: multiImgs ? imgsIid.toString() : "",
            gubun: "admin",
          }
    )
      .then((res) => {
        console.log(res);
        if (res.status === "success") {
          TOA.servicesUseToast("입력이 완료되었습니다.", "s");
          setTimeout(() => {
            navigate(`/localcontent/${res.data.lcid}`);
          }, 1500);
          return;
        }
        if (res.status === "fail") {
          setSubmitCk(false);
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
        }
      })
      .catch((error) => {
        setSubmitCk(false);
        console.log("axios 실패", error.response);
      });
  }

  const fnUseFlag = () => {
    API.servicesPostData(APIURL.urSetlLocalConten, {
      lcid: id,
      useFlag: useFlag == true ? "0" : "1",
    })
      .then((res) => {
        if (res.status === "success") {
          TOA.servicesUseToast("수정이 완료되었습니다.", "s");
          setTimeout(() => {
            window.location.href = `/localcontent`;
          }, 2000);
          return;
        }
        if (res.status === "fail") {
          TOA.servicesUseToast("입력에 실패했습니다.", "e");
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddUserSubmit)}>
          <ul className="tableTopWrap tableTopWhiteWrap">
            <LayoutTopButton url="/localcontent" text="목록으로 가기" />
            {!!id && (
              <LayoutTopButton
                text={useFlag == true ? "비공개" : "공개"}
                fn={fnUseFlag}
              />
            )}

            {(!!getedData.gubun || !id) && (
              <LayoutTopButton text="완료" isSubmitting={isSubmitting} />
            )}
          </ul>

          <div className="formWrap">
            {!!getedData.gubun && (
              <div
                className="formContentWrap"
                style={{ marginTop: "0", width: "100%" }}
              >
                <label className="blockLabel">
                  <span>작성 구분</span>
                </label>

                <div style={{ paddingLeft: "8px", lineHeight: "26px" }}>
                  <span style={{ color: "rgba(0,0,0,0.7)" }}>
                    관리자 페이지에서 작성된 게시글입니다.
                  </span>
                </div>
              </div>
            )}

            <div className="formContentWrap" style={{ width: "100%" }}>
              <label htmlFor="contentTitle" className="blockLabel">
                <span>제목 입력</span>
              </label>
              <div>
                <input
                  type="text"
                  id="contentTitle"
                  placeholder="최대 30자 이내"
                  minLength={2}
                  maxLength={30}
                  {...register("_contentTitle")}
                  disabled={!!getedData.gubun || !id ? false : true}
                />
              </div>
            </div>

            <div className="formContentWrap" style={{ width: "100%" }}>
              <label htmlFor="contentTitle" className="blockLabel">
                <span>작성자</span>
              </label>
              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  id="ruid"
                  disabled
                  {...register("_ruid")}
                  style={{ marginBottom: 0, marginRight: "2px" }}
                />
                <input
                  type="text"
                  id="ruidNick"
                  disabled
                  {...register("_ruidNick")}
                />
              </div>
            </div>

            <div className="formContentWrap" style={{ width: "100%" }}>
              <label htmlFor="title" className="blockLabel">
                <span>최신글 게시판 구분</span>
              </label>

              <div className="filterWrap">
                <label htmlFor="localcontent">
                  <input
                    type="radio"
                    checked={watch("_category") === "localcontent"}
                    value="localcontent"
                    id="localcontent"
                    {...register("_category")}
                    disabled={!!getedData.gubun || !id ? false : true}
                  />
                  <span>B2C 최신글</span>
                </label>

                <label htmlFor="localbusiness">
                  <input
                    type="radio"
                    checked={watch("_category") === "localbusiness"}
                    value="localbusiness"
                    id="localbusiness"
                    {...register("_category")}
                    disabled={!!getedData.gubun || !id ? false : true}
                  />
                  <span>B2B 최신글</span>
                </label>
              </div>
            </div>

            <SetImage id="imgString" title="사진 첨부" />

            <div className="formContentWrap formContentWideWrap">
              <label htmlFor="title" className="blockLabel">
                <span>내용 입력</span>
              </label>
              <div>
                <textarea
                  id="contentString"
                  style={{ height: "400px" }}
                  maxLength={1000}
                  {...register("_contentString")}
                  placeholder="최대 1000자 이내"
                  disabled={!!getedData.gubun || !id ? false : true}
                />
              </div>
            </div>

            {/* 주소 */}
            <PieceRegisterSearchPopUp />

            <div className="formContentWrap" style={{ width: "100%" }}>
              <label htmlFor="contentDetail" className="blockLabel">
                <span>카테고리</span>
              </label>
              <div>
                <input
                  type="text"
                  id="contentDetail"
                  maxLength={20}
                  {...register("_contentDetail")}
                  placeholder="최대 20자 이내 / 예시 : #장판 #인테리어 #도배"
                  disabled={!!getedData.gubun || !id ? false : true}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
