import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // Added import
import logo1 from "@/assets/logo/logo1.png";
import jet from "@/assets/element/jet.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const menuItems = [
  { name: "Beranda", hash: "#" },
  { name: "Fitur", hash: "#fitur" },
  { name: "Testimoni", hash: "#testimoni" },
  { name: "Kelas", hash: "#kelas" },
  { name: "Try Out", hash: "#tryout" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Active link berdasarkan hash + default Beranda
  useEffect(() => {
    const updateActive = () => {
      setActiveLink(window.location.hash || "#");
    };
    updateActive();
    window.addEventListener("hashchange", updateActive);
    return () => window.removeEventListener("hashchange", updateActive);
  }, []);

  // Click outside untuk close mobile menu
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
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const linkClasses = (hash) =>
    `text-lg font-bold transition-colors duration-300 ease-out ${
      activeLink === hash
        ? "text-sky-900"
        : "text-neutral-400 hover:text-sky-900"
    }`;

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#">
              <img className="h-10 w-auto" src={logo1} alt="Logo" />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.hash}
                className={linkClasses(item.hash)}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Get Started + Hamburger */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
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
          <div className="flex flex-col items-center gap-4 py-4 bg-white shadow-lg border-t border-gray-200">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.hash}
                onClick={toggleMenu}
                className={`${linkClasses(
                  item.hash
                )} transform transition-all duration-500 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
