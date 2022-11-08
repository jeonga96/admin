import { useState } from "react";
import { useGetimgStringImgs, useGetImage } from "../../Services/customHook";

import ImageOnClick from "./ServicesImageOnClick";

export default function ComponentDetailNotice({ detail }) {
  const ADMIN = !!detail.contentString;
  const [images, setImages] = useState([]);

  // 서버에서 image를 가져오는 customHook imgs를 가져온다.
  useGetImage(setImages, detail);
  //공지사항 이미지(imgString)를 가져온다.
  useGetimgStringImgs(setImages, detail);

  return (
    <ul className="detailPageLayout">
      <li className="detailTime">
        <div>
          <em>작성 시간</em>
          <span>
            {detail.createTime &&
              detail.createTime.slice(0, 10) +
                " " +
                detail.createTime.slice(11, 16)}
          </span>
        </div>
        <div>
          <em>수정 시간</em>
          <span>
            {detail.updateTime &&
              detail.updateTime.slice(0, 10) +
                " " +
                detail.updateTime.slice(11, 16)}
          </span>
        </div>
      </li>
      <li className="detailContentWrap">
        <h4>제목</h4>
        <div>
          <span>{ADMIN ? detail.contentString : detail.title}</span>
        </div>
      </li>

      <li className="detailContentWrap">
        <h4>내용</h4>
        <div>
          <p>{ADMIN ? detail.contentDetail : detail.content}</p>
          <div
            className="detailWidthContent detailWidthContentImg"
            style={{ justifyContent: "left" }}
          >
            {images &&
              images.map((item) => (
                <ImageOnClick
                  key={item.iid}
                  getData={images}
                  url={item.storagePath}
                  text="공지사항 이미지"
                />
              ))}
          </div>
        </div>
      </li>
    </ul>
  );
}
