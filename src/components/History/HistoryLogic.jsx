import { useEffect, useState } from "react";
import { supabase } from "../../utils/SupaClient";

export default function HistoryLogic({ setHistory, setShowNotification }) {
  const [history, setLocalHistory] = useState([]);

  // Fetch history awal
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

      if (error) console.error(error);
      else setLocalHistory(data);
    };

    fetchHistory();
  }, []);

  // Update realtime jika ada perubahan status
  useEffect(() => {
    const channel = supabase
      .channel("history-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "history",
        },
        (payload) => {
          const updatedItem = payload.new;

          // Update item di local state
          setLocalHistory((prevHistory) =>
            prevHistory.map((item) =>
              item.id === updatedItem.id ? { ...item, ...updatedItem } : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Show notification (sekali per transaksi Approved)
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

    setHistory(history); // Kirim data terbaru ke parent
  }, [history, setHistory, setShowNotification]);

  return null;
}
