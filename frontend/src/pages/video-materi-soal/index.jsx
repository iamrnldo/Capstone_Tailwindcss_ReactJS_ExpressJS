// frontend/src/pages/video-materi-soal/index.jsx

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import jsPDF from "jspdf"; // 1. IMPORT JSPDF

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ... (Bagian SVG Import & IMAGE_MAP biarkan tetap sama) ...
const svgModules = import.meta.glob("../../assets/element/detail_mapel/*.svg", {
  eager: true,
});

const IMAGE_MAP = {};
for (const path in svgModules) {
  const filename = path.split("/").pop();
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const imageUrl = svgModules[path].default;
  IMAGE_MAP[filename] = imageUrl;
  IMAGE_MAP[baseName] = imageUrl;
}

function getImageFromMap(filename) {
  if (!filename) return null;
  const cleanFilename = filename.trim();
  const baseName = cleanFilename.replace(/\.[^/.]+$/, "");
  if (IMAGE_MAP[cleanFilename]) return IMAGE_MAP[cleanFilename];
  if (IMAGE_MAP[baseName]) return IMAGE_MAP[baseName];
  if (IMAGE_MAP[baseName + ".svg"]) return IMAGE_MAP[baseName + ".svg"];
  return null;
}

const getFotoImage = (filename) => getImageFromMap(filename);
const getContohImage = (filename) => getImageFromMap(filename);

// ... (Bagian Icons biarkan tetap sama) ...
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

// ... (TabButton & VideoContent & MateriContent tetap sama) ...
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

const MateriContent = ({ data }) => {
  const fotoImage = getFotoImage(data?.foto);
  const contohImage = getContohImage(data?.contoh);
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-100 to-purple-100">
          {fotoImage ? (
            <img
              src={fotoImage}
              alt={data?.title || "Materi"}
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
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-4">
          Apa itu {data?.title || "Materi"} ?
        </h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {data?.deskripsi || "Deskripsi materi belum tersedia."}
        </p>
      </div>
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
                <p className="text-sm text-gray-500">
                  Gambar contoh tidak ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      )}
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

// ============================================
// Latihan Content - UPDATED FOR DOWNLOAD
// ============================================
const LatihanContent = ({ data, soalList, loadingSoal, latihanInfo }) => {
  // 2. FUNGSI DOWNLOAD PDF
  const handleDownloadPdf = () => {
    if (!soalList || soalList.length === 0) {
      alert("Tidak ada soal untuk diunduh.");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(1, 47, 114); // Warna biru EduSukses
    doc.text(`Latihan Soal: ${data?.title || "Materi"}`, 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Total Soal: ${soalList.length}`, 14, 30);
    doc.line(14, 33, 196, 33); // Garis pembatas

    let yPos = 45;
    const pageHeight = doc.internal.pageSize.height;

    soalList.forEach((soal, index) => {
      // Cek apakah halaman penuh
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }

      // Nomor Soal
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(`Soal ${index + 1} (${soal.difficulty || "Umum"})`, 14, yPos);
      yPos += 7;

      // Pertanyaan (Text wrapping)
      doc.setFont("helvetica", "normal");
      const questionLines = doc.splitTextToSize(soal.pertanyaan || "", 180);
      doc.text(questionLines, 14, yPos);

      // Hitung tinggi text pertanyaan
      yPos += questionLines.length * 7 + 5;

      // Opsi Jawaban (Jika ada di database, sesuaikan key-nya)
      // Asumsi ada pilihan_a, pilihan_b, dst. Jika tidak, bagian ini bisa dihapus/disesuaikan
      if (soal.pilihan_a) {
        const options = [
          `A. ${soal.pilihan_a}`,
          `B. ${soal.pilihan_b}`,
          `C. ${soal.pilihan_c}`,
          `D. ${soal.pilihan_d}`,
          `E. ${soal.pilihan_e}`,
        ];

        options.forEach((opt) => {
          if (opt.length > 4) {
            // Cek jika opsi tidak kosong
            if (yPos > pageHeight - 20) {
              doc.addPage();
              yPos = 20;
            }
            const optLines = doc.splitTextToSize(opt, 170);
            doc.text(optLines, 20, yPos);
            yPos += optLines.length * 6;
          }
        });
        yPos += 5;
      }

      yPos += 10; // Spasi antar soal
    });

    // Save File
    doc.save(`Soal_Latihan_${data?.slug || "EduSukses"}.pdf`);
  };

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
            {/* 3. BUTTON DOWNLOAD (Menggantikan Navigasi) */}
            <button
              onClick={handleDownloadPdf}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors"
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
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Soal (PDF)
            </button>
          </div>
        </div>

        {/* Preview Soal List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {soalList.slice(0, 6).map((soal, index) => (
            <div
              key={soal.id || index}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
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
              <p className="text-sm text-gray-700 line-clamp-3">
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

// ... (Breadcrumb & LoadingSkeleton tetap sama) ...
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

const LoadingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto space-y-8 animate-pulse">
    <div className="space-y-6">
      <div className="h-4 w-48 bg-slate-200 rounded"></div>
      <div className="h-12 w-full max-w-xl mx-auto bg-slate-200 rounded-lg"></div>
    </div>
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex gap-3 mb-3">
        <div className="w-4 h-4 rounded-full bg-[#012f72] animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-[#f58610] animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 rounded-full bg-[#012f72] animate-bounce [animation-delay:-0.3s]"></div>
      </div>
      <p className="text-[#012f72] font-semibold text-sm animate-pulse">
        Sedang memuat materi...
      </p>
    </div>
  </div>
);

// ... (Main Component Logic tetap sama) ...
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
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
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
