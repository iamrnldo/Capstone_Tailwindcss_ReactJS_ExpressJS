/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Icon imports
import missionIcon from "@/assets/element/misi.svg";
import experienceIcon from "@/assets/element/pengalaman.svg";
import communityIcon from "@/assets/element/komunitas.svg";
import resultIcon from "@/assets/element/hasil terbukti.svg";
import aboutIllustration from "@/assets/element/tentang_ilustrasi.svg";

// Teacher photo imports
import teacher1 from "@/assets/element/kristoper.svg";
import teacher2 from "@/assets/element/meilani.svg";
import teacher3 from "@/assets/element/nanang.svg";
import teacher4 from "@/assets/element/sheyla.svg";
import teacher5 from "@/assets/element/natania.svg";
import teacher6 from "@/assets/element/raina.svg";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInDown = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Custom Hook for Scroll Animation
const useScrollAnimation = (threshold = 0.2) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
};

const AboutUsPage = () => {
  const navigate = useNavigate();

  // Features data
  const features = [
    {
      id: 1,
      icon: missionIcon,
      title: "Misi Kami",
      description:
        "Membuat pendidikan berkualitas dapat diakses oleh semua siswa",
    },
    {
      id: 2,
      icon: experienceIcon,
      title: "Pengalaman",
      description: "5+ tahun pengalaman dalam pendidikan online",
    },
    {
      id: 3,
      icon: communityIcon,
      title: "Komunitas",
      description: "50,000+ siswa aktif dari seluruh Indonesia",
    },
    {
      id: 4,
      icon: resultIcon,
      title: "Hasil Terbukti",
      description: "98% siswa berhasil meningkatkan nilai mereka",
    },
  ];

  // Offerings data
  const offerings = [
    {
      id: 1,
      title: "Video Pembelajaran",
      description:
        "Materi disampaikan secara visual dan interaktif, sehingga siswa lebih mudah memahami konsep.",
    },
    {
      id: 2,
      title: "Materi Belajar",
      description:
        "Konten terstruktur sesuai kurikulum SMA, lengkap dengan penjelasan yang ringkas dan jelas.",
    },
    {
      id: 3,
      title: "Latihan Soal",
      description:
        "Ratusan soal latihan untuk mengasah pemahaman dan meningkatkan kemampuan akademik.",
    },
    {
      id: 4,
      title: "Tryout TKA",
      description:
        "Simulasi TKA untuk mengukur kemampuan akademik dan mempersiapkan seleksi masuk perguruan tinggi.",
    },
    {
      id: 5,
      title: "Tryout UTBK",
      description:
        "Tryout UTBK untuk membiasakan diri dengan format ujian sebenarnya dan mengetahui seberapa siap siswa masuk perguruan tinggi.",
    },
  ];

  // Teachers data
  const teachers = [
    {
      id: 1,
      name: "Christopher Wongso, S.Pd.",
      subject: "Guru Bahasa Inggris",
      color: "bg-blue-600",
      photo: teacher1,
      quote:
        "Mengajarkan pembelajaran Bahasa Inggris yang interaktif membawa kepercayaan diri siswa dalam komunikasi!",
    },
    {
      id: 2,
      name: "Raina Cahya, S.Kom.",
      subject: "Guru Matematika",
      color: "bg-[#f58610]",
      photo: teacher2,
      quote:
        "Setiap prestasi pendidikan & karier dimulai dengan mengasah keterampilan problem solving, kolaborasi, dan berpikir kritis!",
    },
    {
      id: 3,
      name: "Nanang Surejo, S.E.",
      subject: "Guru Ekonomi",
      color: "bg-purple-600",
      photo: teacher3,
      quote:
        "Mengajarkan konsep ekonomi menggunakan teori dengan kasus nyata agar siswa lebih siap menghadapi dunia industri!",
    },
    {
      id: 4,
      name: "Sheyla Amanda, S.Si.",
      subject: "Guru Biologi",
      color: "bg-green-600",
      photo: teacher4,
      quote:
        "Dikenal kreatif dan inspiratif dalam mengajarkan koneksi antara teori Biologi dengan dunia nyata!",
    },
    {
      id: 5,
      name: "Natania Kayla, S.Pd.",
      subject: "Guru Matematika",
      color: "bg-[#f58610]",
      photo: teacher5,
      quote:
        "Membantu siswa memahami konsep matematika dengan cara sederhana dan aplikatif!",
    },
    {
      id: 6,
      name: "Meilani Candra, S.Pd.",
      subject: "Guru Bahasa Indonesia",
      color: "bg-pink-600",
      photo: teacher6,
      quote:
        "Fokus pada keterampilan menulis, membaca kritis, dan apresiasi sastra.",
    },
  ];

  // Feature Card Component with Animation
  const FeatureCard = ({ feature, index }) => (
    <motion.div
      className="w-full sm:w-72 space-y-2"
      variants={staggerItem}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-12 h-12 bg-orange-100 rounded-lg mb-3 flex items-center justify-center"
        whileHover={{
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 },
        }}
      >
        <img src={feature.icon} alt={feature.title} className="w-6 h-6" />
      </motion.div>
      <h3 className="text-lg font-semibold text-[#012f72]">{feature.title}</h3>
      <p className="text-base text-gray-700">{feature.description}</p>
    </motion.div>
  );

  // Offering Card Component with Animation
  const OfferingCard = ({ offering, index }) => (
    <motion.div
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-[#012f72] hover:shadow-lg transition-shadow"
      variants={staggerItem}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 40px rgba(1, 47, 114, 0.15)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#012f72] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-4 sm:mb-6"
        whileHover={{
          scale: 1.1,
          rotate: 360,
          transition: { duration: 0.5 },
        }}
      >
        {offering.id}
      </motion.div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
        {offering.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {offering.description}
      </p>
    </motion.div>
  );

  // Teacher Card Component with Animation
  const TeacherCard = ({ teacher, index }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
      variants={staggerItem}
      whileHover={{
        y: -15,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gray-200 rounded-full mb-4 sm:mb-6 overflow-hidden"
        whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
      >
        <motion.img
          src={teacher.photo}
          alt={teacher.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          whileHover={{ scale: 1.3 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </motion.div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
        {teacher.name}
      </h3>
      <motion.span
        className={`inline-block ${teacher.color} text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4`}
        whileHover={{ scale: 1.05 }}
      >
        {teacher.subject}
      </motion.span>
      <p className="text-gray-600 text-xs sm:text-sm italic mt-3 sm:mt-4">
        &quot;{teacher.quote}&quot;
      </p>
    </motion.div>
  );

  // Scroll animation refs
  const heroRef = useRef(null);
  const offeringsRef = useRef(null);
  const teachersRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const offeringsInView = useInView(offeringsRef, { once: true, amount: 0.1 });
  const teachersInView = useInView(teachersRef, { once: true, amount: 0.1 });

  return (
    <div className="bg-[#f0f5ff] min-h-screen pt-16 sm:pt-20 overflow-hidden">
      {/* Breadcrumb with fade animation */}
      <motion.div
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-32 py-4 sm:py-7"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center">
          <motion.p
            className="text-sm sm:text-base font-semibold text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
            onClick={() => navigate("/")}
            whileHover={{ x: -3 }}
          >
            Beranda/
          </motion.p>
          <motion.p
            className="text-sm sm:text-base font-semibold text-[#f58610]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            About
          </motion.p>
        </div>
      </motion.div>

      {/* Hero Section - Tentang EduSukses */}
      <section
        ref={heroRef}
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-24 py-4 sm:py-6"
      >
        <motion.div
          className="bg-white rounded-[20px] p-6 sm:p-10 lg:p-16"
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-start gap-8 lg:gap-12">
            {/* Text Content */}
            <motion.div
              className="w-full lg:w-[711px]"
              variants={fadeInLeft}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <div className="mb-8 sm:mb-12">
                <motion.h1
                  className="text-2xl sm:text-[32px] font-semibold text-[#012f72] mb-3 sm:mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Tentang EduSukses
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg text-gray-700 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  EduSukses adalah platform pendidikan digital yang berfokus
                  pada siswa SMA. Kami hadir untuk mendukung generasi muda
                  Indonesia dalam mempersiapkan diri menghadapi dunia
                  perkuliahan dan karier dengan bekal keterampilan akademik,
                  soft skills, serta pengalaman belajar yang relevan dengan
                  kebutuhan masa depan.
                </motion.p>
              </div>

              {/* Features Grid with Stagger Animation */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
              >
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    index={index}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Image with animation */}
            <motion.div
              className="w-full sm:w-[346px] h-[250px] sm:h-[331px] bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl flex items-center justify-center overflow-hidden"
              variants={fadeInRight}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={aboutIllustration}
                alt="About EduSukses"
                className="w-full h-full object-contain p-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<span class="text-gray-400">Illustration</span>';
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* What We Offer Section */}
      <section
        ref={offeringsRef}
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-32 py-8 sm:py-12"
      >
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={offeringsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl sm:text-[32px] font-semibold text-[#012f72] mb-2 sm:mb-2.5"
            initial={{ opacity: 0, y: 20 }}
            animate={offeringsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Apa yang Kami Tawarkan?
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={offeringsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fasilitas lengkap untuk mendukung kesuksesan akademik siswa
          </motion.p>
        </motion.div>

        {/* Features Cards */}
        <div className="space-y-4 sm:space-y-6">
          {/* Row 1 - 3 Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={offeringsInView ? "visible" : "hidden"}
          >
            {offerings.slice(0, 3).map((offering, index) => (
              <OfferingCard
                key={offering.id}
                offering={offering}
                index={index}
              />
            ))}
          </motion.div>

          {/* Row 2 - 2 Cards Centered */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={offeringsInView ? "visible" : "hidden"}
          >
            {offerings.slice(3, 5).map((offering, index) => (
              <OfferingCard
                key={offering.id}
                offering={offering}
                index={index + 3}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Teacher Team Section */}
      <section
        ref={teachersRef}
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-32 py-8 sm:py-12 pb-16 sm:pb-24"
      >
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={teachersInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl sm:text-[32px] font-semibold text-[#012f72] mb-2 sm:mb-2.5"
            initial={{ opacity: 0, y: 20 }}
            animate={teachersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tim Pengajar Kami
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={teachersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Bertemu dengan para pengajar berpengalaman yang siap membimbing
          </motion.p>
        </motion.div>

        {/* Teachers Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={teachersInView ? "visible" : "hidden"}
        >
          {teachers.map((teacher, index) => (
            <TeacherCard key={teacher.id} teacher={teacher} index={index} />
          ))}
        </motion.div>
      </section>

      {/* Floating Background Elements (Optional decorative animation) */}
      <motion.div
        className="fixed top-20 right-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 pointer-events-none"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-40 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 pointer-events-none"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AboutUsPage;
