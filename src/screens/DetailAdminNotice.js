import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlGetContent, urlGetImages } from "../Services/string";
import { useDidMountEffect } from "../Services/customHook";

import LayoutTopButton from "../components/common/LayoutTopButton";
import ServicesImageOnClick from "../components/common/ServicesImageOnClick";

export default function DetailAdminNotice() {
  const [notice, setNotice] = useState("");
  const [images, setImages] = useState([]);
  const { contid } = useParams();
  console.log(notice);
  // 해당 공지사항 번호에 맞는 데이터를 가져온다.
  useEffect(() => {
    servicesPostData(urlGetContent, {
      contid: contid,
    }).then((res) => {
      if (res.status === "success") {
        setNotice(res.data);
        return;
      }
    });
  }, []);

  //공지사항 이미지(imgString)를 가져온다.
  useDidMountEffect(() => {
    servicesPostData(urlGetImages, {
      imgs: notice.imgString,
    }).then((res) => setImages(res.data));
  }, [notice.imgString]);

  return (
    <>
      <div className="commonBox paddingBox">
        <ul className="tableTopWrap">
          <LayoutTopButton url="/noticelist" text="목록으로 가기" />
          <LayoutTopButton url="modify" text="수정" />
        </ul>
        <ul className="detailPageLayout">
          <li className="detailTime">
            <div>
              <em>작성 시간</em>
              <span>
                {notice.createTime &&
                  notice.createTime.slice(0, 10) +
                    " " +
                    notice.createTime.slice(11, 19)}
              </span>
            </div>
            <div>
              <em>수정 시간</em>
              <span>
                {notice.updateTime &&
                  notice.updateTime.slice(0, 10) +
                    " " +
                    notice.updateTime.slice(11, 19)}
              </span>
            </div>
          </li>

          <li className="formContentWrap">
            <h4>번호</h4>
            <span>{notice.contid}</span>
          </li>

          <li className="formContentWrap">
            <h4>제목</h4>
            <span>{notice.contentString}</span>
          </li>

          <li className="formContentWrap">
            <h4>상세 이미지</h4>
            <ul
              className="detailWidthContent detailWidthContentImg"
              style={{ justifyContent: "left" }}
            >
              {images &&
                images.map((item) => (
                  <ServicesImageOnClick
                    key={item.iid}
                    getData={images}
                    url={item.storagePath}
                    text="공지사항 이미지"
                  />
                ))}
            </ul>
          </li>

          <li className="formContentWrap">
            <h4>공지사항 내용</h4>
            <p>{notice.contentDetail}</p>
          </li>
        </ul>
      </div>
    </>
  );
}
