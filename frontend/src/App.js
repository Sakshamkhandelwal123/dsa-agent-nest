import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

function codeChildText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children
      .map((c) => (typeof c === "string" ? c : ""))
      .join("");
  }
  return "";
}

function normalizeBlockCodeChildren(children) {
  const normalizeTabs = (value) => value.replace(/\t/g, "    ");

  if (typeof children === "string") {
    return normalizeTabs(children);
  }
  if (Array.isArray(children)) {
    return children.map((c) => (typeof c === "string" ? normalizeTabs(c) : c));
  }
  return children;
}

/** Fenced blocks are `pre` + `code` (often `language-*`). Inline `code` has no newline. */
function createMarkdownComponents(isDark) {
  return {
    pre({ children, ...props }) {
      return (
        <pre
          className={`my-4 overflow-x-auto rounded-lg px-6 py-4 text-sm leading-relaxed shadow-inner ${isDark
              ? "!bg-slate-950 !text-slate-100"
              : "!bg-slate-900 !text-slate-100"
            }`}
          style={{ tabSize: 4 }}
          {...props}
        >
          {children}
        </pre>
      );
    },
    code({ className, children, ...props }) {
      const text = codeChildText(children);
      const isBlock =
        /\blanguage-[\w-]+\b/.test(String(className || "")) ||
        text.includes("\n");

      if (!isBlock) {
        return (
          <code
            className={`rounded px-1.5 py-0.5 font-mono text-[0.9em] ${isDark
                ? "bg-slate-700/80 text-slate-100"
                : "bg-slate-200/90 text-slate-800"
              }`}
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code
          className={`block whitespace-pre pl-1 font-mono !text-slate-100 ${className ?? ""}`}
          {...props}
        >
          {normalizeBlockCodeChildren(children)}
        </code>
      );
    },
  };
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [leetcode, setLeetcode] = useState(null);
  const [recent, setRecent] = useState([]);
  const [insights, setInsights] = useState(null);
  const responseRef = useRef(null);
  const markdownComponents = createMarkdownComponents(isDark);

  const API_BASE = "/api";

  useEffect(() => {
    fetchLeetcode();
    fetchRecent();
    fetchInsights();
  }, []);

  useEffect(() => {
    if ((response || loadingAI) && responseRef.current) {
      responseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [response, loadingAI]);

  useEffect(() => {
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const fetchLeetcode = async () => {
    try {
      const res = await fetch(`${API_BASE}/leetcode/stats`);
      const data = await res.json();
      setLeetcode(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch(`${API_BASE}/agent/insights`);
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await fetch(`${API_BASE}/leetcode/recent`);
      const data = await res.json();
      setRecent(data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const suggestionQuestionText =
    typeof suggestion?.question === "string" ? suggestion.question : "";
  const suggestionLink =
    typeof suggestion?.link === "string" ? suggestion.link : "";
  const suggestionTitleSlug =
    typeof suggestion?.titleSlug === "string" ? suggestion.titleSlug : "";
  const suggestionSlug =
    suggestionTitleSlug ||
    suggestionQuestionText.toLowerCase().replace(/\s+/g, "-");
  const suggestionHref = suggestionLink || (
    suggestionSlug ? `https://leetcode.com/problems/${suggestionSlug}` : ""
  );

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${isDark
          ? "bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100"
          : "bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900"
        }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
              🚀 DSA AI Agent
            </h1>
            <p className={`mt-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Your Personal Leetcode + Striver A2Z Coach
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${isDark
                ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Leetcode Stats */}
        {leetcode && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

            <div className={`rounded-xl shadow p-4 ${isDark ? "bg-slate-800/80" : "bg-white"}`}>
              <div className={`text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>Total</div>
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

        {/* Learning Insights */}
        {insights && (
          <div
            className={`rounded-2xl shadow-lg p-6 border mb-6 ${isDark
                ? "bg-slate-800/80 border-slate-700"
                : "bg-white border-slate-100"
              }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              🧠 Learning Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Most Asked */}
              <div>
                <div className={`text-sm mb-1 ${isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                  Most Asked
                </div>

                <div className="text-lg font-semibold capitalize">
                  {insights.mostAsked || "-"}
                </div>
              </div>

              {/* Recent Focus */}
              <div>
                <div className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                  Recent Focus
                </div>

                <div className="space-y-1">
                  {insights.recentFocus?.map((topic, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 rounded-lg text-sm capitalize ${isDark
                          ? "bg-slate-700"
                          : "bg-slate-100"
                        }`}
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <div className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                  Difficulty
                </div>

                <div className="space-y-1 text-sm">

                  <div className="flex justify-between">
                    <span>Easy</span>
                    <span className="font-semibold text-green-500">
                      {insights.difficultyBreakdown?.easy || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Medium</span>
                    <span className="font-semibold text-yellow-500">
                      {insights.difficultyBreakdown?.medium || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Hard</span>
                    <span className="font-semibold text-red-500">
                      {insights.difficultyBreakdown?.hard || 0}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Solved */}
          <div className={`rounded-2xl shadow-lg p-6 border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-100"}`}>
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
                  className={`block p-3 rounded-lg transition ${isDark
                      ? "bg-slate-700/70 hover:bg-slate-700 text-slate-100"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800"
                    }`}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Suggestion */}
          <div className={`rounded-2xl shadow-lg p-6 border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-100"}`}>
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">
                🎯 Suggested
              </h2>
            </div>

            {!suggestion && (
              <div className={`flex flex-col items-center justify-center text-center py-8 ${isDark ? "text-slate-400" : "text-slate-400"}`}>
                <div className="text-4xl mb-2">🧠</div>
                <p className="text-sm">
                  Get a smart question based on your progress
                </p>
                <button
                  type="button"
                  onClick={getSuggestion}
                  disabled={loadingSuggestion}
                  className={`mt-4 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-sm ${isDark ? "bg-slate-700 hover:bg-slate-600 text-slate-100" : "bg-slate-100 hover:bg-slate-200"
                    }`}
                >
                  {loadingSuggestion ? "Loading…" : "Generate Suggestion"}
                </button>
              </div>
            )}

            {suggestion && (
              <div className={`rounded-xl p-4 ${isDark ? "bg-slate-700/60" : "bg-slate-50"}`}>
                <div className={`text-sm mb-1 ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                  Topic
                </div>
                <div className="text-lg font-semibold mb-3 capitalize">
                  {suggestion.topic}
                </div>

                <div className={`text-sm mb-1 ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                  Question
                </div>

                {suggestionHref ? (
                  <a
                    href={suggestionHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-medium hover:underline ${isDark ? "text-blue-300" : "text-blue-600"}`}
                  >
                    {suggestionQuestionText || "Open problem"}
                  </a>
                ) : (
                  <div className={`font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {suggestionQuestionText || "Problem link unavailable"}
                  </div>
                )}

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
          <div className={`rounded-2xl shadow-lg p-6 border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-100"}`}>
            <h2 className="text-xl font-semibold mb-4">
              🤖 Ask AI Coach
            </h2>

            <input
              type="text"
              placeholder="Ask about any DSA problem..."
              className={`w-full rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark
                  ? "border border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-400"
                  : "border border-slate-200"
                }`}
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
            className={`mt-6 rounded-2xl shadow-lg p-6 border ${isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-100"}`}
          >
            <h2 className="text-xl font-semibold mb-4">
              🧠 AI Response
            </h2>

            <div className={`p-4 rounded-xl text-sm leading-relaxed ${isDark ? "bg-slate-900/70" : "bg-slate-50"}`}>
              {loadingAI ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div
                  className={`${isDark ? "prose prose-invert" : "prose prose-slate"} max-w-none text-sm leading-relaxed
                    prose-headings:font-semibold prose-p:my-3 prose-li:my-1
                    prose-pre:my-0`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={markdownComponents}
                  >
                    {response}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
