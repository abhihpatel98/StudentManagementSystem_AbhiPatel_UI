import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import type Class from "../interfaces/Class";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/classes");
      setClasses(res.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          err.message || 
                          "Failed to load classes. Please try again.";
      setError(errorMessage);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validate file type
      if (!selectedFile.name.endsWith('.csv')) {
        setUploadError("Please select a CSV file.");
        e.target.value = "";
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/classes/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Clear any previous errors and refresh the list
      setError("");
      await fetchClasses();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          err.message || 
                          "Failed to import classes. Please check the file format and try again.";
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Classes</h2>

      {/* Error Message for Fetch */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchClasses}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* CSV Import */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
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
        {/* Upload Error Message */}
        {uploadError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {uploadError}
          </div>
        )}
      </div>

      {/* Classes Table */}
      {classes.length === 0 && !error ? (
        <div className="text-center py-8 text-gray-500">
          No classes found. Upload a CSV file to import classes.
        </div>
      ) : (
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
      )}
    </div>
  );
}
