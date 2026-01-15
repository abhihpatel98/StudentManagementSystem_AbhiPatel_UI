import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

interface Class {
  id: number;
  name: string;
  description: string;
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (err: any) {
      setError(err.response?.data || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/classes/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Classes imported successfully!");
      setFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchClasses();
    } catch (err: any) {
      alert(err.response?.data || "Import failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Classes</h2>

      {/* CSV Import */}
      <div className="mb-4 flex items-center space-x-2">
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          disabled={uploading}
          className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 text-white"
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {/* Classes Table */}
      <table className="min-w-full shadow rounded-lg">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id} className="border-t">
              <td className="px-4 py-2">{cls.name}</td>
              <td className="px-4 py-2">{cls.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
