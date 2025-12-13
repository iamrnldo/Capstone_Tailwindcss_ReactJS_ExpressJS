// frontend/src/pages/kelas/index.jsx

import { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Import mapel icons
import matematikapeminatan from "@/assets/element/Matematika Peminatan.svg";
import matematikawajib from "@/assets/element/Matematika Wajib.svg";
import bhindo from "@/assets/element/Bahasa Indonesia.svg";
import binggris from "@/assets/element/binggris.svg";
import Fisika from "@/assets/element/Fisika.svg";
import Kimia from "@/assets/element/Kimia.svg";
import Biologi from "@/assets/element/Biologi.svg";
import Prakarya from "@/assets/element/prakarya.svg";
import Pjok from "@/assets/element/pjok.svg";

const API_URL =
  import.meta.env.VITE_API_URL || "https://capstone-omega-puce.vercel.app";

// Image mapping for mapel icons
const MAPEL_ICONS = {
  "Matematika Peminatan.svg": matematikapeminatan,
  "Matematika Wajib.svg": matematikawajib,
  "Bahasa Indonesia.svg": bhindo,
  "binggris.svg": binggris,
  "Fisika.svg": Fisika,
  "Kimia.svg": Kimia,
  "Biologi.svg": Biologi,
  "prakarya.svg": Prakarya,
  "pjok.svg": Pjok,
};

// Category Badge Component
const CategoryBadge = ({ category }) => {
  const colors = {
    ipa: "bg-green-100 text-green-700",
    ips: "bg-blue-100 text-blue-700",
    bahasa: "bg-purple-100 text-purple-700",
    umum: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        colors[category] || colors.umum
      }`}
    >
      {category?.toUpperCase() || "UMUM"}
    </span>
  );
};

// Mapel Card Component
const MapelCard = ({ mapel, onClick, getIcon }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-3 
                 hover:shadow-lg hover:border-[#012f72] hover:scale-[1.02] 
                 cursor-pointer transition-all duration-300 ease-out group"
    >
      <div className="relative">
        {getIcon(mapel)}
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="font-semibold text-center text-gray-800 group-hover:text-[#012f72] transition-colors">
        {mapel.nama}
      </p>
      <CategoryBadge category={mapel.category} />
      {mapel.deskripsi && (
        <p className="text-xs text-gray-500 text-center line-clamp-2 mt-1">
          {mapel.deskripsi}
        </p>
      )}
    </div>
  );
};

// Skeleton Component
const MapelSkeleton = () => (
  <div className="bg-white border rounded-2xl p-6 flex flex-col items-center gap-3 animate-pulse">
    <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
    <div className="w-24 h-5 bg-gray-200 rounded"></div>
    <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
  </div>
);

// Filter Button Component
const FilterButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
      ${
        active
          ? "bg-[#012f72] text-white shadow-md"
          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
      }`}
  >
    {children}
    {count !== undefined && (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

const Kelas = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useContext(AuthContext);

  // States
  const [mapelList, setMapelList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [activeCategory, debouncedSearch, setSearchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/kelas/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch mata pelajaran
  const fetchMapel = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (activeCategory !== "all") params.append("category", activeCategory);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const response = await fetch(
        `${API_URL}/api/kelas/mapel?${params.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        setMapelList(data.data);
      } else {
        setError(data.message || "Gagal memuat data");
      }
    } catch (err) {
      console.error("Error fetching mapel:", err);
      setError("Gagal memuat mata pelajaran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  // Fetch mapel when filters change
  useEffect(() => {
    if (user) {
      fetchMapel();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeCategory, debouncedSearch]);

  // Handle mapel click
  const handleMapelClick = (slug) => {
    navigate(`/mapel/${slug}`);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Clear filters
  const handleClearFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
  };

  // Get icon for mapel
  const getMapelIcon = (mapel) => {
    if (mapel.icon && MAPEL_ICONS[mapel.icon]) {
      return (
        <img
          src={MAPEL_ICONS[mapel.icon]}
          alt={mapel.nama}
          className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110"
        />
      );
    }

    return (
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: mapel.color || "#012f72" }}
      >
        <span className="text-white text-xl font-bold">
          {mapel.nama.charAt(0)}
        </span>
      </div>
    );
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center  justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 mt-8 pb-12 bg-gradient-to-b from-[#f3f7ff] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mata Pelajaran
          </h1>
          <p className="text-gray-600">
            Pilih mata pelajaran yang ingin kamu pelajari
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Search Input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-[#012f72]/20 focus:border-[#012f72]
                       transition-all duration-300"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <FilterButton
                key={cat.value}
                active={activeCategory === cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                count={cat.count}
              >
                {cat.label}
              </FilterButton>
            ))}
          </div>

          {/* Active Filters Info */}
          {(activeCategory !== "all" || debouncedSearch) && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Menampilkan{" "}
                <span className="font-medium text-gray-700">
                  {mapelList.length}
                </span>{" "}
                mata pelajaran
                {activeCategory !== "all" && (
                  <span>
                    {" "}
                    dalam kategori{" "}
                    <span className="font-medium text-[#012f72]">
                      {activeCategory.toUpperCase()}
                    </span>
                  </span>
                )}
                {debouncedSearch && (
                  <span>
                    {" "}
                    dengan kata kunci "
                    <span className="font-medium">{debouncedSearch}</span>"
                  </span>
                )}
              </p>
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Hapus Filter
              </button>
            </div>
          )}
        </div>

        {/* Mapel Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <MapelSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-red-500 mb-4 font-medium">{error}</p>
            <button
              onClick={fetchMapel}
              className="px-6 py-2.5 bg-[#012f72] text-white rounded-xl hover:bg-[#014094] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : mapelList.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">
              Tidak ada mata pelajaran ditemukan
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-[#012f72] text-white rounded-xl hover:bg-[#014094] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {mapelList.map((mapel, index) => (
              <div
                key={mapel.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MapelCard
                  mapel={mapel}
                  onClick={() => handleMapelClick(mapel.slug)}
                  getIcon={getMapelIcon}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && !error && mapelList.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-[#012f72] to-[#0147a3] rounded-2xl p-6 sm:p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold">{mapelList.length}</p>
                <p className="text-sm text-white/70 mt-1">Mata Pelajaran</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {categories.find((c) => c.value === "ipa")?.count || 0}
                </p>
                <p className="text-sm text-white/70 mt-1">Mapel IPA</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {categories.find((c) => c.value === "ips")?.count || 0}
                </p>
                <p className="text-sm text-white/70 mt-1">Mapel IPS</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {categories.find((c) => c.value === "umum")?.count || 0}
                </p>
                <p className="text-sm text-white/70 mt-1">Mapel Umum</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Kelas;
