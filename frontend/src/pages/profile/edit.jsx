import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  GENDER_OPTIONS,
  KELAS_OPTIONS,
  PEMINATAN_OPTIONS,
} from "../../constants/enums";

const API_URL =
  import.meta.env.VITE_API_URL || "https://capstone-omega-puce.vercel.app/";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, token } = useContext(AuthContext);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    school: "",
    kelas: "",
    peminatan: "",
    email: "",
    phone: "",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is Google user (no password change allowed)
  const isGoogleUser = user?.google_id || user?.type === "google";

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        gender: user.gender || "",
        school: user.school || "",
        kelas: user.kelas || "",
        peminatan: user.peminatan || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setPreview(user.picture || "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return;

    const formDataUpload = new FormData();
    formDataUpload.append("picture", selectedFile);

    try {
      setUploadingPhoto(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/profile/upload-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, picture: data.picture });
        setPreview(data.picture);
        setSelectedFile(null);
        setSuccess("Foto profil berhasil diperbarui!");
      } else {
        setError(data.message || "Gagal mengupload foto");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Gagal mengupload foto. Silakan coba lagi.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      setError("Nama lengkap harus diisi");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          gender: formData.gender || null,
          school: formData.school || null,
          kelas: formData.kelas || null,
          peminatan: formData.peminatan || null,
          phone: formData.phone || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        setSuccess("Profil berhasil diperbarui!");
      } else {
        setError(data.message || "Gagal memperbarui profil");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword) {
      setError("Password lama harus diisi");
      return false;
    }
    if (!passwordData.newPassword) {
      setError("Password baru harus diisi");
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_URL}/api/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        return true;
      } else {
        setError(data.message || "Gagal mengubah password");
        return false;
      }
    } catch (err) {
      console.error("Password change error:", err);
      setError("Gagal mengubah password. Silakan coba lagi.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // If password fields are filled, change password first
    if (
      passwordData.oldPassword ||
      passwordData.newPassword ||
      passwordData.confirmPassword
    ) {
      const passwordSuccess = await handleChangePassword();
      if (!passwordSuccess) return;
    }

    // Update profile
    await handleUpdateProfile();

    // Upload photo if selected
    if (selectedFile) {
      await handleUploadPicture();
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  // Reusable Select Component
  const SelectField = ({ id, name, value, onChange, options, label }) => (
    <div>
      <label htmlFor={id} className="block text-base font-semibold mb-2">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012f72] focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Reusable Password Input Component
  const PasswordField = ({
    id,
    name,
    value,
    onChange,
    placeholder,
    label,
    show,
    onToggle,
    hint,
  }) => (
    <div>
      <label htmlFor={id} className="block text-base font-semibold mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012f72] focus:border-transparent transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );

  if (!user) {
    return (
      <div className=" bg-[#f0f5ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012f72] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[#f0f5ff]">
      <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-base font-semibold mb-8">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#012f72] transition-colors"
          >
            Beranda
          </Link>
          <span className="text-gray-600">/</span>
          <Link
            to="/profile"
            className="text-gray-600 hover:text-[#012f72] transition-colors"
          >
            Profile
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#f58610]">Edit Profile</span>
        </nav>

        {/* Profile Card */}
        <div className="bg-white rounded-[30px] shadow-lg p-6 sm:p-8 lg:p-12">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-[#343434] bg-opacity-70 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              <label
                htmlFor="file-upload"
                className="absolute bottom-0 right-0 bg-[#012f72] text-white rounded-full p-2 cursor-pointer hover:bg-[#014094] transition-colors shadow-lg"
              >
                {uploadingPhoto ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploadingPhoto}
              />
            </div>

            {selectedFile && (
              <button
                onClick={handleUploadPicture}
                disabled={uploadingPhoto}
                className="mt-4 px-4 py-2 bg-[#012f72] text-white text-sm rounded-lg hover:bg-[#014094] transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? "Mengupload..." : "Upload Foto"}
              </button>
            )}
          </div>

          {/* Personal Information */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[#012f72] mb-6">
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-base font-semibold mb-2"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012f72] focus:border-transparent transition-all"
                />
              </div>
              <SelectField
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={GENDER_OPTIONS}
                label="Jenis Kelamin"
              />
            </div>
          </section>

          {/* School Information */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[#012f72] mb-6">
              Informasi Sekolah
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="school"
                  className="block text-base font-semibold mb-2"
                >
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Masukkan nama sekolah"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012f72] focus:border-transparent transition-all"
                />
              </div>
              <SelectField
                id="kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                options={KELAS_OPTIONS}
                label="Pilih Kelas"
              />
              <SelectField
                id="peminatan"
                name="peminatan"
                value={formData.peminatan}
                onChange={handleChange}
                options={PEMINATAN_OPTIONS}
                label="Pilih Peminatan"
              />
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-[#012f72] mb-6">
              Informasi Kontak
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email tidak dapat diubah
                </p>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-base font-semibold mb-2"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012f72] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </section>

          {/* Change Password - Only for non-Google users */}
          {!isGoogleUser && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-[#012f72] mb-6">
                Ubah Password
              </h2>
              <div className="space-y-6">
                <div className="max-w-md">
                  <PasswordField
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan password lama"
                    label="Password Lama"
                    show={showOldPassword}
                    onToggle={() => setShowOldPassword(!showOldPassword)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PasswordField
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Masukkan password baru"
                    label="Password Baru"
                    show={showNewPassword}
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                    hint="Minimal 8 karakter"
                  />
                  <PasswordField
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Konfirmasi password baru"
                    label="Konfirmasi Password Baru"
                    show={showConfirmPassword}
                    onToggle={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {/* Google User Notice */}
          {isGoogleUser && (
            <section className="mb-10">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-blue-800">Akun Google</p>
                    <p className="text-sm text-blue-600">
                      Password dikelola melalui akun Google Anda. Kunjungi
                      pengaturan akun Google untuk mengubah password.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-[#012f72] text-white rounded-lg font-semibold hover:bg-[#014094] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
          