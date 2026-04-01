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

  // ตรวจสอบเงื่อนไขรหัสผ่าน (12 ตัว, ใหญ่, เลข, พิเศษ)
  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
    return regex.test(pass);
  };

useEffect(() => {
  // เงื่อนไข: ถ้าช่องว่างอยู่ไม่ต้องแดง แต่ถ้าเริ่มพิมพ์แล้วไม่ครบเกณฑ์ 12 ตัว/ใหญ่/เลข/พิเศษ ถึงจะแดง
  const isPasswordInputted = formData.password.length > 0;
  const isNotValid = !validatePassword(formData.password);

  setErrors((prev) => ({
    ...prev,
    passwordCriteria: isPasswordInputted && isNotValid,
  }));

  // เช็ครหัสไม่ตรงกัน (ให้แสดงเฉพาะตอนที่พิมพ์ช่อง Confirm แล้วเท่านั้น)
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
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration Successful!");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        <h1 className="text-center text-2xl font-bold text-gray-900">Create an account</h1>

        <div className="space-y-4">
          {/* Username */}
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

          {/* Email */}
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

          {/* New Password */}
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

          {/* Confirm Password */}
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
          {/* แสดงข้อความ Error สีแดงเมื่อรหัสไม่ตรงกัน */}
          {errors.passwordMismatch && (
              <p className="mt-1 text-[12px] font-semibold text-red-500">password mismatch</p>
          )}
          </div>

          {/* Submit Button */}
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