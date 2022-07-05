import styled from "styled-components";
import { BsSearch } from "react-icons/bs";

const WrapDiv = styled.div`
  float: left;
  width: 310px;
  height: 100%;
  ${({ theme }) => theme.media.tab} {
    width: 200px;
  }
  ${({ theme }) => theme.media.mob} {
    ${({ theme }) => theme.styles.blind}
  }
  form {
    width: 100%;
    height: 100%;
    border-radius: 50px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-sizing: border-box;
  }
  button {
    width: 14px;
    height: 100%;
    padding: 1px 23px 1px 20px;
  }
  i {
    color: ${({ theme }) => theme.colors.pointGray};
  }
  input {
    width: 250px;
    height: 100%;
    border: none;
    background-color: transparent;
    ${({ theme }) => theme.media.tab} {
      width: 132px;
    }
    &:focus {
      outline: none;
    }
  }
  label {
    ${({ theme }) => theme.styles.blind}
  }
`;
function HaderSerch() {
  return (
    <WrapDiv>
      <form>
        <button type="submit">
          <i>
            <BsSearch />
          </i>
        </button>
        <input
          type="text"
          id="searchValue"
          name="search_Value"
          placeholder="Search here..."
        />
        <label htmlFor="searchValue">검색할 내용을 입력해 주세요.</label>
      </form>
    </WrapDiv>
  );
}
export default HaderSerch;
