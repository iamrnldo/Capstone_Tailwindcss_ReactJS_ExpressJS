  import { Link } from "react-router-dom";
  import Register from "@/assets/hero/login.png"; // Assuming a similar import path; replace with actual if different
  import logo2 from "@/assets/logo/logo2.png";
  import google from "@/assets/element/google.svg";

  const RegisterPage = () => {
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
                <h2 className="text-black text-xl font-medium">
                  Daftar menggunakan e-mail:
                </h2>

                {/* Google Register Button */}
                <button className="w-full px-8 py-4 bg-sky-900 rounded-lg flex items-center justify-center gap-4 hover:bg-sky-800 transition">
                  <img
                    className="w-7 h-7 rounded-full"
                    src={google}
                    alt="Google"
                  />
                  <span className="text-white text-xl font-normal">
                    Register with google
                  </span>
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-black text-lg">
                    Sudah punya akun?{" "}
                    <Link
                      to="/login"
                      className="text-sky-900 underline hover:text-sky-700"
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
