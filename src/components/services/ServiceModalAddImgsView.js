import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as UV from "../../service/useData/uniquValue";
import * as APIURL from "../../service/string/apiUrl";

import * as IMAGE from "../../action/image";

import ServicesPaginationButton from "./ServicesPaginationButton";

export default function ServiceModalAddImgsView({
  setClickModal,
  clickModal,
  currentfiles,
  onImagesSelected,
}) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const { register, getValues, setValue } = useForm();
  const [list, setList] = useState([]);
  const [selectImg, setSelectImg] = useState([]);

  // pagination 버튼 관련 ------------------------------------------------------------------------
  // listPage: 컨텐츠 총 개수 / page:전체 페이지 수 & 현재 페이지
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState({ getPage: 0, activePage: 1 });

  function fnSearchEnter(f) {
    if (f.keyCode == 13) {
      fnSearch(getValues("_tag"), true);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setClickModal(false);
      }
    }

    // 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const fnSearch = (tag, isNewSearch = false) => {
    if (isNewSearch) {
      setPage({ getPage: 0, activePage: 1 });
    }

    API.servicesPostData(APIURL.urllistTagImages, {
      tag: tag,
      offset: page.getPage,
      size: 12,
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

  useEffect(() => {
    if (!!getValues("_tag")) {
      fnSearch(getValues("_tag"));
    }
  }, [page.activePage]);

  const fnSelect = (item) => {
    // 대표 이미지가 설정되어 있는지 확인
    const isTitleImageSet = currentfiles.some((file) => file.isTitleImage);
    // 설정된 경우, 최대 8개의 이미지 선택 가능
    const maxSelectCount = isTitleImageSet ? 8 : 9;

    if (selectImg.length >= maxSelectCount) {
      const message = isTitleImageSet
        ? "대표 이미지가 설정되어 있을 경우, 최대 8개의 이미지만 선택 가능합니다."
        : "대표 이미지가 설정되어 있지 않을 경우, 최대 9개의 이미지를 선택할 수 있습니다.";
      TOA.servicesUseToast(message, "e");
      return;
    }

    // 첫 번째로 선택된 이미지를 대표 이미지로 설정
    const newImage = {
      ...item,
      isTitleImage: selectImg.length === 0, // 첫 선택 시에 대표 이미지로 설정
    };

    setSelectImg([...selectImg, newImage]);
    UV.serviesUniqueItid(newImage, setSelectImg, selectImg);
  };

  const fnRemove = (item) => {
    setSelectImg(selectImg.filter((img) => img.itid !== item.itid));
  };

  const fnSave = () => {
    // 대표 이미지가 설정되어 있는지 확인
    const isTitleImageSet = currentfiles.some((file) => file.isTitleImage);
    // 설정된 경우, 총 8개의 이미지 추가 가능
    const totalAllowedImages = isTitleImageSet ? 8 : 9;

    if (currentfiles.length + selectImg.length > totalAllowedImages) {
      const message = isTitleImageSet
        ? "대표 이미지가 설정되어 있을 경우, 이미지는 최대 8개까지만 추가할 수 있습니다."
        : "대표 이미지가 설정되어 있지 않을 경우, 이미지는 최대 9개까지만 추가할 수 있습니다.";
      TOA.servicesUseToast(message, "e");
      return;
    }
    const newFiles = selectImg.map((item, index) => ({
      iid: item.riid,
      storagePath: item.storagePath,
      isTitleImage: index === 0, // 첫 번째 이미지를 대표 이미지로 설정
    }));
    const titleImage = newFiles.find((file) => file.isTitleImage);
    const otherImages = newFiles.filter((file) => !file.isTitleImage);

    if (!isTitleImageSet) {
      dispatch(IMAGE.serviceImgData(titleImage.iid));
      localStorage.setItem("isTitleImageSet", "true");
    }

    dispatch(
      IMAGE.serviceimgsData([
        ...currentfiles.filter((file) => !file.isTitleImage),
        ...otherImages,
      ])
    );
    onImagesSelected(newFiles);
    setClickModal(false);
    setValue("_tag", "");
    setList([]);
  };

  return (
    clickModal && (
      <>
        <div className="clickModal addImgsView" ref={modalRef}>
          <div className="addImgsSearchWrap">
            <span>- 검색할 사진의 키워드를 입력해 주세요.</span>
            <span>
              - 두 단어 이상을 검색 시 콤마 ( , ) 사용 ( 예 : 사과, 배, 호두 )
            </span>
            <div>
              <input
                required
                {...register("_tag")}
                onKeyDown={(e) => fnSearchEnter(e)}
              />
              <button
                type="button"
                onClick={() => fnSearch(getValues("_tag"), true)}
              >
                검색
              </button>
            </div>
          </div>

          <ul className="addImgsReturnWrap">
            <li>
              <div>
                {list.length > 0 ? (
                  list.map((item) => (
                    <img
                      onClick={() => fnSelect(item)}
                      key={item.itid}
                      src={item.storagePath}
                      alt={item.remarks}
                    />
                  ))
                ) : (
                  <span>검색된 사진이 없습니다.</span>
                )}
              </div>
              {list.length > 0 && (
                <ServicesPaginationButton
                  itemCount={12}
                  listPage={listPage}
                  page={page}
                  setPage={setPage}
                />
              )}
            </li>

            <li>
              <div className="addImgsButtonContainer">
                <button type="button" onClick={() => setSelectImg([])}>
                  모두취소
                </button>
                <button type="button" onClick={fnSave}>
                  선택완료
                </button>
              </div>
              <div className="addImgsPickContainer">
                {selectImg.length > 0 ? (
                  selectImg.map((item) => (
                    <img
                      onClick={() => fnRemove(item)}
                      key={item.itid}
                      src={item.storagePath}
                      alt={item.remarks}
                    />
                  ))
                ) : (
                  <span>선택된 사진이 없습니다.</span>
                )}
              </div>
            </li>
          </ul>
          <button
            type="button"
            className="formContentBtn"
            onClick={() => {
              setValue("_tag", "");
              setClickModal(false);
              setList([]);
            }}
          >
            닫기
          </button>
        </div>
      </>
    )
  );
}
