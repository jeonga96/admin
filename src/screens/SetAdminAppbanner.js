import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  urlContentList,
  urlSetContent,
  urlGetImages,
} from "../Services/string";
import { servicesPostData } from "../Services/importData";
import { useDidMountEffect } from "../Services/customHook";
import { serviesGetImgId, servicesUseToast } from "../Services/useData";

import LayoutTopButton from "../components/common/LayoutTopButton";
import SetImage from "../components/common/ServicesImageSetUrl";

function InputBox({ inputData, setinputData, item }) {
  const [img, setImg] = useState(null);

  const fnsetinputData = (prev) => {
    setinputData(prev);
  };

  const valueChange = (e, res) => {
    fnsetinputData({
      ...inputData,
      [item.contid]: {
        ...item,
        contid: item.contid,
        contentString: item.contentString,
        category: item.category,
        contentDetail: e.target.value,
      },
    });
  };

  const imgChange = (e, res) => {
    fnsetinputData({
      ...inputData,
      [item.contid]: {
        ...item,
        contid: item.contid,
        contentString: item.contentString,
        category: item.category,
        imgid: res[0].iid,
      },
    });
  };

  return (
    <>
      <h3>{item.contentString}</h3>
      <fieldset>
        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>배너이미지</span>
          </div>
          <div style={{ height: "32px" }}>
            <SetImage
              id={`titleImg${item.contid}`}
              setChangeImg={setImg}
              changeImg={img}
              valueChange={imgChange}
            />
          </div>
        </div>
        <div className="listSearchWrap" style={{ width: "100%" }}>
          <div className="blockLabel">
            <span>랜딩 URL</span>
          </div>
          <div style={{ height: "32px" }}>
            <input
              type="text"
              id="contentDetail"
              placeholder="연결될 URL을 입력해 주세요."
              onChange={valueChange}
              defaultValue={item.contentDetail}
            />
          </div>
        </div>
      </fieldset>
    </>
  );
}

export default function SetAdminAppbanner() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  // 데이터 ------------------------------------------------------------------------
  // bannerList:배너 목록
  const [bannerList, setBannerList] = useState([]);
  // inputData:수정된 내용 저장
  const [inputData, setinputData] = useState({});

  // 이미지 ------------------------------------------------------------------------
  // img:이미지 저장 / imgsIid:서버에 이미지를 보낼 때는, iid값만 필요 / changeImg: 이미지 수정 시 수정된 이미지 저장
  const [img, setImg] = useState(null);
  const imgsIid = [];

  console.log(bannerList);

  // 화면 렌더링 시 가장 처음 발생되는 이벤트
  useLayoutEffect(() => {
    servicesPostData(urlContentList, {
      category: "bannerB2C",
    })
      .then((res) => {
        if (res.status === "success") {
          setBannerList(res.data);
          servicesPostData(urlContentList, {
            category: "bannerB2B",
          }).then((deepRes) => {
            if (deepRes.status === "success") {
              setBannerList([...res.data, ...deepRes.data]);
            }
          });
        }
      })

      .catch((res) => console.log(res));
  }, []);

  // bannerlist의 데이터를 받아오면 기존 배너의 이미지 데이터를 받아온다.
  useDidMountEffect(() => {
    // serviesGetImgId(imgsIid, bannerB2B);
    serviesGetImgId(imgsIid, bannerList);
    servicesPostData(urlGetImages, {
      imgs: imgsIid.toString(),
    }).then((res) => {
      setImg(res.data);
    });
  }, [bannerList]);

  const fnSubmit = () => {
    if (inputData[Object.keys(inputData)] !== {}) {
      for (let i = 0; i < Object.keys(inputData).length; i++) {
        servicesPostData(urlSetContent, {
          contid: inputData[Object.keys(inputData)[i]].contid,
          category: inputData[Object.keys(inputData)[i]].category,
          imgid: inputData[Object.keys(inputData)[i]].imgid,
          contentDetail: inputData[Object.keys(inputData)[i]].contentDetail,
          contentString: inputData[Object.keys(inputData)[i]].contentString,
          useFlag: 1,
        })
          .then((res) => {
            if (res.status === "fail") {
              servicesUseToast("입력에 실패했습니다.", "e");
            }
            if (i === Object.keys(inputData).length - 1) {
              if (res.status === "success") {
                servicesUseToast("완료되었습니다!", "s");
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
                return;
              }
            }
          })
          .catch((error) => console.log("axios 실패", error.response));
      }
    }
  };

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
      <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
        <ul className="tableTopWrap">
          <LayoutTopButton text="완료" disabled={isSubmitting} />
        </ul>

        {/* 하단 list ---------------------------------------- */}
        <div className="commonBox">
          <table className="commonTable">
            <tbody className="commonTable">
              {bannerList &&
                bannerList.map((item) => (
                  <tr key={item.contid} style={{ height: "5.25rem" }}>
                    <td
                      style={{
                        width: "500px",
                        height: "197px",
                      }}
                    >
                      <div
                        style={
                          img && {
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url('${filterImgIid(
                              img,
                              item
                            )}')`,
                            margin: "0 auto",
                          }
                        }
                      ></div>
                    </td>
                    <td>
                      <InputBox
                        item={item}
                        inputData={inputData}
                        setinputData={setinputData}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </form>
    </>
  );
}
