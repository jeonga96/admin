// 유통망 관리 > 지사( 총판 )관리 리스트

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLayoutEffect, useState } from "react";

import * as API from "../../service/api";
import * as STR from "../../service/string";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";
import PieceLoading from "../../components/piece/PieceLoading";

export default function ListAgentAg() {
  const { register, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      _channelId: "gongsacok",
    },
  });
  // 데이터 ------------------------------------------------------------------------
  const [mentList, setMentList] = useState([]);
  // loading:true -> loading중
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    fnSearchSubmit();
  }, []);

  function onResetHandle(e) {
    reset();
    fnSearchSubmit();
  }

  function fnSearchSubmit() {
    console.log(`${STR.urlPre050Biz}/050biz/v1/${watch("_channelId")}/ment`);

    // type: watch("_type"),
    API.servicesGet050biz(
      `${STR.urlPre050Biz}/050biz/v1/${watch("_channelId")}/ment`,
      {
        type: 1,
      }
    ).then((res) => {
      setLoading(true);
      if (res.code === "0000") {
        setLoading(false);
        setMentList(res.data);
      }
    });
  }

  return (mentList == [] && mentList.length == 0) || mentList === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="작성" />
      </ul>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <div className="commonBox">
        <h3 className="blind">사업자관리 검색 필터</h3>
        <form
          className="listSearchForm formLayout"
          onSubmit={handleSubmit(fnSearchSubmit)}
        >
          <div className="listSearchWrap" style={{ width: "50%" }}>
            <label className="blockLabel">
              <span>채널ID</span>
            </label>
            <div>
              <input
                type="text"
                id="channelId"
                placeholder="검색할 채널ID를 입력해 주세요."
                {...register("_channelId")}
              />
            </div>
          </div>

          <div className="listSearchWrap" style={{ width: "50%" }}>
            <label className="blockLabel">
              <span>멘트 타입</span>
            </label>
            <div>
              <select {...register("_type")} style={{ width: "100%" }}>
                <option value="1">컬러링</option>
                <option value="2">착신멘트</option>
                <option value="3">업무외멘트</option>
                <option value="4">휴일멘트</option>
              </select>
            </div>
          </div>

          <div className="listSearchButtonWrap">
            <button type="reset" value="초기화" onClick={onResetHandle}>
              초기화
            </button>
            <button type="submit" value="검색">
              검색
            </button>
          </div>
        </form>
      </div>

      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="멘트 추가" />
      </ul>

      <section className="tableWrap">
        <h3 className="blind">안심번호 멘트관리 목록</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "140px" }}>멘트 관리번호</th>
                <th style={{ width: "140px" }}>멘트 타입</th>
                <th style={{ width: "140px" }}>멘트 파일명</th>
                <th style={{ width: "140px" }}>파일 제목</th>
                <th style={{ width: "140px" }}>멘트 안내 방법</th>
                <th style={{ width: "auto" }}>TTS메세지</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {mentList.map((item) => {
                console.log(item);
                return (
                  <tr key={item.mentId}>
                    <td className="tableButton">
                      <Link to={`${item.mentId}`} className="Link">
                        {item.mentId}
                      </Link>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.fileName}</td>
                    <td>{item.title}</td>
                    <td>{item.musicMethod}</td>
                    <td>{item.ttsMsg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* <PageButton listPage={listPage} page={page} setPage={setPage} /> */}
        </div>
      </section>
    </>
  );
}
