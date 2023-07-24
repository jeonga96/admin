// 사업자 회원 관리 > 사업자 상세정보 > 사업자 리뷰 > 사업자 리뷰 확인
// 리뷰는 관리자 페이지에서 작성하지 않는다.

import { useState } from "react";
import { useGetImage } from "../services/customHook";

import ServicesImageOnClick from "../components/event/ServicesImageOnClick";

export default function DetailCompanyReview({
  compnayReview,
  clickedUseFlag,
  setClickedUseFlag,
}) {
  // 이미지 ------------------------------------------------------------------------
  // images : 리뷰 이미지
  const [images, setImages] = useState([]);
  // 이미지 ------------------------------------------------------------------------
  // useFlagCk:리뷰활성화
  const [useFlagCk, setUseFlagCk] = useState(false);

  // cid값 저장
  const addCheck = (name, isChecked) => {
    (() => {
      if (isChecked) {
        setClickedUseFlag([...clickedUseFlag, name]);
        // 동일한 선택을 할 때 중복 선택되지 않도록 설정
      } else if (!isChecked && clickedUseFlag.includes(name)) {
        setClickedUseFlag(clickedUseFlag.filter((it) => it !== name));
      }
    })();
  };
  // 체크 이벤트 동작 & 상위 컴포넌트에게 전달하기 위한 이벤트 동작
  const handleCheck = ({ target }) => {
    // 체크박스 상태관리
    setUseFlagCk(!useFlagCk);
    // cid 추가, 삭제 이벤트
    addCheck(target.name, target.checked);
  };

  // iid로 이미지 url요청하는 커스텀 훅
  useGetImage(setImages, compnayReview);

  return (
    <>
      <td style={{ width: "70px" }}>
        <input
          type="checkbox"
          name={compnayReview.comrid}
          checked={useFlagCk}
          id="useFlag"
          onChange={handleCheck}
        />
      </td>
      <td className="tableReviewWrap">
        <div>
          <h4 style={{ marginBottom: "6px" }}>{compnayReview.title}</h4>
          <ul>
            <li>
              <span>{compnayReview.ruidNick || "익명"}</span>
            </li>
            <li>
              <em>작성</em>
              <span>
                {compnayReview.createTime &&
                  compnayReview.createTime.slice(0, 10) +
                    " " +
                    compnayReview.createTime.slice(11, 19)}
              </span>
            </li>
            <li>
              <em>수정</em>
              <span>
                {compnayReview.updateTime &&
                  compnayReview.updateTime.slice(0, 10) +
                    " " +
                    compnayReview.updateTime.slice(11, 19)}
              </span>
            </li>
          </ul>
          <p>{compnayReview.content}</p>
        </div>
        <div className="tableReviewImgWrap">
          <div>
            <div className="tableReviewImg">
              <div style={{ width: 62 * images.length + "px" }}>
                {images &&
                  images.map((item) => (
                    <ServicesImageOnClick
                      key={item.iid}
                      getData={images}
                      url={item.storagePath}
                      text="리뷰 이미지"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </td>

      {/* 
        <li className="detailContentWrap">
          <h4 className="blind">내용</h4>
          <div>
            <p>{compnayReview.content}</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {compnayReview.negativeCount && (
                <div style={{ width: "49.5%", height: "75px" }}>
                  <PieceBarChart
                    negativeCount={compnayReview.negativeCount}
                    positiveCount={compnayReview.positiveCount}
                  />
                </div>
              )}
              <div
                className=" detailWidthContentImg detailWidthContent"
                style={{ justifyContent: "left", width: "49.5%" }}
              >
                {images &&
                  images.map((item) => (
                    <ServicesImageOnClick
                      key={item.iid}
                      getData={images}
                      url={item.storagePath}
                      text="리뷰 이미지"
                    />
                  ))}
              </div>
            </div>
          </div>
        </li> */}
      {/* </ul> */}
      {/* </div> */}
    </>
  );
}
