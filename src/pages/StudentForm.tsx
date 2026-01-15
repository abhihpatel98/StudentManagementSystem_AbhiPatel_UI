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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
    setForm(prev => ({ ...prev, classIds: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="emailId"
          value={form.emailId}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          type="tel"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
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
