/* eslint-disable no-unused-vars */
// frontend/src/pages/dashboard/index.jsx

import { useEffect, useContext, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Import images
import hero2 from "../../assets/hero/hero2.png";

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

// ============================================
// Dynamic SVG Import for Rekomendasi Belajar
// ============================================
const rekomendasiSvgModules = import.meta.glob(
  "/src/assets/element/detail_mapel/*.svg",
  { eager: true }
);

const rekomendasiImageMap = {};
for (const path in rekomendasiSvgModules) {
  const fileName = path.split("/").pop();
  rekomendasiImageMap[fileName] =
    rekomendasiSvgModules[path].default || rekomendasiSvgModules[path];
}

const getRekomendasiImage = (foto) => {
  if (!foto) return null;

  if (rekomendasiImageMap[foto]) return rekomendasiImageMap[foto];

  const fotoWithSvg = foto.endsWith(".svg") ? foto : `${foto}.svg`;
  if (rekomendasiImageMap[fotoWithSvg]) return rekomendasiImageMap[fotoWithSvg];

  const lowerFoto = foto.toLowerCase();
  const matchedKey = Object.keys(rekomendasiImageMap).find(
    (key) => key.toLowerCase() === lowerFoto
  );
  if (matchedKey) return rekomendasiImageMap[matchedKey];

  const lowerFotoWithSvg = fotoWithSvg.toLowerCase();
  const matchedKeyWithSvg = Object.keys(rekomendasiImageMap).find(
    (key) => key.toLowerCase() === lowerFotoWithSvg
  );
  if (matchedKeyWithSvg) return rekomendasiImageMap[matchedKeyWithSvg];

  return null;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const MAX_MAPEL_DISPLAY = 7;

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

// ============================================
// Animated Gradient Hero Component (Tailwind)
// ============================================
const AnimatedGradientHero = ({ children }) => {
  return (
    <section className="relative w-full min-h-[400px] px-4 sm:px-10 py-12 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-animated animate-gradient-xy" />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />

      {/* Floating Orb 1 - Purple */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-float" />

      {/* Floating Orb 2 - Blue */}
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-reverse" />

      {/* Floating Orb 3 - Indigo (center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
};

// Toggle Button Icon Component
const ToggleIcon = ({ isExpanded }) => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <div
      className={`transition-all duration-500 ease-in-out ${
        isExpanded ? "rotate-180 scale-110" : "rotate-0 scale-100"
      }`}
    >
      {isExpanded ? (
        <svg
          className="w-8 h-8 text-[#012f72]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <div className="grid grid-cols-2 gap-1">
          <span className="w-3 h-3 bg-[#012f72] rounded transition-all duration-300"></span>
          <span className="w-3 h-3 bg-[#3b82f6] rounded transition-all duration-300"></span>
          <span className="w-3 h-3 bg-[#6366f1] rounded transition-all duration-300"></span>
          <span className="w-3 h-3 bg-[#8b5cf6] rounded transition-all duration-300"></span>
        </div>
      )}
    </div>
  </div>
);

// Mapel Card Component
const MapelCard = ({ mapel, index, onClick, isVisible, getIcon }) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-[#012f72] cursor-pointer transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95"
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
      }}
    >
      {getIcon(mapel)}
      <p className="font-medium text-center text-gray-800">{mapel.nama}</p>
    </div>
  );
};

// Rekomendasi Card Component
const RekomendasiCard = ({ item, navigate }) => {
  const [imageError, setImageError] = useState(false);
  const rekomendasiImage = getRekomendasiImage(item.foto || item.image);

  const getMapelColor = () => {
    if (item.mapel?.color) return item.mapel.color;
    const categoryColors = {
      Matematika: "from-purple-500 to-purple-700",
      Fisika: "from-amber-400 to-amber-600",
      Kimia: "from-green-500 to-green-700",
      Biologi: "from-emerald-500 to-emerald-700",
      "Bahasa Indonesia": "from-rose-400 to-rose-600",
      "Bahasa Inggris": "from-pink-400 to-pink-600",
    };
    for (const [key, value] of Object.entries(categoryColors)) {
      if (item.mapel?.nama?.includes(key) || item.category?.includes(key)) {
        return value;
      }
    }
    return "from-[#012f72] to-[#3b82f6]";
  };

  return (
    <article
      onClick={() => navigate(`/materi/${item.slug}`)}
      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer group"
    >
      <div
        className={`h-38 w-full bg-gradient-to-br ${getMapelColor()} overflow-hidden relative flex items-center justify-center`}
      >
        {rekomendasiImage && !imageError ? (
          <img
            src={rekomendasiImage}
            alt={item.title}
            className="h-38 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/90 h-38">
            <svg
              className="w-16 h-16 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-sm text-white/80 text-center px-4 mt-2 font-medium">
              {item.title}
            </span>
          </div>
        )}
        {item.mapel?.nama && (
          <div className="absolute top-3 left-3">
            <span className="inline-block text-xs bg-white/90 text-gray-800 px-3 py-1 rounded-full font-medium shadow-sm">
              {item.mapel.nama}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 pb-4">
        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
          {item.category || item.mapel?.nama || "Materi"}
        </span>
        <h3 className="font-semibold text-base mt-3 text-gray-900 group-hover:text-[#f58610] transition-colors duration-150 line-clamp-2">
          {item.title}
        </h3>
        {item.deskripsi && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {item.deskripsi}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#012f72] rounded-full flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>
              {item.instructor ||
                item.teacher ||
                `Guru ${item.mapel?.nama || "Pengajar"}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#f58610] rounded-full flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>{item.duration || "30 Menit"}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

// Quiz Card Component
const QuizCard = ({ quiz, navigate }) => {
  const getMapelColorStyle = () => {
    if (quiz.mapelColor && quiz.mapelColor.startsWith("#")) {
      return { backgroundColor: quiz.mapelColor };
    }
    const colorMap = {
      "bg-purple-500": "#8b5cf6",
      "bg-blue-600": "#2563eb",
      "bg-rose-400": "#fb7185",
      "bg-emerald-500": "#10b981",
      "bg-amber-400": "#fbbf24",
      "bg-pink-400": "#f472b6",
      "bg-green-500": "#22c55e",
    };
    return { backgroundColor: colorMap[quiz.mapelColor] || "#012f72" };
  };

  const getDifficultyStyle = () => {
    switch (quiz.difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-700";
      case "Sedang":
        return "bg-yellow-100 text-yellow-700";
      case "Sulit":
        return "bg-red-100 text-red-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getDifficultyIcon = () => {
    switch (quiz.difficulty) {
      case "Mudah":
        return "✔";
      case "Sedang":
        return "⚡";
      case "Sulit":
        return "🔥";
      default:
        return "✔";
    }
  };

  return (
    <article
      onClick={() => navigate(`/latihan/${quiz.slug}`)}
      className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer group"
    >
      <div
        className="inline-flex items-center px-4 py-1.5 rounded-full text-white text-xs font-semibold"
        style={getMapelColorStyle()}
      >
        {quiz.mapel}
      </div>
      {quiz.babUtama && (
        <p className="text-xs text-gray-500 mt-2">{quiz.babUtama}</p>
      )}
      <h3 className="mt-2 font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#f58610] transition-colors duration-150 line-clamp-2">
        {quiz.title}
      </h3>
      {quiz.deskripsi && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
          {quiz.deskripsi}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs mt-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
          <span>📝</span>
          <span>{quiz.totalSoal} Soal</span>
        </span>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${getDifficultyStyle()}`}
        >
          <span>{getDifficultyIcon()}</span>
          <span>{quiz.difficulty}</span>
        </span>
        {quiz.avgWaktu && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600">
            <span>⏱️</span>
            <span>~{quiz.avgWaktu}s/soal</span>
          </span>
        )}
      </div>
      <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors group-hover:bg-[#f58610]">
        <span>Mulai Latihan</span>
        <span className="text-xs">↗</span>
      </button>
    </article>
  );
};

// ============================================
// Main Dashboard Component
// ============================================
const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading, loginWithToken } = useContext(AuthContext);

  const tokenProcessed = useRef(false);
  const [processingToken, setProcessingToken] = useState(false);

  const [mapelList, setMapelList] = useState([]);
  const [rekomendasiBelajar, setRekomendasiBelajar] = useState([]);
  const [rekomendasiLatihan, setRekomendasiLatihan] = useState([]);
  const [loadingMapel, setLoadingMapel] = useState(true);
  const [loadingRekomendasi, setLoadingRekomendasi] = useState(true);
  const [loadingLatihan, setLoadingLatihan] = useState(true);
  const [error, setError] = useState(null);

  const [isMapelExpanded, setIsMapelExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const expandedContentRef = useRef(null);

  // Handle Google OAuth token from URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token && !tokenProcessed.current) {
      tokenProcessed.current = true;
      setProcessingToken(true);
      setSearchParams({}, { replace: true });
      loginWithToken(token)
        .then((result) => {
          setProcessingToken(false);
          if (!result.success) navigate("/login");
        })
        .catch(() => {
          setProcessingToken(false);
          navigate("/login");
        });
    }
  }, [loginWithToken, navigate, searchParams, setSearchParams]);

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = searchParams.get("token");
    if (!loading && !processingToken && !token && !user) {
      navigate("/login");
    }
  }, [user, loading, processingToken, navigate, searchParams]);

  // Fetch functions
  const fetchMapel = async () => {
    try {
      setLoadingMapel(true);
      const response = await fetch(`${API_URL}/api/dashboard/mapel`);
      const data = await response.json();
      if (data.success) setMapelList(data.data);
    } catch (err) {
      setError("Gagal memuat mata pelajaran");
    } finally {
      setLoadingMapel(false);
    }
  };

  const fetchRekomendasiBelajar = async () => {
    try {
      setLoadingRekomendasi(true);
      const response = await fetch(
        `${API_URL}/api/dashboard/rekomendasi-belajar?limit=6`
      );
      const data = await response.json();
      if (data.success) setRekomendasiBelajar(data.data);
    } catch (err) {
      console.error("Error fetching rekomendasi:", err);
    } finally {
      setLoadingRekomendasi(false);
    }
  };

  const fetchRekomendasiLatihan = async () => {
    try {
      setLoadingLatihan(true);
      const response = await fetch(
        `${API_URL}/api/dashboard/rekomendasi-latihan?limit=6`
      );
      const data = await response.json();
      if (data.success) setRekomendasiLatihan(data.data);
    } catch (err) {
      console.error("Error fetching latihan:", err);
    } finally {
      setLoadingLatihan(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMapel();
      fetchRekomendasiBelajar();
      fetchRekomendasiLatihan();
    }
  }, [user]);

  const handleMapelClick = (slug) => navigate(`/mapel/${slug}`);

  const handleToggleMapel = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsMapelExpanded(!isMapelExpanded);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const initialMapel = mapelList.slice(0, MAX_MAPEL_DISPLAY);
  const extraMapel = mapelList.slice(MAX_MAPEL_DISPLAY);
  const hasMoreMapel = mapelList.length > MAX_MAPEL_DISPLAY;

  const getMapelIcon = (mapel) => {
    if (mapel.icon && MAPEL_ICONS[mapel.icon]) {
      return (
        <img
          src={MAPEL_ICONS[mapel.icon]}
          alt={mapel.nama}
          className="w-12 h-12 object-contain"
        />
      );
    }
    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: mapel.color || "#012f72" }}
      >
        <span className="text-white text-lg font-bold">
          {mapel.nama.charAt(0)}
        </span>
      </div>
    );
  };

  // Loading states
  if (loading || processingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {processingToken ? "Memproses login..." : "Memuat..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 mt-2 bg-[#f3f7ff]">
      {/* HERO SECTION with Animated Gradient */}
      <AnimatedGradientHero>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white z-10">
            <p className="text-sm mb-1 text-white/90">Halo, {user.name} :)</p>
            <h1 className="text-3xl font-semibold mb-6 drop-shadow-md">
              Mau belajar apa hari ini?
            </h1>

            <div className="flex gap-4">
              <select
                className="px-4 py-2 rounded-md bg-white/90 backdrop-blur-sm shadow text-sm text-gray-800 border-0 focus:ring-2 focus:ring-white/50 cursor-pointer"
                defaultValue={user.kelas || "12"}
              >
                <option value="12">Kelas 12</option>
                <option value="11">Kelas 11</option>
                <option value="10">Kelas 10</option>
              </select>
              <select
                className="px-4 py-2 rounded-md bg-white/90 backdrop-blur-sm shadow text-sm text-gray-800 border-0 focus:ring-2 focus:ring-white/50 cursor-pointer"
                defaultValue={user.peminatan || "ipa"}
              >
                <option value="ipa">IPA</option>
                <option value="ips">IPS</option>
                <option value="bahasa">Bahasa</option>
              </select>
            </div>
          </div>

          <img
            src={hero2}
            alt="Hero Illustration"
            className="w-[420px] mr-12 hidden lg:block drop-shadow-2xl"
          />
        </div>
      </AnimatedGradientHero>

      {/* MATA PELAJARAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 -mt-32 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Mata Pelajaran</h2>
            {hasMoreMapel && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm transition-all duration-300 ${
                    isMapelExpanded ? "text-[#012f72]" : "text-gray-500"
                  }`}
                >
                  {isMapelExpanded
                    ? `${mapelList.length} mata pelajaran`
                    : `+${extraMapel.length} lainnya`}
                </span>
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isMapelExpanded ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
            )}
          </div>

          {loadingMapel ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 text-sm">
              {[...Array(8)].map((_, i) => (
                <MapelSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchMapel}
                className="px-4 py-2 bg-[#012f72] text-white rounded-lg hover:bg-[#014094]"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 text-sm">
                {initialMapel.map((mapel, index) => (
                  <MapelCard
                    key={mapel.id}
                    mapel={mapel}
                    index={index}
                    onClick={() => handleMapelClick(mapel.slug)}
                    isVisible={true}
                    getIcon={getMapelIcon}
                  />
                ))}

                {hasMoreMapel && (
                  <div
                    onClick={handleToggleMapel}
                    className={`border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${
                      isMapelExpanded
                        ? "border-[#012f72] bg-[#012f72]/5 shadow-md"
                        : "hover:shadow-md hover:border-[#012f72]"
                    } ${isAnimating ? "pointer-events-none" : ""}`}
                  >
                    <ToggleIcon isExpanded={isMapelExpanded} />
                    <p
                      className={`font-medium text-center transition-all duration-300 ${
                        isMapelExpanded ? "text-[#012f72]" : "text-gray-800"
                      }`}
                    >
                      {isMapelExpanded ? "Tutup" : "Semua Mapel"}
                    </p>
                  </div>
                )}

                {!hasMoreMapel && mapelList.length > 0 && (
                  <div
                    onClick={() => navigate("/mapel")}
                    className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-[#012f72] cursor-pointer transition-all duration-200"
                  >
                    <ToggleIcon isExpanded={false} />
                    <p className="font-medium text-center text-gray-800">
                      Lihat Semua
                    </p>
                  </div>
                )}
              </div>

              {hasMoreMapel && (
                <div
                  ref={expandedContentRef}
                  className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 text-sm transition-all duration-500 ease-in-out overflow-hidden ${
                    isMapelExpanded
                      ? "max-h-[1000px] opacity-100 mt-4 pt-4 border-t border-gray-100"
                      : "max-h-0 opacity-0 mt-0 pt-0 border-t-0"
                  }`}
                >
                  {extraMapel.map((mapel, index) => (
                    <MapelCard
                      key={mapel.id}
                      mapel={mapel}
                      index={index}
                      onClick={() => handleMapelClick(mapel.slug)}
                      isVisible={isMapelExpanded}
                      getIcon={getMapelIcon}
                    />
                  ))}
                </div>
              )}

              {hasMoreMapel && isMapelExpanded && (
                <div
                  className={`flex justify-center pt-4 border-t border-gray-100 transition-all duration-500 ease-in-out ${
                    isMapelExpanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={handleToggleMapel}
                    disabled={isAnimating}
                    className="flex items-center gap-2 px-6 py-2 text-sm text-[#012f72] hover:text-white bg-transparent hover:bg-[#012f72] border border-[#012f72] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isMapelExpanded ? "rotate-0" : "rotate-180"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    <span>Tutup</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* REKOMENDASI BELAJAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
              Rekomendasi Belajar
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Pilih materi yang ingin kamu pelajari
            </p>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            {rekomendasiBelajar.length} Materi
          </div>
        </div>

        {loadingRekomendasi ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <RecommendationSkeleton key={i} />
            ))}
          </div>
        ) : rekomendasiBelajar.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {rekomendasiBelajar.map((item) => (
              <RekomendasiCard key={item.id} item={item} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-600 text-sm">
              Belum ada rekomendasi belajar
            </p>
          </div>
        )}
      </section>

      {/* REKOMENDASI LATIHAN SOAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 mt-16 mb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
              Rekomendasi Latihan Soal
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Uji pemahamanmu dengan latihan soal
            </p>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            {rekomendasiLatihan.length} Latihan
          </div>
        </div>

        {loadingLatihan ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <QuizSkeleton key={i} />
            ))}
          </div>
        ) : rekomendasiLatihan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {rekomendasiLatihan.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-600 text-sm">
              Belum ada latihan soal tersedia
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Silakan tambahkan soal terlebih dahulu
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

// Skeleton Components
const MapelSkeleton = () => (
  <div className="border rounded-xl p-4 flex flex-col items-center gap-2 animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    <div className="w-20 h-4 bg-gray-200 rounded"></div>
  </div>
);

const RecommendationSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-38 w-full bg-gray-200"></div>
    <div className="p-5 pb-4">
      <div className="w-20 h-5 bg-gray-200 rounded-full mb-3"></div>
      <div className="w-full h-5 bg-gray-200 rounded mb-2"></div>
      <div className="w-2/3 h-5 bg-gray-200 rounded"></div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const QuizSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-md px-6 pt-5 pb-6 animate-pulse">
    <div className="w-32 h-6 bg-gray-200 rounded-full mb-4"></div>
    <div className="w-full h-5 bg-gray-200 rounded mb-2"></div>
    <div className="w-2/3 h-5 bg-gray-200 rounded mb-4"></div>
    <div className="flex gap-3">
      <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
    </div>
    <div className="mt-6 w-full h-10 bg-gray-200 rounded-full"></div>
  </div>
);

export default Dashboard;
