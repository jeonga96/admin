import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  urlSetContent,
  urlGetContent,
  urlGetImages,
  urlContentList,
} from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { useDidMountEffect } from "../Services/customHook";
import { serviesGetImgId, servicesUseToast } from "../Services/useData";

import SetImage from "../components/common/ServicesImageSetUrl";
import PaginationButton from "../components/common/PiecePaginationButton";

export default function SetAdminAppbanner() {
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm();

  // bannerlist:저장된 배너 리스트 불러오기
  const [bannerlist, setBannerlist] = useState([]);
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  // clickedContid : clickedContid !== null 이라면 수정 아니면 작성기능을 수행
  const [clickedContid, setClickedContid] = useState(null);

  // [이미지 관련]
  // img:이미지 저장 / imgsIid:서버에 이미지를 보낼 때는, iid값만 필요 / changeImg: 이미지 수정 시 수정된 이미지 저장
  const [img, setImg] = useState(null);
  const imgsIid = [];
  const [changeImg, setChangeImg] = useState(null);

  // [목록 페이지 버튼 관련]
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // 화면 렌더링 시 가장 처음 발생되는 이벤트
  useEffect(() => {
    // 카테고리 banner의 앱배너 컨텐츠를 0번째부터 15개씩 가지고 온다.
    servicesPostData(urlContentList, {
      category: "banner",
      offset: page.getPage,
      size: 15,
    })
      .then((res) => {
        // bannerlist : 컨텐츠 카테고리가 배너인 목록 가지고 오기
        // listPage : pagination이용을 위해 가지고 옴
        if (res.status === "success") {
          setBannerlist(res.data);
          setListPage(res.page);
        } else if (res.data === "fail") {
          console.log("기존에 입력된 데이터가 없습니다.");
        }
      })
      .catch((res) => console.log(res));
    // 배너관리 상단 검색 창 사용여부 기본값 지정
    setValue("_useFlag", "1");
  }, [page.getPage]);

  // bannerlist의 데이터를 받아오면 기존 배너의 이미지 데이터를 받아온다.
  useDidMountEffect(() => {
    serviesGetImgId(imgsIid, bannerlist);
    servicesPostData(urlGetImages, {
      imgs: imgsIid.toString(),
    }).then((res) => {
      setImg(res.data);
    });
  }, [bannerlist]);

  // 수정 버튼을 누르면 contid에 맞는 content 데이터를 가지고 온다.
  useDidMountEffect(() => {
    servicesPostData(urlGetContent, {
      contid: clickedContid,
    })
      .then((res) => {
        if (res.status === "success") {
          setValue("_useFlag", res.data.useFlag.toString());
          setValue("_contentDetail", res.data.contentDetail);
          setValue("_contentString", res.data.contentString);

          setChangeImg(res.data.imgid);
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("기존에 입력된 데이터가 없습니다.");
        }
      })
      .catch((res) => console.log(res));
  }, [clickedContid]);

  function HandleSubmit(e) {
    // e.preventDefault();
    const ifImg = changeImg[0] ? changeImg[0].iid : changeImg;
    // 입력되지 않은 값이 있다면 전송되지 않도록 설정
    if (ifImg && getValues("_contentDetail") && getValues("_contentString")) {
      servicesPostData(
        urlSetContent,
        // clickedContid(수정 버튼이 클릭되면) contid도 함께 전달
        !!clickedContid
          ? {
              contid: clickedContid,
              category: "banner",
              imgid: ifImg,
              contentDetail: getValues("_contentDetail"),
              contentString: getValues("_contentString"),
              useFlag: getValues("_useFlag"),
            }
          : {
              category: "banner",
              imgid: ifImg,
              contentDetail: getValues("_contentDetail"),
              contentString: getValues("_contentString"),
              useFlag: getValues("_useFlag"),
            }
      )
        .then((res) => {
          if (res.status === "fail") {
            servicesUseToast("입력에 실패했습니다.", "e");
          }
          if (res.status === "success") {
            servicesUseToast("완료되었습니다!", "s");
            window.location.reload();
            return;
          }
        })
        .catch((error) => console.log("axios 실패", error.response));
    } else {
      servicesUseToast("입력되지 않은 값이 있습니다.");
    }
  }

  // bannerlist imgid에 맞는 image storagePath 값을 전달해주는 함수
  const filterImgIid = (img, item) => {
    for (let i = 0; i < img.length; i++) {
      if (img[i].iid === item.imgid) {
        return img[i].storagePath;
      }
    }
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(HandleSubmit)}>
          <fieldset>
            <div className="formWrap">
              <div className="listSearchWrap" style={{ width: "50%" }}>
                <div className="blockLabel">
                  <span>배너이름</span>
                </div>
                <div>
                  <input
                    type="text"
                    id="contentString"
                    placeholder="제목을 입력해 주세요."
                    {...register("_contentString")}
                  />
                </div>
              </div>
              <div className="listSearchWrap" style={{ width: "50%" }}>
                <div className="blockLabel">
                  <span>사용여부</span>
                </div>
                <div>
                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_useFlag") === "0"}
                    value="0"
                    id="useFlag0"
                    {...register("_useFlag")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="useFlag0">
                    OFF
                  </label>

                  <input
                    className="listSearchRadioInput"
                    type="radio"
                    checked={watch("_useFlag") === "1"}
                    value="1"
                    id="useFlag1"
                    {...register("_useFlag")}
                  />
                  <label className="listSearchRadioLabel" htmlFor="useFlag1">
                    ON
                  </label>
                </div>
              </div>

              <div className="listSearchWrap" style={{ width: "50%" }}>
                <div className="blockLabel">
                  <span>배너이미지</span>
                </div>
                <div>
                  <SetImage
                    id="titleImg"
                    getData={bannerlist}
                    getDataFinish={getDataFinish.current}
                    setChangeImg={setChangeImg}
                    changeImg={changeImg}
                  />
                </div>
              </div>
              <div className="listSearchWrap" style={{ width: "50%" }}>
                <div className="blockLabel">
                  <span>랜딩 URL</span>
                </div>
                <div>
                  <input
                    type="text"
                    id="contentDetail"
                    placeholder="연결될 URL을 입력해 주세요."
                    {...register("_contentDetail")}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <div className="listSearchButtonWrap">
            {!!clickedContid ? (
              <button
                type="reset"
                onClick={() => {
                  setClickedContid(null);
                  setChangeImg(null);
                  reset();
                }}
              >
                취소
              </button>
            ) : (
              <button
                type="reset"
                onClick={() => {
                  reset();
                  setChangeImg(null);
                }}
              >
                초기화
              </button>
            )}

            {!!clickedContid ? (
              <button type="submit" value="수정" disabled={isSubmitting}>
                수정
              </button>
            ) : (
              <button type="submit" value="추가" disabled={isSubmitting}>
                추가
              </button>
            )}
          </div>
        </form>
        {/* 하단 list ---------------------------------------- */}
      </div>
      <div className="commonBox">
        <table className="commonTable">
          <thead>
            <tr>
              <th className="widthM">배너이미지</th>
              <th className="widthM">배너이름</th>
              <th className="widthM">랜딩 URL</th>
              <th className="widthS">사용여부</th>
              <th className="widthS">관리</th>
            </tr>
          </thead>
          <tbody className="commonTable">
            {bannerlist &&
              bannerlist.map((item) => (
                <tr key={item.contid} style={{ height: "5.25rem" }}>
                  <td>
                    <div
                      style={
                        img && {
                          width: "212px",
                          height: "84px",
                          backgroundImage: `url('${filterImgIid(img, item)}')`,
                          margin: "0 auto",
                        }
                      }
                    ></div>
                  </td>
                  <td>{item.contentString}</td>
                  <td>
                    <div>
                      <a
                        href={item.contentDetail}
                        target="_blank"
                        rel="noreferrer"
                        impliesrel="noopener"
                      >
                        {item.contentDetail}
                      </a>
                    </div>
                  </td>
                  <td>
                    {item.useFlag == "1" && <i className="tableIcon">ON</i>}
                  </td>
                  <td>
                    <button
                      className="Link"
                      onClick={() => {
                        setClickedContid(item.contid);
                      }}
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <PaginationButton listPage={listPage} page={page} setPage={setPage} />
      </div>
    </>
  );
}
