export default function PieceLoadingDetail({ allFileCount, loading }) {
  const numberLen = () => {
    return Math.round((loading.length / allFileCount) * 100) || 0;
  };

  return (
    loading.length > 0 &&
    numberLen() < 100 && (
      <>
        <div className="loadingDetailWrap">
          <span>{`${numberLen()} %`}</span>
          <div className="loadingDetailStick">
            {/* 로딩중 */}
            <div
              style={{
                width: numberLen() + "%",
              }}
            ></div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            zIndex: "1",
            width: "100%",
            left: "0",
            top: "0",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        ></div>
      </>
    )
  );
}
