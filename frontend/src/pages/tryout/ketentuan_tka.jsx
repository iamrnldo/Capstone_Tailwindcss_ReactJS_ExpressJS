import { useNavigate, useLocation } from "react-router-dom";

const KetentuanTkaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tryoutId = location.state?.tryoutId; // Mengambil ID dari halaman sebelumnya

  const handleStartExam = () => {
    // Navigasi ke halaman ujian dengan ID yang dibawa
    // Sesuaikan path ini dengan routing ujian Anda
    if (tryoutId) {
      navigate(`/tryout/exam/${tryoutId}`);
    } else {
      console.warn("Tryout ID not found");
      // navigate("/tryout"); // Fallback jika perlu
    }
  };

  return (
    <div className="bg-[#f0f5ff] min-h-screen mt-20">
      <main className="max-w-7xl mx-auto px-8 py-16 pt-[100px]">
        {" "}
        {/* Adjusted padding top */}
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-16">
          <h2 className="text-2xl font-bold text-center text-[#012f72] mb-12">
            Ketentuan Tryout TKA
          </h2>

          <div className="w-full h-px bg-gray-300 mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-5xl mx-auto">
            {/* Rule 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#f58610] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">1</span>
              </div>
              <p className="text-base text-gray-800 pt-3">
                Peserta wajib menyelesaikan soal sesuai durasi yang ditentukan.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#f58610] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">4</span>
              </div>
              <p className="text-base text-gray-800 pt-3">
                Hasil dan analisis skor akan muncul setelah tryout selesai.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#f58610] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">2</span>
              </div>
              <p className="text-base text-gray-800 pt-3">
                Timer akan berjalan otomatis sejak tryout dimulai.
              </p>
            </div>

            {/* Rule 5 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#f58610] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">5</span>
              </div>
              <p className="text-base text-gray-800 pt-3">
                Total Pengerjaan adalah 90 menit.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#f58610] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">3</span>
              </div>
              <p className="text-base text-gray-800 pt-3">
                Jawaban yang belum disimpan saat waktu habis akan dianggap
                kosong.
              </p>
            </div>

            {/* Rule 6 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-[#f58610] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">6</span>
              </div>
              <p className="text-base text-gray-800 pt-3">
                Jumlah Soal yang diujikan adalah 60 soal.
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-16">
            <button
              onClick={handleStartExam}
              className="bg-[#012f72] hover:bg-[#024098] text-white font-semibold px-12 py-4 rounded-full flex items-center gap-3 transition-colors shadow-lg"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Mulai Kerjakan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KetentuanTkaPage;
