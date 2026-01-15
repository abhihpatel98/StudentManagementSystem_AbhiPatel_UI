import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type Student from "../interfaces/Student";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional client-side search
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/students")
      .then(res => setStudents(res.data))
      .catch(err => setError(err.response?.data || "Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{"Error:" + error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Students</h2>
        <button
          onClick={() => navigate("/students/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Student
        </button>
      </div>

      <input
        type="text"
        name="search"
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
      />

      <table className="min-w-full shadow rounded-lg">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Classes</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id} className="border-t">
              <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
              <td className="px-4 py-2">{student.emailId}</td>
              <td className="px-4 py-2">{student.phoneNumber}</td>
              <td className="px-4 py-2">{student.classes.map(c => c.name).join(", ") || "-"}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => navigate(`/students/edit/${student.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
