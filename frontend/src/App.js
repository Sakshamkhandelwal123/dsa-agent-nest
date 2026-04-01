import React, { useState, useEffect } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leetcode, setLeetcode] = useState(null);
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);

  const API_BASE = "/api";

  const getSuggestion = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/agent/suggest`);
      const data = await res.json();
      setSuggestion(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchLeetcode = async () => {
    setLeetcodeLoading(true);
    try {
      const res = await fetch(`${API_BASE}/leetcode/stats`);
      const data = await res.json();
      setLeetcode(data);
    } catch (err) {
      console.error(err);
    }
    setLeetcodeLoading(false);
  };

  const askAgent = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/agent/ask?q=${encodeURIComponent(question)}`
      );
      const data = await res.text();
      setResponse(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeetcode();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            🚀 DSA AI Agent
          </h1>
          <p className="text-slate-600 mt-2">
            Your Personal Leetcode + Striver A2Z Coach
          </p>
        </div>

        {/* Leetcode Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 mb-6">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              📊 Leetcode Progress
            </h2>

            <button
              onClick={fetchLeetcode}
              className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg"
            >
              Refresh
            </button>
          </div>

          {leetcodeLoading && (
            <div className="text-slate-500">
              Loading Leetcode stats...
            </div>
          )}

          {leetcode && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500">
                  Total
                </div>
                <div className="text-2xl font-bold">
                  {leetcode.totalSolved}
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-sm text-green-600">
                  Easy
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {leetcode.easySolved}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="text-sm text-yellow-600">
                  Medium
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {leetcode.mediumSolved}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-sm text-red-600">
                  Hard
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {leetcode.hardSolved}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-sm text-blue-600">
                  Ranking
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {leetcode.ranking}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Suggestion Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                🎯 Today's Question
              </h2>

              <button
                onClick={getSuggestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
              >
                Suggest
              </button>
            </div>

            {loading && (
              <p className="text-slate-500">Finding best question...</p>
            )}

            {suggestion && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-sm text-slate-500 mb-1">
                  Topic
                </div>
                <div className="text-lg font-semibold mb-3 capitalize">
                  {suggestion.topic}
                </div>

                <div className="text-sm text-slate-500 mb-1">
                  Question
                </div>
                <div className="text-md font-medium">
                  {suggestion.question}
                </div>
              </div>
            )}
          </div>

          {/* Ask Agent Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4">
              🤖 Ask AI Coach
            </h2>

            <input
              type="text"
              placeholder="Ask about any DSA problem..."
              className="w-full border border-slate-200 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button
              onClick={askAgent}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition"
            >
              Ask AI
            </button>
          </div>

        </div>

        {/* Response Section */}
        {response && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4">
              🧠 AI Response
            </h2>

            <div className="bg-slate-50 p-4 rounded-xl whitespace-pre-wrap text-sm leading-relaxed">
              {response}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;