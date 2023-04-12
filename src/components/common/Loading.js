// import { CSSProperties } from "react";
import FadeLoader from "react-spinners/FadeLoader";

export default function Loading({ loading }) {
  const override = {
    position: "absolute",
    zIndex: "1",
    left: "50%",
    top: "50%",
    display: "block",
    transform: "translate(-50%,-20%)",
  };

  return (
    <FadeLoader
      color="#303f9f"
      // loading="true"
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="이미지 업로드 중"
      id="loading"
    />
  );
}
