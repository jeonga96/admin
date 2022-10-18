import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  urlSetContent,
  urlGetContent,
  urlGetImages,
  urlContentList,
} from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { useDidMountEffect } from "../Services/customHook";
import { serviesGetImgId } from "../Services/useData";

import SetImage from "../components/common/ServicesImageSetUrl";

export default function SetAdminAppbanner() {
  const location = useLocation();
  // 저장된 배너 리스트 불러오기 & 저장
  const [bannerlist, setBannerlist] = useState([]);
  // 배너 리스트 내부의 배너 상세 내용에 onChange 이벤트를 적용할 수 있도록 설정
  const [bannerDetail, setBannerDetail] = useState({
    contentString: "",
    contentDetail: "",
  });
  // getDataFinish:기존에 입력된 값이 있어 값을 불러왔다면 true로 변경,
  const getDataFinish = useRef(false);
  // clickedContid가 입력되면 수정 아니면 작성기능을 수행하도록 설정
  const [clickedContid, setClickedContid] = useState(null);
  // img: 이미지저장 및 표시
  const [img, setImg] = useState(null);
  // imgsIid:서버에 이미지를 보낼 때는, iid값만 필요
  const imgsIid = [];
  const [changeImg, setChangeImg] = useState("");
  // useFlag radio
  const [useFlagCheck, setUseFlagCheck] = useState("1");

  // 화면 렌더링 시 가장 처음 발생되는 이벤트
  useEffect(() => {
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
          setBannerDetail(res.data);
          setUseFlagCheck(res.data.useFlag.toString());
          setChangeImg(res.data.imgid);
          getDataFinish.current = true;
        } else if (res.data === "fail") {
          console.log("기존에 입력된 데이터가 없습니다.");
        }
      })
      .catch((res) => console.log(res));
  }, [clickedContid]);

  function onChange(e) {
    setBannerDetail({ ...bannerDetail, [e.target.id]: e.target.value });
  }
  function onChangeUseFlag(e) {
    setUseFlagCheck(e.target.value);
  }

  function HandleSubmit(e) {
    e.preventDefault();
    const ifImg = changeImg[0] ? changeImg[0].iid : changeImg;
    // 입력되지 않은 값이 있다면 전송되지 않도록 설정
    if (ifImg && bannerDetail.contentDetail && bannerDetail.contentString) {
      servicesPostData(
        urlSetContent,
        // clickedContid(수정 버튼이 클릭되면) contid도 함께 전달
        !!clickedContid
          ? {
              contid: clickedContid,
              category: "banner",
              imgid: ifImg,
              contentDetail: bannerDetail.contentDetail,
              contentString: bannerDetail.contentString,
              useFlag: useFlagCheck,
            }
          : {
              category: "banner",
              imgid: ifImg,
              contentDetail: bannerDetail.contentDetail,
              contentString: bannerDetail.contentString,
              useFlag: 1,
            }
      )
        .then((res) => {
          if (res.status === "fail") {
            alert("입력에 실패했습니다.");
          }
          if (res.status === "success") {
            alert("완료되었습니다!");
            // window.location.reload();
            return;
          }
        })
        .catch((error) => console.log("axios 실패", error.response));
    } else {
      alert("입력되지 않은 값이 있습니다.");
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
      {/* <div className="commonBox">
        <div className="infoMessageBox">
          <span className="title">안내 메세지</span>
          <ul>
            <li>[배너추가] 내용을 입력한 후 추가 버튼을 클릭해 주십시오.</li>
            <li>
              [배너수정] 관리 → 수정 버튼클릭 → 수정할 내용을 입력을 한 후 수정
              버튼을 클릭해 주십시오.
            </li>
            <li>배너 이미지의 사이즈는 0000*000으로 지정해 주십시오.</li>
          </ul>
        </div>
      </div> */}
      <div className="commonBox">
        <form className="formLayout" onSubmit={HandleSubmit}>
          <fieldset className="formContentWrapWithRadio">
            <div className="listSearchWrap">
              <div className="blockLabel">배너이름</div>
              <div>
                <input
                  type="text"
                  id="contentString"
                  placeholder="제목을 입력해 주세요."
                  onChange={onChange}
                  value={bannerDetail.contentString || ""}
                />
              </div>
            </div>
            <div className="listSearchWrap">
              <div className="blockLabel">사용여부</div>
              <div className="formContentWrapWithTextValue">
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={useFlagCheck === "0"}
                  name="_useFlag"
                  value="0"
                  id="useFlag0"
                  onChange={onChangeUseFlag}
                />
                <label className="listSearchRadioLabel" htmlFor="useFlag0">
                  OFF
                </label>

                <input
                  className="listSearchRadioInput"
                  type="radio"
                  checked={useFlagCheck === "1"}
                  name="_useFlag"
                  value="1"
                  id="useFlag1"
                  onChange={onChangeUseFlag}
                />
                <label className="listSearchRadioLabel" htmlFor="useFlag1">
                  ON
                </label>
              </div>
            </div>

            <div className="listSearchWrap">
              <div className="blockLabel">배너이미지</div>
              <div className="formContentWrapWithTextValue">
                <SetImage
                  id="titleImg"
                  getData={bannerlist}
                  getDataFinish={getDataFinish.current}
                  setChangeImg={setChangeImg}
                  changeImg={changeImg}
                />
              </div>
            </div>
            <div className="listSearchWrap">
              <div className="blockLabel">랜딩 URL</div>
              <div>
                <input
                  type="text"
                  id="contentDetail"
                  placeholder="연결될 URL을 입력해 주세요."
                  onChange={onChange}
                  value={bannerDetail.contentDetail || ""}
                />
              </div>
            </div>
          </fieldset>

          <div className="listSearchButtonWrap">
            <input
              type="reset"
              value="취소"
              onClick={() => {
                if (!!clickedContid) {
                  setClickedContid("");
                  setChangeImg("");
                  setBannerDetail({
                    contentString: "",
                    contentDetail: "",
                  });
                } else {
                  setBannerDetail({
                    contentString: "",
                    contentDetail: "",
                  });
                  setChangeImg("");
                }
              }}
            />

            {!!clickedContid ? (
              <input type="submit" value="수정" />
            ) : (
              <input type="submit" value="추가" />
            )}
          </div>
        </form>
        {/* 하단 list */}
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
                  <td>{item.useFlag ? "ON" : "OFF"}</td>
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
      </div>
    </>
  );
}
