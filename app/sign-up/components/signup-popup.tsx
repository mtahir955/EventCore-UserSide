"use client";

import { useState } from "react";
import Image from "next/image";
// import axios from "axios";
import toast from "react-hot-toast";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
// import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { apiClient } from "@/lib/apiClient";

type AuthView = "signup" | "signin" | "forgot-password" | "reset-password";

interface SignupPopupProps {
  onNavigate: (view: AuthView) => void;
}

export default function SignupPopup({ onNavigate }: SignupPopupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ⭐ NEW HELP POPUP STATE
  const [showHelp, setShowHelp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // ⭐ HANDLE SUBMIT + API CALL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: formData.name.trim() === "",
      phone: formData.phone.trim() === "",
      username: formData.username.trim() === "",
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
      confirmPassword:
        formData.confirmPassword.trim() === "" ||
        formData.confirmPassword !== formData.password,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v)) {
      toast.error("Please fill all required fields correctly!");
      return;
    }

    try {
      const payload = {
        fullName: formData.name,
        phone: formData.phone,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // const response = await axios.post(
      //   `${API_BASE_URL}/auth/buyer/signup`,
      //   payload,
      //   {
      //     headers: {
      //       "X-Tenant-ID": HOST_Tenant_ID,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      const response = await apiClient.post(`/auth/buyer/signup`, payload);

      const data = response.data?.data;

      toast.success("Account created successfully!");

      localStorage.setItem(
        "buyerUser",
        JSON.stringify({
          userId: data.userId,
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar,
          token: data.token,
        })
      );

      onNavigate("signin");
    } catch (error: any) {
      console.error("Signup error:", error);

      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  // -------------------------------
  // 🚀 GOOGLE SIGN UP
  // -------------------------------
  // const googleSignup = useGoogleLogin({
  //   flow: "implicit", // ensures access_token returns
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       // Get Google user profile using access_token
  //       const googleUser = await fetch(
  //         `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
  //       ).then((res) => res.json());

  //       // Send access_token to backend (backend will verify it)
  //       const response = await fetch(`${API_BASE_URL}/auth/social/login`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-Tenant-ID": HOST_Tenant_ID,
  //         },
  //         body: JSON.stringify({
  //           provider: "google",
  //           idToken: tokenResponse.access_token, // ✔ USE access_token
  //         }),
  //       });

  //       const data = await response.json();
  //       if (!response.ok) throw new Error(data.message);

  //       localStorage.setItem("buyerToken", data.data.access_token);
  //       localStorage.setItem("userData", JSON.stringify(data.data.user));

  //       toast.success("Signed up with Google!");
  //       window.location.href = "/#";
  //     } catch (err: any) {
  //       toast.error(err.message || "Google signup failed");
  //     }
  //   },
  //   onError: () => toast.error("Google signup failed"),
  // });

  // -------------------------------
  // 🚀 APPLE SIGN UP
  // -------------------------------
  const appleSignup = async () => {
    try {
      if (!window.AppleID) {
        toast.error("Apple Sign-In not supported.");
        return;
      }

      window.AppleID.auth.init({
        clientId: "com.eventcore.app", // YOUR APPLE CLIENT ID
        scope: "name email",
        redirectURI: "http://localhost:3000", // LOCAL ONLY
        usePopup: true,
      });

      const result = await window.AppleID.auth.signIn();

      const idToken = result.authorization.id_token;
      const user = result.user;

      const response = await fetch(`${API_BASE_URL}/auth/social/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-ID": HOST_Tenant_ID,
        },
        body: JSON.stringify({
          provider: "apple",
          idToken,
          firstName: user?.name?.firstName,
          lastName: user?.name?.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("buyerToken", data.data.access_token);
      localStorage.setItem("userData", JSON.stringify(data.data.user));

      toast.success("Signed up with Apple!");

      window.location.href = "/#";
    } catch (error: any) {
      toast.error(error.message || "Apple signup failed");
    }
  };

  return (
    <div
      className="
      w-full max-w-[596px] 
      h-[90vh] md:h-[600px]
      bg-white dark:bg-[#212121] 
      rounded-lg shadow-xl 
      p-4 sm:p-6 md:p-8 
      font-sans 
      overflow-y-auto 
      scrollbar-hide
    "
    >
      {/* Header */}
      <div className="mb-4 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0077F7] dark:text-white mb-2">
          Create your account
        </h1>
        <h2 className="text-sm sm:text-base font-bold text-black dark:text-white leading-tight mb-2">
          Free and Start Exploring Amazing Events Today
        </h2>
        <p className="text-gray-700 dark:text-gray-400 text-[11px] sm:text-[12px] leading-relaxed">
          Join now to discover concerts, festivals, and experiences you'll love
          – all in one place.
        </p>
      </div>

      {/* Social Login */}
      <div className="space-y-3 sm:space-y-4 mb-3">
        {/* <button
          onClick={() => googleSignup()}
          className="w-full h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <Image
            src="/images/google-icon.png"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="text-black dark:text-white font-medium text-[13px]">
            Sign up with Google
          </span>
        </button> */}

        {/* Social Login */}
        <div className="space-y-3 sm:space-y-4 mb-3">
          <GoogleLogin
            theme="outline"
            size="large"
            width="100%"
            text="signup_with"
            onSuccess={async (credentialResponse) => {
              // try {
              //   // ✅ ID TOKEN (JWT)
              //   const idToken = credentialResponse.credential;

              //   if (!idToken) {
              //     throw new Error("Google ID token missing");
              //   }

              //   const response = await fetch(
              //     `${API_BASE_URL}/auth/social/login`,
              //     {
              //       method: "POST",
              //       headers: {
              //         "Content-Type": "application/json",
              //         "X-Tenant-ID": HOST_Tenant_ID,
              //       },
              //       body: JSON.stringify({
              //         provider: "google",
              //         idToken,
              //       }),
              //     }
              //   );

              //   const data = await response.json();
              //   if (!response.ok) throw new Error(data.message);

              //   localStorage.setItem("buyerToken", data.data.access_token);
              //   localStorage.setItem(
              //     "userData",
              //     JSON.stringify(data.data.user)
              //   );

              //   toast.success("Signed up with Google!");
              //   window.location.href = "/#";
              // } catch (err: any) {
              //   toast.error(err.message || "Google signup failed");
              // }
              try {
                const idToken = credentialResponse.credential;

                if (!idToken) {
                  throw new Error("Google ID token missing");
                }

                const res = await apiClient.post(`/auth/social/login`, {
                  provider: "google",
                  idToken,
                });

                const data = res.data?.data; // backend shape: { success, data: {...} }

                localStorage.setItem("buyerToken", data.access_token);
                localStorage.setItem("userData", JSON.stringify(data.user));

                toast.success("Signed up with Google!");
                window.location.href = "/#";
              } catch (err: any) {
                toast.error(
                  err?.response?.data?.message ||
                    err?.message ||
                    "Google signup failed"
                );
              }
            }}
            onError={() => toast.error("Google Sign-In failed")}
          />
        </div>

        {/* <button
          onClick={appleSignup}
          className="w-full h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <Image
            src="/images/apple-icon.png"
            alt="Apple"
            width={20}
            height={20}
          />
          <span className="text-black dark:text-white font-medium text-[13px]">
            Sign up with Apple
          </span>
        </button> */}
      </div>

      {/* Divider */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
        Or
      </div>

      {/* FORM */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <InputField
          label="Full Name"
          value={formData.name}
          placeholder="Enter your full name"
          error={errors.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
        />

        <InputField
          label="Phone Number"
          value={formData.phone}
          placeholder="Enter your phone number"
          error={errors.phone}
          onChange={(v) => setFormData({ ...formData, phone: v })}
        />

        <InputField
          label="Username"
          value={formData.username}
          placeholder="Choose a username"
          error={errors.username}
          onChange={(v) => setFormData({ ...formData, username: v })}
        />

        <InputField
          label="Email"
          value={formData.email}
          placeholder="Enter your email"
          error={errors.email}
          onChange={(v) => setFormData({ ...formData, email: v })}
        />

        {/* Password */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              className={`w-full h-10 rounded-lg px-4 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
                errors.password
                  ? "bg-red-50 border border-red-500 focus:ring-red-500"
                  : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? (
                // Hide icon (eye with slash)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Show icon (open eye)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.45703 12C3.73128 7.94288 7.52159 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C20.2672 16.0571 16.4769 19 11.9992 19C7.52159 19 3.73128 16.0571 2.45703 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9992 15C13.6561 15 14.9992 13.6569 14.9992 12C14.9992 10.3431 13.6561 9 11.9992 9C10.3424 9 8.99924 10.3431 8.99924 12C8.99924 13.6569 10.3424 15 11.9992 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Re-enter your password"
              className={`w-full h-10 rounded-lg px-4 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "bg-red-50 border border-red-500 focus:ring-red-500"
                  : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
              }`}
            />

            {/* Eye Toggle Button */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showConfirmPassword ? (
                // Eye Off
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Eye
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.45703 12C3.73128 7.94288 7.52159 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C20.2672 16.0571 16.4769 19 11.9992 19C7.52159 19 3.73128 16.0571 2.45703 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9992 15C13.6561 15 14.9992 13.6569 14.9992 12C14.9992 10.3431 13.6561 9 11.9992 9C10.3424 9 8.99924 10.3431 8.99924 12C8.99924 13.6569 10.3424 15 11.9992 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-lg font-bold text-white uppercase tracking-wide transition-colors text-sm sm:text-base"
          style={{ backgroundColor: "#0077F7" }}
        >
          CREATE ACCOUNT
        </button>
      </form>

      {/* Legal */}
      <p className="text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400 text-center mt-3 leading-relaxed">
        By Signing up, you agree to our Privacy Policy and Terms of Service
      </p>

      {/* Login link */}
      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-1">
        Already a Member?{" "}
        <button
          className="font-medium hover:underline"
          style={{ color: "#0077F7" }}
          onClick={() => onNavigate("signin")}
        >
          Log In
        </button>
      </p>

      {/* ⭐ NEW NEED HELP LINK */}
      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-1">
        Need Help?{" "}
        <button
          className="font-medium hover:underline"
          style={{ color: "#0077F7" }}
          onClick={() => setShowHelp(true)}
        >
          Contact Support
        </button>
      </p>

      {/* ⭐ HELP POPUP */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-xl p-6 w-[90%] max-w-[380px] text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Need Assistance?
            </h2>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Our support team is here to help you.
            </p>

            <div className="text-sm space-y-2 text-gray-800 dark:text-gray-200">
              <p>
                <strong>📞 Phone:</strong> +1 (800) 452-1180
              </p>
              <p>
                <strong>📧 Email:</strong> support@eventcore.com
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                We typically respond within <strong>24 hours</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full h-10 rounded-lg font-medium text-white"
              style={{ backgroundColor: "#0077F7" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* REUSABLE INPUT FIELD */
function InputField({
  label,
  value,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  error: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-10 rounded-lg px-4 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
          error
            ? "bg-red-50 border border-red-500 focus:ring-red-500"
            : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
        }`}
      />
    </div>
  );
}
