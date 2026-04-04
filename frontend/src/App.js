import React, { useCallback, useEffect, useState, useRef } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [leetcode, setLeetcode] = useState(null);
  const [recent, setRecent] = useState([]);
  const responseRef = useRef(null);

  const API_BASE = "/api";
  const leetcodeUserQuery = process.env.REACT_APP_LEETCODE_USERNAME
    ? `?username=${encodeURIComponent(process.env.REACT_APP_LEETCODE_USERNAME)}`
    : "";

  const fetchLeetcode = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/leetcode/stats${leetcodeUserQuery}`
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data?.message ?? "Failed to load LeetCode stats");
        return;
      }
      if (data && typeof data.totalSolved === "number") {
        setLeetcode(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [leetcodeUserQuery]);

  const fetchRecent = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/leetcode/recent${leetcodeUserQuery}`
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data?.message ?? "Failed to load recent submissions");
        setRecent([]);
        return;
      }
      setRecent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRecent([]);
    }
  }, [leetcodeUserQuery]);

  useEffect(() => {
    fetchLeetcode();
    fetchRecent();
  }, [fetchLeetcode, fetchRecent]);

  useEffect(() => {
    if ((response || loadingAI) && responseRef.current) {
      responseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [response, loadingAI]);

  const getSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const res = await fetch(`${API_BASE}/agent/suggest`);
      const data = await res.json();
      setSuggestion(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingSuggestion(false);
  };

  const askAgent = async () => {
    if (!question) return;
    setLoadingAI(true);
    setResponse("");
    try {
      const res = await fetch(
        `${API_BASE}/agent/ask?q=${encodeURIComponent(question)}`
      );
      const data = await res.text();
      setResponse(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingAI(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            🚀 DSA AI Agent
          </h1>
          <p className="text-slate-600 mt-2">
            Your Personal Leetcode + Striver A2Z Coach
          </p>
        </div>

        {/* Leetcode Stats */}
        {leetcode && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-sm text-slate-500">Total</div>
              <div className="text-2xl font-bold">
                {leetcode.totalSolved}
              </div>
            </div>

            <div className="bg-green-50 rounded-xl shadow p-4">
              <div className="text-sm text-green-600">Easy</div>
              <div className="text-2xl font-bold text-green-600">
                {leetcode.easySolved}
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl shadow p-4">
              <div className="text-sm text-yellow-600">Medium</div>
              <div className="text-2xl font-bold text-yellow-600">
                {leetcode.mediumSolved}
              </div>
            </div>

            <div className="bg-red-50 rounded-xl shadow p-4">
              <div className="text-sm text-red-600">Hard</div>
              <div className="text-2xl font-bold text-red-600">
                {leetcode.hardSolved}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl shadow p-4">
              <div className="text-sm text-blue-600">Ranking</div>
              <div className="text-xl font-bold text-blue-600">
                {leetcode.ranking?.toLocaleString()}
              </div>
            </div>

          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Solved */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4">
              🔥 Recent Solved
            </h2>

            <div className="space-y-2">
              {recent.slice(0, 6).map((item, index) => (
                <a
                  key={index}
                  href={`https://leetcode.com/problems/${item.titleSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-slate-50 hover:bg-slate-100 p-3 rounded-lg transition"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Suggestion */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">
                🎯 Suggested
              </h2>
            </div>

            {!suggestion && (
              <div className="flex flex-col items-center justify-center text-center py-8 text-slate-400">
                <div className="text-4xl mb-2">🧠</div>
                <p className="text-sm">
                  Get a smart question based on your progress
                </p>
                <button
                  type="button"
                  onClick={getSuggestion}
                  disabled={loadingSuggestion}
                  className="mt-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-sm"
                >
                  {loadingSuggestion ? "Loading…" : "Generate Suggestion"}
                </button>
              </div>
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

                <a
                  href={`https://leetcode.com/problems/${suggestion.question
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-medium hover:underline"
                >
                  {suggestion.question}
                </a>

                <button
                  type="button"
                  onClick={getSuggestion}
                  disabled={loadingSuggestion}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-xl"
                >
                  {loadingSuggestion ? "Loading…" : "Suggest Another"}
                </button>
              </div>
            )}
          </div>

          {/* Ask AI */}
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

        {(loadingAI || response) && (
          <div
            ref={responseRef}
            className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-slate-100"
          >
            <h2 className="text-xl font-semibold mb-4">
              🧠 AI Response
            </h2>

            <div className="bg-slate-50 p-4 rounded-xl whitespace-pre-wrap text-sm leading-relaxed">
              {loadingAI ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                response
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
