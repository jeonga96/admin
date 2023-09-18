import { useNavigate } from "react-router-dom";
import { useState } from "react";

import * as API from "../../service/api";
import * as STR from "../../service/string";
import * as UD from "../../service/useData";

import ComponentLoading from "../../components/piece/PieceLoading";

export default function SetCsvUpload() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const csvData = [
    [
      "comType",
      "cname",
      "subCategory",
      "bigCategory",
      "address",
      "detailaddress",
      "zipcode",
      "name",
      "telnum",
      "mobilenum",
    ],
  ];

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

  function handleModalOpen(e) {
    e.preventDefault();
    const files = e.target.files[0];
    const formData = new FormData();
    formData.append("csvFile", files);
    setLoading(true);
    // FormData에 저장된 데이터를 서버에 보냄
    UD.servicesUseModalCsvUpload(
      `${files.name} 파일을 업로드 하시겠습니까?`,
      "추가를 누르시면 회원데이터가 추가됩니다.",
      () => {
        API.servicesPostDataForm(STR.urlSetCsv, formData).then((res) => {
          console.log("post", res);
          if (res.status === "success") {
            setLoading(false);
            navigate("/user");
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
        <span>- 업로드 파일은 UTF-8, csv로 합니다.</span>
        <span>- 모든 필드는 필수로 입력해 주세요.</span>
        <span>- 계약자명(name)은 특수문자 사용이 불가합니다.</span>
        <span>
          - 상세업종(subCategory)과 대표업종(bigCategory)은 쉼표[ , ]로 구분하여
          작성해주십시오.
        </span>
        <span>
          - 사용가능한 특수문자는 [& ’ , - . ・] 입니다. 특수문자는
          상호(cname)와 상세주소(detailaddress)만 사용 가능합니다.
        </span>
        <span style={{ color: "red", fontWeight: 600 }}>
          - [한] : 한글 [영] : 영어 [숫] : 숫자 [공] : 공백 [특] : 특수문자 [ ,
          ] : 쉼표 [ - ] : 대시기호
        </span>
        <table>
          <thead>
            <tr>
              <td>comType</td>
              <td>cname</td>
              <td>subCategory</td>
              <td>bigCategory</td>
              <td>address</td>
              <td>detailaddress</td>
              <td>zipcode</td>
              <td>name</td>
              <td>telnum</td>
              <td>mobilenum</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span>가입구분</span>
                <span>[법인] [일반]</span>
              </td>
              <td>
                <span>상호</span>
                <span>[한] [영] [숫] [공] [특]</span>
              </td>
              <td>
                <span>상세업종</span>
                <span>[한] [영] [숫] [공] [ , ]</span>
              </td>
              <td>
                <span>대표업종</span>
                <span>[한] [영] [숫] [공] [ , ]</span>
              </td>
              <td>
                <span>주소</span>
                <span>[한] [영] [숫] [공] [특]</span>
              </td>
              <td>
                <span>상세주소</span>
                <span>[한] [영] [숫] [공] [특]</span>
              </td>
              <td>
                <span>우편번호</span>
                <span>[숫]</span>
              </td>
              <td>
                <span>계약자명</span>
                <span>[한] [공]</span>
              </td>
              <td>
                <span>홍보번호</span>
                <span>[숫] [ - ]</span>
              </td>
              <td>
                <span>계약자휴대폰</span>
                <span>[숫] [ - ]</span>
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
