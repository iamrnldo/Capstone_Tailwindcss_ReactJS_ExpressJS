/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/components/Header.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo1 from "@/assets/logo/logo1.png";
import jet from "@/assets/element/jet.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const loggedOutMenu = [
  { name: "Beranda", path: "#beranda", type: "hash" },
  { name: "Fitur", path: "#fitur", type: "hash" },
  { name: "Tentang", path: "#tentang", type: "hash" },
];

const loggedInMenu = [
  { name: "Beranda", path: "/dashboard", type: "route" },
  { name: "Kelas", path: "/kelas", type: "route" },
  { name: "Try Out", path: "/tryout", type: "route" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = user ? loggedInMenu : loggedOutMenu;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Active link based on current route or hash
  useEffect(() => {
    if (user) {
      // For logged in users, check pathname
      setActiveLink(location.pathname);
    } else {
      // For logged out users, check hash
      setActiveLink(window.location.hash || "#beranda");
    }
  }, [location.pathname, user]);

  // Listen for hash changes (for logged out menu)
  useEffect(() => {
    if (!user) {
      const updateActive = () => {
        setActiveLink(window.location.hash || "#beranda");
      };
      window.addEventListener("hashchange", updateActive);
      return () => window.removeEventListener("hashchange", updateActive);
    }
  }, [user]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen, isDropdownOpen]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const isActive = (item) => {
    if (item.type === "route") {
      return location.pathname === item.path;
    }
    return activeLink === item.path;
  };

  const linkClasses = (item) =>
    `text-lg font-bold transition-colors duration-300 ease-out ${
      isActive(item)
        ? "bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent"
        : "text-slate-900 hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-500 hover:bg-clip-text hover:text-transparent"
    }`;

  // Render menu item based on type (route or hash)
  const renderMenuItem = (item, onClick = null) => {
    if (item.type === "route") {
      return (
        <Link
          key={item.name}
          to={item.path}
          className={linkClasses(item)}
          onClick={onClick}
        >
          {item.name}
        </Link>
      );
    }
    return (
      <a
        key={item.name}
        href={item.path}
        className={linkClasses(item)}
        onClick={onClick}
      >
        {item.name}
      </a>
    );
  };

  // Render mobile menu item with animation
  const renderMobileMenuItem = (item, index) => {
    const baseClasses = `${linkClasses(
      item
    )} transform transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
      isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
    }`;

    const style = {
      transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
    };

    if (item.type === "route") {
      return (
        <Link
          key={item.name}
          to={item.path}
          onClick={toggleMenu}
          className={baseClasses}
          style={style}
        >
          {item.name}
        </Link>
      );
    }
    return (
      <a
        key={item.name}
        href={item.path}
        onClick={toggleMenu}
        className={baseClasses}
        style={style}
      >
        {item.name}
      </a>
    );
  };

  return (
    <nav className="w-full bg-white/0 backdrop-blur-lg shadow-md fixed top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            {user ? (
              <Link to="/dashboard">
                <img className="h-10 w-auto" src={logo1} alt="Logo" />
              </Link>
            ) : (
              <a href="#beranda">
                <img className="h-10 w-auto" src={logo1} alt="Logo" />
              </a>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>

          {/* Get Started / Profile Dropdown + Hamburger */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:block text-sky-900 font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-4 w-48 bg-white/90 backdrop-blur-2xl rounded-xl shadow-2xl py-2 z-10 border border-white/40 transition-all duration-300 ${
                    isDropdownOpen
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible"
                  }`}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-700 to-purple-500 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all duration-300 ease-out text-sm md:text-base md:px-5 md:py-2.5 md:gap-4 hover:scale-105 active:scale-95"
              >
                <span className="text-white font-medium md:text-xl">
                  Get Started
                </span>
                <img
                  className="w-4 h-4 md:w-5 md:h-5"
                  src={jet}
                  alt="Jet Icon"
                />
              </Link>
            )}

            {/* Hamburger Button */}
            <button
              ref={buttonRef}
              className="md:hidden text-sky-900 w-6 h-6 flex flex-col justify-center items-center focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-sky-900 transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-sky-900 transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-sky-900 transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-4 py-4 bg-white/0 backdrop-blur-lg shadow-lg border-t border-white/20">
            {menuItems.map((item, index) => renderMobileMenuItem(item, index))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
