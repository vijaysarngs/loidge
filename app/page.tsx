"use client";

import { useState, ChangeEvent } from 'react';

// 1. Define what the API response looks like (TypeScript needs this)
interface AnalysisResult {
  filename: string;
  score: number;
  verdict: string;
  details: string;
}

export default function Home() {
  // 2. Add types to useState
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    // 🔴 IMPORTANT: Replace this with your HUGGING FACE URL
    // Example: "https://vijayhaiya-ai-background-detector.hf.space/analyze"
    const API_URL = "https://vijayhaiya/ai-background-detector.hf.space/analyze"; 

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
          🔍 AI Detector
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Upload an image to analyze background artifacts.
        </p>
        
        {/* Input Area */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Image
          </label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) setFile(e.target.files[0]);
            }}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
        </div>

        {/* Analyze Button */}
        <button 
          onClick={handleAnalyze}
          disabled={!file || loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200
            ${!file || loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Detect AI Artifacts"
          )}
        </button>

        {/* Results Section */}
        {result && (
          <div className={`mt-8 p-4 rounded-lg border-l-4 ${
            result.score > 50 ? "bg-red-50 border-red-500" : "bg-green-50 border-green-500"
          }`}>
            <h2 className="text-lg font-bold text-gray-900">
              Verdict: <span className={result.score > 50 ? "text-red-600" : "text-green-600"}>
                {result.verdict}
              </span>
            </h2>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Artifact Probability</span>
                <span className="text-sm font-medium text-gray-700">{result.score.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${result.score > 50 ? "bg-red-600" : "bg-green-600"}`} 
                  style={{ width: `${Math.min(result.score, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <p className="mt-3 text-xs text-gray-500 italic">
              {result.details}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
