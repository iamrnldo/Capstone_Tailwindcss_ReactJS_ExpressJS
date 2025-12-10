// frontend/src/pages/dashboard/index.jsx

import { useEffect, useContext, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Import images
import hero2 from "../../assets/hero/hero2.png";
import programlinear1 from "@/assets/element/programlinier1.svg";
import programlinear from "@/assets/element/programlinear.svg";
import suratlamarankerja from "@/assets/element/suratlamarankerja.svg";
import dimensi3vector from "@/assets/element/dimensi3vector.svg";
import matriks from "@/assets/element/matriks.svg";
import dimensi3 from "@/assets/element/dimensi3.svg";

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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Maximum mapel to show initially
const MAX_MAPEL_DISPLAY = 7;

// Image mapping for mapel icons (key = icon value from database)
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

// Image mapping for rekomendasi belajar
const REKOMENDASI_IMAGES = {
  programlinear: programlinear,
  programlinear1: programlinear1,
  suratlamarankerja: suratlamarankerja,
  dimensi3vector: dimensi3vector,
  matriks: matriks,
  dimensi3: dimensi3,
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

// Mapel Card Component with Animation
const MapelCard = ({ mapel, index, onClick, isVisible, getIcon }) => {
  return (
    <div
      onClick={onClick}
      className={`
        border rounded-xl p-4 flex flex-col items-center gap-2 
        hover:shadow-md hover:border-[#012f72] cursor-pointer 
        transition-all duration-300 ease-out
        ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }
      `}
      style={{
        transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
      }}
    >
      {getIcon(mapel)}
      <p className="font-medium text-center text-gray-800">{mapel.nama}</p>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading, loginWithToken } = useContext(AuthContext);

  // Token processing ref
  const tokenProcessed = useRef(false);
  const [processingToken, setProcessingToken] = useState(false);

  // Data states
  const [mapelList, setMapelList] = useState([]);
  const [rekomendasiBelajar, setRekomendasiBelajar] = useState([]);
  const [rekomendasiLatihan, setRekomendasiLatihan] = useState([]);
  const [loadingMapel, setLoadingMapel] = useState(true);
  const [loadingRekomendasi, setLoadingRekomendasi] = useState(true);
  const [loadingLatihan, setLoadingLatihan] = useState(true);
  const [error, setError] = useState(null);

  // State for expanded mapel
  const [isMapelExpanded, setIsMapelExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ref for the expanded content
  const expandedContentRef = useRef(null);

  // Handle Google OAuth token from URL
  useEffect(() => {
    const token = searchParams.get("token");

    if (token && !tokenProcessed.current) {
      tokenProcessed.current = true;
      setProcessingToken(true);

      console.log("Processing token from URL...");

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("token");
      setSearchParams({}, { replace: true });

      loginWithToken(token)
        .then((result) => {
          console.log("Token processing result:", result);
          setProcessingToken(false);

          if (!result.success) {
            console.error("Failed to login with token");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Token processing error:", error);
          setProcessingToken(false);
          navigate("/login");
        });
    }
  }, [loginWithToken, navigate, searchParams, setSearchParams]);

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = searchParams.get("token");

    if (!loading && !processingToken && !token && !user) {
      console.log("No user, redirecting to login");
      navigate("/login");
    }
  }, [user, loading, processingToken, navigate, searchParams]);

  // Fetch mata pelajaran
  const fetchMapel = async () => {
    try {
      setLoadingMapel(true);
      const response = await fetch(`${API_URL}/api/dashboard/mapel`);
      const data = await response.json();

      if (data.success) {
        setMapelList(data.data);
      } else {
        console.error("Failed to fetch mapel:", data.message);
      }
    } catch (err) {
      console.error("Error fetching mapel:", err);
      setError("Gagal memuat mata pelajaran");
    } finally {
      setLoadingMapel(false);
    }
  };

  // Fetch rekomendasi belajar
  const fetchRekomendasiBelajar = async () => {
    try {
      setLoadingRekomendasi(true);
      const response = await fetch(
        `${API_URL}/api/dashboard/rekomendasi-belajar?limit=6`
      );
      const data = await response.json();

      if (data.success) {
        setRekomendasiBelajar(data.data);
      }
    } catch (err) {
      console.error("Error fetching rekomendasi:", err);
    } finally {
      setLoadingRekomendasi(false);
    }
  };

  // Fetch rekomendasi latihan
  const fetchRekomendasiLatihan = async () => {
    try {
      setLoadingLatihan(true);
      const response = await fetch(
        `${API_URL}/api/dashboard/rekomendasi-latihan?limit=6`
      );
      const data = await response.json();

      if (data.success) {
        setRekomendasiLatihan(data.data);
      }
    } catch (err) {
      console.error("Error fetching latihan:", err);
    } finally {
      setLoadingLatihan(false);
    }
  };

  // Fetch data when user is available
  useEffect(() => {
    if (user) {
      fetchMapel();
      fetchRekomendasiBelajar();
      fetchRekomendasiLatihan();
    }
  }, [user]);

  // Handle mapel click
  const handleMapelClick = (slug) => {
    navigate(`/mapel/${slug}`);
  };

  // Handle toggle with animation
  const handleToggleMapel = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsMapelExpanded(!isMapelExpanded);

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Get displayed mapel based on expanded state
  const initialMapel = mapelList.slice(0, MAX_MAPEL_DISPLAY);
  const extraMapel = mapelList.slice(MAX_MAPEL_DISPLAY);

  // Check if there are more mapel to show
  const hasMoreMapel = mapelList.length > MAX_MAPEL_DISPLAY;

  // Get icon for mapel
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

  // Show loading state
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

  // Show nothing while redirecting
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
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-[#99c2ff] via-[#b190ff] to-[#e6a6ff] w-full min-h-[400px] px-4 sm:px-10 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-[#012f72] z-10">
            <p className="text-sm mb-1">Halo, {user.name} :)</p>
            <h1 className="text-3xl font-semibold mb-6">
              Mau belajar apa hari ini?
            </h1>

            <div className="flex gap-4">
              <select
                className="px-4 py-2 rounded-md bg-white shadow text-sm"
                defaultValue={user.kelas || "12"}
              >
                <option value="12">12</option>
                <option value="11">11</option>
                <option value="10">10</option>
              </select>
              <select
                className="px-4 py-2 rounded-md bg-white shadow text-sm"
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
            className="w-[420px] mr-12 hidden lg:block"
          />
        </div>
      </section>

      {/* MATA PELAJARAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 -mt-32 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 ease-in-out">
          {/* Header */}
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

          {/* Loading State */}
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
              {/* Initial Mapel Grid (Always Visible) */}
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

                {/* Toggle Button - Only if there are more mapel */}
                {hasMoreMapel && (
                  <div
                    onClick={handleToggleMapel}
                    className={`
                      border rounded-xl p-4 flex flex-col items-center gap-2 
                      cursor-pointer transition-all duration-300 
                      ${
                        isMapelExpanded
                          ? "border-[#012f72] bg-[#012f72]/5 shadow-md"
                          : "hover:shadow-md hover:border-[#012f72]"
                      }
                      ${isAnimating ? "pointer-events-none" : ""}
                    `}
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

                {/* If no more mapel, show "Lihat Semua" link */}
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

              {/* Expandable Extra Mapel Section */}
              {hasMoreMapel && (
                <div
                  ref={expandedContentRef}
                  className={`
                    grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 text-sm
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${
                      isMapelExpanded
                        ? "max-h-[1000px] opacity-100 mt-4 pt-4 border-t border-gray-100"
                        : "max-h-0 opacity-0 mt-0 pt-0 border-t-0"
                    }
                  `}
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

              {/* Bottom Close Button (when expanded) */}
              {hasMoreMapel && isMapelExpanded && (
                <div
                  className={`
                    flex justify-center pt-4 border-t border-gray-100
                    transition-all duration-500 ease-in-out
                    ${isMapelExpanded ? "opacity-100" : "opacity-0"}
                  `}
                >
                  <button
                    onClick={handleToggleMapel}
                    disabled={isAnimating}
                    className="
                      flex items-center gap-2 px-6 py-2 
                      text-sm text-[#012f72] hover:text-white
                      bg-transparent hover:bg-[#012f72] 
                      border border-[#012f72] rounded-full
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
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
        <h2 className="font-bold text-xl sm:text-2xl mb-6 text-gray-900">
          Rekomendasi Belajar
        </h2>

        {loadingRekomendasi ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <RecommendationSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {rekomendasiBelajar.map((item) => (
              <article
                key={item.id}
                onClick={() => navigate(`/materi/${item.slug}`)}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              >
                <img
                  src={REKOMENDASI_IMAGES[item.image] || programlinear}
                  alt={item.title}
                  className="h-38 w-full object-cover"
                />
                <div className="p-5 pb-4">
                  <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-base mt-3 text-gray-900">
                    {item.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-1"></span>
                      <span>{item.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* REKOMENDASI LATIHAN SOAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 mt-16 mb-20">
        <h2 className="font-bold text-xl sm:text-2xl mb-6 text-gray-900">
          Rekomendasi Latihan Soal
        </h2>

        {loadingLatihan ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <QuizSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {rekomendasiLatihan.map((quiz) => (
              <article
                key={quiz.id}
                onClick={() => navigate(`/latihan/${quiz.slug}`)}
                className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer"
              >
                <div
                  className={`inline-flex items-center px-4 py-1.5 rounded-full ${quiz.mapelColor} text-white text-xs font-semibold`}
                >
                  {quiz.mapel}
                </div>

                <h3 className="mt-4 font-semibold text-sm sm:text-base text-gray-900">
                  {quiz.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs mt-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
                    <span>📝</span>
                    <span>{quiz.totalSoal} Soal</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                    <span>✔</span>
                    <span>{quiz.difficulty}</span>
                  </span>
                </div>

                <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors">
                  <span>Pilih</span>
                  <span className="text-xs">↗</span>
                </button>
              </article>
            ))}
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
