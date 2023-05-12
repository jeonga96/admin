import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData, servicesSetStorage } from "../Services/importData";
import { servicesUseToast } from "../Services/useData";
import { urlAddcompany, urlUserlist, urlSetCompany } from "../Services/string";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function AddCompany() {
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm();
  const navigate = useNavigate();

  const [select, setSelect] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    servicesPostData(urlUserlist, {
      offset: 0,
      size: 40,
    }).then((res) => setUserList(res.data));
  }, []);

  const fnSelect = (res) => {
    console.log(res);
    setSelect(res);
    setValue("_name", res.name);
  };

  // 사업자 회원 추가 이벤트
  const fnSubmit = (e) => {
    servicesPostData(urlAddcompany, {
      name: getValues("_name"),
    })
      .then((res) => {
        if (res.status === "fail") {
          servicesUseToast("잘못된 값을 입력했습니다.", "e");
          return;
        }
        // 정상 등록 완료
        // 디테일 정보를 입력하도록 사업자 상세정보로 이동
        if (res.status === "success") {
          servicesPostData(urlSetCompany, {
            cid: res.data.cid,
            ruid: select.uid,
          });
          servicesUseToast("완료되었습니다.", "s");
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
            <div>
              <input
                type="text"
                id="name"
                placeholder="계약자명을 입력해 주세요."
                {...register("_name", {
                  // required: "계약자명은 필수로 입력해야 합니다.",
                  minLength: {
                    value: 2,
                    message: "2자 이상의 이름만 사용가능합니다.",
                  },
                  maxLength: {
                    value: 8,
                    message: "8자 이하의 이름만 사용가능합니다.",
                  },
                  pattern: {
                    value: /[ㄱ-ㅎ가-힣]/,
                    message: "입력 형식에 맞지 않습니다.",
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name="name"
                render={({ message }) => (
                  <span className="errorMessageWrap">{message}</span>
                )}
              />
            </div>
          </div>
          <div className="addCompanyUserList">
            <section className="tableWrap">
              <h3 className="blind">회원관리 리스트</h3>
              <table className="commonTable">
                <thead>
                  <tr>
                    <th>관리번호</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>핸드폰번호</th>
                    <th>계약일</th>
                  </tr>
                </thead>
                {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
                <tbody>
                  {userList &&
                    userList.map((item) => (
                      <tr key={item.uid} onClick={() => fnSelect(item)}>
                        <td>{item.uid}</td>
                        <td>{item.userid}</td>
                        <td>{item.name}</td>
                        <td>{item.mobile}</td>
                        <td>
                          {item.createTime && item.createTime.slice(0, 10)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
          </div>
        </form>
      </div>
    </>
  );
}
