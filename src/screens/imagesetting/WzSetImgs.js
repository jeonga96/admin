// 와짱에서 이미지 가져오기
// 현재 해당 주소로 이동하는 버튼을 제거하여 해당 기능 사용하지 않음

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";

import PaginationButton from "../../components/services/ServicesPaginationButton";
import ComponentTableTopScrollBtn from "../../components/piece/PieceTableTopScrollBtn";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import Loading from "../../components/piece/PieceLoading";

function ListChild({ item, setClickedId, reset, all }) {
  const [use, setUser] = useState(false);

  CUS.useCleanupEffect(() => {
    if (reset) {
      setUser(false);
    }
  }, [reset]);

  CUS.useCleanupEffect(() => {
    // console.log(all);
    if (all) {
      fnClicked((prev) => [
        ...prev,
        {
          tags: item.tags,
          storagePath: item.storagePath,
          fileName: item.fileName,
          sid: item.sid,
        },
      ]);
      setUser(true);
    }
  }, [all]);

  const fnClicked = (fn) => {
    setClickedId(fn);
  };

  const fnRemove = (e) => {
    fnClicked((prev) => {
      return !!e.target.parentNode.id
        ? prev.filter((item) => item.sid.toString() !== e.target.parentNode.id)
        : prev.filter((item) => item.sid.toString() !== e.target.id);
    });
  };

  return (
    <div
      id={item.sid}
      className={use ? "useWzLink" : ""}
      onClick={(e) => {
        if (use) {
          fnRemove(e);
        } else {
          fnClicked((prev) => [
            ...prev,
            {
              tags: item.tags,
              storagePath: item.storagePath,
              fileName: item.fileName,
              sid: item.sid,
            },
          ]);
        }
        setUser(!use);
      }}
    >
      <img src={item.storagePath} alt={item.tags} />
      <div id={item.sid}>
        <span>{item.tags}</span>
      </div>
    </div>
  );
}

// 부모 : =========================================================
export default function SetImgs() {
  const { register, getValues, handleSubmit } = useForm();

  // 로딩중 표시
  const [loading, setLoading] = useState(false);
  // 선택 초기화 & 전체 선택 버튼 선택 여부 확인
  const [reset, setReset] = useState(false);
  const [all, setAll] = useState(false);

  // 전달받은 페이지, 데이타 저장
  const [list, setList] = useState([]);
  const [listPage, setListPage] = useState({});

  // 현재 페이지 확인
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  // 상단의 버튼,총 이미지, 선택된 이미지 저장
  const [tableTopScrollBtnData, setTableTopScrollBtnData] = useState([]);
  const [clickedId, setClickedId] = useState([]);

  // 검색 동작 함수
  const onSearch = (tag) => {
    if (!!getValues("_tag")) {
      setLoading(true);

      API.servicesNotokenPostData(
        APIURL.urlWazzanggetImages,
        // { offset: 1, size: 28, searchKeyword: "인테리어" }
        {
          offset: page.getPage,
          size: 28,
          searchKeyword: tag,
        }
      )
        .then((res) => {
          console.log(res);
          setList(res.data);
          setListPage(res.page);

          // 로딩, 선택 초기화, 전체선택 초기화
          setLoading(false);
          setReset(false);
          setAll(false);
        })
        .catch((res) => console.log(res));
    } else {
      TOA.servicesUseToast("검색어를 입력해 주세요.", "e");
    }
  };

  // 태그 입력 후 페이지 이동 시 동작 이벤트
  useEffect(() => {
    if (!!getValues("_tag")) {
      onSearch(getValues("_tag"));
    }
  }, [page]);

  // 총 이미지, 선택된 이미지 개수 표시
  useEffect(() => {
    if (!!list) {
      setTableTopScrollBtnData([
        {
          idName: "CompanyDetail_4",
          text: `총 이미지 : ${
            listPage.totalElements ? listPage.totalElements : 0
          } 개`,
        },
        {
          idName: "CompanyDetail_1",
          text: `선택된 이미지 : ${clickedId.length} 개`,
        },
      ]);
    }
  }, [list, clickedId]);

  // 초기화 이벤트
  const fnReset = () => {
    setReset(true);
    setClickedId([]);
  };

  // 전체 선택 이벤트
  const fnAll = () => {
    setAll(true);
  };

  // 검색 이벤트
  const fnSearch = () => {
    onSearch(getValues("_tag"));
  };

  // url을 이미지 코드로 변경하는 함수
  async function urlToBlob(imageUrl) {
    const IMAGEFILENAME = imageUrl.storagePath.split(".");

    try {
      const response = await axios(imageUrl.storagePath, {
        method: "get",
        responseType: "blob",
        mode: "cors",
        headers: {
          "Content-type": `image/${IMAGEFILENAME[IMAGEFILENAME.length - 1]}`,
          "Cache-Control": "no-cache",
        },
      });

      const contentType = response.headers["content-type"];
      return new Blob([response.data], { type: contentType });
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  }

  // 저장 이벤트
  const fnGongsacokSubmit = async () => {
    setLoading(true);
    for (let i = 0; clickedId.length > i; i++) {
      if (clickedId[i].size > 20000000) {
        setLoading(false);
        return alert("20MB 용량 미만의 이미지만 등록 가능합니다.");
      }
      const formData = new FormData();
      const blob = await urlToBlob(clickedId[i]);

      const FILENAME = clickedId[i].fileName.split(".")[0];
      const TYPE = clickedId[i].storagePath.split(".").pop();

      formData.append(
        "Imgs",
        new Blob([blob], { type: `image/${TYPE}` }),
        FILENAME
      );
      formData.append(
        "dto",
        new Blob(
          [
            JSON.stringify({
              tag: clickedId[i].tags,
              remarks: clickedId[i].tags,
            }),
          ],
          { type: "application/json" }
        )
      );

      try {
        await API.servicesPostDataForm(APIURL.urlupTagImages, formData);
      } catch (error) {
        console.log("servicesPostDataForm error : ", error);
        TOA.servicesUseToast("저장되지 않았습니다.", "e");
        return;
      }
    } // for
    TOA.servicesUseToast("완료되었습니다.", "s");
    setLoading(false);
    fnReset();
  };

  return (
    <div className="formWrap">
      <ul className="tableTopWrap tableTopBorderWrap">
        <ComponentTableTopScrollBtn data={tableTopScrollBtnData} noHover />
        <LayoutTopButton url="/setimgs" text="목록으로 가기" />
        <LayoutTopButton fn={fnAll} text="전체 선택" />
        <LayoutTopButton fn={fnReset} text="선택 초기화" />
        <LayoutTopButton fn={fnGongsacokSubmit} text="공사콕에 저장" />
      </ul>
      <div className="formContainer">
        <div className="imageSetWrap">
          <div className="addImgsSearchWrap" style={{ borderBottom: "none" }}>
            <form style={{ width: "450px" }} onSubmit={handleSubmit(fnSearch)}>
              <input required {...register("_tag")} />
              <button type="button" onClick={fnSearch} style={{ width: "23%" }}>
                검색
              </button>
            </form>
          </div>
          <div className="imageSetNotice">
            <span>
              - 해당 페이지에서는 와짱 서버에 저장된 이미지를 불러올 수
              있습니다.
            </span>
            <span>- 키워드 검색 후 이미지를 선택하여 저장할 수 있습니다.</span>
            <span>
              - 페이지 이동, 새로운 키워드 검색 시에도 선택된 이미지는 저장되어
              있습니다.
            </span>
          </div>
        </div>
        <Loading loading={loading} fix="WzSetImgs" bg />
        <div className="imageWzSetListWrap">
          {list.length > 0 ? (
            list.map((item) => (
              <ListChild
                key={item.sid}
                item={item}
                setClickedId={setClickedId}
                reset={reset}
                all={all}
              />
            ))
          ) : (
            <span className="imageSetNokeyword">입력된 키워드가 없습니다.</span>
          )}
        </div>
        <PaginationButton
          itemCount={28}
          listPage={listPage}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
