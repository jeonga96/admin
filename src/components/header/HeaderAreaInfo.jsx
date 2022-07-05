import styled from "styled-components";
import { BsBell } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";

const WrapDiv = styled.div`
  display: flex;
  justify-content: space-between;
  float: right;
  width: 195px;
  height: 100%;
  span {
    ${({ theme }) => theme.styles.blind}
  }
  button {
    width: 100%;
    height: 100%;
  }
`;
const WrapNotice = styled.ul`
  display: flex;
  justify-content: center;
  width: 145px;
  li {
    width: 20px;
    height: 100%;
    &:first-child {
      margin-right: 20px;
    }
  }
  i {
    width: 100%;
    height: 100%;
    font-size: 17px;
    color: ${({ theme }) => theme.colors.pointGray};
  }
`;

const User = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.primary};
  i {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.white};
  }
`;
function HeaderAreaInfo() {
  return (
    <WrapDiv>
      <WrapNotice>
        <li>
          <button>
            <span>알림</span>
            <i>
              <BsBell />
            </i>
          </button>
        </li>
        <li>
          <button>
            <span>메세지</span>
            <i>
              <IoMailOutline />
            </i>
          </button>
        </li>
      </WrapNotice>
      <User>
        <button>
          <span>사용자 환경설정</span>
          <i>
            <BiUser />
          </i>
        </button>
      </User>
    </WrapDiv>
  );
}
export default HeaderAreaInfo;
