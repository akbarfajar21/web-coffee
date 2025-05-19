import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../utils/SupaClient";
import CountUp from "react-countup";
import { Users, ShoppingCart } from "lucide-react";

const Statistik = ({ isDarkMode }) => {
  const [penggunaAktif, setPenggunaAktif] = useState(0);
  const [totalProdukTerjual, setTotalProdukTerjual] = useState(0);
  const [dalamTampilan, setDalamTampilan] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ambilStatistik = async () => {
      try {
        const { data: dataPengguna, error: errorPengguna } = await supabase
          .from("profiles")
          .select("role");

        if (errorPengguna) throw new Error(errorPengguna.message);
        setPenggunaAktif(dataPengguna.length);

        const { data: dataHistory, error: errorHistory } = await supabase
          .from("history")
          .select("quantity");

        if (errorHistory) throw new Error(errorHistory.message);

        const totalJumlah = dataHistory.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setTotalProdukTerjual(totalJumlah);
      } catch (error) {
        console.error("Kesalahan saat mengambil statistik:", error);
      }
    };

    ambilStatistik();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setDalamTampilan(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="p-6 transition-all duration-300 flex items-center justify-center text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      <div className="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            icon: <Users size={32} className="text-white dark:text-gray-300" />,
            title: "Pengguna Aktif",
            count: penggunaAktif,
            color: "bg-blue-500 dark:bg-blue-600",
          },
          {
            icon: (
              <ShoppingCart
                size={32}
                className="text-white dark:text-gray-300"
              />
            ),
            title: "Produk Terjual",
            count: totalProdukTerjual,
            color: "bg-green-500 dark:bg-green-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md text-white text-center flex flex-col items-center border border-white/10 dark:border-gray-700 ${stat.color}`}
          >
            {/* Ikon dengan Latar Belakang Lembut */}
            <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg">
              {stat.icon}
            </div>

            {/* Judul */}
            <h3 className="text-sm font-medium mt-3 mb-1">{stat.title}</h3>

            {/* Angka CountUp */}
            {dalamTampilan && (
              <p className="text-3xl font-bold tracking-tight">
                <CountUp
                  start={0}
                  end={stat.count}
                  duration={2}
                  separator=","
                />
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistik;
