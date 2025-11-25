// src/pages/index.jsx
import { useState, useRef, useEffect } from "react";
import React from "react";
import element1 from "@/assets/element/element1.png";
import jet from "@/assets/element/jet.png";
import hero1 from "@/assets/hero/hero1.png";
import logo1 from "@/assets/logo/logo1.png";

// Make app layout & pages for structure


const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Navigation */}
      <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/">
                <img className="h-10 w-auto" src={logo1} alt="Logo" />
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-neutral-400 hover:text-sky-900 text-lg font-bold transition-colors duration-200"
              >
                Beranda
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-sky-900 text-lg font-bold transition-colors duration-200"
              >
                Fitur
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-sky-900 text-lg font-bold transition-colors duration-200"
              >
                Testimoni
              </a>
            </div>

            {/* Get Started Button (always visible) */}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-700 to-purple-500 rounded-2xl flex items-center gap-2 hover:opacity-90 transition-opacity duration-200 text-sm md:text-base md:px-5 md:py-2.5 md:gap-4">
                <span className="text-white font-medium md:text-xl">
                  Get Started
                </span>
                <img
                  className="w-4 h-4 md:w-5 md:h-5"
                  src={jet}
                  alt="Jet Icon"
                />
              </button>

              {/* Hamburger Button (Mobile only) - Animated */}
              <button
                ref={buttonRef}
                className="md:hidden text-sky-900 w-6 h-6 flex flex-col justify-center items-center"
                onClick={toggleMenu}
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-sky-900 transition-all duration-300 ${
                      isMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-full bg-sky-900 transition-all duration-300 ${
                      isMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-full bg-sky-900 transition-all duration-300 ${
                      isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu with Animation (only links, since button is always visible) */}
          <div
            ref={menuRef}
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-4 py-4 bg-white shadow-lg border-t border-gray-200">
              <a
                href="#"
                className="text-neutral-400 hover:text-sky-900 text-lg font-bold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Beranda
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-sky-900 text-lg font-bold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Fitur
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-sky-900 text-lg font-bold transition-colors duration-200"
                onClick={toggleMenu}
              >
                Testimoni
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-sky-100 rounded-full">
              <div className="w-5 h-5 bg-blue-700 rounded"></div>
              <span className="text-blue-700 text-sm">
                Platform Edukasi #1 untuk Siswa SMA
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-zinc-800">Raih Prestasi </span>
              <span className="text-blue-700">Terbaikmu</span>
            </h1>

            <p className="text-zinc-800 text-lg lg:text-xl">
              Belajar dengan metode interaktif, tutor berpengalaman, dan materi
              lengkap untuk semua mata pelajaran SMA. Mulai perjalanan suksesmu
              sekarang!
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="text-indigo-500 text-3xl lg:text-4xl font-semibold">
                  15K+
                </div>
                <div className="text-zinc-600 text-sm lg:text-base">
                  Siswa Aktif
                </div>
              </div>
              <div className="w-px h-12 bg-neutral-400"></div>
              <div className="flex flex-col items-center">
                <div className="text-indigo-500 text-3xl lg:text-4xl font-semibold">
                  500+
                </div>
                <div className="text-zinc-600 text-sm lg:text-base">
                  Video Pembelajaran
                </div>
              </div>
              <div className="w-px h-12 bg-neutral-400"></div>
              <div className="flex flex-col items-center">
                <div className="text-indigo-500 text-3xl lg:text-4xl font-semibold">
                  4.9⭐
                </div>
                <div className="text-zinc-600 text-sm lg:text-base">
                  Rating Pengguna
                </div>
              </div>
            </div>

            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-500 rounded-2xl flex items-center justify-center gap-4 hover:opacity-90 transition">
              <span className="text-white text-xl font-medium">
                Mulai Belajar Gratis
              </span>
              <div className="w-5 h-5 border-2 border-white rounded"></div>
            </button>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md">
              <img
                className="w-full h-auto rounded-[250px] border border-gray-300"
                src={hero1}
                alt="Student"
              />
              <div className="absolute -top-8 -right-8 px-14 py-4 bg-yellow-300 rounded-2xl transform rotate-[-11deg] shadow-lg">
                <img className="w-10 h-12" src={element1} alt="Element1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Mata Pelajaran Populer
          </h2>
          <p className="text-lg text-black">
            Pilih mata pelajaran yang ingin kamu kuasai
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-[20px] border border-zinc-600 p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-5 mb-6">
              <img
                className="w-16 h-16 rounded-[10px]"
                src="https://placehold.co/70x70"
                alt="Kimia"
              />
              <h3 className="text-2xl font-medium">Kimia</h3>
            </div>
            <p className="text-sm mb-8">
              Mempelajari reaksi, zat, dan perubahan materi yang terjadi di
              sekitar kita.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline"
            >
              <span>Lihat Materi</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>

          <div className="bg-white rounded-[20px] border border-zinc-600 p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-5 mb-6">
              <img
                className="w-16 h-16 rounded-[10px]"
                src="https://placehold.co/70x70"
                alt="Biologi"
              />
              <h3 className="text-2xl font-medium">Biologi</h3>
            </div>
            <p className="text-sm mb-8">
              Mengenali sistem tubuh, sel, dan berbagai proses biologis.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline"
            >
              <span>Lihat Materi</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>

          <div className="bg-white rounded-[20px] border border-zinc-600 p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-5 mb-6">
              <img
                className="w-16 h-16 rounded-[10px]"
                src="https://placehold.co/70x70"
                alt="Bahasa Inggris"
              />
              <h3 className="text-2xl font-medium">Bahasa Inggris</h3>
            </div>
            <p className="text-sm mb-8">
              Meningkatkan grammar, vocabulary, dan kemampuan membaca.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline"
            >
              <span>Lihat Materi</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>

          <div className="bg-white rounded-[20px] border border-zinc-600 p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-5 mb-6">
              <img
                className="w-16 h-16 rounded-[10px]"
                src="https://placehold.co/70x70"
                alt="Ekonomi"
              />
              <h3 className="text-2xl font-medium">Ekonomi</h3>
            </div>
            <p className="text-sm mb-8">
              Mempelajari konsep kebutuhan, permintaan, dan dasar-dasar ekonomi
              modern.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline"
            >
              <span>Lihat Materi</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>

          <div className="bg-white rounded-[20px] border border-zinc-600 p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-5 mb-6">
              <img
                className="w-16 h-16 rounded-[10px]"
                src="https://placehold.co/70x70"
                alt="Geografi"
              />
              <h3 className="text-2xl font-medium">Geografi</h3>
            </div>
            <p className="text-sm mb-8">
              Mengenal bumi, lingkungan, peta, dan fenomena alam di sekitar
              kita.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline"
            >
              <span>Lihat Materi</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>

          <div className="bg-white rounded-[20px] border border-zinc-600 p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-5 mb-6">
              <img
                className="w-16 h-16 rounded-[10px]"
                src="https://placehold.co/70x70"
                alt="Sejarah"
              />
              <h3 className="text-2xl font-medium">Sejarah</h3>
            </div>
            <p className="text-sm mb-8">
              Memahami perjalanan bangsa, peristiwa penting, dan cerita masa
              lalu.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline"
            >
              <span>Lihat Materi</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-black mb-4">
              Mengapa Memilih Belajar di EduSukses?
            </h2>
            <p className="text-lg text-black">
              Fitur unggulan yang membantu kesuksesan belajarmu
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-indigo-50 rounded-[20px] p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500 rounded-[20px] mb-8">
                <div className="w-14 h-10 bg-white rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-4">
                Belajar Nyaman dan Fleksibel
              </h3>
              <p className="text-base text-black">
                Siswa SMA dapat mengakses materi kapan saja dengan jadwal yang
                fleksibel, sehingga belajar tidak terbatas oleh waktu maupun
                tempat.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-[20px] p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500 rounded-[20px] mb-8">
                <div className="w-14 h-11 bg-white rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-4">
                Guru Profesional dan Kompeten
              </h3>
              <p className="text-base text-black">
                Pengajar berpengalaman siap menciptakan lingkungan belajar
                kondusif dengan materi berkualitas yang dirancang khusus untuk
                mendukung persiapan kuliah dan karier masa depan.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-indigo-50 rounded-[20px] p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500 rounded-[20px] mb-8">
                <div className="w-14 h-11 bg-white rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-4">
                Metode Pembelajaran Interaktif
              </h3>
              <p className="text-base text-black">
                EduSukses menghadirkan video materi, diskusi real-time, dan
                modul terpersonalisasi yang membuat proses belajar lebih menarik
                serta relevan dengan kebutuhan siswa SMA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-sky-900 mb-8">
              EduSukses
            </h2>
            <div className="bg-indigo-100 rounded-lg p-8">
              <p className="text-lg text-black">
                EduSukses adalah platform pendidikan digital yang berfokus pada
                siswa SMA. Kami hadir untuk mendukung generasi muda Indonesia
                dalam mempersiapkan diri menghadapi dunia perkuliahan dan karier
                dengan bekal keterampilan akademik, soft skills, serta
                pengalaman belajar yang relevan dengan kebutuhan masa depan.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              className="w-80 h-80 object-contain"
              src="https://placehold.co/336x322"
              alt="About"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Kata Mereka Tentang EduSukses
          </h2>
          <p className="text-lg text-black">
            Testimoni dari siswa yang sudah merasakan manfaatnya
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-[20px] border border-neutral-400 p-8">
            <div className="flex items-start gap-6 mb-6">
              <img
                className="w-16 h-16 rounded-full"
                src="https://placehold.co/70x70"
                alt="Rani"
              />
              <div>
                <h4 className="text-xl font-semibold text-blue-700">Rani</h4>
                <p className="text-neutral-400">Kelas 12</p>
              </div>
            </div>
            <p className="text-base text-black">
              "Belajar di EduSukses membuat saya lebih mudah memahami materi
              yang sulit. Kelas interaktifnya membantu saya berani bertanya dan
              berdiskusi langsung dengan guru. Sekarang saya lebih siap
              menghadapi ujian akhir dan seleksi masuk kuliah."
            </p>
          </div>

          <div className="bg-white rounded-[20px] border border-neutral-400 p-8">
            <div className="flex items-start gap-6 mb-6">
              <img
                className="w-16 h-16 rounded-full"
                src="https://placehold.co/70x70"
                alt="Sehan"
              />
              <div>
                <h4 className="text-xl font-semibold text-blue-700">Sehan</h4>
                <p className="text-neutral-400">Kelas 11</p>
              </div>
            </div>
            <p className="text-base text-black">
              "Saat SMA, saya menggunakan EduSukses untuk mempersiapkan ujian
              masuk perguruan tinggi. Modul terpersonalisasi dan asesmen yang
              jelas membuat saya bisa memilih jurusan sesuai minat. Kini saya
              kuliah di kampus impian berkat dukungan EduSukses."
            </p>
          </div>

          <div className="bg-white rounded-[20px] border border-neutral-400 p-8">
            <div className="flex items-start gap-6 mb-6">
              <img
                className="w-16 h-16 rounded-full"
                src="https://placehold.co/70x70"
                alt="Alicia"
              />
              <div>
                <h4 className="text-xl font-semibold text-blue-700">Alicia</h4>
                <p className="text-neutral-400">Kelas 11</p>
              </div>
            </div>
            <p className="text-base text-black">
              "EduSukses membantu saya menemukan jurusan yang tepat melalui
              asesmen karier. Materinya tidak hanya akademik, tapi juga melatih
              soft skills seperti komunikasi dan problem solving. Pengalaman
              belajar di EduSukses benar-benar mendukung perjalanan saya menuju
              dunia perkuliahan."
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              className="w-full max-w-md h-auto"
              src="https://placehold.co/500x500"
              alt="FAQ"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-black mb-8">
              Pertanyaan Umum (FAQ)
            </h2>
            <div className="space-y-4">
              <details className="bg-blue-100 border-t border-b border-blue-300 rounded-[56px] p-5 group">
                <summary className="flex justify-between items-center cursor-pointer text-lg font-medium">
                  <span>Apa tujuan aplikasi ini?</span>
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </summary>
                <p className="mt-4 text-base">
                  Platform ini dirancang untuk membantu siswa SMA belajar lebih
                  efektif dengan materi lengkap dan metode interaktif.
                </p>
              </details>

              <details className="bg-blue-100 border-t border-b border-blue-300 rounded-[56px] p-5 group">
                <summary className="flex justify-between items-center cursor-pointer text-lg font-medium">
                  <span>Bagaimana cara belajar di EduSukses?</span>
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </summary>
                <p className="mt-4 text-base">
                  Daftar akun, pilih mata pelajaran, dan mulai belajar dengan
                  video, kuis, dan diskusi interaktif.
                </p>
              </details>

              <details className="bg-blue-100 border-t border-b border-blue-300 rounded-[56px] p-5 group">
                <summary className="flex justify-between items-center cursor-pointer text-lg font-medium">
                  <span>Apakah EduSukses membantu persiapan kuliah?</span>
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </summary>
                <p className="mt-4 text-base">
                  Ya, kami menyediakan materi persiapan ujian masuk perguruan
                  tinggi dan asesmen karier.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
            <div className="text-center md:text-left">
              <img
                className="w-36 h-24 mx-auto md:mx-0 mb-4"
                src="https://placehold.co/140x98"
                alt="Logo"
              />
              <h3 className="text-3xl font-bold">EduSukses</h3>
              <p className="mt-4">Belajar Fleksibel, Prestasi Maksimal</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Pengguna</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Kelas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Try Out
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Tentang Kami</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Media Sosial</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full hover:opacity-80 transition"
                ></a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full hover:opacity-80 transition"
                ></a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full hover:opacity-80 transition"
                ></a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full hover:opacity-80 transition"
                ></a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-8 text-center">
            <p>© 2025 EduSukses. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
