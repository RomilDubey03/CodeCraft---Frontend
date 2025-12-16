import React, { useState } from "react";
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video, BookOpenText } from "lucide-react";
import { NavLink } from "react-router";

function AdminActions() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add a new coding problem to the platform",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      route: "/admin/create"
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems and their details",
      icon: Edit,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100",
      route: "/admin/update"
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove problems from the platform",
      icon: Trash2,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      route: "/admin/delete"
    },
    {
      id: "publish editorials",
      title: "Publish Editorials",
      description: "Publish Editorials",
      icon: BookOpenText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      route: "/admin/editorials"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage coding problems on your platform
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`bg-white border ${option.borderColor} rounded-lg hover:border-gray-300 transition-colors`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`${option.bgColor} p-3 rounded-lg`}
                    >
                      <IconComponent
                        size={24}
                        className={option.color}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {option.title}
                      </h2>

                      <p className="text-gray-600 text-sm mb-4">
                        {option.description}
                      </p>

                      {/* Action Button */}
                      <div>
                        <NavLink
                          to={option.route}
                          className="inline-block px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90"
                        >
                          Go to {option.title}
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats
        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                12
              </div>
              <div className="text-sm text-gray-500">
                Total Problems
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                3
              </div>
              <div className="text-sm text-gray-500">
                Easy Problems
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                7
              </div>
              <div className="text-sm text-gray-500">
                Medium Problems
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                2
              </div>
              <div className="text-sm text-gray-500">
                Hard Problems
              </div>
            </div>
          </div>
        </div> */}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Home size={16} />
            Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default AdminActions;
