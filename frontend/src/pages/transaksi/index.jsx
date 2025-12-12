import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// =========================================
// IMPORT ASSETS
// =========================================
// Pastikan file sudah di-rename jadi "qris.svg" di folder assets/element
import qrisImage from "../../assets/element/qris.svg";
import illustrationImage from "../../assets/element/illustration.svg";

const TransaksiPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { paketName, price } = location.state || {
    paketName: "Paket Belum Dipilih",
    price: 0,
  };

  const [timeLeft, setTimeLeft] = useState(861); // 14 menit 21 detik
  const [deadlineStr, setDeadlineStr] = useState("");

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    const now = new Date();
    const deadlineDate = new Date(now.getTime() + timeLeft * 1000);

    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const dayName = days[deadlineDate.getDay()];
    const day = deadlineDate.getDate();
    const month = months[deadlineDate.getMonth()];
    const year = deadlineDate.getFullYear();
    const hours = String(deadlineDate.getHours()).padStart(2, "0");
    const minutes = String(deadlineDate.getMinutes()).padStart(2, "0");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeadlineStr(
      `${dayName}, ${day} ${month} ${year} pukul ${hours}.${minutes} WIB`
    );

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimeDisplay = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#f0f5ff] min-h-screen">
      <main className="pt-[85px]">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-1  font-semibold mb-8 text-sm sm:text-base">
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
            <span
              onClick={() => navigate("/choose-paket")}
              className="text-gray-700 cursor-pointer hover:text-[#012f72]"
            >
              Pilih Paket
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-[#f58610]">Transaksi</span>
          </nav>

          {/* Payment Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="mb-6 px-4 py-2 bg-blue-50 text-[#012f72] rounded-lg font-medium text-sm text-center">
                Anda akan membeli: <br className="sm:hidden" />
                <strong className="text-lg">{paketName}</strong>
              </div>

              {/* Timer */}
              <div className="text-center mb-8">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  Selesaikan pembayaran dalam
                </p>
                <div
                  className={`text-4xl font-bold mb-4 tracking-wider ${
                    timeLeft < 300
                      ? "text-red-600 animate-pulse"
                      : "text-[#012f72]"
                  }`}
                >
                  {formatTimeDisplay(timeLeft)}
                </div>
                <p className="text-sm text-gray-500">Batas akhir pembayaran</p>
                <p className="text-base font-semibold text-gray-800">
                  {deadlineStr || "Memuat..."}
                </p>
              </div>

              {/* QRIS Code Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-xl mb-6 w-full max-w-md flex justify-center">
                <div className="w-[280px] h-[280px] bg-white p-4 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden">
                  {/* TAMPILKAN GAMBAR QRIS */}
                  <img
                    src={qrisImage}
                    alt="QRIS Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Total & Button */}
              <div className="text-center w-full">
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  Total Bayar:{" "}
                  <span className="text-[#f58610]">{formatRupiah(price)}</span>
                </p>
                <button
                  onClick={() => alert("Fitur unduh QRIS sedang diproses...")}
                  className="bg-[#012f72] hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto w-full sm:w-auto shadow-md hover:shadow-lg"
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
                    ></path>
                  </svg>
                  <span>UNDUH QRIS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instructions & Illustration */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#012f72] mb-2">
                  Cara Pembayaran
                </h2>
                <p className="text-gray-600 text-sm">
                  Ikuti langkah berikut untuk menyelesaikan pembayaran:
                </p>
              </div>
              <div className="space-y-5">
                {[
                  "Buka aplikasi bank atau e-wallet (GoPay, OVO, Dana).",
                  "Pilih menu Bayar / Scan QRIS.",
                  "Scan kode QR di atas.",
                  "Periksa nama penerima dan total tagihan.",
                  "Masukkan PIN dan pembayaran selesai.",
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#012f72] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base pt-1 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
              <div className="text-center w-full">
                <div className="w-full aspect-square max-w-[320px] mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden shadow-inner p-6">
                  {/* TAMPILKAN ILUSTRASI */}
                  <img
                    src={illustrationImage}
                    alt="Ilustrasi Pembayaran"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  Pembayaran mudah, cepat, dan otomatis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransaksiPage;
