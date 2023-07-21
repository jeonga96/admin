// 사업자 회원 관리 > 사업자 관리 > 사업자 추가

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import * as API from "../Services/api";
import * as UD from "../Services/useData";
import * as STR from "../Services/string";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ComponentModal from "../components/services/ServiceModalCompanyAdd";

export default function AddCompany() {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clickModal = useSelector((state) => state.click, shallowEqual);
  const [select, setSelect] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    API.servicesPostData(STR.urlUserlist, {
      offset: 0,
      size: 40,
    }).then((res) => setUserList(res.data));
  }, []);

  const fnSelect = (res) => {
    setSelect(res);
    setValue("_name", res.name);
    dispatch({
      type: "clickEvent",
      payload: false,
    });
  };

  // 사업자 회원 추가 이벤트
  const fnSubmit = (e) => {
    API.servicesPostData(STR.urlAddcompany, {
      name: getValues("_name"),
    })
      .then((res) => {
        console.log("???");
        if (res.status === "fail") {
          UD.servicesUseToast("잘못된 값을 입력했습니다.", "e");
          return;
        }
        // 정상 등록 완료
        // 디테일 정보를 입력하도록 사업자 상세정보로 이동
        if (res.status === "success") {
          console.log(STR.urlSetCompany, res.data.cid, select.uid);
          API.servicesPostData(STR.urlSetCompany, {
            cid: res.data.cid,
            ruid: select.uid,
          });
          UD.servicesUseToast("완료되었습니다.", "s");
          return setTimeout(
            () => navigate(`/company/${res.data.cid}/req`),
            2000
          );
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <form
          className="formLayout formCenterLayout"
          onSubmit={handleSubmit(fnSubmit)}
        >
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formContentWrap" style={{ marginTop: "10px" }}>
            <label htmlFor="name" className="blockLabel">
              <span>계약자</span>
            </label>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input
                type="text"
                id="name"
                style={{ width: "86%" }}
                placeholder="계약자명을 입력해 주세요."
                {...register("_name", {
                  minLength: {
                    value: 2,
                    message: "2자 이상의 이름만 사용가능합니다.",
                  },
                  maxLength: {
                    value: 8,
                    message: "8자 이하의 이름만 사용가능합니다.",
                  },
                })}
              />

              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "clickEvent",
                    payload: !clickModal,
                  })
                }
                className="formContentBtn"
              >
                검색
              </button>
            </div>
          </div>

          <ComponentModal fn={fnSelect} userList={userList} />
        </form>
      </div>
    </>
  );
}
