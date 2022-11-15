import { Link } from "react-router-dom";
import { MdOutlineImage } from "react-icons/md";

export default function ComponentListNotice({ notice, ISADMIN }) {
  return (
    <>
      <table className="commonTable">
        <thead>
          <tr>
            <th style={{ width: "100px" }}>번호</th>
            <th style={{ width: "auto" }}>내용</th>
            <th style={{ width: "150px" }}>날짜</th>
          </tr>
        </thead>
        <tbody className="commonTable">
          {notice &&
            notice.map((item) =>
              ISADMIN ? (
                <tr key={item.contid} style={{ height: "5.25rem" }}>
                  <td>{item.contid}</td>
                  <td className="tableContentWrap">
                    <Link to={`/notice/${item.contid}`} className="Link">
                      <em>{item.contentString}</em>
                      <i>{item.imgString ? <MdOutlineImage /> : null}</i>
                      {/* <i>
                        {item.category === "notice" ? (
                          <span>전체 공지</span>
                        ) : (
                          <span>사업자 공지</span>
                        )}
                      </i> */}
                      <p>
                        {item.contentDetail.length > 55
                          ? item.contentDetail.slice(0, 54) + "..."
                          : item.contentDetail}
                      </p>
                    </Link>
                  </td>
                  <td>{item.createTime.slice(0, 10)}</td>
                </tr>
              ) : (
                <tr key={item.comnid} style={{ height: "5.25rem" }}>
                  <td>{item.comnid}</td>
                  <td className="tableContentWrap">
                    <Link
                      to={`/company/${item.rcid}/notice/${item.comnid}`}
                      className="Link"
                    >
                      <em>{item.title}</em>
                      <i>{item.imgs ? <MdOutlineImage /> : null}</i>
                      <p>
                        {item.content.length > 55
                          ? item.content.slice(0, 54) + "..."
                          : item.content}
                      </p>
                    </Link>
                  </td>
                  <td>{item.createTime.slice(0, 10)}</td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </>
  );
}
