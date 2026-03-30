"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signupService } from "@/services/signupService";
import { useRouter } from "next/navigation"; 

export default function SignupPage() {
  const router = useRouter(); 

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

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_\-]).{12,}$/;
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
    if (errors.passwordCriteria || errors.passwordMismatch) return;

    setIsLoading(true);
    try {
      await signupService({
        Username: formData.username,
        Password: formData.password,
        Confirm_pass: formData.confirmPassword,
        Email: formData.email,
      });
      
      // ✅ เปลี่ยนแค่ State ให้เป็น true ส่วนหน่วงเวลา (setTimeout) เอาออกไปแล้ว
      setIsSuccess(true); 

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert(errorMsg || "Something went wrong"); 
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ หน้าจอ Success (รอผู้ใช้กดปุ่มด้วยตัวเอง)
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#e8fbf0]">
            <svg className="h-12 w-12 text-[#00E676]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Success!</h2>
          <p className="text-gray-500 mt-2">
            Your account has been created successfully.
          </p>
          <div className="pt-6">
            <button
              onClick={() => router.push("/auth/login")}
              // ปรับปุ่มให้เป็นสีเขียวเด่นชัด เพื่อให้รู้ว่าต้องกดตรงนี้เพื่อไปต่อ
              className="w-full rounded-lg bg-[#00E676] px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-[#00c864] shadow-sm"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold text-gray-900">Create an account</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-[14px] font-medium text-gray-900">Username</label>
            <input
              name="username"
              type="text"
              placeholder="username"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 p-3 outline-none focus:ring-1 focus:ring-emerald-400"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-gray-900">Email</label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 p-3 outline-none focus:ring-1 focus:ring-emerald-400"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-gray-900">New Password</label>
            <input
                name="password"
                type="password"
                placeholder="••••••••••"
                required
                className={`mt-1 w-full rounded-xl border p-3 outline-none transition-colors text-gray-900 placeholder:text-gray-400 ${
                    errors.passwordCriteria ? "border-red-500" : "border-gray-200"
                }`}
                onChange={handleChange}
            />
            <p className={`mt-2 text-[12px] leading-tight ${errors.passwordCriteria ? "text-red-500" : "text-[#94a3b8]"}`}>
              Password must be at least 12 characters, including uppercase letters, numbers, and at least one special character.
            </p>
          </div>

          <div>
          <label className="block text-[14px] font-medium text-gray-900">Confirm Password</label>
          <input
              name="confirmPassword"
              type="password"
              placeholder="••••••••••"
              required
              
              className={`mt-1 w-full rounded-xl border p-3 outline-none transition-colors text-gray-900 placeholder:text-gray-400 ${
              errors.passwordMismatch 
                  ? "border-red-500 ring-1 ring-red-500" 
                  : "border-gray-200 focus:border-emerald-400"
              }`}
              onChange={handleChange}
          />
          {errors.passwordMismatch && (
              <p className="mt-1 text-[12px] font-semibold text-red-500">password mismatch</p>
          )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00E676] py-3 font-semibold text-gray-900 transition-all hover:bg-[#00c864] disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Create Account"} <span className="text-xl">→</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}