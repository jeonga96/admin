import { useState } from "react";
import { servicesPostData } from "../../Services/importData";
import { urlSetUserRole } from "../../Services/string";

export default function SelectUserRole({ uid }) {
  const [selected, setSelected] = useState("");
  function onChange(e) {
    setSelected(e.target.value);
  }
  function onSubmitUserRole(e) {
    e.preventDefault();
    console.log(uid, selected);
    servicesPostData(urlSetUserRole, {
      uid: uid,
      userrole: selected,
    });
  }

  return (
    <form onSubmit={onSubmitUserRole} className="selectForm">
      <select id="userRoleSelect" onChange={onChange} value={selected}>
        <option value="ROLE_USER">일반 유저</option>
        <option value="ROLE_USER,ROLE_ADMIN">관리자 유저</option>
      </select>
      <button className="smallButton">변경</button>
    </form>
  );
}
