import { useState } from "react";
import { useGetimgStringImgs, useGetImage } from "../../Services/customHook";

import ImageOnClick from "./ServicesImageOnClick";

export default function ComponentDetailNotice({ detail }) {
  // contentString 유무를 확인해 contentString가 있으면 관리자 내용
  const ADMIN = !!detail.contentString;
  // 이미지 ------------------------------------------------------------------------
  // imgs:상세 이미지저장 및 표시, imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const [imgs, setImgs] = useState([]);

  // 서버에서 image를 가져오는 customHook imgs를 가져온다.
  useGetImage(setImgs, detail);
  //공지사항 이미지(imgString)를 가져온다.
  useGetimgStringImgs(setImgs, detail);

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
      <li className="detailContentWrap title">
        <h4 className="blind">제목</h4>
        <div>
          <span className="titleText">
            {ADMIN ? detail.contentString : detail.title}
          </span>
        </div>
      </li>

      <li className="detailContentWrap">
        <h4 className="blind">내용</h4>
        <div>
          <p className="contentText">
            {ADMIN ? detail.contentDetail : detail.content}
          </p>
          {imgs && (
            <div
              className="detailWidthContent detailWidthContentImg"
              style={{ justifyContent: "left" }}
            >
              {imgs.map((item) => (
                <ImageOnClick
                  key={item.iid}
                  getData={imgs}
                  url={item}
                  text="공지사항 이미지"
                />
              ))}
            </div>
          )}
        </div>
      </li>
    </ul>
  );
}
