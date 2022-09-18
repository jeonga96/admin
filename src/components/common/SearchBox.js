export default function SearchBox() {
  return (
    <div className="headerSearch">
      <form>
        <button type="submit">
          <i>{/* <BsSearch /> */}</i>
        </button>
        <input
          type="text"
          id="searchValue"
          name="search_Value"
          placeholder="Search here..."
        />
        <label className="blind" htmlFor="searchValue">
          검색할 내용을 입력해 주세요.
        </label>
      </form>
    </div>
  );
}
