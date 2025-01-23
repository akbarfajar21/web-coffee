import { useEffect, useState } from "react";
import { supabase } from "../../utils/SupaClient";

export default function HistoryLogic({ setHistory, setShowNotification }) {
  const [localHistory, setLocalHistory] = useState([]);

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("history")
        .select(
          "id, quantity, status, created_at, order_id, harga_saat_transaksi, coffee(nama_produk, foto_barang, harga_produk)"
        )
        .eq("profile_id", user.user.id);

      if (error) {
        console.error(error);
      } else {
        // Sort history by date (ascending)
        const sortedData = data.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setLocalHistory(sortedData);
      }
    };

    fetchHistory();
  }, []);

  // Show notification
  useEffect(() => {
    const notifiedItems =
      JSON.parse(localStorage.getItem("notifiedItems")) || [];

    localHistory.forEach((item) => {
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

    // Update parent state with sorted history
    setHistory(localHistory);
  }, [localHistory, setHistory, setShowNotification]);

  return null; // This component does not render anything itself
}
