import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Adjust path if needed (based on your structure)

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-sky-900 mb-8">
          Welcome to Your Dashboard, {user.name}!
        </h1>
        <img
          src={user.picture}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <p className="text-lg text-black mb-6">Email: {user.email}</p>
        <p className="text-lg text-black mb-6">
          Member since: {new Date(user.created_at).toLocaleDateString()}
        </p>

        {/* Placeholder for dashboard features */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-indigo-50 rounded-[20px] p-8 text-center">
            <h2 className="text-2xl font-semibold text-zinc-800 mb-4">
              Recent Classes
            </h2>
            <p className="text-base text-black">
              No recent classes yet. Start exploring!
            </p>
            <a href="#kelas" className="text-blue-700 hover:underline">
              Go to Classes
            </a>
          </div>
          <div className="bg-indigo-50 rounded-[20px] p-8 text-center">
            <h2 className="text-2xl font-semibold text-zinc-800 mb-4">
              Try Outs
            </h2>
            <p className="text-base text-black">
              Prepare for exams with our try outs.
            </p>
            <a href="#tryout" className="text-blue-700 hover:underline">
              Start Try Out
            </a>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-8 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
