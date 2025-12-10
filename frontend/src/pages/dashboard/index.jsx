/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useContext, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import hero2 from "../../assets/hero/hero2.png";
import programlinear1 from "@/assets/element/programlinier1.svg"; 
import programlinear from "@/assets/element/programlinear.svg"; 
import suratlamarankerja from "@/assets/element/suratlamarankerja.svg"; 
import dimensi3vector from "@/assets/element/dimensi3vector.svg"; 
import matriks from "@/assets/element/matriks.svg"; 
import dimensi3 from "@/assets/element/dimensi3.svg"; 
import matematikapeminatan from "@/assets/element/Matematika Peminatan.svg"; 
import matematikawajib from "@/assets/element/Matematika Wajib.svg"; 
import bhindo from "@/assets/element/Bahasa Indonesia.svg"; 
import binggris from "@/assets/element/binggris.svg"; 
import Fisika from "@/assets/element/Fisika.svg"; 
import Kimia from "@/assets/element/Kimia.svg"; 
import Biologi from "@/assets/element/Biologi.svg"; 
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading, loginWithToken } = useContext(AuthContext);

  // Use ref to prevent multiple token processing
  const tokenProcessed = useRef(false);
  const [processingToken, setProcessingToken] = useState(false);

  // Handle Google OAuth token from URL - runs only once
  useEffect(() => {
    const token = searchParams.get("token");

    // Only process if token exists and hasn't been processed yet
    if (token && !tokenProcessed.current) {
      tokenProcessed.current = true; // Mark as processed immediately
      setProcessingToken(true);

      console.log("Processing token from URL...");

      // Clear token from URL first
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("token");
      setSearchParams({}, { replace: true });

      // Process the token
      loginWithToken(token)
        .then((result) => {
          console.log("Token processing result:", result);
          setProcessingToken(false);

          if (!result.success) {
            console.error("Failed to login with token");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Token processing error:", error);
          setProcessingToken(false);
          navigate("/login");
        });
    }
  }, [loginWithToken, navigate, searchParams, setSearchParams]);

  // Redirect to login if not authenticated (after initial load)
  useEffect(() => {
    const token = searchParams.get("token");

    // Don't redirect if:
    // 1. Still loading
    // 2. Still processing token
    // 3. There's a token in URL (being processed)
    if (!loading && !processingToken && !token && !user) {
      console.log("No user, redirecting to login");
      navigate("/login");
    }
  }, [user, loading, processingToken, navigate, searchParams]);

  // Show loading state
  if (loading || processingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {processingToken ? "Memproses login..." : "Memuat..."}
          </p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 mt-2 bg-[#f3f7ff]">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-[#99c2ff] via-[#b190ff] to-[#e6a6ff] w-full min-h-[400px] px-4 sm:px-10 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-[#012f72] z-10">
            <p className="text-sm mb-1">Halo, {user.name} :)</p>
            <h1 className="text-3xl font-semibold mb-6">
              Mau belajar apa hari ini?
            </h1>

            <div className="flex gap-4">
              <select className="px-4 py-2 rounded-md bg-white shadow text-sm " disabled>
                <option>12</option>
                <option>11</option>
                <option>10</option>
              </select>
              <select className="px-4 py-2 rounded-md bg-white shadow text-sm " disabled>
                <option>IPA</option>
                <option>IPS</option>
              </select>
            </div>
          </div>

          <img
            src={hero2}
            alt="Hero Illustration"
            className="w-[420px] mr-12  hidden lg:block"
          />
        </div>
      </section>

      {/* MATA PELAJARAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 -mt-32 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="font-semibold mb-6 text-lg">Mata Pelajaran</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 text-sm">
            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <img
                src={matematikapeminatan}
                alt="Matematika Peminatan"
                className="w-12"
              />
              <p className="font-medium text-center">Matematika Peminatan</p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <img
                src={matematikawajib}
                alt="Matematika Wajib"
                className="w-12"
              />
              <p className="font-medium text-center">Matematika Wajib</p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <img src={binggris} alt="Bahasa Inggris" className="w-12" />
              <p className="font-medium text-center">Bahasa Inggris</p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <img src={bhindo} alt="Bahasa Indonesia" className="w-12" />
              <p className="font-medium text-center">Bahasa Indonesia</p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <img src={Fisika} alt="Fisika" className="w-12" />
              <p className="font-medium text-center">Fisika</p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <img src={Kimia} alt="Kimia" className="w-12" />
              <p className="font-medium text-center">Kimia</p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <img src={Biologi} alt="Biologi" className="w-12" />
              <p className="font-medium text-center">Biologi</p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow cursor-pointer">
              <div className="grid grid-cols-2 gap-1">
                <span className="w-3 h-3 bg-gray-400 rounded"></span>
                <span className="w-3 h-3 bg-gray-300 rounded"></span>
                <span className="w-3 h-3 bg-gray-300 rounded"></span>
                <span className="w-3 h-3 bg-gray-200 rounded"></span>
              </div>
              <p className="font-medium text-center">Semua Mapel</p>
            </div>
          </div>
        </div>
      </section>

      {/* REKOMENDASI BELAJAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 mt-16">
        <h2 className="font-bold text-xl sm:text-2xl mb-6 text-gray-900">
          Rekomendasi Belajar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer">
            <img
              src={programlinear}
              alt="Program Linear"
              className="h-38 w-full object-cover"
            />
            <div className="p-5 pb-4">
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                Optimasi
              </span>
              <h3 className="font-semibold text-base mt-3 text-gray-900">
                Program Linear
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-1"></span>
                  <span>Pak Nathan</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-400 mr-1"></span>
                  <span>30 Menit</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer">
            <img
              src={suratlamarankerja}
              alt="Surat Lamaran Kerja"
              className="h-38 w-full object-cover"
            />
            <div className="p-5 pb-4">
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                Surat Resmi
              </span>
              <h3 className="font-semibold text-base mt-3 text-gray-900">
                Surat Lamaran Kerja
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-1"></span>
                  <span>Pak Hahan</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-400 mr-1"></span>
                  <span>30 Menit</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 3 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer">
            <img
              src={dimensi3}
              alt="Dimensi Tiga"
              className="h-38 w-full object-cover"
            />
            <div className="p-5 pb-4">
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                Kalkulus
              </span>
              <h3 className="font-semibold text-base mt-3 text-gray-900">
                Dimensi Tiga
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-1"></span>
                  <span>Pak Nathan</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-400 mr-1"></span>
                  <span>30 Menit</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 4 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer">
            <img
              src={dimensi3vector}
              alt="Vektor dalam Ruang Dimensi Tiga"
              className="h-38 w-full object-cover"
            />
            <div className="p-5 pb-4">
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                Aljabar
              </span>
              <h3 className="font-semibold text-base mt-3 text-gray-900">
                Vektor dalam Ruang Dimensi Tiga
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-1"></span>
                  <span>Bu Cia</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-400 mr-1"></span>
                  <span>30 Menit</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 5 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer">
            <img
              src={matriks}
              alt="Matriks dan Transformasi Linear"
              className="h-38 w-full object-cover"
            />
            <div className="p-5 pb-4">
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                Aljabar Linear
              </span>
              <h3 className="font-semibold text-base mt-3 text-gray-900">
                Matriks dan Transformasi Linear
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-1"></span>
                  <span>Bu Atika</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-400 mr-1"></span>
                  <span>40 Menit</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 6 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer">
            <img
              src={programlinear1}
              alt="Program Linear"
              className="h-38 w-full object-cover"
            />
            <div className="p-5 pb-4">
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
                Optimasi
              </span>
              <h3 className="font-semibold text-base mt-3 text-gray-900">
                Program Linear
              </h3>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-1"></span>
                  <span>Bu Dilla</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full border border-gray-400 mr-1"></span>
                  <span>15 Menit</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* REKOMENDASI LATIHAN SOAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 mt-16 mb-20">
        <h2 className="font-bold text-xl sm:text-2xl mb-6 text-gray-900">
          Rekomendasi Latihan Soal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-500 text-white text-xs font-semibold">
              Matematika Peminatan
            </div>

            <h3 className="mt-4 font-semibold text-sm sm:text-base text-gray-900">
              Persamaan &amp; Pertidaksamaan Lingkaran
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
                <span>📝</span>
                <span>30 Soal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                <span>✔</span>
                <span>Mudah</span>
              </span>
            </div>

            <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors">
              <span>Pilih</span>
              <span className="text-xs">↗</span>
            </button>
          </article>

          {/* Card 2 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold">
              Matematika Wajib
            </div>

            <h3 className="mt-4 font-semibold text-sm sm:text-base text-gray-900">
              Perbandingan Trigonometri pada Segitiga
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
                <span>📝</span>
                <span>30 Soal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                <span>✔</span>
                <span>Mudah</span>
              </span>
            </div>

            <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors">
              <span>Pilih</span>
              <span className="text-xs">↗</span>
            </button>
          </article>

          {/* Card 3 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-rose-400 text-white text-xs font-semibold">
              Bahasa Indonesia
            </div>

            <h3 className="mt-4 font-semibold text-sm sm:text-base text-gray-900">
              Menganalisis Teks Editorial
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
                <span>📝</span>
                <span>30 Soal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                <span>✔</span>
                <span>Mudah</span>
              </span>
            </div>

            <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors">
              <span>Pilih</span>
              <span className="text-xs">↗</span>
            </button>
          </article>

          {/* Card 4 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold">
              Biologi
            </div>

            <h3 className="mt-4 font-semibold text-sm sm:text-base text-gray-900">
              Genetika: Persilangan &amp; Pewarisan
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
                <span>📝</span>
                <span>30 Soal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                <span>✔</span>
                <span>Mudah</span>
              </span>
            </div>

            <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors">
              <span>Pilih</span>
              <span className="text-xs">↗</span>
            </button>
          </article>

          {/* Card 5 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-400 text-white text-xs font-semibold">
              Fisika
            </div>

            <h3 className="mt-4 font-semibold text-sm sm:text-base text-gray-900">
              Fluida Dinamis &amp; Statika Fluida
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
                <span>📝</span>
                <span>30 Soal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                <span>✔</span>
                <span>Mudah</span>
              </span>
            </div>

            <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors">
              <span>Pilih</span>
              <span className="text-xs">↗</span>
            </button>
          </article>

          {/* Card 6 */}
          <article className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 px-6 pt-5 pb-6 cursor-pointer">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-pink-400 text-white text-xs font-semibold">
              Bahasa Inggris
            </div>

            <h3 className="mt-4 font-semibold text-sm sm:text-base text-gray-900">
              Reading Comprehension – Narrative Text
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-300 text-blue-700 bg-blue-50">
                <span>📝</span>
                <span>30 Soal</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                <span>✔</span>
                <span>Mudah</span>
              </span>
            </div>

            <button className="mt-6 w-full bg-[#012f72] text-white text-sm font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#01244d] transition-colors">
              <span>Pilih</span>
              <span className="text-xs">↗</span>
            </button>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
