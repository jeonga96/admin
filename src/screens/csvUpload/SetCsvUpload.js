import { useNavigate } from "react-router-dom";
import { useState } from "react";

import * as API from "../../service/api";

import * as APIURL from "../../service/string/apiUrl";
import * as MO from "../../service/library/modal";
import * as TOA from "../../service/library/toast";

import ComponentLoading from "../../components/piece/PieceLoading";

export default function SetCsvUpload() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const csvData = [
    [
      "isGongsa",
      "cname",
      "bigCategory",
      "subCategory",
      "comType",
      "name",
      "mobilenum",
      "telnum",
      "zipcode",
      "address",
      "detailaddress",
      "remarks",
    ],
  ];

  // const csvData = [
  //   [
  //     "comType",
  //     "cname",
  //     "subCategory",
  //     "bigCategory",
  //     "address",
  //     "detailaddress",
  //     "zipcode",
  //     "name",
  //     "telnum",
  //     "mobilenum",
  //     "remarks",
  //     "isGongsa",
  //   ],
  // ];

  const generateCSV = () => {
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "gongsacokdata.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let readFile = (file) =>
    new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsText(file);
    });

  const leadOnly = async (files) => {
    let csvText = await readFile(files);
    console.log("csvText :", csvText.split("\r\n"));
  };

  function handleModalOpen(e) {
    e.preventDefault();
    setLoading(true);
    const files = e.target.files[0];

    const formData = new FormData();
    formData.append("csvFile", files);
    // FormData에 저장된 데이터를 서버에 보냄
    MO.servicesUseModalCsvUpload(
      `${files.name} 파일을 업로드 하시겠습니까?`,
      "추가를 누르시면 회원데이터가 추가됩니다.",
      () => {
        console.log("formData", formData);
        leadOnly(files);

        API.servicesPostDataForm(APIURL.urlSetCsv, formData).then((res) => {
          console.log("servicesPostDataForm", res);
          try {
            setLoading(false);
            if (res.status === "success") {
              TOA.servicesUseToast("등록이 완료되었습니다!", "s");
              setTimeout(() => {
                navigate("/company");
              }, 1500);
            } else {
              // TOA.servicesUseToast(res.emsg, "e");
              console.log("err", res);
              alert(res.emsg);
            }
          } catch {
            TOA.servicesUseToast(res.emsg, "e");
            setLoading(false);
          }
        });
      },
      () => console.log("닫기!")
    );
  }

  return (
    <div className="commonBox">
      <h3 className="blind">사업자관리 검색 필터</h3>
      <ComponentLoading loading={loading} bg />
      <div className="contentInnerManual">
        <span style={{ color: "red" }}>
          - 업로드 파일은 UTF-8, csv로 합니다.
        </span>
        <span style={{ color: "red" }}>
          - <b style={{ color: "red" }}> * </b> 가 앞에 붙는항목은 필수로
          입력해주세요.{" "}
          <span style={{ color: "black" }}>
            {" "}
            * 이 없다면 빈값으로도 업로드 가능합니다
          </span>
        </span>
        <span>
          <span style={{ color: "red" }}>
            - {"<"} 주의 {"> "}
          </span>
          도로명 주소 우선 입력 / 도로명 주소 없을 경우, 지번 주소 입력
        </span>
        <span>
          - 상세 업종 ( subCategory ) 과 대표 ( 주력 ) 업종 ( bigCategory ) 은
          쉼표[ , ]로 구분하여 작성해주십시오.
        </span>

        <span>
          - 사용가능한 특수문자는 [ & ’ , - . ・ ] 입니다. 특수문자는 상호 (
          cname ) 와 상세주소 ( detailaddress ) 만 사용 가능합니다.
        </span>
        <span>
          - null데이터 오류는 셀이 비어있어 오류가 발생했다는 메세지입니다.
        </span>
        <span>
          <i>[ 한 ] : 한글 </i>
          <i>[ 영 ] : 영어 </i>
          <i>[ 숫 ] : 숫자 </i>
          <i>[ 공 ] : 공백 </i>
          <i>[ 특 ] : 특수문자 </i>
          <i>[ , ] : 쉼표 </i>
          <i>[ - ] : 대시기호 </i>
          <i>[ 1 ] : 예 </i>
          <i>[ 0 ] : 아니오</i>
        </span>
        <table>
          <thead>
            <tr>
              <td>isGongsa</td>
              <td>cname</td>
              <td>bigCategory</td>
              <td>subCategory</td>
              <td>comType</td>
              <td>name</td>
              <td>mobilenum</td>
              <td>telnum</td>
              <td>zipcode</td>
              <td>address</td>
              <td>detailaddress</td>
              <td>remarks</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span>
                  <b style={{ color: "red" }}>*</b> 공사업체 확인
                </span>
                <span>[ 1 ] [ 0 ]</span>
              </td>
              <td>
                <span>
                  <b style={{ color: "red" }}>*</b> 상호
                </span>
                <span>[ 한 ] [ 영 ] [ 숫 ] [ 특 ]</span>
              </td>
              <td>
                <span>
                  <b style={{ color: "red" }}>*</b> 대표 ( 주력 ) 업종
                </span>
                <span>[ 한 ] [ 영 ] [ 숫 ] [ , ]</span>
              </td>
              <td>
                <span>
                  <b style={{ color: "red" }}>*</b> 상세 업종
                </span>
                <span>[ 한 ] [ 영 ] [ 숫 ] [ , ]</span>
              </td>
              <td>
                {/* <span>가입 구분</span> */}
                <span>
                  <b style={{ color: "red" }}>*</b> 사업자분류
                </span>
                <span>[ 법인 ] [ 일반 ]</span>
              </td>
              <td>
                <span>대표자명</span>
                <span>[ 한 ] [ 공 ]</span>
              </td>
              <td>
                <span>계약자휴대폰</span>
                <span>[ 숫 ] [ - ] [ 공 ]</span>
              </td>
              <td>
                <span>홍보번호</span>
                <span>[ 숫 ] [ - ] [ 공 ]</span>
              </td>
              <td>
                <span>
                  <b style={{ color: "red" }}>*</b> 우편번호
                </span>
                <span>[ 숫 ]</span>
              </td>
              <td>
                <span>
                  <b style={{ color: "red" }}>*</b> 주소
                </span>
                <span>[ 한 ] [ 영 ] [ 숫 ] [ 특 ]</span>
              </td>

              <td>
                <span>상세주소</span>
                <span>[ 한 ] [ 영 ] [ 숫 ] [ 공 ] [ 특 ]</span>
              </td>

              <td>
                <span>비고</span>
                <span>[ 조건없음 ]</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <form className="listSearchForm formLayout">
        <div className="listSearchButtonWrap">
          <button
            type="button"
            onClick={generateCSV}
            style={{ width: "170px" }}
          >
            회원데이터 입력폼 다운로드
          </button>

          <label
            htmlFor="upload"
            style={{ width: "170px" }}
            className="basicModifyBtn"
          >
            회원데이터 업로드
          </label>
          <input
            className="blind"
            id="upload"
            type="file"
            accept=".csv"
            onChange={handleModalOpen}
          />
        </div>
      </form>
    </div>
  );
}
