import { useEffect, useState } from "react";
import { supabase } from "../../utils/SupaClient";

export default function HistoryLogic({ setHistory, setIsLoading }) {
  const [history, setLocalHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("history")
        .select(
          "id, quantity, status, created_at, order_id, harga_saat_transaksi, coffee(nama_produk, foto_barang, harga_produk)"
        )
        .eq("profile_id", user.user.id);

      if (error) console.error(error);
      else setLocalHistory(data);

      setIsLoading(false);
    };

    fetchHistory();
  }, [setIsLoading]);

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

  useEffect(() => {
    const notifiedItems =
      JSON.parse(localStorage.getItem("notifiedItems")) || [];

    const newApprovedItems = history.filter(
      (item) => item.status === "Approved" && !notifiedItems.includes(item.id)
    );

    if (newApprovedItems.length > 0) {
      newApprovedItems.forEach((item) => {
        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `Pesanan ${item.order_id} disetujui!`,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
          });
        });
      });

      const updatedNotifiedItems = [
        ...new Set([...notifiedItems, ...newApprovedItems.map((i) => i.id)]),
      ];
      localStorage.setItem(
        "notifiedItems",
        JSON.stringify(updatedNotifiedItems)
      );
    }

    setHistory(history);
  }, [history, setHistory]);

  return null;
}
