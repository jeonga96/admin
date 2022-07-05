import styled from "styled-components";

import AccountInfo from "./sale/AccountInfo";
import DailySales from "./sale/DailySales";
import DownloadReport from "./sale/DownloadReport";
import Kalender from "./sale/Kalender";
import MarketValus from "./sale/MarketValus";
import MonthlyInvoices from "./sale/MonthlyInvoices";
import NewsAndUpdate from "./sale/NewsAndUpdate";
import PopularProducts from "./sale/PopularProducts";
import Revenue from "./sale/Revenue";
import Summary from "./sale/Summary";
import TopGlobalSales from "./sale/TopGlobalSales";
import TopSellingProduct from "./sale/TopSellingProduct";
import TotalOrder from "./sale/TotalOrder";
import TotalSalesUnit from "./sale/TotalSalesUnit";
import Transaction from "./sale/Transaction";

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

function ContainerContentArea() {
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

export default ContainerContentArea;
