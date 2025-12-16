import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "@/utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all"
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problems/getAllProblems"
        );
        setProblems(data.data.allProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problems/getAllProblemsSolvedByUser"
        );
        setSolvedProblems(data.data.problemsSolved);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center  gap-1">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <NavLink
              to="/"
              className="text-xl font-bold text-gray-900"
            >
              CodeCraft
            </NavLink>
          </div>
          <div className="flex items-center space-x-2"></div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-gray-700">
                    {user?.firstName
                      ?.charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="btn btn-ghost btn-sm p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-white rounded-lg w-48 border border-gray-200 mt-1"
              >
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-red-500 hover:bg-red-100 rounded px-3 py-2"
                  >
                    Logout
                  </button>
                </li>
                {user?.role === "admin" && (
                  <li>
                    <NavLink
                      to="/admin"
                      className="text-sm text-gray-700 hover:bg-gray-100 rounded px-3 py-2"
                    >
                      Admin Dashboard
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Problems
              </h1>
              <p className="text-gray-600">
                Solve coding challenges to improve your skills
              </p>
            </div>
            {user && solvedProblems.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {solvedProblems.length}
                    </p>
                    <p className="text-sm text-gray-500">
                      Problems Solved
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value
                    })
                  }
                >
                  <option value="all">All Problems</option>
                  <option value="solved">Solved Only</option>
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Difficulty
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      difficulty: e.target.value
                    })
                  }
                >
                  <option value="all">
                    All Difficulties
                  </option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Tag
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      tag: e.target.value
                    })
                  }
                >
                  <option value="all">All Tags</option>
                  <option value="array">Array</option>
                  <option value="linkedList">
                    Linked List
                  </option>
                  <option value="graph">Graph</option>
                  <option value="dp">
                    Dynamic Programming
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <div
                key={problem._id}
                className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="hover:text-primary"
                          >
                            {problem.title}
                          </NavLink>
                        </h2>
                        {solvedProblems.some(
                          (sp) =>
                            sp._id === problem._id
                        ) && (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded text-xs font-medium">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Solved
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyBadgeColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </div>
                        <div className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-medium">
                          {problem.tags}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90"
                      >
                        Solve
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No problems found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredProblems.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
              <div>
                Showing {filteredProblems.length} of{" "}
                {problems.length} problems
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    Easy:{" "}
                    {
                      problems.filter(
                        (p) => p.difficulty === "easy"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>
                    Medium:{" "}
                    {
                      problems.filter(
                        (p) => p.difficulty === "medium"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>
                    Hard:{" "}
                    {
                      problems.filter(
                        (p) => p.difficulty === "hard"
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-50 text-green-700 border border-green-100";
    case "medium":
      return "bg-yellow-50 text-yellow-700 border border-yellow-100";
    case "hard":
      return "bg-red-50 text-red-700 border border-red-100";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

export default Homepage;
