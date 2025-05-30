import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import { Settings2, ListOrdered, LogOut } from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa";
import useUserStore from "../utils/store/useUserStore";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const { user, profile, setUser, setProfile, resetUser } = useUserStore();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    let channel;

    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const userData = session.session.user;
        setUser(userData);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, email, full_name")
          .eq("id", userData.id)
          .single();

        if (!error && profileData) {
          setProfile(profileData);

          if (!localStorage.getItem("hasLoggedIn")) {
            localStorage.setItem("hasLoggedIn", "true");
            Swal.fire({
              title: "Selamat Datang Kembali!",
              html: `<div class="text-gray-700 dark:text-gray-200 text-lg font-medium">
                Hai, <span class="font-bold">${
                  profileData.username || "Pengguna"
                }</span>! Semoga harimu menyenangkan!
              </div>`,
              icon: "success",
              confirmButtonText: "Lanjutkan",
              background: document.documentElement.classList.contains("dark")
                ? "#1E293B"
                : "#FFFAF0",
              color: document.documentElement.classList.contains("dark")
                ? "#E5E7EB"
                : "#333",
              confirmButtonColor: document.documentElement.classList.contains(
                "dark"
              )
                ? "#F97316"
                : "#FF5733",
              showClass: {
                popup: "animate__animated animate__zoomIn animate__faster",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOut animate__faster",
              },
              customClass: {
                popup:
                  "rounded-3xl shadow-2xl px-10 py-8 border border-gray-200 dark:border-gray-700",
                title: "text-3xl font-extrabold text-gray-900 dark:text-white",
                confirmButton:
                  "px-6 py-3 rounded-lg text-lg font-semibold bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow-lg",
              },
            });
          }

          channel = supabase
            .channel("public:profiles")
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${userData.id}`,
              },
              (payload) => {
                setProfile(payload.new);
              }
            )
            .subscribe();
        }
      } else {
        resetUser();
      }
      setIsLoading(false);
    };

    if (!user || !profile) {
      fetchUser();
    } else {
      setIsLoading(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          supabase
            .from("profiles")
            .select("username, avatar_url, email, full_name")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profileData, error }) => {
              if (!error && profileData) {
                setProfile(profileData);
              }
            });
        } else if (event === "SIGNED_OUT") {
          resetUser();
          localStorage.removeItem("hasLoggedIn");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      Swal.fire({
        title: "Logout Berhasil",
        text: "Anda telah keluar. Sampai jumpa lagi!",
        icon: "success",
        background: "#ffffff",
        color: "#333",
        confirmButtonText: "Kembali ke Halaman Utama",
        confirmButtonColor: "#4CAF50",
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },
        customClass: {
          popup: "rounded-2xl shadow-xl",
          confirmButton:
            "px-6 py-3 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300",
        },
      }).then(() => {
        navigate("/home");
      });
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <header>
      <input
        type="checkbox"
        id="hbr"
        className="hbr peer hidden"
        aria-hidden="true"
        onChange={toggleMenu}
      />
      <nav className="fixed z-20 w-full bg-gradient-to-r from-[#ffffff] to-[#f0f0f0]/80 dark:bg-gradient-to-r dark:from-[#2c2c2c] dark:to-[#1e1e1e]/80 backdrop-blur-lg shadow-lg">
        <div className="px-6 md:px-10 w-full">
          <div className="w-full flex flex-wrap items-center justify-between gap-6 md:py-3 md:gap-0">
            {/* Logo + Hamburger + Mobile theme/profile */}
            <div className="w-full flex justify-between lg:w-auto items-center">
              <Link
                to="/"
                aria-label="logo"
                className="flex space-x-2 items-center"
              >
                <span className="text-2xl font-semibold text-[#3d241c] dark:text-[#e0e0e0] hover:text-[#ff6632] transition duration-300">
                  CoffeeShopMe
                </span>
              </Link>

              {/* Container untuk mobile: theme+profile di kiri, hamburger di kanan */}
              <div className="flex items-center justify-between lg:hidden">
                {/* Mobile: Theme & Profile (di kiri) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
                    aria-label="Toggle Theme"
                  >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </button>

                  {isLoading ? null : user && profile ? (
                    <div className="relative dropdown">
                      <img
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                        src={
                          profile?.avatar_url ||
                          "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover cursor-pointer"
                      />
                      {dropdownVisible && (
                        <div className="absolute right-0 mt-2 bg-white dark:bg-[#252525] dark:border dark:border-gray-600 rounded-xl shadow-xl w-52 py-2 transform transition-all duration-300 ease-out scale-95 z-30">
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Pengaturan
                          </Link>
                          <Link
                            to="/history"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Riwayat
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Keluar
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Hamburger (paling kanan) */}
                <label
                  htmlFor="hbr"
                  className="peer-checked:hamburger block relative z-20 p-6 -mr-6 cursor-pointer"
                >
                  <div
                    aria-hidden="true"
                    className="m-auto h-0.5 w-6 rounded bg-[#3e2723] dark:bg-[#d7ccc8] transition duration-300"
                  ></div>
                  <div
                    aria-hidden="true"
                    className="m-auto mt-2 h-0.5 w-6 rounded bg-[#3e2723] dark:bg-[#d7ccc8] transition duration-300"
                  ></div>
                  <div
                    aria-hidden="true"
                    className="m-auto mt-2 h-0.5 w-6 rounded bg-[#3e2723] dark:bg-[#d7ccc8] transition duration-300"
                  ></div>
                </label>
              </div>
            </div>

            {/* Menu Navigasi (hidden di mobile kecuali menuVisible) */}
            <div
              className={`navmenu w-full flex-wrap justify-center items-center space-y-8 p-6 lg:space-y-0 lg:p-0 lg:flex md:flex-nowrap lg:w-7/12 ${
                menuVisible ? "peer-checked:flex" : "hidden"
              }`}
            >
              <ul className="space-y-6 tracking-wide font-medium text-base lg:text-sm lg:flex lg:space-y-0 lg:space-x-6 justify-center items-center">
                {["/home", "/product", "/about", "/contact"].map(
                  (path, index) => {
                    const labels = ["Home", "Product", "About", "Contact"];
                    const isActive = location.pathname === path;

                    return (
                      <li
                        key={index}
                        className="relative group flex-1 text-center"
                      >
                        <Link
                          to={path}
                          className={`relative inline-block w-52 md:w-full px-6 py-2 transition-all transform rounded-lg shadow-md ${
                            isActive
                              ? "bg-gradient-to-r from-[#ff6632] to-[#ff9966] text-white scale-105"
                              : "text-[#2c2c2c] dark:text-[#ffffff] hover:text-white hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966]"
                          }`}
                        >
                          <span className="relative z-10">{labels[index]}</span>
                        </Link>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            {/* Desktop: Theme & Profile (tampil hanya di desktop) */}
            <div className="hidden lg:flex justify-end items-center gap-3 pl-4 relative">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </button>

              {isLoading ? null : user && profile ? (
                <div className="relative">
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >
                    <img
                      src={
                        profile?.avatar_url ||
                        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      alt={profile?.username || profile?.email}
                      className="w-9 h-9 rounded-full object-cover transition-transform duration-300 transform hover:scale-105"
                    />
                    <span className="text-sm font-medium text-[#6d4c41] dark:text-[#ffffff] truncate">
                      {profile?.username || profile?.email}
                    </span>
                  </div>

                  {dropdownVisible && (
                    <div className="absolute right-0 mt-2 bg-white dark:bg-[#252525] dark:border dark:border-gray-600 rounded-xl shadow-xl w-52 py-2 transform transition-all duration-300 ease-out scale-95 z-30">
                      <div className="px-4 py-2">
                        <Link
                          to="/settings"
                          className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white rounded-lg p-3 transition-all duration-300 ease-in-out"
                        >
                          <Settings2 className="mr-2 w-5 h-5" /> Pengaturan
                        </Link>
                      </div>
                      <div className="px-4 py-2">
                        <Link
                          to="/history"
                          className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white rounded-lg p-3 transition-all duration-300 ease-in-out"
                        >
                          <ListOrdered className="mr-2 w-5 h-5" /> Riwayat
                        </Link>
                      </div>
                      <div className="px-4 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white rounded-lg p-3 transition-all duration-300 ease-in-out"
                        >
                          <LogOut className="mr-2 w-5 h-5" /> Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <button className="bg-[#ff6632] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] transition-all duration-300 transform hover:scale-110">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
