import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

interface Class {
  id: number;
  name: string;
}

interface StudentFormDto {
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  classIds: number[];
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  phoneNumber?: string;
}

export default function StudentForm() {
  const { id } = useParams(); // undefined if create, has value if edit
  const navigate = useNavigate();

  const [classes, setClasses] = useState<Class[]>([]);
  const [form, setForm] = useState<StudentFormDto>({
    firstName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    classIds: [],
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Fetch classes for dropdown
  useEffect(() => {
    api.get("/classes")
      .then(res => setClasses(res.data))
      .catch(() => setClasses([]));
  }, []);

  // Fetch student if editing
  useEffect(() => {
    if (!id) return;
    api.get(`/students/${id}`)
      .then(res => {
        const studentData = res.data;
        // Extract class IDs from classes array if present, otherwise use classIds
        const classIds = studentData.classes 
          ? studentData.classes.map((c: any) => c.id)
          : (studentData.classIds || []);
        setForm({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          emailId: studentData.emailId,
          phoneNumber: studentData.phoneNumber,
          classIds: classIds,
        });
      })
      .catch(() => setError("Failed to load student"));
  }, [id]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) {
          return "First Name is required";
        }
        return undefined;
      case "lastName":
        if (!value.trim()) {
          return "Last Name is required";
        }
        return undefined;
      case "emailId":
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return undefined;
      case "phoneNumber":
        if (!value.trim()) {
          return "Phone Number is required";
        }
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(value)) {
          return "Phone Number must contain only digits";
        }
        if (value.length > 10) {
          return "Phone Number must be maximum 10 digits";
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setForm(prev => ({ ...prev, [name]: digitsOnly }));
        // Clear error if valid
        const error = validateField(name, digitsOnly);
        setValidationErrors(prev => ({ ...prev, [name]: error }));
      }
      return;
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validate on change and clear error if valid
    const error = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
    setForm(prev => ({ ...prev, classIds: selected }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    errors.firstName = validateField("firstName", form.firstName);
    errors.lastName = validateField("lastName", form.lastName);
    errors.emailId = validateField("emailId", form.emailId);
    errors.phoneNumber = validateField("phoneNumber", form.phoneNumber);
    
    setValidationErrors(errors);
    
    return !Object.values(errors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (id) {
        await api.put(`/students/${id}`, form);
      } else {
        await api.post("/students", form);
      }
      navigate("/students");
    } catch (err: any) {
      setError(err.response?.data || "Failed to save student");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto rounded shadow-md space-y-4">
      <h2 className="text-2xl font-semibold">{id ? "Edit Student" : "Add Student"}</h2>
      {error && <div className="text-red-700 p-2 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              validationErrors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {validationErrors.firstName && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.firstName}</p>
          )}
        </div>
        <div>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              validationErrors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {validationErrors.lastName && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.lastName}</p>
          )}
        </div>
        <div>
          <input
            name="emailId"
            value={form.emailId}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              validationErrors.emailId
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {validationErrors.emailId && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.emailId}</p>
          )}
        </div>
        <div>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number (Max 10 digits)"
            type="tel"
            maxLength={10}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              validationErrors.phoneNumber
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {validationErrors.phoneNumber && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.phoneNumber}</p>
          )}
        </div>
        <select
          multiple
          value={form.classIds.map(String)}
          onChange={handleClassChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
