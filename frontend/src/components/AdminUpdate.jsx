import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { useNavigate } from "react-router";
import { Edit } from "lucide-react";

const AdminUpdate = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const { data } = await axiosClient.get(
                    "api/v1/problems/getAllProblems"
                );
                setProblems(data.data.allProblems);
            } catch (err) {
                setError("Failed to fetch problems");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/update/${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-gray-600">Loading problems...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Update Problems
                    </h1>
                    <p className="text-gray-600">
                        Select a problem to edit its details
                    </p>
                </div>

                {/* Stats */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500">
                                Total Problems
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {problems.length}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <div className="text-sm text-gray-500">
                                    Easy
                                </div>
                                <div className="text-xl font-bold text-green-600">
                                    {
                                        problems.filter(
                                            (p) =>
                                                p.difficulty?.toLowerCase() ===
                                                "easy"
                                        ).length
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Medium
                                </div>
                                <div className="text-xl font-bold text-yellow-600">
                                    {
                                        problems.filter(
                                            (p) =>
                                                p.difficulty?.toLowerCase() ===
                                                "medium"
                                        ).length
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">
                                    Hard
                                </div>
                                <div className="text-xl font-bold text-red-600">
                                    {
                                        problems.filter(
                                            (p) =>
                                                p.difficulty?.toLowerCase() ===
                                                "hard"
                                        ).length
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                            <div className="col-span-1">#</div>
                            <div className="col-span-5">Title</div>
                            <div className="col-span-2">Difficulty</div>
                            <div className="col-span-2">Tags</div>
                            <div className="col-span-2 text-center">
                                Actions
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {problems.map((problem, index) => (
                            <div
                                key={problem._id}
                                className="p-4 hover:bg-gray-50"
                            >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1 text-sm text-gray-500">
                                        {index + 1}
                                    </div>

                                    <div className="col-span-5">
                                        <div className="font-medium text-gray-900">
                                            {problem.title}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${problem.difficulty?.toLowerCase() ===
                                                "easy"
                                                ? "bg-green-50 text-green-700 border border-green-100"
                                                : problem.difficulty?.toLowerCase() ===
                                                    "medium"
                                                    ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                                    : "bg-red-50 text-red-700 border border-red-100"
                                                }`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                    </div>

                                    <div className="col-span-2">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-medium">
                                            {problem.tags}
                                        </span>
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <button
                                            onClick={() =>
                                                handleEdit(problem._id)
                                            }
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-yellow-600 rounded hover:bg-yellow-700"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {problems.length === 0 && (
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
                            There are no problems to update
                        </p>
                    </div>
                )}

                {/* Info Note */}
                {problems.length > 0 && (
                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <p className="text-sm text-blue-700 font-medium mb-1">
                                    Information
                                </p>
                                <p className="text-sm text-blue-600">
                                    Click the Edit button to modify a problem's
                                    title, description, difficulty, tags, or
                                    test cases.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUpdate;
