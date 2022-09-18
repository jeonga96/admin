export default function NavPartList({ item }) {
  return (
    <div className="navPart">
      <div>
        <img src={item.icon} alt={item.name} />
      </div>
      <span>{item.name}</span>
    </div>
  );
}
