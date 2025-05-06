import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import { Helmet } from "react-helmet";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    noTelepon: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw new Error(error.message);
      }
      const user = data.user;

      const defaultAvatarUrl =
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email,
        no_telepon: formData.noTelepon,
        avatar_url: defaultAvatarUrl,
      });

      if (profileError) {
        throw new Error("Error saving user profile.");
      }

      setSuccessMessage(
        "Success! Your account has been successfully registered. We'll redirect you to the login page shortly."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>CoffeeShopMe | Register</title>
      </Helmet>
      <div className="max-w-md w-full bg-white dark:bg-[#121212] shadow-2xl rounded-2xl p-6 space-y-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white">
          Create a New Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
          Create an account to enjoy our best services
        </p>

        {/* Error / Success Notification */}
        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-xl border border-red-500 shadow-md">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-sm text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 p-3 rounded-xl border border-green-500 shadow-md">
            {successMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            "Full Name",
            "Username",
            "Email",
            "Phone Number",
            "Password",
            "Confirm Password",
          ].map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
              </label>
              <input
                type={
                  label.includes("Password")
                    ? "password"
                    : label.includes("Email")
                    ? "email"
                    : label.includes("Phone")
                    ? "tel"
                    : "text"
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-all duration-300 text-sm"
                placeholder={`Enter your ${label.toLowerCase()}`}
                required
              />
            </div>
          ))}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white text-sm font-semibold rounded-xl shadow-md transition-all transform active:scale-95 duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-85 hover:shadow-lg"
            }`}
          >
            {isLoading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Already Have an Account */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition-colors duration-300"
            >
              Login Now
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
