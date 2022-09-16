import { useEffect, useState, useRef } from "react";
import { BiUpload } from "react-icons/bi";
import {
  servicesPostDataForm,
  servicesPostData,
  useDidMountEffect,
} from "../../Services/importData";
import { urlGetImages, urlUpImages } from "../../Services/string";

export default function SetImage({ title, img, setImg }) {
  function setImage(img) {
    return setImg(img);
  }
  const imgsIid = useRef([]);

  function handleSetImage(event) {
    event.preventDefault();
    const files = event.target.files;
    console.log("이미지 클릭", files);
    console.log("이미지 클릭2", event);
    const formData = new FormData();
    // if (event.target.id === "titleImg") {
    //   console.log("titleUpload click-->", files[0]);
    //   formData.append("Imgs", files[0]);
    // } else {
    //   for (let i = 0; i < files.length; i++) {
    //     console.log(i, "titleUpload click-->", files[i]);
    //     formData.append("Imgs", files[i]);
    //   }
    // }

    // servicesPostDataForm(urlUpImages, formData).then((res) => {
    //   setImage(res.data);
    //   if (res.data.length > 1) {
    //     for (let i = 0; i < res.data.length; i++) {
    //       imgsIid.current.push(res.data[i].iid);
    //     }
    //   }
    // });
  }

  return (
    <div>
      <div className="blockLabel">{title}</div>
      <label htmlFor="imgs" className="blockLabel fileboxLabel ">
        <BiUpload /> 사진 업로드
      </label>
      <input
        type="file"
        id="titleImg"
        name="Imgs"
        accept="image/*"
        className="blind"
        onClick={handleSetImage}
      />
      {img && img.length === 1 ? (
        <div className="imgsThumbnail">
          <img src={img[0].storagePath} alt="사업자 상세 이미지" />
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
