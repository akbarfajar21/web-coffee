import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import { FiSettings, FiLogOut, FiClipboard } from "react-icons/fi";
import { FaMoon, FaSun } from "react-icons/fa"; // Import untuk ikon tema

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [theme, setTheme] = useState("light");

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
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (session?.session?.user) {
        setUser(session.session.user);
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, email, full_name")
          .eq("id", session.session.user.id)
          .single();

        if (!error) {
          setProfile(profileData);

          if (!localStorage.getItem("hasLoggedIn")) {
            localStorage.setItem("hasLoggedIn", "true");
            Swal.fire({
              title: "Login Berhasil!",
              text: `Selamat datang kembali, ${
                profileData.full_name || "Pengguna"
              }!`,
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#ff6632",
            });
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    };

    fetchUser();

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
          setUser(null);
          setProfile(null);
          localStorage.removeItem("hasLoggedIn");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      Swal.fire({
        title: "Logged Out",
        text: "You have successfully logged out.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff6632",
      }).then(() => {
        navigate("/");
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
        <div className="px-6 md:px-12 w-full">
          <div className="w-full flex flex-wrap items-center justify-between gap-6 md:py-3 md:gap-0">
            <div className="w-full flex justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="logo"
                className="flex space-x-2 items-center"
              >
                <span className="text-2xl font-semibold text-[#3d241c] dark:text-[#e0e0e0] hover:text-[#ff6632] transition duration-300">
                  Coffee Shop
                </span>
              </Link>
              <label
                htmlFor="hbr"
                className="peer-checked:hamburger block relative z-20 p-6 -mr-6 cursor-pointer lg:hidden ml-auto"
              >
                <div
                  aria-hidden="true"
                  className="m-auto h-0.5 w-6 rounded bg-[#3e2723] dark:bg-[#d7ccc8] transition duration-300"
                ></div>
                <div
                  aria-hidden="true"
                  className="m-auto mt-2 h-0.5 w-6 rounded bg-[#3e2723] dark:bg-[#d7ccc8] transition duration-300"
                ></div>
              </label>
            </div>
            <div
              className={`navmenu w-full flex-wrap justify-center items-center space-y-8 p-6 lg:space-y-0 lg:p-0 lg:flex md:flex-nowrap lg:w-7/12 ${
                menuVisible ? "peer-checked:flex" : "hidden"
              }`}
            >
              <ul className="space-y-6 tracking-wide font-medium text-base lg:text-sm lg:flex lg:space-y-0 lg:space-x-6 justify-center items-center">
                {["/", "/product", "/about", "/contact"].map((path, index) => {
                  const labels = ["Home", "Product", "About", "Contact"];
                  const isActive = location.pathname === path;

                  return (
                    <li key={index} className="relative group">
                      <Link
                        to={path}
                        className={`relative inline-block w-full text-center px-6 py-2 transition-all transform rounded-lg shadow-md ${
                          isActive
                            ? "bg-gradient-to-r from-[#ff6632] to-[#ff9966] text-white scale-105"
                            : "text-[#2c2c2c] dark:text-[#ffffff] hover:text-white hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] hover:shadow-lg hover:scale-110"
                        }`}
                      >
                        <span className="relative z-10">{labels[index]}</span>
                      </Link>
                    </li>
                    
                  );
                })}
              </ul>
              <div className="w-full flex justify-end lg:border-l border-[#6d4c41]/10 items-center gap-3 pl-4 relative">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
                  >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </button>
                </div>
                {user && profile ? (
                  <div className="relative">
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                      <img
                        src={profile.avatar_url || "default-avatar-url"}
                        alt={profile.username || profile.email}
                        className="w-9 h-9 rounded-full object-cover transition-transform duration-300 transform hover:scale-105"
                      />
                      <span className="text-sm font-medium text-[#6d4c41] dark:text-[#ffffff] truncate">
                        {profile.full_name || profile.username}
                      </span>
                    </div>

                    {dropdownVisible && (
                      <div className="absolute right-0 mt-2 bg-white dark:bg-[#3e2723] rounded-lg shadow-lg w-48 py-2 transform transition-all duration-300 ease-in-out z-30">
                        <div className="px-4 py-2">
                          <Link
                            to="/settings"
                            className="flex items-center text-sm text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] hover:text-white rounded-lg p-2 transition duration-200"
                          >
                            <FiSettings className="mr-2" /> Settings
                          </Link>
                        </div>
                        <div className="px-4 py-2">
                          <Link
                            to="/history"
                            className="flex items-center text-sm text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] hover:text-white rounded-lg p-2 transition duration-200"
                          >
                            <FiClipboard className="mr-2" /> History
                          </Link>
                        </div>
                        <div className="px-4 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center text-sm text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] hover:text-white rounded-lg p-2 transition duration-200"
                          >
                            <FiLogOut className="mr-2" /> Log Out
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
