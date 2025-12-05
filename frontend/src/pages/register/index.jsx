import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Register from "@/assets/hero/login.png";
import logo2 from "@/assets/logo/logo2.png";
import google from "@/assets/element/google.svg";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Redirect to verification pending page
      navigate("/verification-pending", {
        state: { email: formData.email },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative">
              <img
                className="w-full h-auto object-contain"
                src={Register}
                alt="Education illustration"
              />
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="flex flex-col items-center lg:items-start space-y-8">
            {/* Logo and Title */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <img
                  className="w-20 h-14 object-contain"
                  src={logo2}
                  alt="Logo"
                />
                <h1 className="text-sky-900 text-4xl lg:text-5xl font-bold">
                  EduSukses
                </h1>
              </div>
              <p className="text-black text-lg lg:text-xl mt-4">
                Bangun kebiasaan belajar yang konsisten
                <br />
                dan hasil nyata lewat pengalaman interaktif.
              </p>
            </div>

            {/* Register Section */}
            <div className="w-full max-w-md space-y-6">
              <h2 className="text-black text-xl font-medium">Buat akun baru</h2>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-black mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent outline-none transition"
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimal 6 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-sky-900 rounded-lg hover:bg-sky-800 transition disabled:bg-sky-600 disabled:cursor-not-allowed"
                >
                  <span className="text-white text-xl font-semibold">
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t-2 border-gray-300"></div>
                <span className="px-4 text-gray-500 text-base">ATAU</span>
                <div className="flex-1 border-t-2 border-gray-300"></div>
              </div>

              {/* Google Register Button */}
              <button
                onClick={handleGoogleRegister}
                className="w-full px-8 py-4 bg-white border-2 border-sky-900 rounded-lg flex items-center justify-center gap-4 hover:bg-sky-50 transition"
              >
                <img
                  className="w-7 h-7 rounded-full"
                  src={google}
                  alt="Google"
                />
                <span className="text-sky-900 text-xl font-normal">
                  Daftar dengan Google
                </span>
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-black text-lg">
                  Sudah punya akun?{" "}
                  <Link
                    to="/login"
                    className="text-sky-900 font-semibold underline hover:text-sky-700"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
