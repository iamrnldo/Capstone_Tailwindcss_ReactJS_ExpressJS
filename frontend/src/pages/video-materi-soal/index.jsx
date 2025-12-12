// frontend/src/pages/video-materi-soal/index.jsx

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ============================================
// Import all SVG images directly
// ============================================
const svgModules = import.meta.glob("../../assets/element/detail_mapel/*.svg", {
  eager: true,
});

// Build lookup map immediately
const IMAGE_MAP = {};
for (const path in svgModules) {
  const filename = path.split("/").pop();
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const imageUrl = svgModules[path].default;

  IMAGE_MAP[filename] = imageUrl;
  IMAGE_MAP[baseName] = imageUrl;

  console.log(
    `Added to IMAGE_MAP: ${baseName} -> ${imageUrl ? "OK" : "FAILED"}`
  );
}

console.log("IMAGE_MAP final:", IMAGE_MAP);
console.log("IMAGE_MAP keys:", Object.keys(IMAGE_MAP));

/**
 * Get image by filename - Generic function for both foto and contoh
 */
function getImageFromMap(filename) {
  if (!filename) return null;

  const cleanFilename = filename.trim();
  const baseName = cleanFilename.replace(/\.[^/.]+$/, "");

  console.log("Looking for:", cleanFilename, "or", baseName, "in IMAGE_MAP");

  // Try exact filename first
  if (IMAGE_MAP[cleanFilename]) {
    console.log("Found exact:", cleanFilename);
    return IMAGE_MAP[cleanFilename];
  }

  // Try baseName (handles extension mismatch)
  if (IMAGE_MAP[baseName]) {
    console.log("Found baseName:", baseName);
    return IMAGE_MAP[baseName];
  }

  // Try with .svg extension
  if (IMAGE_MAP[baseName + ".svg"]) {
    console.log("Found with .svg:", baseName + ".svg");
    return IMAGE_MAP[baseName + ".svg"];
  }

  console.log("Not found. Available:", Object.keys(IMAGE_MAP));
  return null;
}

// Alias functions for clarity
const getFotoImage = (filename) => getImageFromMap(filename);
const getContohImage = (filename) => getImageFromMap(filename);

// ============================================
// Tab Icons
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
// Tab Button
// ============================================
const TabButton = ({ id, label, icon, isActive, onClick }) => (
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

// ============================================
// Video Content
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
            <div className="flex-1 bg-gradient-to-br from-stone-400 to-stone-300" />
            <div className="flex-1 bg-gradient-to-br from-teal-800 to-teal-900" />
          </div>
          <button
            onClick={() =>
              hasVideo ? setIsPlaying?.(true) : alert("Video belum tersedia")
            }
            className="absolute inset-0 flex items-center justify-center group z-20"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
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
        <h3 className="text-white text-base sm:text-lg font-semibold">
          {data?.title || "Materi"}
        </h3>
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
// Materi Content - UPDATED
// ============================================
const MateriContent = ({ data }) => {
  // Get both foto and contoh images from IMAGE_MAP
  const fotoImage = getFotoImage(data?.foto);
  const contohImage = getContohImage(data?.contoh);

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log("MateriContent data:", {
        title: data.title,
        foto: data.foto,
        contoh: data.contoh,
        fotoImageResolved: fotoImage ? "YES" : "NO",
        contohImageResolved: contohImage ? "YES" : "NO",
      });
    }
  }, [data, fotoImage, contohImage]);

  return (
    <>
      {/* Hero - UPDATED to use fotoImage */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-100 to-purple-100">
          {fotoImage ? (
            <img
              src={fotoImage}
              alt={data?.title || "Materi"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : data?.foto ? (
            // If foto exists but not in IMAGE_MAP, show debug info
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <svg
                className="w-16 h-16 text-gray-300 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <p className="text-xs text-gray-500">
                Image not found: {data.foto}
              </p>
            </div>
          ) : (
            // Default placeholder when no foto is set
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
          <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-lg shadow-md">
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

      {/* Deskripsi */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-4">
          {data?.title || "Materi"}
        </h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {data?.deskripsi || "Deskripsi materi belum tersedia."}
        </p>
      </div>

      {/* Tujuan */}
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

      {/* Konten */}
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

      {/* Contoh */}
      {data?.contoh && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-6">
            Contoh
          </h2>
          <div className="bg-[#fffde7] rounded-xl p-4 sm:p-6 border-2 border-[#ff6f00]">
            {contohImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={contohImage}
                  alt={`Contoh ${data.title}`}
                  className="max-w-full h-auto max-h-[600px] object-contain rounded-lg shadow-md"
                />
                <p className="text-xs text-gray-500 mt-3">{data.contoh}</p>
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
                <p className="text-sm text-gray-500 mb-2">
                  Gambar contoh tidak ditemukan
                </p>
                <p className="text-xs text-gray-400">
                  File:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {data.contoh}
                  </code>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related */}
      {data?.relatedMateri?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[#012f72] mb-4">
            Materi Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.relatedMateri.map((related) => (
              <a
                key={related.id}
                href={`/materi/${related.slug}`}
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
              >
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

// ... rest of the components remain the same (LatihanContent, Breadcrumb, LoadingSkeleton, etc.)

// ============================================
// Latihan Content
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

  if (soalList?.length > 0) {
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
              onClick={() => navigate?.(`/latihan/${data?.slug || ""}`)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              Mulai Latihan
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {soalList.slice(0, 6).map((soal, index) => (
            <div
              key={soal.id || index}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg cursor-pointer border border-gray-100"
              onClick={() =>
                navigate?.(`/latihan/${data?.slug || ""}?soal=${index + 1}`)
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
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {soal.pertanyaan || `Soal ${index + 1}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
      <svg
        className="w-20 h-20 mx-auto text-gray-300 mb-6"
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
      <p className="text-gray-600">
        Latihan soal belum tersedia untuk materi ini.
      </p>
    </div>
  );
};

// ============================================
// Breadcrumb
// ============================================
const Breadcrumb = ({ data, navigate }) => (
  <nav className="mb-6">
    <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-600">
      <li>
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:text-[#012f72]"
        >
          Beranda
        </button>
      </li>
      <li className="flex items-center gap-1">
        <span>/</span>
        <button
          onClick={() => navigate("/mapel")}
          className="hover:text-[#012f72]"
        >
          Mata Pelajaran
        </button>
      </li>
      {data?.mapel && (
        <li className="flex items-center gap-1">
          <span>/</span>
          <button
            onClick={() => navigate(`/mapel/${data.mapel.slug}`)}
            className="hover:text-[#012f72]"
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

// ============================================
// Loading
// ============================================
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-4 w-48 bg-gray-200 rounded"></div>
    <div className="flex justify-center gap-3">
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="bg-white rounded-2xl shadow-lg h-64"></div>
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
          console.log(
            "Loaded materi:",
            result.data.title,
            "| Foto:",
            result.data.foto,
            "| Contoh:",
            result.data.contoh
          );
        } else {
          setError(result.message || "Gagal memuat konten");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Gagal memuat konten.");
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
        console.error("Error:", err);
      } finally {
        setLoadingSoal(false);
      }
    };
    fetchSoal();
  }, [activeTab, slug]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setIsPlaying(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tabName);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${newParams.toString()}`
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
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#012f72] text-white rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f5ff]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72]"></div>
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
              {...tab}
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
