export function CustomerTypeview({ list }) {
  return (
    <div
      className={
        list
          ? "customerTypeListManual CompanyManual"
          : "customerTypeSetManual CompanyManual"
      }
    >
      <ul>
        <li>
          <span>무료고객 관리</span>
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#888" }}>
            무료
          </i>
          : 무료등록 고객
        </li>

        <li>
          <span>와짱고객 관리</span>
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#379777" }}>
            와해
          </i>
          : 와짱해지
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#379777" }}>
            와유
          </i>
          : 와짱유료고객
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#379777" }}>
            와가
          </i>
          : 와짱가제작고객
        </li>

        <li>
          <span>공사콕고객 관리</span>
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#FF6969" }}>
            콕해
          </i>
          : 공사콕 해지 고객
        </li>
        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#FF6969" }}>
            노출
          </i>
          : 노출키워드 ₩ 9, 900 유료 가맹점
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#FF6969" }}>
            판매
          </i>
          : 판매키워드 7개 유료 가맹점
        </li>

        <li>
          -
          <i className="tableIcon" style={{ backgroundColor: "#FF6969" }}>
            배너
          </i>
          : 스폰서 배너 유료 가맹점
        </li>
      </ul>
    </div>
  );
}

export function ListCustomerType({ value }) {
  const customerTypes = {
    무료: { bgColor: "#888", label: "무료" },
    와해: { bgColor: "#379777", label: "와해" },
    와유: { bgColor: "#379777", label: "와유" },
    와가: { bgColor: "#379777", label: "와가" },
    콕해: { bgColor: "#FF6969", label: "콕해" },
    노출: { bgColor: "#FF6969", label: "노출" },
    판매: { bgColor: "#FF6969", label: "판매" },
    배너: { bgColor: "#FF6969", label: "배너" },
  };

  const customerType = customerTypes[value];

  if (!customerType) return null;

  return (
    <>
      <i
        className="tableIcon"
        style={{
          backgroundColor: customerType.bgColor,
          position: "absolute",
          fontWeight: "500",
          left: "8px",
        }}
      >
        {customerType.label}
      </i>
    </>
  );
}
