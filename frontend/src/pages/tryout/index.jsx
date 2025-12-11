/* eslint-disable react-hooks/static-components */
import { useState } from "react";

// TKA SVG imports
import toTka1Bindo from "@/assets/element/to tka 1 bindo.svg";
import toTka1Ipa from "@/assets/element/to tka 1 ipa.svg";
import toTka1Mtk from "@/assets/element/to tka 1 mtk.svg";
import toTka2Bindo from "@/assets/element/to tka 2 bindo.svg";
import toTka2Ipa from "@/assets/element/to tka 2 ipa.svg";
import toTka2Mtk from "@/assets/element/to tka 2 mtk.svg";

// UTBK SVG imports
import toUtbk1PenalaranUmum from "@/assets/element/TO UTBK 1 penalaran umum.svg";
import toUtbk1LiterasiBindo from "@/assets/element/TO UTBK 1 literasi bahasa indo.svg";
import toUtbk1LiterasiBing from "@/assets/element/TO UTBK 1 literasi bing.svg";
import toUtbk1Mtk from "@/assets/element/TO UTBK 1 mtk.svg";
import toUtbk2PenalaranUmum from "@/assets/element/TO UTBK 2 penalaran umum.svg";
import toUtbk2LiterasiBin from "@/assets/element/TO UTBK 2 literasi bin.svg";
import toUtbk2Mtk from "@/assets/element/TO UTBK 2 mtk.svg";
import toUtbk2LiterasiBing from "@/assets/element/TO UTBK 2 literasi bing.svg";

// Common SVG imports
import premiumIcon from "@/assets/element/premium.svg";
import dibukaIcon from "@/assets/element/dibuka.svg";
import ditutupIcon from "@/assets/element/ditutup.svg";

const TryoutPage = () => {
  const [activeTab, setActiveTab] = useState("tka");

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // TKA Data
  const tkaData = {
    section1: {
      title: "TO TKA 1 SMA",
      cards: [
        {
          id: 1,
          title: "TO TKA Bahasa Indonesia",
          image: toTka1Bindo,
          alt: "bindo tka 1",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: true,
        },
        {
          id: 2,
          title: "TO TKA IPA",
          image: toTka1Ipa,
          alt: "ipa tka 1",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 3,
          title: "TO TKA Matematika",
          image: toTka1Mtk,
          alt: "mtk tka 1",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: false,
        },
      ],
    },
    section2: {
      title: "TO TKA 2 SMA",
      cards: [
        {
          id: 4,
          title: "TO TKA Bahasa Indonesia",
          image: toTka2Bindo,
          alt: "bindo tka 2",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 5,
          title: "TO TKA IPA",
          image: toTka2Ipa,
          alt: "ipa tka 2",
          activeDate: "03 Oktober 2025 - 17 Oktober 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 6,
          title: "TO TKA Matematika",
          image: toTka2Mtk,
          alt: "mtk tka 2",
          activeDate: "03 November 2025 - 17 November 2025",
          isPremium: true,
          isOpen: false,
        },
      ],
    },
  };

  // UTBK Data
  const utbkData = {
    section1: {
      title: "TO UTBK 1 SMA",
      cards: [
        {
          id: 1,
          title: "TO UTBK Penalaran Umum",
          image: toUtbk1PenalaranUmum,
          alt: "penalaran umum utbk 1",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: true,
        },
        {
          id: 2,
          title: "TO UTBK Literasi Bahasa Indonesia",
          image: toUtbk1LiterasiBindo,
          alt: "literasi bahasa indo utbk 1",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 3,
          title: "TO UTBK Literasi Bahasa Inggris",
          image: toUtbk1LiterasiBing,
          alt: "Literasi Bahasa Inggris utbk 1",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 4,
          title: "TO UTBK Matematika",
          image: toUtbk1Mtk,
          alt: "Matematika utbk 1",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: false,
        },
      ],
    },
    section2: {
      title: "TO UTBK 2 SMA",
      cards: [
        {
          id: 5,
          title: "TO UTBK Penalaran Umum",
          image: toUtbk2PenalaranUmum,
          alt: "penalaran umum utbk 2",
          activeDate: "03 September 2025 - 17 September 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 6,
          title: "TO UTBK Literasi Bahasa Indonesia",
          image: toUtbk2LiterasiBin,
          alt: "Literasi Bahasa Indonesia utbk 2",
          activeDate: "03 Oktober 2025 - 17 Oktober 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 7,
          title: "TO UTBK Matematika",
          image: toUtbk2Mtk,
          alt: "Matematika utbk 2",
          activeDate: "03 November 2025 - 17 November 2025",
          isPremium: true,
          isOpen: false,
        },
        {
          id: 8,
          title: "TO UTBK Literasi Bahasa Inggris",
          image: toUtbk2LiterasiBing,
          alt: "Literasi Bahasa Inggris utbk 2",
          activeDate: "03 November 2025 - 17 November 2025",
          isPremium: true,
          isOpen: false,
        },
      ],
    },
  };

  // Card Component
  const TryoutCard = ({ card }) => (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
      <div className="flex items-start gap-2 sm:gap-3">
        <img
          src={card.image}
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
          className={`${
            card.isOpen
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#F54210] hover:bg-orange-600"
          } text-white px-3 sm:px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 sm:gap-1.5 flex-shrink-0 transition-colors`}
        >
          <img
            src={card.isOpen ? dibukaIcon : ditutupIcon}
            alt={card.isOpen ? "dibuka" : "ditutup"}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          />
          <span className="hidden sm:inline">
            {card.isOpen ? "Dibuka" : "Ditutup"}
          </span>
        </button>
      </div>
    </div>
  );

  // Section Component
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

  const currentData = activeTab === "tka" ? tkaData : utbkData;

  return (
    <div className="bg-[#f0f5ff] min-h-screen pt-16 mt-4 sm:pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex items-center text-xs sm:text-sm">
          <span className="text-gray-600 font-bold">Beranda/</span>
          <span className="text-[#f58610] ml-1 font-bold">
            {activeTab === "tka" ? "TryOut TKA" : "TryOut UTBK"}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <TryoutSection
          title={currentData.section1.title}
          cards={currentData.section1.cards}
        />
        <TryoutSection
          title={currentData.section2.title}
          cards={currentData.section2.cards}
        />
      </main>
    </div>
  );
};

export default TryoutPage;
