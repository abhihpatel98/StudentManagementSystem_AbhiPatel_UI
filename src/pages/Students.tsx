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
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof Student | "fullName" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const handleSort = (column: keyof Student | "fullName") => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any;
    let bValue: any;

    if (sortColumn === "fullName") {
      aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
      bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
    } else if (sortColumn === "classes") {
      aValue = a.classes.map(c => c.name).join(", ").toLowerCase();
      bValue = b.classes.map(c => c.name).join(", ").toLowerCase();
    } else {
      aValue = String(a[sortColumn]).toLowerCase();
      bValue = String(b[sortColumn]).toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleDelete = async (studentId: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      return;
    }

    try {
      await api.delete(`/students/${studentId}`);
      // Remove the deleted student from the list
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (err: any) {
      setError(err.response?.data || "Failed to delete student");
    }
  };

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
            <th 
              className="px-4 py-2 text-left cursor-pointer select-none"
              onClick={() => handleSort("fullName")}
            >
              <div className="flex items-center gap-2">
                Name
                {sortColumn === "fullName" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th 
              className="px-4 py-2 text-left cursor-pointer select-none"
              onClick={() => handleSort("emailId")}
            >
              <div className="flex items-center gap-2">
                Email
                {sortColumn === "emailId" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th 
              className="px-4 py-2 text-left cursor-pointer select-none"
              onClick={() => handleSort("phoneNumber")}
            >
              <div className="flex items-center gap-2">
                Phone
                {sortColumn === "phoneNumber" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th 
              className="px-4 py-2 text-left cursor-pointer select-none"
              onClick={() => handleSort("classes")}
            >
              <div className="flex items-center gap-2">
                Classes
                {sortColumn === "classes" && (
                  <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map(student => (
            <tr key={student.id} className="border-t">
              <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
              <td className="px-4 py-2">{student.emailId}</td>
              <td className="px-4 py-2">{student.phoneNumber}</td>
              <td className="px-4 py-2">{student.classes.map(c => c.name).join(", ") || "-"}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/students/edit/${student.id}`)}
                    className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                    className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
