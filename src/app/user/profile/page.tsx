"use client";

import React, { useState } from 'react';
import BottomNav from '@/components/NavBar';
import { Settings, ChevronRight, LogOut, ShieldCheck, Mail, User } from 'lucide-react';
// ✅ 1. Import Link จาก next/link เข้ามา
import Link from 'next/link'; 

const ProfilePage = () => {
  const [user] = useState({
    name: 'Loma Linux',
    email: 'loma.linux@example.com',
    role: 'Verified Reporter',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Loma',
    joinedDate: 'March 2024'
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* Header Section (เหมือนเดิม) */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm border-b border-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-emerald-500/20 p-1">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-full h-full rounded-full bg-gray-100 object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-50 p-1.5 rounded-full border-2 border-white shadow-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
          
          <div className="mt-4 px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
            {user.role}
          </div>
        </div>
      </div>

      {/* Menu Options Section */}
      <div className="px-6 mt-8 space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">Settings</h2>
        
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          
          {/* Menu Item 1: Edit Profile */}
          {/* ✅ 2. เปลี่ยน button เป็น Link แล้วใส่ href */}
          <Link href="/user/edit-profile" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-medium text-gray-700">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          {/* Menu Item 2: Email Notifications */}
          {/* ✅ จุดสำคัญ! ใส่ URL หน้า Notification ของนายตรง href นี้นะครับ */}
          <Link href="/user/notifications" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Mail className="w-5 h-5 text-purple-500" />
              </div>
              <span className="font-medium text-gray-700">Email Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          {/* Menu Item 3: Security Settings */}
          <Link href="/user/security" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Settings className="w-5 h-5 text-orange-500" />
              </div>
              <span className="font-medium text-gray-700">Security & Privacy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-6">
          <button 
            className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 transition-colors"
            onClick={() => {
              // โค้ดสำหรับ Sign Out เช่น ลบ Token แล้วเด้งไปหน้า Login
              console.log("Signing out...");
              window.location.href = "/auth/login";
            }}
          >
            <div className="p-2 bg-red-50 rounded-lg">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-bold">Sign Out</span>
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8 italic">
          Joined since {user.joinedDate}
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;