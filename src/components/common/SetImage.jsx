import { BiUpload } from "react-icons/bi";
import { servicesPostDataForm } from "../../Services/importData";
import { urlUpImages } from "../../Services/string";

export default function SetImage({ img, setImg, imgsIid, title, id }) {
  function setImage(img) {
    return setImg(img);
  }
  function setImgsIid(img) {
    return imgsIid.push(img);
  }

  function handleSetImage(event) {
    event.preventDefault();
    const files = event.target.files;
    console.log("이미지 클릭", files);
    const formData = new FormData();
    if (event.target.id === "titleImg") {
      console.log("titleUpload click-->", files[0]);
      formData.append("Imgs", files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        console.log(i, "titleUpload click-->", files[i]);
        formData.append("Imgs", files[i]);
      }
    }

    servicesPostDataForm(urlUpImages, formData).then((res) => {
      setImage(res.data);
      if (res.data.length > 1) {
        for (let i = 0; i < res.data.length; i++) {
          // imgsIid.push(res.data[i].iid);
          setImgsIid(res.data[i].iid);
          console.log(imgsIid);
        }
      }
    });
  }
  return (
    <div>
      <div className="blockLabel">{title}</div>
      <label htmlFor={id} className="blockLabel fileboxLabel">
        <BiUpload /> 사진 업로드
      </label>
      <input
        type="file"
        id={id}
        name={"__" + id}
        accept="image/*"
        className="blind"
        onChange={handleSetImage}
        multiple={imgsIid ? "multiple" : null}
      />
      {img && img.length === 1 ? (
        <div className="imgsThumbnail">
          <img src={img[0].storagePath} alt="사업자 대표 이미지" />
        </div>
      ) : null}
      {img && img.length > 1 ? (
        <ul className="imgsThumbnail">
          {img.map((item, key) => (
            <li key={key}>
              <img src={item.storagePath} alt="사업자 상세 이미지" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
