import { NavLink } from "react-router-dom";

function NavBox() {
  const style = {
    fontWeight: "900",
    fonsize: "30px",
    color: "red",
  };
  return (
    <>
      <div className="NavHederInner">
        <h1>Salessa</h1>
        <button type="button">닫기</button>
      </div>
      <div className="NavContentInner">
        <ul>
          <li>
            <NavLink to="/" activeStyle={style}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/uikits" activeStyle={style}>
              uikits
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
export default NavBox;
