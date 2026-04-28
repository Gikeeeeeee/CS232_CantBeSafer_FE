"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, BellRing, Info } from 'lucide-react';
import { api } from '@/lib/axios';

export default function NotificationsPage() {
  const [email, setEmail] = useState('loma.linux@example.com');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // 🚀 ยิง API จริงไปที่ Backend
      const response = await api.post('/api/test/subscribe', { email });
      
      if (response.status === 200 || response.status === 201) {
        alert(`ระบบได้ส่งคำขอยืนยันไปที่ ${email} แล้ว!\nกรุณาตรวจสอบ Email และกด 'Confirm Subscription' ในกล่องข้อความของคุณ`);
        setIsSubscribed(true);
      }
    } catch (error: any) {
      console.error("Subscription Error:", error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการส่งคำขอสมัครรับการแจ้งเตือน");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm border-b border-gray-100 flex items-center gap-4">
        <Link href="/user/profile" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Email Notifications</h1>
      </div>

      <div className="p-6 mt-2">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="flex flex-col items-center justify-center text-center mb-8 mt-4">
            <div className="p-4 bg-purple-100 rounded-full mb-4 ring-4 ring-purple-50">
              <BellRing className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">รับการแจ้งเตือนเหตุฉุกเฉิน</h2>
            <p className="text-sm text-gray-500 mt-2">ระบบจะส่งอีเมลแจ้งเตือนเมื่อมีเหตุการณ์สำคัญเกิดขึ้น</p>
          </div>

          <div className="space-y-6">
            
            {/* Email Section - แก้ไขสีตัวหนังสือให้ดำชัดเจน */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
              <div className="flex items-center gap-3">
                <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200">
                  <Mail className="h-5 w-5 text-slate-600" />
                </div>
                {/* ✅ text-slate-900: บังคับตัวหนังสือสีดำเข้ม
                   ✅ bg-white: พื้นหลังสีขาว
                */}
                <input
                  type="email"
                  className="block w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email"
                />
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">การดำเนินการที่จำเป็น (Check your Inbox)</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  หลังจากกดสมัคร คุณต้องเข้าหน้าอีเมลของคุณเพื่อกด <strong className="underline">"Confirm Subscription"</strong> มิฉะนั้นระบบจะไม่ส่งการแจ้งเตือนให้คุณครับ
                </p>
              </div>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 mt-4 ${
                isSubscribed 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : 'bg-purple-600 hover:bg-purple-700'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <BellRing className={`w-5 h-5 ${isLoading ? 'animate-bounce' : ''}`} />
              {isLoading ? 'กำลังส่ง...' : (isSubscribed ? 'Subscribed Success!' : 'Subscribe Now')}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}