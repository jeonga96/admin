import { useParams } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useEffect, useState, useCallback } from "react";

import * as API from "../../service/api";
import * as UD from "../../service/useData";
import * as STR from "../../service/string";

import PieceDetailListLink from "../piece/PieceDetailListLink";

export default function ComponentCompanyPieceLink() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const getedData = useSelector((state) => state.getedData, shallowEqual);
  const writeData = useSelector((state) => state.writeData, shallowEqual);

  const [toEstimateinfo, setToEstimateinfo] = useState([]);
  const [fromEstimateinfo, setFromEstimateinfo] = useState([]);
  const [toproposalInfo, setToproposalInfo] = useState([]);
  const [fromproposalInfo, setFromproposalInfo] = useState([]);

  const [noticeList, setNoticeList] = useState([]);
  const [reviewList, setReviewList] = useState([]);

  const onChangeWrite = useCallback(
    (e) => {
      dispatch({
        type: "serviceWriteData",
        payload: {
          ...writeData,
          [e.target.id]: e.target.value,
        },
      });
    },
    [writeData]
  );

  useEffect(() => {
    dispatch({
      type: "serviceWriteData",
      payload: {
        okCount: getedData.okCount,
        reCount: getedData.reCount,
        noCount: getedData.noCount,
      },
    });

    // 상세 회사정보 불러오기 기존 값이 없다면 새로운 회원이다. 새로 작성함
    UD.serviesPostDataSettingRcid(STR.urlCompanyNoticeList, cid, setNoticeList);
    UD.serviesPostDataSettingRcid(STR.urlReviewList, cid, setReviewList);

    // 견적요청서 - uid가 필요하기 떄문에 cid로 uid를 확인한 후 진행
    API.servicesPostData(STR.urlGetCompany, { cid: cid })
      .then((res) => {
        if (res.data.ruid !== undefined) {
          // 회원정보
          API.servicesPostData(STR.urlListEstimateInfo, {
            fromUid: res.data.ruid,
            offset: 0,
            size: 150,
          }).then((res) => setFromEstimateinfo(res.data));
          // 견적 요청서 수령
          API.servicesPostData(STR.urlListEstimateInfo, {
            toUid: res.data.ruid,
            offset: 0,
            size: 150,
          }).then((res) => setToEstimateinfo(res.data));

          // 견적서 요청
          API.servicesPostData(STR.urlListProposalInfo, {
            fromUid: res.data.ruid,
            offset: 0,
            size: 150,
          }).then((res) => setFromproposalInfo(res.data));

          // 견적서 수령
          API.servicesPostData(STR.urlListProposalInfo, {
            toUid: res.data.ruid,
            offset: 0,
            size: 150,
          }).then((res) => setToproposalInfo(res.data));
        }
      })
      .catch((res) => console.log(res));
  }, [getedData]);

  return (
    <>
      {/* 견적 관리 링크 이동 ================================================================ */}
      <fieldset id="CompanyDetail_5">
        <h3>견적 관리</h3>
        <div className="formContentWrap">
          <label htmlFor="address" className=" blockLabel">
            <span>견적의뢰서</span>
          </label>
          <ul className="detailContent">
            <PieceDetailListLink
              getData={toEstimateinfo}
              url={`toestimateinfo`}
              title="요청"
              useLink={
                toEstimateinfo && toEstimateinfo.length > 0 ? true : false
              }
            />

            <PieceDetailListLink
              getData={fromEstimateinfo}
              url={`fromestimateinfo`}
              title="수령"
              useLink={
                fromEstimateinfo && fromEstimateinfo.length > 0 ? true : false
              }
            />
          </ul>
        </div>
        <div className="formContentWrap">
          <label htmlFor="address" className=" blockLabel">
            <span>견적서</span>
          </label>
          <ul className="detailContent">
            <PieceDetailListLink
              getData={toproposalInfo}
              url={`toproposalInfo`}
              title="요청"
              useLink={
                toproposalInfo && toproposalInfo.length > 0 ? true : false
              }
            />

            <PieceDetailListLink
              getData={fromproposalInfo}
              url={`fromproposalInfo`}
              title="수령"
              useLink={
                fromproposalInfo && fromproposalInfo.length > 0 ? true : false
              }
            />
          </ul>
        </div>
      </fieldset>

      {/* 고객관리 링크 이동 ================================================================ */}
      <fieldset id="CompanyDetail_6">
        <h3>고객 관리</h3>
        <div className="formContentWrap">
          <label htmlFor="address" className=" blockLabel">
            <span>평점</span>
          </label>
          <ul className="detailContent">
            <li style={{ width: "33.3333%" }}>
              <div>
                <span>추천</span>
                <input
                  type="number"
                  id="reCount"
                  value={writeData.reCount || ""}
                  onChange={onChangeWrite}
                />
              </div>
            </li>

            <li style={{ width: "33.3333%" }}>
              <div>
                <span>만족</span>
                <input
                  type="number"
                  id="okCount"
                  value={writeData.okCount || ""}
                  onChange={onChangeWrite}
                />
              </div>
            </li>

            <li style={{ width: "33.3333%" }}>
              <div>
                <span>불만족</span>
                <input
                  type="number"
                  id="noCount"
                  value={writeData.noCount || ""}
                  onChange={onChangeWrite}
                />
              </div>
            </li>
          </ul>
        </div>

        <div className="formContentWrap">
          <label htmlFor="address" className=" blockLabel">
            <span>커뮤니티 관리</span>
          </label>
          <ul className="detailContent">
            <PieceDetailListLink
              getData={noticeList}
              url={`/company/${getedData.rcid}/notice`}
              title="공지사항"
              useLink={true}
            />

            <PieceDetailListLink
              getData={reviewList}
              url={`/company/${getedData.rcid}/review`}
              title="리뷰"
              useLink={reviewList.length > 0 ? true : false}
            />
          </ul>
        </div>
      </fieldset>
    </>
  );
}
