import { useSelector, shallowEqual, useDispatch } from "react-redux";

export default function ServiceModalCompanyAdd({ fn, userList }) {
  const dispatch = useDispatch();
  const clickModal = useSelector((state) => state.click, shallowEqual);

  return (
    clickModal && (
      <>
        <div className="clickModal">
          <section className="tableWrap">
            <h3 className="blind">회원관리 리스트</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>관리번호</th>
                  <th style={{ width: "100px" }}>아이디</th>
                  <th style={{ width: "100px" }}>이름</th>
                  <th style={{ width: "100px" }}>핸드폰번호</th>
                  <th style={{ width: "auto" }}>계약일</th>
                </tr>
              </thead>

              <tbody>
                {userList &&
                  userList.map((item) => (
                    <tr key={item.uid} onClick={() => fn(item)}>
                      <td style={{ width: "100px" }}>{item.uid}</td>
                      <td style={{ width: "100px" }}>{item.userid}</td>
                      <td style={{ width: "100px" }}>{item.name}</td>
                      <td style={{ width: "100px" }}>{item.mobile}</td>
                      <td style={{ width: "auto" }}>
                        {item.createTime && item.createTime.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "serviceClick",
                payload: !clickModal,
              })
            }
            className="formContentBtn"
          >
            검색
          </button>
        </div>
      </>
    )
  );
}
