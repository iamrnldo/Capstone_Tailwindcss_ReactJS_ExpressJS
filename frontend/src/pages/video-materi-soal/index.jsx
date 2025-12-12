
// frontend/src/pages/video-materi-soal/index.jsx

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ============================================
// Import all JPG images from detail_mapel folder
// ============================================
const imageModules = import.meta.glob(
  "../../../assets/element/detail_mapel/*.jpg",
  { eager: true }
);

// Create a mapping of filename to imported module
const getContohImage = (filename) => {
  if (!filename) return null;

  // Try to find the image in the imported modules
  const key = Object.keys(imageModules).find((path) =>
    path.endsWith(`/${filename}`)
  );

  if (key && imageModules[key]) {
    return imageModules[key].default;
  }

  return null;
};

// ============================================
// Tab Icons Components
// ============================================
const VideoIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
  </svg>
);

const MateriIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const LatihanIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// ============================================
// Tab Button Component
// ============================================
const TabButton = ({ id, label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm transition-all duration-300 ${
        isActive
          ? "bg-blue-600 text-white shadow-md font-medium"
          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm font-medium"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

// ============================================
// Video Content Component
// ============================================
const VideoContent = ({ data, isPlaying, setIsPlaying }) => {
  const hasVideo = data?.videoUrl;

  if (hasVideo && isPlaying) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <div
          className="relative bg-black"
          style={{ paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={data.videoUrl}
            title={data.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <div
        className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-stone-200"
        style={{ paddingBottom: "56.25%", height: 0 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-gradient-to-br from-stone-400 to-stone-300 relative">
              <div className="absolute top-8 left-8 hidden sm:block">
                <div className="w-16 h-16 rounded-full border-4 border-gray-800 bg-white flex items-center justify-center relative">
                  <div
                    className="w-1 h-5 bg-gray-800 absolute"
                    style={{
                      transform: "rotate(90deg)",
                      transformOrigin: "center bottom",
                    }}
                  />
                  <div
                    className="w-1 h-6 bg-gray-800 absolute"
                    style={{
                      transform: "rotate(0deg)",
                      transformOrigin: "center bottom",
                    }}
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-8 w-32 h-40 hidden md:block">
                <div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-t-lg h-full shadow-lg relative">
                  <div className="absolute top-8 left-0 right-0 mx-4 h-12 bg-gray-800 rounded flex items-center justify-center">
                    <div className="w-8 h-1 bg-gray-400"></div>
                  </div>
                  <div className="absolute top-24 left-0 right-0 mx-4 h-12 bg-gray-800 rounded flex items-center justify-center">
                    <div className="w-8 h-1 bg-gray-400"></div>
                  </div>
                  <div className="absolute -top-2 left-4 flex gap-1">
                    <div className="w-2 h-8 bg-red-600 rounded-t"></div>
                    <div className="w-2 h-10 bg-blue-600 rounded-t"></div>
                    <div className="w-2 h-6 bg-green-600 rounded-t"></div>
                  </div>
                  <div className="absolute -top-4 right-4 flex gap-2">
                    <div className="w-3 h-4 bg-orange-400 rounded"></div>
                    <div className="w-2 h-3 bg-yellow-300"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-teal-800 to-teal-900 relative p-8">
              <svg
                className="absolute inset-0 w-full h-full opacity-60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="30"
                  y="20"
                  width="60"
                  height="80"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="180"
                  cy="200"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <path
                  d="M 250 50 L 300 100 L 200 100 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <text
                  x="40"
                  y="150"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="14"
                  fontFamily="monospace"
                >
                  f(x)=ax+b
                </text>
                <text
                  x="320"
                  y="80"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="18"
                  fontFamily="monospace"
                >
                  π
                </text>
                <text
                  x="280"
                  y="180"
                  fill="rgba(255,255,255,0.25)"
                  fontSize="48"
                  fontFamily="Arial Black"
                  fontWeight="bold"
                >
                  MATH
                </text>
              </svg>
              <div className="absolute bottom-20 right-20 hidden lg:block">
                <div className="w-24 h-12 border-t-4 border-l-4 border-r-4 border-white rounded-t-full opacity-40"></div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (hasVideo) {
                setIsPlaying && setIsPlaying(true);
              } else {
                alert("Video belum tersedia untuk materi ini");
              }
            }}
            className="absolute inset-0 flex items-center justify-center group z-20"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-white text-base sm:text-lg font-semibold">
            {data?.title || "Materi"}
          </h3>
          <div className="bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            <p className="text-white text-xs sm:text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              {data?.instructor || "Guru Pengajar"}
            </p>
          </div>
        </div>
      </div>
      {!hasVideo && (
        <div className="absolute bottom-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
          Video segera hadir
        </div>
      )}
    </div>
  );
};

// ============================================
// Materi Content Component (Updated with Contoh JPG Image)
// ============================================
const MateriContent = ({ data }) => {
  // Get the contoh image (JPG)
  const contohImage = getContohImage(data?.contoh);

  return (
    <>
      {/* Hero Image Box */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-100 to-purple-100">
          {data?.foto ? (
            <img
              src={data.foto}
              alt={data.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-24 h-24 sm:w-32 sm:h-32 text-blue-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              {data?.title || "Materi"}
            </span>
          </div>
          {data?.babUtama && (
            <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1.5 rounded-lg shadow-md">
              <span className="text-xs font-medium text-white">
                {data.babUtama}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Deskripsi */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-4">
          {data?.title || "Materi"}
        </h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {data?.deskripsi || "Deskripsi materi belum tersedia."}
        </p>
      </div>

      {/* Section 2: Tujuan Pembelajaran */}
      {data?.tujuan && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-4">
            Tujuan Pembelajaran
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {data.tujuan}
          </p>
        </div>
      )}

      {/* Section 3: Konten Materi */}
      {data?.konten && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-6">
            Materi Pembelajaran
          </h2>
          <div
            className="prose prose-sm sm:prose-base max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.konten }}
          />
        </div>
      )}

      {/* Section 4: Contoh (Display JPG Image from assets) */}
      {data?.contoh && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-6">
            Contoh
          </h2>
          <div className="bg-[#fffde7] rounded-xl p-4 sm:p-6 border-2 border-[#ff6f00]">
            {contohImage ? (
              <div className="flex justify-center">
                <img
                  src={contohImage}
                  alt={`Contoh ${data.title}`}
                  className="max-w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Gambar contoh tidak ditemukan: {data.contoh}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related Materi */}
      {data?.relatedMateri && data.relatedMateri.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[#012f72] mb-4">
            Materi Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.relatedMateri.map((related) => (
              <a
                key={related.id}
                href={`/materi/${related.slug}`}
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {related.foto && (
                  <img
                    src={related.foto}
                    alt={related.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2">
                  {related.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ============================================
// Latihan Soal Content Component
// ============================================
const LatihanContent = ({
  data,
  navigate,
  soalList,
  loadingSoal,
  latihanInfo,
}) => {
  if (loadingSoal) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat latihan soal...</p>
      </div>
    );
  }

  if (soalList && soalList.length > 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#012f72]">
                Latihan Soal {data?.title || ""}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {soalList.length} soal tersedia
                {latihanInfo?.waktu && ` • ${latihanInfo.waktu} menit`}
              </p>
            </div>
            <button
              onClick={() =>
                navigate && navigate(`/latihan/${data?.slug || ""}`)
              }
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>Mulai Latihan</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {soalList.slice(0, 6).map((soal, index) => (
            <div
              key={soal.id || index}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
              onClick={() =>
                navigate &&
                navigate(`/latihan/${data?.slug || ""}?soal=${index + 1}`)
              }
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    soal.difficulty === "Mudah"
                      ? "bg-green-100 text-green-700"
                      : soal.difficulty === "Sedang"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {soal.difficulty || "Mudah"}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {soal.tipeSoal === "pilihan_ganda"
                    ? "Pilihan Ganda"
                    : soal.tipeSoal}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {soal.pertanyaan || `Soal ${index + 1}`}
              </p>
            </div>
          ))}
        </div>

        {soalList.length > 6 && (
          <div className="text-center">
            <button
              onClick={() =>
                navigate && navigate(`/latihan/${data?.slug || ""}`)
              }
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Lihat semua {soalList.length} soal →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
      <svg
        className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-6"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-4">
        Latihan Soal {data?.title || ""}
      </h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Latihan soal belum tersedia untuk materi ini. Silakan pelajari materi
        terlebih dahulu.
      </p>
    </div>
  );
};

// ============================================
// Breadcrumb Component
// ============================================
const Breadcrumb = ({ data, navigate }) => {
  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-600">
        <li>
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:text-[#012f72] transition-colors"
          >
            Beranda
          </button>
        </li>
        <li className="flex items-center gap-1">
          <span>/</span>
          <button
            onClick={() => navigate("/mapel")}
            className="hover:text-[#012f72] transition-colors"
          >
            Mata Pelajaran
          </button>
        </li>
        {data?.mapel && (
          <li className="flex items-center gap-1">
            <span>/</span>
            <button
              onClick={() => navigate(`/mapel/${data.mapel.slug}`)}
              className="hover:text-[#012f72] transition-colors"
            >
              {data.mapel.nama}
            </button>
          </li>
        )}
        <li className="flex items-center gap-1">
          <span>/</span>
          <span className="text-[#012f72] font-medium">
            {data?.title || "Materi"}
          </span>
        </li>
      </ol>
    </nav>
  );
};

// ============================================
// Loading Skeleton Component
// ============================================
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-4 w-48 bg-gray-200 rounded"></div>
    <div className="flex justify-center gap-3">
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="h-64 bg-gray-200"></div>
    </div>
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// ============================================
// Main Component
// ============================================
const VideoMateriSoal = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("materi");
  const [data, setData] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [latihanInfo, setLatihanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSoal, setLoadingSoal] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["video", "materi", "latihan"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/materi/${slug}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Gagal memuat konten");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat konten. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchSoal = async () => {
      if (activeTab !== "latihan" || !slug) return;

      try {
        setLoadingSoal(true);
        const response = await fetch(`${API_URL}/api/latihan/${slug}/soal`);
        const result = await response.json();

        if (result.success) {
          setSoalList(result.data || []);
          setLatihanInfo(result.latihan || null);
        }
      } catch (err) {
        console.error("Error fetching soal:", err);
      } finally {
        setLoadingSoal(false);
      }
    };

    fetchSoal();
  }, [activeTab, slug]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setIsPlaying(false);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", tabName);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${newSearchParams.toString()}`
    );
  };

  const tabs = [
    { id: "video", label: "Video", icon: <VideoIcon /> },
    { id: "materi", label: "Materi", icon: <MateriIcon /> },
    { id: "latihan", label: "Latihan Soal", icon: <LatihanIcon /> },
  ];

  if (authLoading || loading) {
    return (
      <div className="bg-[#f0f5ff] min-h-screen pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f0f5ff] min-h-screen pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-[#012f72] text-white rounded-lg hover:bg-[#014094] transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f5ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f5ff] min-h-screen pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <Breadcrumb data={data} navigate={navigate} />

        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={handleTabSwitch}
            />
          ))}
        </div>

        <div className="transition-all duration-300">
          {activeTab === "video" && (
            <VideoContent
              data={data}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}
          {activeTab === "materi" && <MateriContent data={data} />}
          {activeTab === "latihan" && (
            <LatihanContent
              data={data}
              navigate={navigate}
              soalList={soalList}
              loadingSoal={loadingSoal}
              latihanInfo={latihanInfo}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoMateriSoal;
