// frontend/src/pages/detail_mapel/index.jsx

import { useNavigate, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Icon imports
import heroBanner from "@/assets/element/samping judul.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_GRADIENT = "from-[#98c2ff] via-[#a894ed] to-[#df96ff]";

// Animation Variants - DIPERBAIKI
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: "beforeChildren", // Tambahkan ini
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const DetailMapelPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [mapelInfo, setMapelInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailMapel = async () => {
      if (!subjectId) {
        setError("ID mata pelajaran tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = `${API_URL}/api/detail-mapel/${subjectId}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || `HTTP error! status: ${response.status}`
          );
        }

        if (data.success) {
          setMapelInfo(data.data.mapel);
          setCourses(data.data.courses || []);
        } else {
          throw new Error(data.message || "Gagal memuat data");
        }
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailMapel();
  }, [subjectId]);

  // Course Card Component - DIPERBAIKI (tanpa index dependency)
  const CourseCard = ({ course }) => (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
      variants={cardVariant}
      whileHover={{
        y: -6,
        boxShadow: "0 12px 24px rgba(1, 47, 114, 0.1)",
        transition: { duration: 0.15 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/mapel/${mapelInfo?.slug}/${course.slug}`)}
    >
      {/* Image Container */}
      <div className="h-[160px] bg-gradient-to-br from-[#012f72] to-[#3b82f6] overflow-hidden relative flex items-center justify-center">
        <span className="text-5xl text-white/80">📚</span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="inline-flex items-center justify-center bg-[#97bfff]/35 px-2.5 py-1 rounded mb-2.5">
          <p className="text-xs text-[#012f72] font-medium">
            {course.category || "Umum"}
          </p>
        </div>

        <h3 className="text-sm font-semibold text-[#012f72] mb-3 group-hover:text-[#f58610] transition-colors duration-150 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-[#525252]">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-[#012f72] rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
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
            <span>{course.teacher || "Pengajar"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-[#f58610] rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
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
            <span>{course.duration || "30 Menit"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const formatDisplayName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-[#f0f5ff] min-h-screen pt-16 sm:pt-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div
            className={`bg-gradient-to-r ${DEFAULT_GRADIENT} rounded-[20px] h-48 sm:h-56 mb-8 animate-pulse opacity-50`}
          ></div>
          <div className="mb-6">
            <div className="h-6 w-44 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-[160px] bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-5 w-20 bg-gray-200 rounded mb-2.5"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-3"></div>
                  <div className="flex gap-4">
                    <div className="h-3.5 w-16 bg-gray-200 rounded"></div>
                    <div className="h-3.5 w-14 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-[#f0f5ff] min-h-screen pt-16 sm:pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-2 text-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-sm"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 bg-[#012f72] text-white rounded-full hover:bg-[#f58610] transition-colors text-sm"
            >
              Ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No mapelInfo
  if (!mapelInfo) {
    return (
      <div className="bg-[#f0f5ff] min-h-screen pt-16 sm:pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Mata Pelajaran Tidak Ditemukan
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 bg-[#012f72] text-white rounded-full hover:bg-[#f58610] transition-colors text-sm"
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="bg-[#f0f5ff] min-h-screen pt-16 sm:pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <motion.div
          className="flex items-center gap-1 mb-6 sm:mb-8 flex-wrap"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p
            className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer hover:text-[#012f72] transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Beranda/
          </p>
          <p
            className="text-sm sm:text-base font-semibold text-gray-700 cursor-pointer hover:text-[#012f72] transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Kelas/
          </p>
          <p className="text-sm sm:text-base font-semibold text-[#f58610]">
            {formatDisplayName(mapelInfo.nama)}
          </p>
        </motion.div>

        {/* Hero Banner */}
        <motion.div
          className={`relative bg-gradient-to-r ${DEFAULT_GRADIENT} rounded-[20px] h-44 sm:h-56 mb-8 sm:mb-10 overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full"
            animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-4 left-1/4 w-12 h-12 bg-white/10 rounded-full"
            animate={{ y: [0, 5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between h-full px-6 sm:px-12 py-6 sm:py-0">
            <motion.div
              className="text-center sm:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="text-sm sm:text-base font-semibold text-white mb-1">
                {mapelInfo.grade || "Kelas 12"}
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white">
                {mapelInfo.nama}
              </p>
              {mapelInfo.deskripsi && (
                <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-md">
                  {mapelInfo.deskripsi}
                </p>
              )}
            </motion.div>

            <motion.div
              className="hidden sm:flex w-[180px] sm:w-[220px] lg:w-[260px] h-[130px] sm:h-[160px] lg:h-[180px] bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 items-center justify-center overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <img
                src={heroBanner}
                alt={mapelInfo.nama}
                className="w-full h-full object-contain p-3"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Section Title */}
        <motion.div
          className="mb-5 sm:mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#012f72]">
                Materi Pembelajaran
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Pilih materi yang ingin kamu pelajari
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {courses.length} Materi
            </div>
          </div>
        </motion.div>

        {/* Course Cards Grid - DIPERBAIKI */}
        {courses.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }} // Hanya animasi sekali
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-600 text-sm">
              Belum ada materi untuk mata pelajaran ini
            </p>
          </motion.div>
        )}

        {/* Load More Button */}
        {courses.length > 6 && (
          <motion.div
            className="flex justify-center mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.button
              className="px-6 py-2.5 bg-[#012f72] text-white text-sm font-semibold rounded-full hover:bg-[#f58610] transition-colors duration-150"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Lihat Semua Materi
            </motion.button>
          </motion.div>
        )}
      </main>

      <div className="h-14 sm:h-20" />
    </div>
  );
};

export default DetailMapelPage;
