import { Link } from "react-router-dom";

import { useSelector, shallowEqual } from "react-redux";
import { useState } from "react";

import * as API from "../../service/api";
import * as CH from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";

export default function ComponentListNotice({ list }) {
  const [image, setImage] = useState([]);
  // const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  CH.useCleanupEffect(() => {
    console.log(" pageData.getPage", list);

    const fetchImages = async () => {
      let newImages = [];

      for (let i = 0; i < list.length; i++) {
        if (!!list[i].imgString) {
          try {
            const res = await API.servicesPostData(APIURL.urlGetImages, {
              imgs: list[i].imgString?.split(",")[0],
            });

            if (res.status === "success") {
              newImages.push(...res.data);
            } else {
              newImages.push("-");
            }
          } catch (error) {
            console.error("Error fetching images:", error);
            newImages.push("-");
          }
        } else {
          newImages.push("-");
        }
      }
      // 새로운 페이지 데이터마다 이미지를 덮어쓰기 위해 초기화 후 설정
      setImage(newImages);
    };
    // `pageData.getPage`가 변경될 때마다 이미지를 다시 로드
    fetchImages();
  }, [list]);

  return (
    <>
      {list && list.length > 0 ? (
        <table className="commonTable">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>작성자</th>
              <th style={{ width: "auto" }}>내용</th>
              <th style={{ width: "150px" }}>사진</th>
            </tr>
          </thead>
          <tbody className="commonTable">
            {list?.map((item, key) => (
              <tr key={item.lcid} style={{ height: "3.25rem" }}>
                <td>
                  {!!item.gubun ? (
                    <i
                      className="tableIcon"
                      style={{ backgroundColor: "#757575" }}
                    >
                      관리자
                    </i>
                  ) : (
                    <i
                      className="tableIcon"
                      style={{ backgroundColor: "#167d88" }}
                    >
                      회원
                    </i>
                  )}
                </td>
                <td className="tableContentWrap">
                  <Link
                    to={`/localcontent/${item.lcid}`}
                    className="Link"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {item.contentDetail && (
                      <div style={{ display: "flex", height: "22px" }}>
                        {item.contentDetail?.split(" ").map((item) => (
                          <div
                            style={{
                              width: "auto",
                              height: "20px",
                              padding: "0 6px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(0,0,0,0.05)",
                              marginRight: "8px",
                              border: "1px solid rgba(0,0,0,0.15)",
                              lineHeight: "20px",
                            }}
                          >
                            # {item.startsWith("#") ? item.substring(1) : item}
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      style={{
                        fontWeight: 500,
                        height: "28px",
                        fontSize: "16px",
                      }}
                    >
                      {item.contentTitle}
                    </div>
                    <div
                      style={{
                        height: "28px",
                        width: "100%",
                        fontSize: "16px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.contentString}
                    </div>
                    <div
                      style={{
                        height: "24px",
                        color: "rgba(0,0,0,0.7)",
                        lineHeight: "24px",
                      }}
                    >
                      {!!item.location ? item.location : "지역 없음"} /{" "}
                      {item.createTime.slice(0, 10)}
                    </div>
                  </Link>
                </td>
                <td>
                  {image[key] === "-" ? (
                    " "
                  ) : (
                    <img
                      style={{
                        height: "110px",
                      }}
                      src={image[key]?.storagePath}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="nullBox">데이터가 없습니다.</div>
      )}
    </>
  );
}
