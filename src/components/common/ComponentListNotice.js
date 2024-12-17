import { Link } from "react-router-dom";
import { MdOutlineImage } from "react-icons/md";

export default function ComponentListNotice({ notice, ISADMIN }) {
  return (
    <>
      {notice && notice.length > 0 ? (
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
              notice.map((item, key) =>
                ISADMIN ? (
                  <tr
                    key={item.contid}
                    style={{ height: "3.25rem" }}
                    className={item.useFlag == 0 ? "flageN" : null}
                  >
                    <td>{notice?.length - key}</td>
                    <td className="tableContentWrap">
                      <Link
                        to={`/notice/${item.contid}`}
                        className="Link NoticeLink"
                      >
                        <em>{item.contentString}</em>
                        <i>{item.imgString ? <MdOutlineImage /> : null}</i>
                      </Link>
                    </td>
                    <td>{item.createTime.slice(0, 10)}</td>
                  </tr>
                ) : (
                  <tr key={item.comnid} style={{ height: "3.25rem" }}>
                    <td>{notice?.length - key}</td>
                    <td className="tableContentWrap">
                      <Link
                        to={`/company/${item.rcid}/notice/${item.comnid}`}
                        className="Link"
                      >
                        <em>{item.title}</em>
                        <i>{item.imgs ? <MdOutlineImage /> : null}</i>
                      </Link>
                    </td>
                    <td>{item.createTime.slice(0, 10)}</td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      ) : (
        <div className="nullBox">데이터가 없습니다.</div>
      )}
    </>
  );
}
