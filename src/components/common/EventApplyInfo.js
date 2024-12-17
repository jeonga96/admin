import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

export default function EventApplyInfo() {
  const { cid, uid } = useParams(); // URL 파라미터에서 cid, uid를 가져옴
  const [contentsList, setContentsList] = useState([]);

  const [listItems, setListItems] = useState([]); // 리스트 아이템을 저장하는 상태
  console.log(uid);

  // 컴포넌트가 마운트되거나 업데이트될 때 실행되는 useEffect
  const fetchListItems = useCallback(() => {
    API.servicesPostData(APIURL.urlGetEventApplyInfo, {
      ruid: uid,
    })
      .then((res) => {
        if (res.status === "success") {
          console.log("리스트 불러오기 성공");
          setContentsList(res.data);
        } else {
          setContentsList([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setContentsList([]);
      });
  }, [uid]);

  useEffect(() => {
    fetchListItems();
  }, [fetchListItems]);

  const fnProductValue = (item) => {
    if (item === "1") {
      return "홈페이지 제작, 관리 ( PC형 )";
    } else if (item === "2") {
      return "블로그 제작 + 포스팅 1회 + 동영상 제작";
    } else if (item === "3") {
      return "블로그 포스팅 7회 작성";
    } else {
      return "홈페이지 + 블로그 포스팅 1회 + 동영상 제작, 관리 업로드";
    }
  };

  return (
    <>
      <fieldset
        id="CompanyDetail_11"
        style={{
          paddingBottom: contentsList.length > 0 ? "0" : "5%",
        }}
      >
        <h3>와짱 이벤트 목록</h3>
        {contentsList.length > 0 && (
          <table className="EventApplyInfo-table">
            <thead>
              <tr>
                <th style={{ width: "7%" }}>관리번호</th>
                <th style={{ width: "9%" }}>공사콕회원</th>
                <th style={{ width: "9%" }}>사업자분류</th>
                <th style={{ width: "auto" }}>상품</th>
                <th style={{ width: "12%" }}>업체명</th>
                <th style={{ width: "12%" }}>대표 ( 주력 ) 업종</th>
                <th style={{ width: "12%" }}>휴대폰</th>
              </tr>
            </thead>
            <tbody>
              {contentsList &&
                contentsList.map((item) => (
                  <tr key={item.gweid}>
                    <td>{item.gweid}</td>
                    <td>{item.guserFlag === "0" ? "미가입" : "가입"}</td>
                    <td>{item.busClassFlag}</td>
                    <td>{fnProductValue(item.product)}</td>
                    <td>{item.cname}</td>
                    <td>{item.job}</td>
                    <td>{item.telnum}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </fieldset>
    </>
  );
}
