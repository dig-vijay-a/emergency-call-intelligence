import React, { useState } from 'react';
import axios from 'axios';
import { Mic, Upload, Activity, MapPin, Users, AlertTriangle, Play, Loader2 } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeCall = async () => {
    if (!file) {
      setError("Please select an audio file first.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("audio_file", file);

    try {
      const response = await axios.post("http://localhost:8000/analyze-call", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the call. Ensure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (score) => {
    if (score > 7.5) return "text-red-500";
    if (score > 5.0) return "text-orange-500";
    if (score > 3.0) return "text-yellow-500";
    return "text-green-500";
  };
  
  const getSeverityBg = (score) => {
    if (score > 7.5) return "bg-red-500/10 border-red-500/50";
    if (score > 5.0) return "bg-orange-500/10 border-orange-500/50";
    if (score > 3.0) return "bg-yellow-500/10 border-yellow-500/50";
    return "bg-green-500/10 border-green-500/50";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between py-6 border-b border-gray-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-red-500/20 text-red-500">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Emergency Call Intelligence</h1>
            <p className="text-sm text-gray-400">AI-Powered Dispatcher Copilot</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mic size={20} className="text-blue-400" />
              Incoming Call
            </h2>
            
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-500 transition-colors">
              <input 
                type="file" 
                accept="audio/*" 
                className="hidden" 
                id="audio-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-800 rounded-full text-gray-400">
                  <Upload size={32} />
                </div>
                <span className="text-sm font-medium">Click to upload audio file</span>
                <span className="text-xs text-gray-500">MP3, WAV, M4A</span>
              </label>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Play size={16} className="text-blue-400 flex-shrink-0" />
                  <span className="text-sm truncate text-gray-300">{file.name}</span>
                </div>
              </div>
            )}

            <button 
              onClick={analyzeCall}
              disabled={isAnalyzing || !file}
              className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isAnalyzing ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 
                file ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : 
                'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing AI Pipeline...
                </>
              ) : (
                <>
                  <Activity size={20} />
                  Analyze Emergency Call
                </>
              )}
            </button>

            {error && (
              <p className="mt-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Pipeline Status</h3>
             <ul className="space-y-4">
                <li className={`flex items-center gap-3 ${result ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${result ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                  <span className="text-sm">Speech-to-Text Transcription</span>
                </li>
                <li className={`flex items-center gap-3 ${result ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${result ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                  <span className="text-sm">LLM Information Extraction</span>
                </li>
                <li className={`flex items-center gap-3 ${result ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${result ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                  <span className="text-sm">XGBoost Severity Scoring</span>
                </li>
             </ul>
          </div>
        </div>

        {/* Right Column: Output Dashboard */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Top Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`col-span-2 rounded-2xl p-6 border ${getSeverityBg(result.severity_score)} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Priority Score</h3>
                    <div className="flex items-end gap-3 mt-1">
                      <span className={`text-5xl font-black ${getSeverityColor(result.severity_score)}`}>
                        {result.severity_score}
                      </span>
                      <span className="text-xl font-medium text-gray-400 mb-1">/ 10</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border ${getSeverityBg(result.severity_score)} ${getSeverityColor(result.severity_score)}`}>
                      {result.severity_class}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Dispatch Rec</h3>
                  <p className="text-xl font-bold text-white leading-tight">
                    {result.dispatch_recommendation}
                  </p>
                </div>
              </div>

              {/* Extracted Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <AlertTriangle size={16} />
                    <span className="text-xs uppercase font-semibold tracking-wider">Emergency Type</span>
                  </div>
                  <p className="text-lg font-semibold">{result.emergency_type}</p>
                </div>
                <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <MapPin size={16} />
                    <span className="text-xs uppercase font-semibold tracking-wider">Location</span>
                  </div>
                  <p className="text-lg font-semibold">{result.location}</p>
                </div>
                <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Users size={16} />
                    <span className="text-xs uppercase font-semibold tracking-wider">Victims</span>
                  </div>
                  <p className="text-lg font-semibold">{result.victims}</p>
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Live Transcript</h3>
                <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-sm leading-relaxed text-gray-300">
                  "{result.transcript}"
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-gray-500">
              <Activity size={48} className="mb-4 text-gray-700" />
              <p className="text-lg font-medium">Waiting for incoming call...</p>
              <p className="text-sm">Upload an audio file and analyze to view dispatch intelligence.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
