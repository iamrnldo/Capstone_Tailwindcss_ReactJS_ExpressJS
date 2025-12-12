import { useState, useEffect } from "react";
import axios from "axios";

// Common SVG imports
import premiumIcon from "@/assets/element/premium.svg";
import dibukaIcon from "@/assets/element/dibuka.svg";
import ditutupIcon from "@/assets/element/ditutup.svg";

// Dynamic Image Loader
const svgModules = import.meta.glob("../../assets/element/**/*.svg", {
  eager: true,
  import: "default",
});

const TryoutPage = () => {
  const [activeTab, setActiveTab] = useState("tka");
  const [tryoutData, setTryoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const getImageSrc = (filename) => {
    const fullPath = `../../assets/element/${filename}`;
    if (svgModules[fullPath]) {
      return svgModules[fullPath];
    }
    return null;
  };

  // 1. Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  // 2. Fetch Tryout Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tryout/${activeTab}`,
          {
            withCredentials: true,
          }
        );
        setTryoutData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // ==========================================
  // CARD COMPONENT WITH NEW LOGIC
  // ==========================================
  const TryoutCard = ({ card }) => {
    const imageSrc = getImageSrc(card.image);

    // 1. Check User Status
    const isUserPremium = userData?.is_premium === true;

    // 2. Check Card Status
    const isTryoutPremium = card.isPremium; // value from DB (t/f)
    const isDateOpen = card.isOpen; // value from DB (start_time check)

    // 3. MAIN LOGIC
    let isAccessible = false;

    if (isDateOpen) {
      if (isUserPremium) {
        // User Premium = Buka Semua (t & f)
        isAccessible = true;
      } else {
        // User Free
        if (isTryoutPremium) {
          isAccessible = false; // Premium card (t) -> Ditutup
        } else {
          isAccessible = true; // Free card (f) -> Dibuka
        }
      }
    } else {
      // If date passed -> Always Ditutup
      isAccessible = false;
    }

    return (
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
        <div className="flex items-start gap-2 sm:gap-3">
          <img
            src={imageSrc || "/path/to/placeholder.svg"}
            alt={card.alt}
            className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[#012f72] mb-1 sm:mb-1.5">
              {card.title}
            </h3>
            <p className="text-xs text-gray-600 mb-1.5 sm:mb-2">
              Masa aktif: {card.activeDate}
            </p>
            {/* Show Premium Label if tryout is premium */}
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

          <button
            disabled={!isAccessible}
            className="flex-shrink-0 transition-opacity hover:opacity-80"
          >
            <img
              src={isAccessible ? dibukaIcon : ditutupIcon}
              alt={isAccessible ? "dibuka" : "ditutup"}
              // UPDATED: w-20 (80px) and sm:w-24 (96px)
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
          <div className="flex justify-center items-center h-64">
            <p className="text-[#012f72] font-semibold">
              Memuat data tryout...
            </p>
          </div>
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
