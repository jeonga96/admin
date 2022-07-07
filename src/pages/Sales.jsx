import AccountInfo from "../components/sale/AccountInfo";
import DailySales from "../components/sale/DailySales";
import DownloadReport from "../components/sale/DownloadReport";
import Kalender from "../components/sale/Kalender";
import MarketValus from "../components/sale/MarketValus";
import MonthlyInvoices from "../components/sale/MonthlyInvoices";
import NewsAndUpdate from "../components/sale/NewsAndUpdate";
import PopularProducts from "../components/sale/PopularProducts";
import Revenue from "../components/sale/Revenue";
import Summary from "../components/sale/Summary";
import TopGlobalSales from "../components/sale/TopGlobalSales";
import TopSellingProduct from "../components/sale/TopSellingProduct";
import TotalOrder from "../components/sale/TotalOrder";
import TotalSalesUnit from "../components/sale/TotalSalesUnit";
import Transaction from "../components/sale/Transaction";

function Sale() {
  return (
    <div className="mainWrap" id="sale">
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
    </div>
  );
}

export default Sale;
