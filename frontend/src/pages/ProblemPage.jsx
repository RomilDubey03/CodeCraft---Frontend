import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "@/utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import AIChatBot from "../components/AIChatBot";
import Editorial from "../components/Editorial";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript"
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/api/v1/problems/problemByID/${problemId}`
        );

        const problemData = response.data.data.problemRequested;
        const initialCode = problemData.starterCode.find(
          (sc) => sc.language === langMap[selectedLanguage]
        ).code;

        setProblem(problemData);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.starterCode.find(
        (sc) => sc.language === langMap[selectedLanguage]
      ).code;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(
        `/api/v1/submissions/run/${problemId}`,
        {
          code,
          language: selectedLanguage
        }
      );

      setRunResult(response.data.data);
      setLoading(false);
      setActiveRightTab("testcase");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal server error"
      });
      setLoading(false);
      setActiveRightTab("testcase");
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(
        `/api/v1/submissions/submit/${problemId}`,
        {
          code: code,
          language: selectedLanguage
        }
      );

      setSubmitResult(response.data.data);
      setLoading(false);
      setActiveRightTab("result");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab("result");
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-50 text-green-700 border border-green-100";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100";
      case "hard":
        return "bg-red-50 text-red-700 border border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
        {/* Left Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex px-4">
            {["description", "editorial", "solutions", "submissions", "chatAI"].map((tab) => {
              const tabLabels = {
                description: "Description",
                editorial: "Editorial",
                solutions: "Solutions",
                submissions: "Submissions",
                chatAI: "ChatAI"
              };

              return (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeLeftTab === tab
                    ? "text-primary border-primary"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                    }`}
                  onClick={() => setActiveLeftTab(tab)}
                >
                  {tabLabels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === "description" && (
                <div className="space-y-6">
                  {/* Problem Header */}
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        {problem.title}
                      </h1>
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyBadgeColor(problem.difficulty)}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium">
                          {problem.tags.charAt(0).toUpperCase() + problem.tags.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                          {problem.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Examples</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <h4 className="font-medium text-gray-700">
                              Example {index + 1}
                            </h4>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-500 mb-1">Input</div>
                              <div className="min-w-0">
                                <pre className="bg-gray-50 text-gray-800 p-3 rounded text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words max-w-full">
                                  {example.input}
                                </pre>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500 mb-1">Output</div>
                              <div className="min-w-0">
                                <pre className="bg-gray-50 text-gray-800 p-3 rounded text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words max-w-full">
                                  {example.output}
                                </pre>
                              </div>
                            </div>
                            {example.explanation && (
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Explanation</div>
                                <div className="text-gray-700 text-sm p-3 bg-blue-50 rounded border border-blue-100 break-words">
                                  {example.explanation}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === "editorial" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Editorial</h2>
                  <p className="text-gray-600 mb-6">Editorial content will be available soon!</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 inline-block">
                    <p className="text-sm text-gray-700">
                      Stay tuned for detailed explanations and solutions.
                    </p>
                  </div>
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Solutions</h2>
                    <div className="text-sm text-gray-500">
                      {problem.referenceSolution?.length || 0} solutions available
                    </div>
                  </div>

                  {problem.referenceSolution?.length > 0 ? (
                    <div className="space-y-4">
                      {problem.referenceSolution.map((solution, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              Solution {index + 1} • {solution.language}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              Reference
                            </span>
                          </div>
                          <div className="p-4">
                            <div className="bg-gray-50 rounded border border-gray-200 overflow-hidden">
                              <div className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium border-b border-gray-200">
                                {solution.language}
                              </div>
                              <pre className="p-4 text-sm text-gray-800 overflow-x-auto max-h-96 whitespace-pre-wrap break-words">
                                <code>{solution.completeCode}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Solutions Locked</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Solve this problem first to unlock community solutions.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">My Submissions</h2>
                    <div className="text-sm text-gray-500">
                      View your submission history
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === "chatAI" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Chat with AI Assistant</h2>
                      <p className="text-sm text-gray-600">Get help and explanations for this problem</p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <AIChatBot problem={problem} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col bg-white">
        {/* Right Tabs Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex px-4">
            {["code", "testcase", "result"].map((tab) => {
              const tabLabels = {
                code: "Code Editor",
                testcase: "Test Results",
                result: "Submission Result"
              };

              return (
                <button
                  key={tab}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeRightTab === tab
                    ? "text-primary border-primary"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                    }`}
                  onClick={() => setActiveRightTab(tab)}
                >
                  {tabLabels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === "code" && (
            <div className="flex-1 flex flex-col">
              {/* Editor Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Language:</span>
                  <div className="flex gap-1">
                    {["javascript", "java", "cpp"].map((lang) => (
                      <button
                        key={lang}
                        className={`px-3 py-1.5 text-sm font-medium rounded ${selectedLanguage === lang
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {langMap[lang]}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setActiveRightTab("testcase")}
                >
                  Console
                </button>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="light"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: "on",
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: "line",
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: "line",
                    mouseWheelZoom: true
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t border-gray-200 bg-white flex justify-end gap-3">
                <button
                  className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 text-gray-700 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={handleRun}
                  disabled={loading}
                >
                  {loading ? "Running..." : "Run Code"}
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={handleSubmitCode}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {activeRightTab === "testcase" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setActiveRightTab("code")}
                >
                  Back to Editor
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {runResult ? (
                  <div className="space-y-6">
                    {/* Result Summary Card */}
                    <div className={`rounded-lg border p-4 ${runResult.success
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${runResult.success
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                          }`}
                        >
                          {runResult.success ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${runResult.success ? "text-green-800" : "text-red-800"}`}>
                            {runResult.success ? "All Test Cases Passed!" : "Test Cases Failed"}
                          </h4>
                          <div className="text-sm text-gray-600 mt-1">
                            Runtime: {runResult.runtime} sec • Memory: {runResult.memory} KB
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test Cases Details */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-700">Detailed Results</h5>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {runResult.testCases.map((tc, i) => (
                          <div
                            key={i}
                            className={`rounded-lg border p-4 ${tc.status_id === 3
                              ? "border-green-200"
                              : "border-red-200"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tc.status_id === 3
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {tc.status_id === 3 ? "✓" : "✗"}
                                </div>
                                <span className="font-medium text-gray-900">Test Case {i + 1}</span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${tc.status_id === 3
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                              >
                                {tc.status_id === 3 ? "Passed" : "Failed"}
                              </span>
                            </div>

                            <div className="space-y-3 text-sm">
                              <div>
                                <div className="text-gray-500 mb-1">Input</div>
                                <pre className="bg-gray-50 text-gray-800 p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                  {tc.stdin}
                                </pre>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Expected Output</div>
                                <pre className="bg-gray-50 text-gray-800 p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                  {tc.expected_output}
                                </pre>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Your Output</div>
                                <pre className="bg-gray-50 text-gray-800 p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                  {tc.stdout || "No output"}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Test Results Yet</h4>
                    <p className="text-gray-600 mb-6">Run your code to see test results here</p>
                    <button
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90"
                      onClick={() => setActiveRightTab("code")}
                    >
                      Go to Editor
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeRightTab === "result" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Submission Result</h3>
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setActiveRightTab("code")}
                >
                  Back to Editor
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {submitResult ? (
                  <div className="space-y-6">
                    {/* Submission Result Card */}
                    <div className={`rounded-lg border p-6 ${submitResult.accepted
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${submitResult.accepted
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                          }`}
                        >
                          {submitResult.accepted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h4 className={`text-xl font-bold ${submitResult.accepted ? "text-green-800" : "text-red-800"}`}>
                            {submitResult.accepted ? "Accepted" : submitResult.error}
                          </h4>
                          <p className="text-gray-600 mt-1">
                            {submitResult.accepted
                              ? "Your solution passed all test cases."
                              : "Your solution didn't pass all test cases."}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{submitResult.passedTestCases}</div>
                          <div className="text-sm text-gray-500">Passed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{submitResult.totalTestCases}</div>
                          <div className="text-sm text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{submitResult.runtime}</div>
                          <div className="text-sm text-gray-500">Runtime (s)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{submitResult.memory}</div>
                          <div className="text-sm text-gray-500">Memory (KB)</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Test Cases</span>
                          <span>{submitResult.passedTestCases}/{submitResult.totalTestCases}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${submitResult.accepted ? "bg-green-500" : "bg-red-500"}`}
                            style={{ width: `${(submitResult.passedTestCases / submitResult.totalTestCases) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Next Steps</h5>
                      <div className="flex gap-3">
                        <button
                          className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                          onClick={() => setActiveRightTab("code")}
                        >
                          Try Again
                        </button>
                        <button
                          className="px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90"
                          onClick={() => setActiveLeftTab("solutions")}
                        >
                          View Solutions
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Submission Yet</h4>
                    <p className="text-gray-600 mb-6">Submit your solution to see evaluation results</p>
                    <button
                      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90"
                      onClick={() => setActiveRightTab("code")}
                    >
                      Go to Editor
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;