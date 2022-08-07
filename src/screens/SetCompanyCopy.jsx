import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  axiosPostToken,
  axiosPostForm,
  getStorage,
} from "../Services/importData";
import { urlSetCompanyDetail, urlUpImages, ISLOGIN } from "../Services/string";

function Company() {
  const { cid } = useParams();

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Imgs", selectedFile);
    // const formData = new FormData(document.getElementById("imgFrom"));
    const token = getStorage(ISLOGIN);
    axiosPostForm(urlUpImages, formData, token).then((res) =>
      console.log("axiosPostForm", res)
    );
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  function imgUploadEvent(e) {
    e.preventDefault();
    if (e.target.files) {
      const uploadFile = e.target.files[0];
      // const formData = new FormData(document.getElementById("imgFrom"));
      const formData = new FormData();
      console.log("uploadFile", uploadFile);
      formData.append("imgs", uploadFile);

      const token = getStorage(ISLOGIN);
      axiosPostForm(urlUpImages, formData, token).then((res) =>
        console.log("axiosPostForm files", res)
      );
    }
  }

  return (
    <section className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <h3>사업자 상세정보 수정</h3>

        <form id="imgFrom" name="imgFrom " onSubmit={handleSubmit}>
          <input type="file" name="Imgs" onChange={handleFileSelect} />
          <input type="submit" value="Upload File" />
        </form>

        {/* <form className="formLayout" id="imgFrom">
          <input
            type="file"
            id="titleImg"
            name="imgs"
            accept="image/*"
            onChange={imgUploadEvent}
          />
          <label htmlFor="titleImg" className="blind userIdLabel" />
        </form> */}

        {/* <button type="submit" className="loginBtn">
            사용자 추가하기
          </button> */}
      </div>
    </section>
  );
}
export default Company;
