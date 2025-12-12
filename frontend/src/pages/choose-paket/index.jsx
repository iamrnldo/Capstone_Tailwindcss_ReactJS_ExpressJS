import { useNavigate } from "react-router-dom";

const ChoosePaketPage = () => {
  const navigate = useNavigate();

  // Update fungsi ini
  const handlePurchase = (paketName, price) => {
    // Navigasi ke halaman transaksi sambil membawa data paket
    navigate("/transaksi", {
      state: {
        paketName: paketName,
        price: price,
      },
    });
  };

  return (
    <div className="bg-[#f0f5ff] min-h-screen">
      {/* Main Content */}
      <main className="pt-[85px]">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-1 text-base font-semibold mb-12">
            <span
              onClick={() => navigate("/dashboard")}
              className="text-gray-700 cursor-pointer hover:text-[#012f72]"
            >
              Beranda
            </span>
            <span className="text-gray-400">/</span>
            <span
              onClick={() => navigate("/tryout")}
              className="text-gray-700 cursor-pointer hover:text-[#012f72]"
            >
              TryOut TKA
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-[#f58610]">Transaksi</span>
          </nav>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Yuk gas lah, biar langsung belajar!
            </h2>
            <p className="text-lg font-semibold text-[#525252]">
              Pilihan Paket Berlangganan
            </p>
          </div>

          {/* Subscription Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Package 1 - 1 Bulan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                  <span className="mr-1">⚡</span> Paket 1 bulan
                </div>
                <div className="text-5xl font-bold text-[#012f72] mb-2">
                  Rp50.000
                </div>
                <p className="text-gray-600">per bulan</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700">
                    Akses penuh ke semua Tryout UTBK & TKA selama 30 hari
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700">
                    Analisis hasil tryout + laporan progres bulanan
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700">
                    Bonus: 1 sesi konsultasi online dengan mentor
                  </span>
                </li>
              </ul>
              <button
                onClick={() => handlePurchase("Paket 1 Bulan", 50000)}
                className="w-full bg-[#012f72] text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors duration-300"
              >
                Beli Sekarang
              </button>
            </div>

            {/* Package 2 - 3 Bulan (Highlighted) */}
            <div className="bg-gradient-to-br from-[#012f72] to-blue-600 rounded-2xl shadow-xl p-8 transform scale-105 relative border-2 border-[#f58610] z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#f58610] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                🔥 TERPOPULER
              </div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                  <span className="mr-1">🔥</span> Paket 3 bulan
                </div>
                <div className="text-5xl font-bold text-white mb-2">
                  Rp120.000
                </div>
                <p className="text-blue-100">Hemat Rp30.000!</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-white font-medium">
                    Akses penuh ke semua Tryout UTBK & TKA selama 90 hari
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-white font-medium">
                    Analisis hasil + laporan progres tiap bulan
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-white font-medium">
                    Bonus: 2 sesi konsultasi online dengan mentor
                  </span>
                </li>
              </ul>
              <button
                onClick={() => handlePurchase("Paket 3 Bulan", 120000)}
                className="w-full bg-[#f58610] text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-lg"
              >
                Beli Sekarang
              </button>
            </div>

            {/* Package 3 - 6 Bulan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-blue-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                  <span className="mr-1">⚡</span> Paket 6 bulan
                </div>
                <div className="text-5xl font-bold text-[#012f72] mb-2">
                  Rp200.000
                </div>
                <p className="text-green-600 font-semibold">Hemat Rp100.000!</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700">
                    Akses penuh ke semua Tryout UTBK & TKA selama 180 hari
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700">
                    Analisis hasil + laporan progres tiap bulan
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-gray-700">
                    Bonus: 2 sesi konsultasi online dengan mentor
                  </span>
                </li>
              </ul>
              <button
                onClick={() => handlePurchase("Paket 6 Bulan", 200000)}
                className="w-full bg-[#012f72] text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors duration-300"
              >
                Beli Sekarang
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
              <svg
                className="w-5 h-5 text-[#012f72]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                Pembayaran aman dengan QRIS
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChoosePaketPage;
