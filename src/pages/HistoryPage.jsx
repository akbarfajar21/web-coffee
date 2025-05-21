import React, { useState } from "react";
import Header from "../components/Header";
import HistoryLogic from "../components/History/HistoryLogic";
import HistoryUI from "../components/History/HistoryUI";
import { Helmet } from "react-helmet";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // state loading

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>CoffeeShopMe | History</title>
      </Helmet>
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <HistoryLogic
          setHistory={setHistory}
          setShowNotification={setShowNotification}
          setIsLoading={setIsLoading} // pass setIsLoading ke Logic
        />
        <HistoryUI
          history={history}
          showNotification={showNotification}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading} // pass isLoading ke UI
        />
      </main>
    </div>
  );
}
