"use client";
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    // Replace with your ACTUAL Cloud Run URL
    const API_URL = "https://ai-detector-api-xyz.a.run.app/analyze";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-10 max-w-xl mx-auto text-center font-sans">
      <h1 className="text-3xl font-bold mb-6">🔍 AI Background Detector</h1>
      
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />

      <button 
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Scanning..." : "Detect AI Artifacts"}
      </button>

      {result && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold">Verdict: {result.verdict}</h2>
          <p className="text-gray-600">Artifact Score: {result.score}</p>
        </div>
      )}
    </div>
  );
}