"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import {
  getCountryDataList,
  getEmojiFlag,
  type TCountryCode,
} from "countries-list";
import { apiClient } from "@/lib/apiClient";

type AuthView = "signup" | "signin" | "forgot-password" | "reset-password";
type AccountType = "" | "guest" | "ambassador";

interface SignupPopupProps {
  onNavigate: (view: AuthView) => void;
}

const countryCodeOptions = getCountryDataList()
  .flatMap((country) =>
    country.phone.map((phone) => ({
      iso2: country.iso2,
      country: country.name,
      code: `+${phone}`,
      flag: getEmojiFlag(country.iso2),
    }))
  )
  .sort((a, b) => a.country.localeCompare(b.country));

const passwordRequirements = [
  {
    label: "8+ chars",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Uppercase",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Lowercase",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "Number",
    test: (value: string) => /\d/.test(value),
  },
  {
    label: "Special char",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

export default function SignupPopup({ onNavigate }: SignupPopupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    phoneCountryCode: "+1",
    phoneCountryIso: "US" as TCountryCode,
    phoneNumber: "",
    accountType: "" as AccountType,
    ambassadorId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    birthday: false,
    phoneNumber: false,
    accountType: false,
    ambassadorId: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const passwordChecks = useMemo(
    () =>
      passwordRequirements.map((requirement) => ({
        ...requirement,
        met: requirement.test(formData.password),
      })),
    [formData.password]
  );

  const passwordMeetsRequirements = passwordChecks.every((item) => item.met);

  const updateForm = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAmbassador = formData.accountType === "ambassador";
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const combinedPhone = `${formData.phoneCountryCode} ${formData.phoneNumber}`.trim();

    const newErrors = {
      firstName: formData.firstName.trim() === "",
      lastName: formData.lastName.trim() === "",
      birthday: formData.birthday.trim() === "",
      phoneNumber: formData.phoneNumber.trim() === "",
      accountType: formData.accountType === "",
      ambassadorId: isAmbassador && formData.ambassadorId.trim() === "",
      email: formData.email.trim() === "",
      password:
        formData.password.trim() === "" || !passwordMeetsRequirements,
      confirmPassword:
        formData.confirmPassword.trim() === "" ||
        formData.confirmPassword !== formData.password,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      toast.error(
        newErrors.password
          ? "Password does not meet all requirements."
          : "Please fill all required fields correctly!"
      );
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        phoneCountryCode: formData.phoneCountryCode,
        phoneNumber: formData.phoneNumber,
        accountType: formData.accountType,
        ambassadorId: isAmbassador ? formData.ambassadorId : "",
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,

        // Legacy fallbacks keep the current backend contract working until
        // the buyer model is updated server-side.
        fullName,
        phone: combinedPhone,
        username: formData.email,
      };

      const response = await apiClient.post(`/auth/buyer/signup`, payload);
      const data = response.data?.data || {};

      toast.success("Account created successfully!");

      const storedUser = {
        userId: data.userId,
        username: data.username || formData.email,
        firstName: data.firstName || formData.firstName,
        lastName: data.lastName || formData.lastName,
        fullName: data.fullName || fullName,
        birthday: data.birthday || formData.birthday,
        email: data.email || formData.email,
        phoneCountryCode:
          data.phoneCountryCode || formData.phoneCountryCode,
        phoneNumber: data.phoneNumber || formData.phoneNumber,
        phone: data.phone || combinedPhone,
        accountType: data.accountType || formData.accountType,
        ambassadorId:
          data.ambassadorId ||
          (formData.accountType === "ambassador" ? formData.ambassadorId : ""),
        avatar: data.avatar,
        token: data.token,
      };

      localStorage.setItem("buyerUser", JSON.stringify(storedUser));
      localStorage.setItem("userData", JSON.stringify(storedUser));

      onNavigate("signin");
    } catch (error: any) {
      console.error("Signup error:", error);

      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
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
      <div className="mb-4 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0077F7] dark:text-white mb-2">
          Create your account
        </h1>
        <h2 className="text-sm sm:text-base font-bold text-black dark:text-white leading-tight mb-2">
          Free and Start Exploring Amazing Events Today
        </h2>
        <p className="text-gray-700 dark:text-gray-400 text-[11px] sm:text-[12px] leading-relaxed">
          Join now to discover events, festivals, and experiences you'll love
          - all in one place.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-3">
        <GoogleLogin
          theme="outline"
          size="large"
          width="100%"
          text="signup_with"
          onSuccess={async (credentialResponse) => {
            try {
              const idToken = credentialResponse.credential;

              if (!idToken) {
                throw new Error("Google ID token missing");
              }

              const res = await apiClient.post(`/auth/social/login`, {
                provider: "google",
                idToken,
              });

              const data = res.data?.data;

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

      <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
        Or
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="First Name"
            value={formData.firstName}
            placeholder="Enter first name"
            error={errors.firstName}
            onChange={(v) => updateForm("firstName", v)}
          />

          <InputField
            label="Last Name"
            value={formData.lastName}
            placeholder="Enter last name"
            error={errors.lastName}
            onChange={(v) => updateForm("lastName", v)}
          />
        </div>

        <InputField
          label="Email"
          type="email"
          value={formData.email}
          placeholder="Enter your email"
          error={errors.email}
          onChange={(v) => updateForm("email", v)}
        />

        <InputField
          label="Birthday"
          type="date"
          value={formData.birthday}
          placeholder="Select your birthday"
          error={errors.birthday}
          onChange={(v) => updateForm("birthday", v)}
        />

        <PhoneNumberField
          countryCode={formData.phoneCountryCode}
          countryIso={formData.phoneCountryIso}
          phoneNumber={formData.phoneNumber}
          error={errors.phoneNumber}
          onCountryChange={(country) =>
            setFormData((prev) => ({
              ...prev,
              phoneCountryCode: country.code,
              phoneCountryIso: country.iso2,
            }))
          }
          onPhoneNumberChange={(value) => updateForm("phoneNumber", value)}
        />

        <AccountTypeSelector
          value={formData.accountType}
          error={errors.accountType}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              accountType: value,
              ambassadorId: value === "ambassador" ? prev.ambassadorId : "",
            }))
          }
        />

        {formData.accountType === "ambassador" && (
          <InputField
            label="Ambassador ID Number"
            value={formData.ambassadorId}
            placeholder="Enter Ambassador ID Number"
            error={errors.ambassadorId}
            onChange={(v) => updateForm("ambassadorId", v)}
          />
        )}

        <PasswordField
          label="Password"
          value={formData.password}
          placeholder="Enter your password"
          visible={showPassword}
          error={errors.password}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          onChange={(value) => updateForm("password", value)}
        />

        <PasswordField
          label="Confirm Password"
          value={formData.confirmPassword}
          placeholder="Re-enter your password"
          visible={showConfirmPassword}
          error={errors.confirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          onChange={(value) => updateForm("confirmPassword", value)}
        />

        <PasswordRequirementList checks={passwordChecks} />

        <button
          type="submit"
          className="w-full h-12 rounded-lg font-bold text-white uppercase tracking-wide transition-colors text-sm sm:text-base"
          style={{ backgroundColor: "#0077F7" }}
        >
          CREATE ACCOUNT
        </button>
      </form>

      <p className="text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400 text-center mt-3 leading-relaxed">
        By Signing up, you agree to our Privacy Policy and Terms of Service
      </p>

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
                <strong>Phone:</strong> +1 (800) 452-1180
              </p>
              <p>
                <strong>Email:</strong> support@eventcore.com
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

function InputField({
  label,
  value,
  placeholder,
  error,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  error: boolean;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
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

function PhoneNumberField({
  countryCode,
  countryIso,
  phoneNumber,
  error,
  onCountryChange,
  onPhoneNumberChange,
}: {
  countryCode: string;
  countryIso: TCountryCode;
  phoneNumber: string;
  error: boolean;
  onCountryChange: (country: {
    iso2: TCountryCode;
    country: string;
    code: string;
    flag: string;
  }) => void;
  onPhoneNumberChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectedCountry =
    countryCodeOptions.find(
      (country) => country.iso2 === countryIso && country.code === countryCode
    ) || countryCodeOptions.find((country) => country.code === countryCode);
  const filteredCountryCodes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return countryCodeOptions;

    return countryCodeOptions.filter((country) => {
      return (
        country.country.toLowerCase().includes(query) ||
        country.code.includes(query) ||
        country.iso2.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  return (
    <div>
      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
        Phone Number
      </label>
      <div
        className={`flex h-10 rounded-lg text-black dark:text-white font-medium text-sm sm:text-base focus-within:ring-2 ${
          error
            ? "bg-red-50 border border-red-500 focus-within:ring-red-500"
            : "bg-gray-100 dark:bg-gray-800 focus-within:ring-[#D19537]"
        }`}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setSearchTerm("");
            }}
            className="flex h-10 w-[126px] items-center justify-between gap-2 rounded-l-lg border-r border-gray-300 px-3 text-sm outline-none dark:border-gray-700"
            aria-label="Phone country code"
            aria-expanded={isOpen}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span>{selectedCountry?.flag}</span>
              <span>{selectedCountry?.code || countryCode}</span>
            </span>
            <svg
              className="h-3 w-3 shrink-0 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 top-11 z-50 w-72 rounded-lg border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-[#1a1a1a]">
              <div className="px-2 pb-2">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search country or code"
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#D19537] dark:border-gray-700 dark:bg-[#101010] dark:text-gray-100"
                  autoFocus
                />
              </div>

              <div className="max-h-56 overflow-y-auto">
                {filteredCountryCodes.length > 0 ? (
                  filteredCountryCodes.map((country) => (
                    <button
                      key={`${country.iso2}-${country.code}`}
                      type="button"
                      onClick={() => {
                        onCountryChange(country);
                        setSearchTerm("");
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#2a2a2a]"
                    >
                      <span className="w-6 shrink-0">{country.flag}</span>
                      <span className="w-14 shrink-0 font-semibold">
                        {country.code}
                      </span>
                      <span className="min-w-0 truncate">
                        {country.country}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No country found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <input
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="Enter your phone number"
          inputMode="tel"
          className="min-w-0 flex-1 rounded-r-lg bg-transparent px-4 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
        />
      </div>
    </div>
  );
}

function AccountTypeSelector({
  value,
  error,
  onChange,
}: {
  value: AccountType;
  error: boolean;
  onChange: (value: AccountType) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
        Account Type
      </label>
      <div
        className={`grid grid-cols-2 gap-2 rounded-lg ${
          error ? "border border-red-500 p-1" : ""
        }`}
      >
        {[
          { value: "guest" as const, label: "Guest" },
          { value: "ambassador" as const, label: "Viago Ambassador" },
        ].map((option) => (
          <label
            key={option.value}
            className={`flex h-10 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
              value === option.value
                ? "border-[#0077F7] bg-[#0077F7] text-white"
                : "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              name="accountType"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  placeholder,
  visible,
  error,
  onToggleVisibility,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  visible: boolean;
  error: boolean;
  onToggleVisibility: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-10 rounded-lg px-4 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
            error
              ? "bg-red-50 border border-red-500 focus:ring-red-500"
              : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
          }`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
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
  );
}

function PasswordRequirementList({
  checks,
}: {
  checks: Array<{ label: string; met: boolean }>;
}) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800/70 px-3 py-2">
      <p className="mb-1 text-[10px] sm:text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
        Password Requirements
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {checks.map((item) => (
          <li
            key={item.label}
            className={`text-xs font-medium ${
              item.met ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.met ? "Met:" : "Missing:"} {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
