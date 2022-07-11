export default function TabelTr({ item }) {
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.title}</td>
      <td>{item.name}</td>
      <td>{item.addFile}</td>
      <td>{item.date}</td>
    </tr>
  );
}
