import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "@/utils/axiosClient";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required")
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required")
      })
    )
    .min(1, "At least one hidden test case required"),
  starterCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        code: z.string().min(1, "Initial code is required")
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1, "Complete code is required")
      })
    )
    .length(3, "All three languages required")
});

function ProblemPanel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      starterCode: [
        { language: "C++", code: "" },
        { language: "Java", code: "" },
        { language: "JavaScript", code: "" }
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: "visibleTestCases"
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: "hiddenTestCases"
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProblem = async () => {
        try {
          const { data } = await axiosClient.get(
            `/api/v1/problems/problemByID/${id}`
          );
          const problem = data.data.problemRequested;

          reset({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: problem.tags,
            visibleTestCases: problem.visibleTestCases,
            hiddenTestCases: problem.hiddenTestCases,
            starterCode: problem.starterCode,
            referenceSolution: problem.referenceSolution
          });
        } catch (error) {
          console.error(error);
          alert("Failed to fetch problem details");
          navigate("/admin");
        }
      };
      fetchProblem();
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await axiosClient.post(`/problems/update/${id}`, data);
        alert("Problem updated successfully!");
      } else {
        console.log("problem api hit on frontend");
        console.log(data);
        await axiosClient.post("/problems/create", data);
        alert("Problem created successfully!");
      }
      navigate("/admin");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Update Problem" : "Create New Problem"}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Modify the problem details below"
              : "Fill in the details to create a new coding problem"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  {...register("title")}
                  className={`w-full border ${errors.title
                    ? "border-red-300"
                    : "border-gray-300"
                    } rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900`}
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <span className="text-red-600 text-xs mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className={`w-full border ${errors.description
                    ? "border-red-300"
                    : "border-gray-300"
                    } rounded px-3 py-2 text-sm focus:outline-none focus:border-primary h-32 bg-white text-gray-900`}
                  placeholder="Enter problem description"
                />
                {errors.description && (
                  <span className="text-red-600 text-xs mt-1">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    {...register("difficulty")}
                    className={`w-full border ${errors.difficulty
                      ? "border-red-300"
                      : "border-gray-300"
                      } rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900`}
                  >
                    <option value="easy" className="text-gray-900 bg-white">Easy</option>
                    <option value="medium" className="text-gray-900 bg-white">Medium</option>
                    <option value="hard" className="text-gray-900 bg-white">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors.difficulty.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tag
                  </label>
                  <select
                    {...register("tags")}
                    className={`w-full border ${errors.tags
                      ? "border-red-300"
                      : "border-gray-300"
                      } rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900`}
                  >
                    <option value="array" className="text-gray-900 bg-white">Array</option>
                    <option value="linkedList" className="text-gray-900 bg-white">
                      Linked List
                    </option>
                    <option value="graph" className="text-gray-900 bg-white">Graph</option>
                    <option value="dp" className="text-gray-900 bg-white">DP</option>
                  </select>
                  {errors.tags && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors.tags.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Test Cases
            </h2>

            {/* Visible Test Cases */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">
                  Visible Test Cases
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendVisible({
                      input: "",
                      output: "",
                      explanation: ""
                    })
                  }
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90"
                >
                  <Plus size={16} />
                  Add Visible Case
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 p-4 rounded space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">
                      Test Case {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Input
                    </label>
                    <input
                      {...register(
                        `visibleTestCases.${index}.input`
                      )}
                      placeholder="Enter input"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Output
                    </label>
                    <input
                      {...register(
                        `visibleTestCases.${index}.output`
                      )}
                      placeholder="Enter output"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Explanation
                    </label>
                    <textarea
                      {...register(
                        `visibleTestCases.${index}.explanation`
                      )}
                      placeholder="Enter explanation"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-700">
                  Hidden Test Cases
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendHidden({ input: "", output: "" })
                  }
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90"
                >
                  <Plus size={16} />
                  Add Hidden Case
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 p-4 rounded space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">
                      Hidden Test Case {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Input
                    </label>
                    <input
                      {...register(
                        `hiddenTestCases.${index}.input`
                      )}
                      placeholder="Enter input"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Output
                    </label>
                    <input
                      {...register(
                        `hiddenTestCases.${index}.output`
                      )}
                      placeholder="Enter output"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Templates */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Code Templates
            </h2>

            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-medium text-gray-700">
                    {index === 0
                      ? "C++"
                      : index === 1
                        ? "Java"
                        : "JavaScript"}
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Code (Starter Template)
                    </label>
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <textarea
                        {...register(
                          `starterCode.${index}.code`
                        )}
                        className="w-full bg-white text-gray-900 p-3 text-sm font-mono focus:outline-none"
                        rows={6}
                        placeholder={`Enter ${index === 0
                          ? "C++"
                          : index === 1
                            ? "Java"
                            : "JavaScript"
                          } starter code`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference Solution
                    </label>
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <textarea
                        {...register(
                          `referenceSolution.${index}.completeCode`
                        )}
                        className="w-full bg-white text-gray-900 p-3 text-sm font-mono focus:outline-none"
                        rows={6}
                        placeholder={`Enter ${index === 0
                          ? "C++"
                          : index === 1
                            ? "Java"
                            : "JavaScript"
                          } solution`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-50 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs"></span>
                  {isEditMode ? "Updating..." : "Creating..."}
                </span>
              ) : (
                isEditMode ? "Update Problem" : "Create Problem"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProblemPanel;
