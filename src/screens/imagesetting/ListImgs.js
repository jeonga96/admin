// 회원관리 > 통합회원 상세정보
import {
  IoIosExpand,
  IoMdClose,
  IoMdCreate,
  IoMdTrash,
  IoIosCheckmark,
} from "react-icons/io";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as RAN from "../../service/useData/rander";
import * as CUS from "../../service/customHook";

import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";
import ServicesPaginationButton from "../../components/services/ServicesPaginationButton";
import LayoutTopButton from "../../components/layout/LayoutTopButton";

function ImageComponent({ item }) {
  const { register, setValue, getValues } = useForm();
  const [modalView, setModalView] = useState(false);

  // 태그 가져오는 함수
  CUS.useCleanupEffect(() => {
    setValue("_selecttag", item.tag);
  }, []);

  // 태그 수정
  const fnSetting = () => {
    API.servicesPostData(APIURL.urlsetTagImages, {
      itid: item.itid,
      tag: getValues("_selecttag"),
      useFlag: 1,
    })
      .then(() => {
        TOA.servicesUseToast("수정되었습니다.", "s");
        setModalView(false);
      })
      .catch((res) => console.log("error : ", res));
  };

  // 이미지 삭제
  const fnRemove = () => {
    if (window.confirm("이미지를 삭제하시겠습니까?")) {
      // alert("확인 되었습니다.");
      API.servicesPostData(APIURL.urlsetTagImages, {
        itid: item.itid,
        useFlag: 0,
      })
        .then(() => {
          TOA.servicesUseToast("삭제되었습니다.", "s");
          RAN.serviesAfter2secondReload();
        })
        .catch((res) => console.log("error : ", res));
    }
  };

  // 📍 다운로드 버튼을 이용하여 바로 다운로드 하는 방식은 현재 이미지를 가지고 오는 방식 ( AWS )로 인해
  // CORS 오류가 발생하고 있어 CORS 해결 후 문제를 해결 할 수 있습니다.

  // const fnDownload = () => {
  //   const filename = item.tag.replaceAll(",", "_");
  //   fetch(item.storagePath, { method: "GET" })
  //     .then((res) => {
  //       return res.blob(); // raw 데이터를 받아온다
  //     })
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(blob); // 받아온 날 상태의 data를 현재 window에서만 사용하는 url로 바꾼다
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = filename; // 원하는 이름으로 파일명 지정
  //       document.body.appendChild(a);
  //       a.click(); // 자동으로 눌러버리기
  //       setTimeout((_) => {
  //         window.URL.revokeObjectURL(url); // 해당 url을 더 사용 못하게 날려버린다
  //       }, 60000);
  //       a.remove(); // a를 다 사용했으니 지워준다
  //     })
  //     .catch((err) => {
  //       console.error("err: ", err);
  //     });
  // };

  return (
    <div>
      <img key={item.itid} src={item.storagePath} alt={item.remarks} />
      {modalView && (
        <div className="addImgsSelecttagContainer">
          <div>
            <div className="remarksBox" style={{ height: "46.8px" }}>
              <span>태그</span>
              <input
                required
                {...register("_selecttag")}
                style={{ border: "none" }}
              />
            </div>
            {/* {item.remarks && ( */}
            <div className="remarksBox">
              <span>비고</span>
              <span>{item.remarks}</span>
            </div>
            {/* )} */}
            <div className="saveImgsBtnContainer">
              <button type="button" onClick={fnSetting}>
                <IoIosCheckmark />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="addImgsBtnContainer">
        <a target="_blank" rel="noreferrer" href={item.storagePath} download>
          <button type="button">
            <IoIosExpand />
          </button>
        </a>
        {/* <button type="button" onClick={fnDownload}>
          다운로드
        </button> */}
        <button type="button" onClick={() => setModalView((prev) => !prev)}>
          {modalView ? <IoMdClose /> : <IoMdCreate />}
        </button>
        <button type="button" onClick={fnRemove}>
          <IoMdTrash />
        </button>
      </div>
    </div>
  );
}

// ====================================================================================
export default function ListImgs() {
  const { register, getValues, setValue } = useForm();

  const [tableTopScrollBtnData, setTableTopScrollBtnData] = useState([]);
  const [list, setList] = useState([]);
  // pagination 버튼 관련 ------------------------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  function fnSearchEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault(); // 기본 Enter 키 동작을 막습니다.
      fnSearch(); // 인자를 전달하지 않고 fnSearch 함수를 호출합니다.
    }
  }
  useEffect(() => {
    API.servicesPostData(APIURL.urllistTagImages, {
      tag: getValues("_tag"),
      offset: page.getPage,
      size: 30,
    })
      .then((res) => {
        console.log(res);
        if (res.status === "success") {
          setList(res.data);
          setListPage(res.page);
        }
      })
      .catch((res) => console.log("urllistTagImages : ", res));
  }, [page.activePage]);

  useEffect(() => {
    setTableTopScrollBtnData([
      {
        idName: "CompanyDetail",
        text: `총 이미지 : ${listPage.totalElements} 개`,
      },
    ]);
  }, [listPage]);

  const fnReset = () => {
    API.servicesPostData(APIURL.urllistTagImages, {
      tag: "",
      offset: 0,
      size: 30,
    })
      .then((res) => {
        if (res.status === "success") {
          setList(res.data);
          setListPage(res.page);
          setValue("_tag", "");
        }
      })
      .catch((res) => console.log("error : ", res));
  };

  const fnSearch = () => {
    API.servicesPostData(APIURL.urllistTagImages, {
      tag: getValues("_tag"),
      offset: 0,
      size: 30,
    })
      .then((res) => {
        if (res.status === "success") {
          setList(res.data);
          setListPage(res.page);
        } else {
          TOA.servicesUseToast("검색된 이미지가 없습니다.", "e");
        }
      })
      .catch((res) => console.log("error : ", res));
  };

  return (
    <div className="commonBox">
      <form className="formLayout">
        <ul className="tableTopWrap tableTopBorderWrap">
          <ComponentTableTopScrollBtn data={tableTopScrollBtnData} noHover />
          {/* ================= 와짱 관리자 페이지의 이미지 관리에 저장된 이미지를 가져오는 기능으로 이동하는 버튼 ================= */}

          <LayoutTopButton url="add" text="이미지 추가" />
        </ul>

        <div className="formWrap">
          <div className="formContainer">
            <div className="imageSetWrap">
              <div
                className="addImgsSearchWrap"
                style={{ borderBottom: "none" }}
              >
                <div>
                  <input
                    required
                    {...register("_tag")}
                    onKeyDown={fnSearchEnter}
                  />
                  <button type="button" onClick={fnSearch}>
                    검색
                  </button>
                  <button
                    type="button"
                    style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                    onClick={fnReset}
                  >
                    초기화
                  </button>
                </div>
              </div>

              <div className="addImgsViewhWrap">
                {list.map((item) => (
                  <ImageComponent key={item.itid} item={item} />
                ))}
              </div>
            </div>
            <ServicesPaginationButton
              itemCount={30}
              listPage={listPage}
              page={page}
              setPage={setPage}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
