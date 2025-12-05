import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import Login from "@/assets/hero/login.png";
import logo2 from "@/assets/logo/logo2.png";
import google from "@/assets/element/google.svg";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { error: contextError } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
      window.location.reload(); // Reload to update AuthContext
    } catch (err) {
      const errorData = err.response?.data;

      // Check if email needs verification
      if (errorData?.needsVerification) {
        navigate("/verification-pending", {
          state: { email: errorData.email },
        });
        return;
      }

      setError(errorData?.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
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
                src={Login}
                alt="Education illustration"
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
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

            {/* Login Section */}
            <div className="w-full max-w-md space-y-6">
              <h2 className="text-black text-xl font-medium">
                Masuk ke akun Anda
              </h2>

              {/* Error Display */}
              {(error || contextError) && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error || contextError}
                </div>
              )}

              {/* Email/Password Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-sky-900 rounded-lg hover:bg-sky-800 transition disabled:bg-sky-600 disabled:cursor-not-allowed"
                >
                  <span className="text-white text-xl font-semibold">
                    {loading ? "Memproses..." : "Masuk"}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t-2 border-gray-300"></div>
                <span className="px-4 text-gray-500 text-base">ATAU</span>
                <div className="flex-1 border-t-2 border-gray-300"></div>
              </div>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full px-8 py-4 bg-white border-2 border-sky-900 rounded-lg flex items-center justify-center gap-4 hover:bg-sky-50 transition"
              >
                <img
                  className="w-7 h-7 rounded-full"
                  src={google}
                  alt="Google"
                />
                <span className="text-sky-900 text-xl font-normal">
                  Masuk dengan Google
                </span>
              </button>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-black text-lg">
                  Belum punya akun?{" "}
                  <Link
                    to="/register"
                    className="text-sky-900 font-semibold underline hover:text-sky-700"
                  >
                    Daftar di sini
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

export default LoginPage;
