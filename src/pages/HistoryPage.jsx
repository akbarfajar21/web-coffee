import React, { useState } from "react";
import Header from "../components/Header";
import HistoryLogic from "../components/History/HistoryLogic";
import HistoryUI from "../components/History/HistoryUI";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <HistoryLogic
          setHistory={setHistory}
          setShowNotification={setShowNotification}
        />
        <HistoryUI
          history={history}
          showNotification={showNotification}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>
    </div>
  );
}
