import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../utils/SupaClient";
import CountUp from "react-countup";
import { Users, ShoppingCart } from "lucide-react";

const Statistik = ({ isDarkMode }) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalSoldProducts, setTotalSoldProducts] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("role");

        if (usersError) throw new Error(usersError.message);
        setActiveUsers(usersData.length);

        const { data: historyData, error: historyError } = await supabase
          .from("history")
          .select("quantity");

        if (historyError) throw new Error(historyError.message);

        const totalQuantity = historyData.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setTotalSoldProducts(totalQuantity);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
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
      className={`p-8 dark:bg-gray-700 shadow-xl transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-lg dark:bg-gray-800 dark:text-white shadow-md text-center flex flex-col items-center transition-all duration-300 ${
            isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <Users size={40} className="mb-3 text-blue-500" />
          <h3 className="text-lg font-semibold mb-3">Pengguna Aktif</h3>
          {inView && (
            <p className="text-4xl font-bold">
              <CountUp
                start={0}
                end={activeUsers}
                duration={2.5}
                separator=","
              />
            </p>
          )}
        </div>

        <div
          className={`p-6 rounded-lg shadow-md text-center dark:bg-gray-800 dark:text-white flex flex-col items-center transition-all duration-300 ${
            isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
          }`}
        >
          <ShoppingCart size={40} className="mb-3 text-green-500" />
          <h3 className="text-lg font-semibold mb-3">Produk Terjual</h3>
          {inView && (
            <p className="text-4xl font-bold">
              <CountUp
                start={0}
                end={totalSoldProducts}
                duration={2.5}
                separator=","
              />
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Statistik;
