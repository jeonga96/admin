import { useDispatch, useSelector } from "react-redux";

export default function Popup({ text }) {
  const popup = useSelector((props) => props.popupState);
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(!popup);
  };
  return (
    <div className={popup ? "popupWrap" : "popupWrap popupWrapNone"}>
      <div>
        <h3>경고!</h3>
        <span>{text}</span>
      </div>
      <button onClick={onClick}>닫기</button>
    </div>
  );
}
