import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Adjust path if needed
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); // Added setUser if needed; otherwise, refetch after update
  const [name, setName] = useState(user?.name || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.picture || "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateName = async () => {
    try {
      setError(null);
      setSuccess(null);
      const res = await axios.put("http://localhost:5000/api/profile", {
        name,
      }); // Changed to PUT
      setUser(res.data); // Update with full user response
      setSuccess("Name updated successfully!");
    } catch (err) {
      setError("Failed to update name. Please try again.");
      console.error(err);
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("picture", selectedFile);

    try {
      setError(null);
      setSuccess(null);
      const res = await axios.post(
        "http://localhost:5000/api/profile/upload-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser({ ...user, picture: res.data.picture });
      setPreview(res.data.picture);
      setSelectedFile(null);
      setSuccess("Picture updated successfully!");
    } catch (err) {
      setError("Failed to update picture. Please try again.");
      console.error(err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-indigo-50 rounded-[20px] p-8">
        <h1 className="text-3xl font-bold text-sky-900 mb-6">
          Profile Settings
        </h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleUploadPicture}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Upload Picture
          </button>
        </div>

        {/* Name Edit */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleUpdateName}
            className="mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Update Name
          </button>
        </div>

        {/* Email (Read-only) */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Email:</label>
          <p className="text-lg">{user.email}</p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
      </div>
    </div>
  );
};

export default Profile;
