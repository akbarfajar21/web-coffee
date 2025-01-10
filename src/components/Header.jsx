import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import { FiSettings, FiLogOut } from "react-icons/fi";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

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
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    };

    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

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
      <nav className="fixed z-20 w-full bg-gradient-to-r from-[#f8f5f2] to-[#f8f5f2]/80 dark:bg-gradient-to-r dark:from-[#3e2723] dark:to-[#3e2723]/80 backdrop-blur-lg shadow-lg">
        <div className="px-6 md:px-12 w-full">
          <div className="w-full flex flex-wrap items-center justify-between gap-6 md:py-3 md:gap-0">
            <div className="w-full flex justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="logo"
                className="flex space-x-2 items-center"
              >
                <span className="text-2xl font-semibold text-[#6d4c41] dark:text-[#d7ccc8] hover:text-[#ff6632] transition duration-300">
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
                        className={`relative inline-block px-6 py-2 transition-all transform rounded-lg shadow-md ${
                          isActive
                            ? "bg-gradient-to-r from-[#ff6632] to-[#ff9966] text-white scale-105"
                            : "text-[#ffffff] hover:text-white hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] hover:shadow-lg hover:scale-110"
                        }`}
                      >
                        <span className="relative z-10">{labels[index]}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="w-full flex justify-end lg:border-l border-[#6d4c41]/10 items-center gap-3 pl-4 relative">
                {user && profile ? (
                  <div className="relative">
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                      <img
                        src={profile.avatar_url || "default-avatar-url"}
                        alt={profile.username || profile.email}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-[#6d4c41] dark:text-[#ffffff]">
                        {profile.full_name || profile.email}
                      </span>
                    </div>

                    {dropdownVisible && (
                      <div className="absolute right-0 mt-4 bg-white dark:bg-[#d3d3d3] rounded-lg shadow-lg z-30 w-48 transform transition-all duration-300 ease-in-out">
                        <div>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] hover:text-white hover:shadow-md"
                          >
                            <FiSettings className="mr-2" /> Settings
                          </Link>
                        </div>
                        <div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#ff6632] hover:to-[#ff9966] hover:text-white hover:shadow-md"
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
