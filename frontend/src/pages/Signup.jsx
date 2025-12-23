import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "@/authSlice";
import toast, { Toaster } from "react-hot-toast";

const signupSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .toLowerCase(),
  email: z.string().email("Invalid Email"),
  age: z.coerce
    .number()
    .min(5, "Age must be at least 5")
    .max(100, "Age must be valid"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(
  //       typeof error === "string" ? error : "Registration failed"
  //     );
  //   }
  // }, [error]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex text-gray-800">
      {/* Left Side - Dark Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          ></div>

          {/* Floating Code Elements */}
          <div className="absolute top-16 right-20 text-gray-600 font-mono text-sm opacity-40">
            {"<code>"}
          </div>
          <div className="absolute bottom-24 left-16 text-gray-600 font-mono text-sm opacity-40">
            {"</code>"}
          </div>
          <div className="absolute top-1/3 right-12 text-gray-600 font-mono text-xs opacity-30">
            {"{ }"}
          </div>
          <div className="absolute bottom-1/3 left-24 text-gray-600 font-mono text-xs opacity-30">
            {"[ ]"}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-black">C</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight">
                CodeCraft
              </h1>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-400 text-center max-w-md leading-relaxed mb-8">
            Master the art of coding through practice, challenges, and real-world problems
          </p>

          {/* Features */}
          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 bg-gray-800/80 rounded-lg flex items-center justify-center border border-gray-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm">Practice with coding challenges</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 bg-gray-800/80 rounded-lg flex items-center justify-center border border-gray-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm">Track your progress & skill growth</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 bg-gray-800/80 rounded-lg flex items-center justify-center border border-gray-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm">Join a community of developers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="card w-full max-w-md bg-white shadow-2xl border border-gray-100 rounded-2xl">
          <div className="card-body p-6 sm:p-8">
            {/* Header Section */}
            <div className="text-center mb-6">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Join CodeCraft
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Create your account to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name Field */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-semibold text-gray-700">
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${errors.fullName ? "input-error bg-red-50" : "border-gray-200"
                    }`}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <span className="text-error text-xs mt-1 ml-1 font-medium">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              {/* Grid for Username and Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username Field */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-semibold text-gray-700">
                      Username
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="johndoe123"
                    className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${errors.username ? "input-error bg-red-50" : "border-gray-200"
                      }`}
                    {...register("username")}
                  />
                  {errors.username && (
                    <span className="text-error text-xs mt-1 ml-1 font-medium">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                {/* Age Field */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-semibold text-gray-700">
                      Age
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="18"
                    className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${errors.age ? "input-error bg-red-50" : "border-gray-200"
                      }`}
                    {...register("age")}
                  />
                  {errors.age && (
                    <span className="text-error text-xs mt-1 ml-1 font-medium">
                      {errors.age.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-semibold text-gray-700">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? "input-error bg-red-50" : "border-gray-200"
                    }`}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-error text-xs mt-1 ml-1 font-medium">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label pt-0">
                  <span className="label-text font-semibold text-gray-700">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? "input-error bg-red-50" : "border-gray-200"
                      }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-error text-xs mt-1 ml-1 font-medium">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="form-control pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary w-full text-white shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] ${loading ? "loading btn-disabled" : ""
                    }`}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="font-semibold text-primary hover:text-primary-focus transition-colors"
                >
                  Log in
                </NavLink>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
