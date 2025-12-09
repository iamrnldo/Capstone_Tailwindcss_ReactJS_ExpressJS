// frontend/src/pages/profile/index.jsx
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getKelasLabel,
  getPeminatanLabel,
} from "../../constants/enums";

// Import background image
import bgProfile from "../../assets/bg/bg-1.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [watchHistory, setWatchHistory] = useState([]);
  const [materialHistory, setMaterialHistory] = useState([]);

  // Check if user is premium (you can modify this based on your logic)
  const isPremium = user?.is_premium || false;

  // Format join date
  const formatJoinDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = { month: "long", year: "numeric" };
    return `Bergabung ${date.toLocaleDateString("id-ID", options)}`;
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("62")) {
      return `+62 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(
        9
      )}`;
    } else if (cleaned.startsWith("0")) {
      return `+62 ${cleaned.slice(1, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(
        8
      )}`;
    }
    return phone;
  };

  // Get user display info
  const getUserClassInfo = () => {
    const kelas = user?.kelas
      ? getKelasLabel(user.kelas).replace("Kelas ", "")
      : "";
    const peminatan = user?.peminatan ? getPeminatanLabel(user.peminatan) : "";

    if (kelas && peminatan) {
      return `${kelas} ${peminatan}`;
    } else if (kelas) {
      return `Kelas ${kelas}`;
    } else if (peminatan) {
      return peminatan;
    }
    return null;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Dummy data for now
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWatchHistory([
      {
        id: 1,
        title: "Program Linear",
        category: "Optimasi",
        instructor: "Pak Nathan",
        duration: "30 Menit",
        gradient: "from-blue-100 to-blue-200",
      },
      {
        id: 2,
        title: "Integral Substitusi dan Parsial",
        category: "Kalkulus",
        instructor: "Pak Doni",
        duration: "20 Menit",
        gradient: "from-purple-100 to-purple-200",
      },
      {
        id: 3,
        title: "Barisan dan Deret Tak Hingga",
        category: "Kalkulus",
        instructor: "Pak Satria",
        duration: "25 Menit",
        gradient: "from-green-100 to-green-200",
      },
    ]);

    setMaterialHistory([
      {
        id: 1,
        title: "Program Linear",
        category: "Optimasi",
        instructor: "Pak Nathan",
        gradient: "from-orange-100 to-orange-200",
      },
      {
        id: 2,
        title: "Integral Substitusi dan Parsial",
        category: "Kalkulus",
        instructor: "Pak Doni",
        gradient: "from-pink-100 to-pink-200",
      },
      {
        id: 3,
        title: "Barisan dan Deret Tak Hingga",
        category: "Kalkulus",
        instructor: "Pak Satria",
        gradient: "from-teal-100 to-teal-200",
      },
    ]);

    return () => clearTimeout(timer);
  }, [token]);

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f0f5ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f5ff]">
      {/* Main Content */}
      <div className="max-w-7xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-base font-semibold mb-8">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#012f72] transition-colors"
          >
            Beranda
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#f58610]">Profile</span>
        </nav>

        {/* Background Card with bg-1.png */}
        <div
          className="relative shadow-lg rounded-[30px] pt-20 sm:pt-28 mb-16"
          style={{
            backgroundImage: `url(${bgProfile})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Inner Profile Card (White Card) */}
          <div className="bg-white rounded-[24px] shadow-lg p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] bg-pink-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-2.5 sm:p-3 hover:bg-gray-800 transition shadow-md"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Profile Information */}
              <div className="flex-1 w-full text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-4 gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <h2 className="text-2xl sm:text-[32px] font-bold text-[#012f72]">
                      {user.name || "User"}
                    </h2>
                    {isPremium && (
                      <div className="bg-[#fffb8a] px-4 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm">
                        <svg
                          className="w-4 h-4 text-[#ff8300]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        <p className="text-sm font-semibold text-[#ff8300]">
                          Premium Member
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="bg-[#012f72] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#014094] transition flex items-center space-x-2 shadow-md"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Class and School Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 mb-6">
                  {getUserClassInfo() && (
                    <>
                      <p className="text-base sm:text-lg text-[#525252] font-medium">
                        {getUserClassInfo()}
                      </p>
                      {user.school && (
                        <span className="text-gray-400 hidden sm:inline">
                          •
                        </span>
                      )}
                    </>
                  )}
                  {user.school && (
                    <p className="text-base sm:text-lg text-[#525252] font-medium">
                      {user.school}
                    </p>
                  )}
                  {!getUserClassInfo() && !user.school && (
                    <p className="text-base sm:text-lg text-gray-400 italic">
                      Belum ada informasi sekolah
                    </p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-[#525252]">
                  {/* Email */}
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </div>

                  {/* Phone */}
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{formatPhone(user.phone)}</span>
                    </div>
                  )}

                  {/* Join Date */}
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatJoinDate(user.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watch History Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#012f72]">
              Riwayat Tontonan
            </h3>
            {watchHistory.length > 0 && (
              <Link
                to="/profile/watch-history"
                className="text-[#012f72] hover:text-[#014094] font-medium text-sm flex items-center gap-1"
              >
                Lihat Semua
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>

          {watchHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchHistory.map((item) => (
                <VideoCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="video"
              title="Belum ada riwayat tontonan"
              description="Mulai menonton video pembelajaran untuk melihat riwayat di sini"
            />
          )}
        </div>

        {/* Material History Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#012f72]">
              Riwayat Materi
            </h3>
            {materialHistory.length > 0 && (
              <Link
                to="/profile/material-history"
                className="text-[#012f72] hover:text-[#014094] font-medium text-sm flex items-center gap-1"
              >
                Lihat Semua
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>

          {materialHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialHistory.map((item) => (
                <MaterialCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="book"
              title="Belum ada riwayat materi"
              description="Mulai membaca materi pembelajaran untuk melihat riwayat di sini"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Video Card Component
const VideoCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer group">
      <div
        className={`h-[180px] sm:h-[200px] bg-gradient-to-br ${item.gradient} flex items-center justify-center relative`}
      >
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-[#012f72] opacity-50 group-hover:opacity-70 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transition transform scale-0 group-hover:scale-100">
            <svg
              className="w-6 h-6 text-[#012f72] ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="inline-block bg-[#97bfff] bg-opacity-35 px-3 sm:px-4 py-1 rounded mb-3">
          <p className="text-xs sm:text-sm text-[#012f72] font-medium">
            {item.category}
          </p>
        </div>
        <h4 className="text-sm sm:text-base font-semibold text-[#012f72] mb-3 line-clamp-2">
          {item.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-[#525252]">
          <div className="flex items-center space-x-1">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{item.instructor}</span>
          </div>
          <div className="flex items-center space-x-1">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{item.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Material Card Component
const MaterialCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer group">
      <div
        className={`h-[180px] sm:h-[200px] bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
      >
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-[#012f72] opacity-50 group-hover:opacity-70 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        )}
      </div>
      <div className="p-4 sm:p-6">
        <div className="inline-block bg-[#97bfff] bg-opacity-35 px-3 sm:px-4 py-1 rounded mb-3">
          <p className="text-xs sm:text-sm text-[#012f72] font-medium">
            {item.category}
          </p>
        </div>
        <h4 className="text-sm sm:text-base font-semibold text-[#012f72] mb-3 line-clamp-2">
          {item.title}
        </h4>
        <div className="flex items-center space-x-1 text-xs text-[#525252]">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>{item.instructor}</span>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon === "video" ? (
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        )}
      </div>
      <h4 className="text-lg font-medium text-gray-700 mb-2">{title}</h4>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

export default Profile;
