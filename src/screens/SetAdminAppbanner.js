import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  urlSetContent,
  urlGetContent,
  urlContentList,
} from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { serviesGetImgsIid } from "../Services/useData";

import SetImage from "../components/common/ServicesImageSetUrl";

export default function SetAdminAppbanner() {
  const [bannerlist, setBannerlist] = useState([]);
  const [imgs, setImgs] = useState([]);
  const imgsIid = [];
  const getDataFinish = useRef(false);
  const [noticeDetail, setNoticeDetail] = useState({
    contentString: "",
    contentDetail: "",
  });

  useEffect(() => {
    // if (!!contid) {
    //   servicesPostData(urlGetContent, {
    //     contid: contid,
    //   })
    //     .then((res) => {
    //       if (res.status === "success") {
    //         setNoticeDetail(res.data);
    //         getDataFinish.current = true;
    //       } else if (res.data === "fail") {
    //         console.log("기존에 입력된 데이터가 없습니다.");
    //       }
    //     })
    //     .catch((res) => console.log(res));
    // }

    servicesPostData(urlContentList, {
      category: "banner",
      offset: 0,
      size: 10,
    })
      .then((res) => {
        if (res.status === "success") {
          setBannerlist(res.data);
        } else if (res.data === "fail") {
          console.log("기존에 입력된 데이터가 없습니다.");
        }
      })
      .catch((res) => console.log(res));
  }, []);

  function onChange(e) {
    setNoticeDetail({ ...noticeDetail, [e.target.id]: e.target.value });
  }

  function AddUserSubmit(e) {
    serviesGetImgsIid(imgsIid, imgs);
    servicesPostData(
      urlSetContent
      // !!contid
      //   ? {
      //       contid: contid,
      //       category: "notice",
      //       contentString: noticeDetail.contentString,
      //       contentDetail: noticeDetail.contentDetail,
      //       imgString: setImgs ? imgsIid.toString() : "",
      //     }
      //   : {
      //       category: "notice",
      //       contentString: noticeDetail.contentString,
      //       contentDetail: noticeDetail.contentDetail,
      //       imgString: setImgs ? imgsIid.toString() : "",
      //     }
    )
      .then((res) => {
        if (res.status === "fail") {
          alert("입력에 실패했습니다,");
        }
        if (res.status === "success") {
          alert("완료되었습니다!");
          window.location.href = `/admin/notice/${res.data.contid}`;
          return;
        }
      })
      .catch((error) => console.log("axios 실패", error.response));
  }

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={AddUserSubmit}>
          <fieldset className="formContentWrapWithRadio">
            <div className="listSearchWrap">
              <div className="blockLabel">배너이름</div>
              <div className="formContentWrapWithTextValue"></div>
            </div>
            <div className="listSearchWrap">
              <div className="blockLabel">사용여부</div>
              <div className="formContentWrapWithTextValue"></div>
            </div>
            <div className="listSearchWrap">
              <div className="blockLabel">배너 이미지</div>
              <div className="formContentWrapWithTextValue"></div>
            </div>
            <div className="listSearchWrap">
              <div className="blockLabel">랜딩 URL</div>
              <div className="formContentWrapWithTextValue"></div>
            </div>
          </fieldset>
          <div className="listSearchButtonWrap">
            <input type="reset" value="초기화" />
            <input type="submit" value="검색" />
          </div>
        </form>
        {/* 하단 list */}
        <table className="commonTable">
          {/* <thead>
            <tr>
              <th className="widthM">배너이미지</th>
              <th className="widthBB">랜딩 URL</th>
              <th className="widthM">상태</th>
              <th className="widthM">관리</th>
            </tr>
          </thead>
          <tbody className="commonTable">
            {bannerlist &&
              bannerlist.map((item) => (
                <tr key={item.contid} style={{ height: "5.25rem" }}>
                  <td>{item.contid}</td>
                  <td className="tableContentWrap">
                    <em>{item.contentString}</em>
                  </td>
                  <td>{item.createTime.slice(0, 10)}</td>
                </tr>
              ))}
          </tbody> */}
        </table>
      </div>
    </>
  );
}
