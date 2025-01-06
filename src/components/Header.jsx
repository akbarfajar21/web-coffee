import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    // Fetch the current authenticated user
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (session?.session?.user) {
        setUser(session.session.user);

        // Fetch the profile data from Supabase
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
        if (role === "admin") {
          localStorage.removeItem("admin-auth-token");
        } else {
          localStorage.removeItem("user-auth-token");
        }
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
      <nav className="fixed z-20 w-full bg-[#f8f5f2]/80 dark:bg-[#3e2723]/80 backdrop-blur navbar shadow-md shadow-[#6d4c41]/10 peer-checked:navbar-active md:relative md:bg-transparent dark:shadow-none">
        <div className="px-6 md:px-12 w-full">
          <div className="w-full flex flex-wrap items-center justify-between gap-6 md:py-3 md:gap-0">
            <div className="w-full flex justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="logo"
                className="flex space-x-2 items-center"
              >
                <span className="text-base font-bold text-[#6d4c41] dark:text-[#d7ccc8]">
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
              className={`navmenu w-full flex-wrap justify-end items-center space-y-8 p-6 lg:space-y-0 lg:p-0 lg:flex md:flex-nowrap lg:w-7/12 ${
                menuVisible ? "peer-checked:flex" : "hidden"
              }`}
            >
              <ul className="space-y-6 tracking-wide font-medium text-base lg:text-sm lg:flex lg:space-y-0 lg:space-x-6">
                {["/", "/about", "/product", "/contact"].map((path, index) => {
                  const labels = ["Home", "About", "Product", "Contact"];
                  const isActive = location.pathname === path;

                  return (
                    <li key={index}>
                      <Link
                        to={path}
                        className={`relative block md:px-6 py-2 transition ${
                          isActive
                            ? "bg-[#ff6632] text-white shadow-md rounded-tl-lg rounded-br-lg"
                            : "text-[#ffffff]"
                        } hover:bg-[#ff6632] hover:text-white rounded-tl-lg rounded-br-lg`}
                      >
                        <span className="relative">{labels[index]}</span>
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
                        src={profile.avatar_url}
                        alt={profile.username}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-[#3e2723] dark:text-[#d7ccc8]">
                        {profile.full_name}
                      </span>
                    </div>

                    {dropdownVisible && (
                      <div
                        className={`absolute -right-0 mt-4 bg-white rounded-lg shadow-lg z-30 transform transition-all duration-300 ease-in-out`}
                      >
                        <div className="px-4 py-2 text-gray-800 border-b">
                          <p className="text-sm text-gray-500">
                            {profile.email}
                          </p>
                        </div>
                        <div>
                          <Link
                            to="/settings"
                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 mr-2 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM21 10.7l-1.4-1.4c-.25-.25-.62-.25-.87 0l-2.1 2.1c-.52-.42-1.08-.8-1.66-1.2l-.24-2.16c-.06-.28-.31-.48-.58-.48h-2.1c-.27 0-.52.2-.58.48l-.24 2.16c-.58.4-1.14.78-1.66 1.2l-2.1-2.1c-.25-.25-.62-.25-.87 0L14.8 10.7c-.46.46-.48 1.12-.06 1.59l1.2 1.2c-.52.4-1.1.78-1.7 1.14L14.3 17c-.06.28-.31.48-.58.48h-2.1c-.27 0-.52-.2-.58-.48l-.24-2.16c-.6-.36-1.18-.74-1.7-1.14l-1.2 1.2c-.42.47-.4 1.13.06 1.59l-1.4 1.4c-.25.25-.25.62 0 .87l2.1 2.1c-.39.52-.78 1.08-1.2 1.66l-2.16.24c-.28.06-.48.31-.48.58v2.1c0 .27.2.52.48.58l2.16.24c.42.39.8.78 1.2 1.2l-2.1 2.1c-.25.25-.25.62 0 .87l1.4 1.4c.25.25.62.25.87 0l2.1-2.1c.52.39 1.08.78 1.66 1.2l.24 2.16c.06.28.31.48.58.48h2.1c.27 0 .52-.2.58-.48l.24-2.16c.39-.42.78-.8 1.2-1.2l2.1 2.1c.25.25.62.25.87 0l1.4-1.4c.25-.25.25-.62 0-.87l-2.1-2.1c.42-.52.8-1.08 1.2-1.66l2.16-.24c.28-.06.48-.31.48-.58v-2.1c0-.27-.2-.52-.48-.58l-2.16-.24c-.42-.39-.8-.78-1.2-1.2l2.1-2.1c.25-.25.25-.62 0-.87L21 10.7z"></path>
                            </svg>
                            Settings
                          </Link>
                        </div>
                        <div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login">
                    <button className="bg-[#ff6632] text-white px-4 py-2 rounded-md hover:bg-[#834a34] transition duration-300">
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
