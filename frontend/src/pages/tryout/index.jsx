import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Static Icons
import premiumIcon from "@/assets/element/premium.svg";
import dibukaIcon from "@/assets/element/dibuka.svg";
import ditutupIcon from "@/assets/element/ditutup.svg";

// ==========================================
// DYNAMIC IMAGE LOADER
// ==========================================
const svgModules = import.meta.glob("../../assets/element/**/*.svg", {
  eager: true,
  import: "default",
});

// ... (LoadingSkeleton Component tetap sama, tidak perlu diubah) ...
const LoadingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto space-y-8 animate-pulse">
    {/* ... code skeleton ... */}
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
      <p className="text-[#012f72] font-semibold text-xs tracking-wide">
        MEMUAT TRYOUT...
      </p>
    </div>
    <div className="space-y-6">
      <div className="h-6 w-40 bg-slate-200 rounded mb-4"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TryoutPage = () => {
  const [activeTab, setActiveTab] = useState("tka");
  const [tryoutData, setTryoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  const getImageSrc = (filename) => {
    const fullPath = `../../assets/element/${filename}`;
    if (svgModules[fullPath]) return svgModules[fullPath];
    if (svgModules[filename]) return svgModules[filename];
    return null;
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token =
        localStorage.getItem("token") ||
        new URLSearchParams(window.location.search).get("token");
      if (!token) {
        console.warn("No token found");
        return;
      }
      try {
        const response = await axios.get("https://capstone-omega-puce.vercel.app/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTryoutData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://capstone-omega-puce.vercel.app/api/tryout${activeTab}`
        );
        setTryoutData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTryoutData();
  }, [activeTab]);

  const TryoutCard = ({ card }) => {
    const imageSrc = getImageSrc(card.image);
    const isUserPremium = userData?.is_premium === true;
    const isCardPremium = card.isPremium;
    const isDateOpen = card.isOpen;
    const isAccessible = isDateOpen && (isUserPremium || !isCardPremium);

    // ===========================================
    // UPDATE NAVIGASI DI SINI
    // ===========================================
    const handleCardClick = () => {
      if (isAccessible) {
        // Cek tab aktif untuk menentukan tujuan navigasi
        if (activeTab === "tka") {
          // Arahkan ke Ketentuan TKA, bawa ID tryout di state
          navigate("/tryout/ketentuan_tka", { state: { tryoutId: card.id } });
        } else {
          // Arahkan ke Ketentuan UTBK, bawa ID tryout di state
          navigate("/tryout/ketentuan_utbk", { state: { tryoutId: card.id } });
        }
      } else {
        navigate("/choose-paket");
      }
    };

    return (
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 
                   cursor-pointer relative overflow-hidden group
                   transition-all duration-300 ease-in-out
                   hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
      >
        <div className="flex items-start gap-2 sm:gap-3 relative z-10">
          <img
            src={imageSrc || "/path/to/placeholder.svg"}
            alt={card.alt}
            className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[#012f72] mb-1 sm:mb-1.5 group-hover:text-blue-600 transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-gray-600 mb-1.5 sm:mb-2">
              Masa aktif: {card.activeDate}
            </p>
            {card.isPremium && (
              <div className="flex items-center gap-1.5">
                <img
                  src={premiumIcon}
                  alt="premium"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                />
                <span className="text-xs text-blue-500 font-semibold">
                  Premium
                </span>
              </div>
            )}
          </div>
          <button className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <img
              src={isAccessible ? dibukaIcon : ditutupIcon}
              alt={isAccessible ? "dibuka" : "ditutup"}
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </button>
        </div>
      </div>
    );
  };

  const TryoutSection = ({ title, cards }) => (
    <section className="mb-8 sm:mb-10">
      <h2 className="text-lg sm:text-xl font-bold text-[#012f72] mb-4 sm:mb-5">
        {title}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {cards.map((card) => (
          <TryoutCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-[#f0f5ff] min-h-screen pt-16 mt-4 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex items-center text-xs sm:text-sm">
          <span className="text-gray-600 font-bold">Beranda/</span>
          <span className="text-[#f58610] ml-1 font-bold">
            {activeTab === "tka" ? "TryOut TKA" : "TryOut UTBK"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex bg-white border-2 border-[#012f72] rounded-lg overflow-hidden max-w-xl mx-auto">
          <button
            onClick={() => switchTab("tka")}
            className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-xs sm:text-sm transition-colors ${
              activeTab === "tka"
                ? "bg-[#012f72] text-white"
                : "bg-[#F0F5FF] text-[#012f72] hover:bg-gray-50"
            }`}
          >
            TryOut TKA
          </button>
          <button
            onClick={() => switchTab("utbk")}
            className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 font-semibold text-xs sm:text-sm transition-colors ${
              activeTab === "utbk"
                ? "bg-[#012f72] text-white"
                : "bg-[#F0F5FF] text-[#012f72] hover:bg-gray-50"
            }`}
          >
            TryOut UTBK
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : tryoutData ? (
          <>
            {tryoutData.section1 && (
              <TryoutSection
                title={tryoutData.section1.title}
                cards={tryoutData.section1.cards}
              />
            )}
            {tryoutData.section2 && (
              <TryoutSection
                title={tryoutData.section2.title}
                cards={tryoutData.section2.cards}
              />
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Data tidak ditemukan</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TryoutPage;
