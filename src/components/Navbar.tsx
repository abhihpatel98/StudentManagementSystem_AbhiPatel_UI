import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link
              to="/students"
              className={`px-3 py-2 rounded-md transition text-white ${
                isActive("/students")
                  ? "bg-blue-700 font-semibold"
                  : "hover:bg-blue-700"
              }`}
            >
              Students
            </Link>
            <Link
              to="/classes"
              className={`px-3 py-2 rounded-md transition text-white ${
                isActive("/classes")
                  ? "bg-blue-700 font-semibold"
                  : "hover:bg-blue-700"
              }`}
            >
              Classes
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
