import hero1 from "@/assets/hero/hero1.png";

const Dashboard = () => {
  return (
    <>
      {/* Hero Section */}
      <section class="bg-gradient-to-l from-blue-500 via-fuchsia-300 to-blue-300 py-8">
        <div class="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div class="flex-1 space-y-6">
            <div class="space-y-4">
              <p class="text-white text-3xl font-medium">Hallo, Tania ;)</p>
              <h2 class="text-white text-5xl font-semibold">
                Siap lanjut belajar hari ini?
              </h2>
              <h3 class="text-white text-5xl font-semibold">
                Yuk mulai dari topik yang paling kamu butuh
              </h3>
            </div>
            <p class="text-zinc-900 text-xl">
              Temukan solusi lengkap untuk anak SMA berprestasi dengan kelas
              interaktif dan pendekatan kontekstual.
            </p>
            <button class="px-4 py-3.5 bg-sky-900 rounded-full text-white text-lg font-semibold">
              Belajar Sekarang
            </button>
          </div>
          <img
            class="w-full md:w-1/2 h-auto rounded-[250px]"
            src={hero1}
            alt="Hero Image"
          />
        </div>
      </section>
      {/* Rekomendasi Belajar  */}
      <section class="container mx-auto px-4 py-8">
        <h2 class="text-zinc-900 text-2xl font-semibold mb-6">
          Rekomendasi Belajar
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div class="rounded-2xl overflow-hidden flex flex-col">
            <div class="flex-1 bg-gray-200"></div> {/* Placeholder for image */}
            <div class="p-6 bg-zinc-900/75 text-slate-50 text-xl font-semibold">
              Mengenal arti fungsi, cara kerja relasi, dan contoh penerapannya.
            </div>
          </div>
          {/* Repeat for other 4 items */}
          <div class="rounded-2xl overflow-hidden flex flex-col">
            <div class="flex-1 bg-gray-200"></div>
            <div class="p-6 bg-zinc-900/75 text-slate-50 text-xl font-semibold">
              Mengenal arti fungsi, cara kerja relasi, dan contoh penerapannya.
            </div>
          </div>
          <div class="rounded-2xl overflow-hidden flex flex-col">
            <div class="flex-1 bg-gray-200"></div>
            <div class="p-6 bg-zinc-900/75 text-slate-50 text-xl font-semibold">
              Mengenal arti fungsi, cara kerja relasi, dan contoh penerapannya.
            </div>
          </div>
          <div class="rounded-2xl overflow-hidden flex flex-col">
            <div class="flex-1 bg-gray-200"></div>
            <div class="p-6 bg-zinc-900/75 text-slate-50 text-xl font-semibold">
              Mengenal arti fungsi, cara kerja relasi, dan contoh penerapannya.
            </div>
          </div>
          <div class="rounded-2xl overflow-hidden flex flex-col">
            <div class="flex-1 bg-gray-200"></div>
            <div class="p-6 bg-zinc-900/75 text-slate-50 text-xl font-semibold">
              Mengenal arti fungsi, cara kerja relasi, dan contoh penerapannya.
            </div>
          </div>
        </div>
      </section>

      {/* Latihan Soal */}
      <section class="container mx-auto px-4 py-8 space-y-8">
        <h2 class="text-zinc-900 text-2xl font-semibold">Latihan Soal</h2>
        {/* Each exercise card */}
        <div class="bg-amber-200 rounded-[50px] p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            class="w-full md:w-48 h-44 rounded-2xl"
            src="https://placehold.co/193x176"
            alt="Fungsi"
          />
          <div class="flex-1 space-y-4">
            <h3 class="text-sky-900 text-3xl font-semibold">Fungsi</h3>
            <p class="text-zinc-900 text-xl font-semibold">
              Mengenal konsep fungsi, domain, range, dan contoh penerapannya
              dalam soal.
            </p>
            <div class="flex gap-8">
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-sky-900 rounded-full"></div>
                <span class="text-zinc-900 text-xl">10 Soal</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-sky-900 rounded-full"></div>
                <span class="text-zinc-900 text-xl">Estimasi 30 Menit</span>
              </div>
            </div>
            <button class="px-4 py-2.5 bg-sky-900 rounded-full text-slate-50 text-lg font-semibold">
              Coba Sekarang
            </button>
          </div>
        </div>
        {/* Repeat for other two */}
        <div class="bg-amber-200 rounded-[50px] p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            class="w-full md:w-60 h-44 rounded-2xl"
            src="https://placehold.co/245x176"
            alt="Descriptive Text"
          />
          <div class="flex-1 space-y-4">
            <h3 class="text-sky-900 text-3xl font-semibold">
              Descriptive Text
            </h3>
            <p class="text-zinc-900 text-xl font-semibold">
              Mengenal grammar, vocabulary, reading, writing dan contoh
              penerapannya dalam soal.
            </p>
            <div class="flex gap-8">
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-sky-900 rounded-full"></div>
                <span class="text-zinc-900 text-xl">10 Soal</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-sky-900 rounded-full"></div>
                <span class="text-zinc-900 text-xl">Estimasi 30 Menit</span>
              </div>
            </div>
            <button class="px-4 py-2.5 bg-sky-900 rounded-full text-slate-50 text-lg font-semibold">
              Coba Sekarang
            </button>
          </div>
        </div>
        <div class="bg-amber-200 rounded-[50px] p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            class="w-full md:w-48 h-44 rounded-2xl"
            src="https://placehold.co/193x176"
            alt="Struktur dan Fungsi Jaringan Tumbuhan"
          />
          <div class="flex-1 space-y-4">
            <h3 class="text-sky-900 text-3xl font-semibold">
              Struktur dan Fungsi Jaringan Tumbuhan
            </h3>
            <p class="text-zinc-900 text-xl font-semibold">
              Mengenal Pengertian, Jenis Jaringan, Struktur, Fungsi, serta
              Contoh Penerapan dalam Soal.
            </p>
            <div class="flex gap-8">
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-sky-900 rounded-full"></div>
                <span class="text-zinc-900 text-xl">10 Soal</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-sky-900 rounded-full"></div>
                <span class="text-zinc-900 text-xl">Estimasi 30 Menit</span>
              </div>
            </div>
            <button class="px-4 py-2.5 bg-sky-900 rounded-full text-slate-50 text-lg font-semibold">
              Coba Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Mengapa Memilih */}
      <section class="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <img
          class="w-full md:w-1/2 h-auto"
          src="https://placehold.co/500x500"
          alt="Why Choose"
        />
        <div class="flex-1 space-y-8">
          <h2 class="text-zinc-900 text-2xl font-semibold">
            Mengapa Memilih Belajar di EduSukses?
          </h2>
          <div>
            <h3 class="text-blue-600 text-2xl font-semibold">
              Belajar Nyaman dan Fleksibel
            </h3>
            <p class="text-zinc-900 text-xl">
              Siswa SMA dapat mengakses materi kapan saja dengan jadwal yang
              fleksibel, sehingga belajar tidak terbatas oleh waktu maupun
              tempat.
            </p>
          </div>
          <div>
            <h3 class="text-blue-600 text-2xl font-semibold">
              Metode Pembelajaran Interaktif
            </h3>
            <p class="text-zinc-900 text-xl">
              EduSukses menghadirkan video materi, diskusi real-time, dan modul
              terpersonalisasi yang membuat proses belajar lebih menarik serta
              relevan dengan kebutuhan siswa SMA.
            </p>
          </div>
          <div>
            <h3 class="text-blue-600 text-2xl font-semibold">
              Guru Profesional dan Kompeten
            </h3>
            <p class="text-zinc-900 text-xl">
              Pengajar berpengalaman siap menciptakan lingkungan belajar
              kondusif dengan materi berkualitas yang dirancang khusus untuk
              mendukung persiapan kuliah dan karier masa depan.
            </p>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section class="container mx-auto px-4 py-8">
        <h2 class="text-zinc-900 text-2xl font-semibold mb-6">
          Kata Mereka Tentang EduSukses
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-slate-50 rounded-2xl border border-neutral-400 p-6 space-y-4">
            <div class="flex items-start gap-4">
              <img
                class="w-16 h-16 rounded-full"
                src="https://placehold.co/70x70"
                alt="Rani"
              />
              <div>
                <p class="text-blue-600 text-xl font-semibold">Rani</p>
                <p class="text-neutral-400 text-base font-semibold">Kelas 12</p>
              </div>
            </div>
            <p class="text-zinc-900 text-base">
              "Belajar di EduSukses membuat saya lebih mudah memahami materi
              yang sulit. Kelas interaktifnya membantu saya berani bertanya dan
              berdiskusi langsung dengan guru. Sekarang saya lebih siap
              menghadapi ujian akhir dan seleksi masuk kuliah."
            </p>
          </div>
          {/* Repeat for other two testimonials */}
          <div class="bg-slate-50 rounded-2xl border border-neutral-400 p-6 space-y-4">
            <div class="flex items-start gap-4">
              <img
                class="w-16 h-16 rounded-full"
                src="https://placehold.co/70x70"
                alt="Sehan"
              />
              <div>
                <p class="text-blue-600 text-xl font-semibold">Sehan</p>
                <p class="text-neutral-400 text-base font-semibold">Kelas 12</p>
              </div>
            </div>
            <p class="text-zinc-900 text-base">
              "Saat SMA, saya menggunakan EduSukses untuk mempersiapkan ujian
              masuk perguruan tinggi. Modul terpersonalisasi dan asesmen yang
              jelas membuat saya bisa memilih jurusan sesuai minat. Kini saya
              kuliah di kampus impian berkat dukungan EduSukses."
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl border border-neutral-400 p-6 space-y-4">
            <div class="flex items-start gap-4">
              <img
                class="w-16 h-16 rounded-full"
                src="https://placehold.co/70x70"
                alt="Rani"
              />
              <div>
                <p class="text-blue-600 text-xl font-semibold">Rani</p>
                <p class="text-neutral-400 text-base font-semibold">Kelas 12</p>
              </div>
            </div>
            <p class="text-zinc-900 text-base">
              "EduSukses membantu saya menemukan jurusan yang tepat melalui
              asesmen karier. Materinya tidak hanya akademik, tapi juga melatih
              soft skills seperti komunikasi dan problem solving. Pengalaman
              belajar di EduSukses benar-benar mendukung perjalanan saya menuju
              dunia perkuliahan."
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section class="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div class="flex-1 space-y-4">
          <h2 class="text-zinc-900 text-2xl font-semibold">
            Pertanyaan Umum yang Sering Diajukan (FAQ)
          </h2>
          <div class="space-y-2">
            <div class="bg-emerald-500 p-4 flex justify-between items-center text-slate-50 text-xl font-semibold">
              <span>Apa tujuan aplikasi ini?</span>
              <div class="w-5 h-5 border-2 border-slate-50"></div>
            </div>
            <div class="bg-emerald-500 p-4 flex justify-between items-center text-slate-50 text-xl font-semibold">
              <span>Bagaimana cara belajar di EduSukses?</span>
              <div class="w-5 h-5 border-2 border-slate-50"></div>
            </div>
            <div class="bg-emerald-500 p-4 flex justify-between items-center text-slate-50 text-xl font-semibold">
              <span>Apakah EduSukses bantu persiapan kuliah?</span>
              <div class="w-5 h-5 border-2 border-slate-50"></div>
            </div>
          </div>
        </div>
        <img
          class="w-full md:w-1/2 h-auto"
          src="https://placehold.co/501x501"
          alt="FAQ Image"
        />
      </section>
    </>
  );
};

export default Dashboard;
