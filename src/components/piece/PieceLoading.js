import FadeLoader from "react-spinners/FadeLoader";

export default function PieceLoading({ loading, bg, fix }) {
  function getOverrideStyle(fix) {
    let override = {
      position: "fixed",
      zIndex: "1",
      left: "1050px",
      top: "380px",
      display: "block",
    };

    if (fix === "WzSetImgs") {
      override = {
        ...override,
        left: "840px",
        top: "380px",
      };
    }

    if (!fix) {
      override = {
        ...override,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -25%)",
      };
    }

    return override;
  }

  // 사용 예시
  const overrideStyle = getOverrideStyle(fix);

  // console.log(override);

  // const override = fix
  // ? {
  //     position: "fixed",
  //     zIndex: "1",
  //     left: "1050px",
  //     top: "380px",
  //     display: "block",
  //   }
  // : {
  //     position: "absolute",
  //     zIndex: "1",
  //     left: "50%",
  //     top: "50%",
  //     display: "block",
  //     transform: "translate(-50%,-20%)",
  //   };

  return (
    <>
      <FadeLoader
        color="#303f9f"
        loading={loading}
        cssOverride={overrideStyle}
        size={150}
        aria-label="이미지 업로드 중"
        id="loading"
      />

      {!!bg && loading && (
        <div
          style={{
            position: "absolute",
            zIndex: "10",
            width: "100%",
            left: "0",
            top: "0",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        ></div>
      )}
    </>
  );
}
