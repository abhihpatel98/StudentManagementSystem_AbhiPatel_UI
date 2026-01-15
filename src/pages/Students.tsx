import { useEffect, useState } from "react";
import api from "../api/axios";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  classes: string[];
}

export default function Students() {
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
      <h2 className="text-2xl font-semibold mb-4">Students</h2>

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
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id} className="border-t">
              <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
              <td className="px-4 py-2">{student.emailId}</td>
              <td className="px-4 py-2">{student.phoneNumber}</td>
              <td className="px-4 py-2">{student.classes.join(", ") || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
