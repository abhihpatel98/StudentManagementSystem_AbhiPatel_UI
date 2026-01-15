import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

interface ValidationErrors {
  username?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data.token);
      navigate("/students");
    } catch (err: any) {
      const errorMessage = err.response?.data || "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
            {errors.general}
          </div>
        )}

        <div>
          <input
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.username
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
            disabled={isSubmitting}
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-md transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
