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
      className={`p-10 transition-all duration-300 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "dark:bg-gray-800 text-gray-900"
      }`}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: <Users size={40} className="mb-3" />,
            title: "Pengguna Aktif",
            count: activeUsers,
            color: "from-blue-400 to-blue-600",
          },
          {
            icon: <ShoppingCart size={40} className="mb-3" />,
            title: "Produk Terjual",
            count: totalSoldProducts,
            color: "from-green-400 to-green-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${stat.color} text-white text-center flex flex-col items-center
            transition-all duration-300 transform hover:scale-[1.05] hover:shadow-2xl`}
          >
            {stat.icon}
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            {inView && (
              <p className="text-4xl font-bold">
                <CountUp
                  start={0}
                  end={stat.count}
                  duration={2.5}
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
