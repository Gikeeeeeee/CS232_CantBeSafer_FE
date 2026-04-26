"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signupService } from "../../../services/signupService";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    passwordCriteria: false,
    passwordMismatch: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ตรวจสอบเงื่อนไขรหัสผ่าน (อย่างน้อย 4 ตัว, ใหญ่, เลข, พิเศษ)
  const validatePassword = (pass: string) => {
    // ปรับ regex ให้ตรงกับเงื่อนไขในหน้า UI (หรือปรับตามนโยบายความปลอดภัยที่ต้องการ)
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*])[A-Za-z\d_!@#$%^&*]{4,}$/;
    return regex.test(pass);
  };

  useEffect(() => {
    const isPasswordInputted = formData.password.length > 0;
    const isNotValid = !validatePassword(formData.password);

    setErrors((prev) => ({
      ...prev,
      passwordCriteria: isPasswordInputted && isNotValid,
    }));

    setErrors((prev) => ({
      ...prev,
      passwordMismatch: formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword,
    }));
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (errors.passwordCriteria || errors.passwordMismatch) return;

    setIsLoading(true);
    try {
      // ส่งข้อมูลด้วย Key ที่ Backend Controller ต้องการ (ตัวพิมพ์ใหญ่)
      await signupService({
        Username: formData.username,
        Email: formData.email,
        Password: formData.password,
        Confirm_pass: formData.confirmPassword,
      } as any); 
      
      setIsSuccess(true);
    } catch (err: any) {
      // ดักจับข้อความ Error เช่น "All fields are required" จาก Backend
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // --- SUCCESS STATE UI ---
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <div className="w-48 h-48 bg-[#00E676] rounded-full flex items-center justify-center mb-8">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#1A202C" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-24 h-24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-3 text-center">Success!</h1>
          <p className="text-gray-500 text-center mb-10 leading-relaxed">
            Your account has been created successfully.<br/>You can now log in to the system.
          </p>

          <Link href="/auth/login" className="w-full">
            <button className="w-full bg-[#00E676] text-gray-900 py-4 rounded-full font-bold text-lg hover:bg-[#00c864] transition-all active:scale-95 shadow-lg">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- SIGNUP FORM UI ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          {errorMsg && (
            <p className="mt-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-[14px] font-bold text-gray-800 mb-1">Username</label>
            <input
              name="username"
              type="text"
              placeholder="username"
              required
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:ring-1 focus:ring-emerald-400 text-black"
              onChange={handleChange}
              value={formData.username}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[14px] font-bold text-gray-800 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:ring-1 focus:ring-emerald-400 text-black"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[14px] font-bold text-gray-800 mb-1">New Password</label>
            <input
                name="password"
                type="password"
                placeholder="••••••••••"
                required
                className={`w-full rounded-xl border p-3 outline-none transition-colors text-black placeholder:text-gray-400 ${
                  errors.passwordCriteria ? "border-red-500 ring-1 ring-red-100" : "border-gray-200 focus:ring-1 focus:ring-emerald-400"
                }`}
                onChange={handleChange}
                value={formData.password}
            />
            <p className={`mt-2 text-[11px] leading-tight ${errors.passwordCriteria ? "text-red-500 font-medium" : "text-gray-400"}`}>
              Password must be at least 4 characters, including uppercase letters, numbers, and at least one special character.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[14px] font-bold text-gray-800 mb-1">Confirm Password</label>
            <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••••"
                required
                className={`w-full rounded-xl border p-3 outline-none transition-colors text-black placeholder:text-gray-400 ${
                  errors.passwordMismatch 
                    ? "border-red-500 ring-1 ring-red-500" 
                    : "border-gray-200 focus:ring-1 focus:ring-emerald-400"
                }`}
                onChange={handleChange}
                value={formData.confirmPassword}
            />
            {errors.passwordMismatch && (
                <p className="mt-1 text-[12px] font-semibold text-red-500">password mismatch</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#00E676' }}
              className="flex w-full h-[50px] items-center justify-center gap-2 rounded-xl font-bold text-gray-900 transition-all hover:opacity-90 disabled:opacity-50 shadow-md active:scale-95"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Create Account <span className="text-xl">→</span></>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 pt-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-gray-900 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}