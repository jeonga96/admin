import styled from "styled-components";

import AccountInfo from "../components/contents/sale/AccountInfo";
import DailySales from "../components/contents/sale/DailySales";
import DownloadReport from "../components/contents/sale/DownloadReport";
import Kalender from "../components/contents/sale/Kalender";
import MarketValus from "../components/contents/sale/MarketValus";
import MonthlyInvoices from "../components/contents/sale/MonthlyInvoices";
import NewsAndUpdate from "../components/contents/sale/NewsAndUpdate";
import PopularProducts from "../components/contents/sale/PopularProducts";
import Revenue from "../components/contents/sale/Revenue";
import Summary from "../components/contents/sale/Summary";
import TopGlobalSales from "../components/contents/sale/TopGlobalSales";
import TopSellingProduct from "../components/contents/sale/TopSellingProduct";
import TotalOrder from "../components/contents/sale/TotalOrder";
import TotalSalesUnit from "../components/contents/sale/TotalSalesUnit";
import Transaction from "../components/contents/sale/Transaction";

const WrapMain = styled.main`
  width: 100%;
  height: auto;
  section {
    padding: 14px;
    box-sizing: border-box;
    div {
      width: 100%;
      height: 100%;
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: 5px;
      box-sizing: border-box;
    }
  }
  ${({ theme }) => theme.media.pc} {
    display: flex;
    flex-wrap: wrap;
    & > div {
      width: 66.6666%;
      height: auto;
    }
  } //widePc

  ${({ theme }) => theme.media.minPc} {
  }
`;

function Sale() {
  return (
    <WrapMain>
      <div>
        <Revenue />
        <DownloadReport />
      </div>
      <TotalSalesUnit />
      <DailySales />
      <Summary />
      <TotalOrder />
      <Transaction />
      <NewsAndUpdate />
      <AccountInfo />
      <Kalender />
      <TopGlobalSales />
      <MonthlyInvoices />
      <TopSellingProduct />
      <PopularProducts />
      <MarketValus />
    </WrapMain>
  );
}

export default Sale;
