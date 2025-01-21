// src/components/HistoryLogic.js

import { useEffect, useState } from "react";
import { supabase } from "../../utils/SupaClient";

export default function HistoryLogic({ setHistory, setShowNotification }) {
  const [history, setLocalHistory] = useState([]);

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("history")
        .select(
          "id, quantity, status, created_at,order_id, harga_saat_transaksi, coffee(nama_produk, foto_barang, harga_produk)"
        )
        .eq("profile_id", user.user.id);

      if (error) console.error(error);
      else setLocalHistory(data);
    };

    fetchHistory();
  }, []);

  // Show notification
  useEffect(() => {
    const notifiedItems =
      JSON.parse(localStorage.getItem("notifiedItems")) || [];

    history.forEach((item) => {
      if (item.status === "Approved" && !notifiedItems.includes(item.id)) {
        setShowNotification(true);

        const updatedNotifiedItems = [...notifiedItems, item.id];
        localStorage.setItem(
          "notifiedItems",
          JSON.stringify(updatedNotifiedItems)
        );

        setTimeout(() => setShowNotification(false), 4000);
      }
    });

    setHistory(history); // Send history data to parent
  }, [history, setHistory, setShowNotification]);

  return null; // This component does not render anything itself
}
