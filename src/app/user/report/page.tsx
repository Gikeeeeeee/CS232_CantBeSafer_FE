"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Plus, User, ChevronLeft, PlusCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { submitReport, uploadReportEvidence } from "@/services/reportService";
import Cookies from 'js-cookie';

export default function ReportPage() {
  const { token: storeToken } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const latFromMap = Number(searchParams.get('lat')) || 14.0722;
  const lngFromMap = Number(searchParams.get('lng')) || 100.6025;

  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationName, setLocationName] = useState(''); 
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentToken = storeToken || Cookies.get('auth-token');
    if (!currentToken) {
      setError("ไม่พบ Session กรุณา Login ใหม่");
    }
  }, [storeToken]);

  const openFilePicker = (capture?: boolean) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.removeAttribute('capture');
    if (capture) fileInputRef.current.setAttribute('capture', 'environment');
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!locationName.trim() || !description.trim()) {
      setError("กรุณากรอกข้อมูลสถานที่และรายละเอียดเหตุการณ์");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 🎯 ดึง Token (ตัดคำว่า Bearer ออกถ้ามี เพื่อส่งเข้า service แบบสะอาดๆ)
      let rawToken = storeToken || Cookies.get('auth-token');
      if (!rawToken) throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      
      const activeToken = rawToken.replace('Bearer ', '');

      // 1. ส่งข้อมูลรายงาน
      const resData = await submitReport({
              title: locationName.trim(),          // ใช้ชื่อสถานที่ตั้งเป็น Title ไปเลย
              description: description.trim(),
              urgency: 5,
              latitude: latFromMap,
              longitude: lngFromMap,
              locationName: locationName.trim(),   // 👈 เพิ่มบรรทัดนี้ เพื่อส่งชื่อสถานที่ให้ Backend
              radius: 10                           // 👈 เพิ่มบรรทัดนี้ (ใส่ค่า Default เป็น 10 หรือค่าที่คุณต้องการ)
            }, activeToken);

      // ดึง ID (ดักทุกรูปแบบที่ Backend มักจะส่งมา)
      const reportId = resData?.report_id || resData?.data?.report_id || resData?.id || resData?.data?.id;
      
      if (!reportId) {
        throw new Error("ไม่สามารถดึงหมายเลขรายงานจากเซิร์ฟเวอร์ได้");
      }

      // 2. ถ้ามีรูปภาพ ให้ส่งตามไป
      if (imageFile) {
        await uploadReportEvidence(reportId, imageFile, activeToken);
      }

      // เคลียร์ไฟล์หลังส่งเสร็จ
      setImageFile(null);
      setStep(3); 
    } catch (err: any) {
      console.error("❌ Submission Error:", err);
      // จัดการ Error ข้อความ 401
      if (err.message.includes('401')) {
        setError("สิทธิ์การใช้งานหมดอายุ (401) กรุณา Login ใหม่");
      } else {
        setError(err.message || "เกิดข้อผิดพลาดในการส่งรายงาน กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProgressBar = () => (
    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
      <div
        className="bg-[#00FF85] h-full transition-all duration-500 ease-out"
        style={{ width: `${step === 1 ? 0 : step === 2 ? 50 : 100}%` }}
      />
    </div>
  );

  const CustomHeader = () => (
    <div className="flex items-center justify-between mb-8">
      {step === 2 && (
        <button 
          disabled={isSubmitting}
          onClick={() => setStep(1)} 
          className="hover:bg-gray-100 p-1 rounded-full transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={32} />
        </button>
      )}
      {step === 2 && (
        <div className="flex-1 px-10">
          <ProgressBar />
        </div>
      )}
      {step === 1 && (
        <div className="w-full">
          <ProgressBar />
        </div>
      )}
       {step === 3 && (
        <div className="w-full">
          <ProgressBar />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-24 md:pb-0">
      <div className="max-w-md mx-auto px-6 pt-10 md:pt-20">

        <CustomHeader />

        {/* --- STEP 1: PHOTO --- */}
        {step === 1 && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-left w-full mb-8">
              Upload a Photo of Scene of the incident
            </h1>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />

            <div
              onClick={() => openFilePicker()}
              className={`w-full aspect-[4/3] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                ${imageFile ? 'border-purple-500 bg-purple-50' : 'border-purple-500 hover:border-purple-600 bg-white'}`}
            >
              <div className="text-center p-4">
                 <button className="bg-white text-black px-6 py-2 rounded-lg mb-2 font-medium">Select a photo</button>
                 <p className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">
                    {imageFile ? imageFile.name : "Not Selected"}
                 </p>
              </div>
            </div>

            <div className="my-10 text-black font-medium text-sm">or</div>

            <button
              onClick={() => openFilePicker(true)}
              className="w-full bg-gray-200 py-4 rounded-full flex items-center justify-center gap-3 font-medium text-black hover:bg-gray-300 active:scale-[0.98] transition-all"
            >
              <Camera size={22} className="text-black" />
              Open Camera & Take Photo
            </button>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#00FF85] text-black py-4 rounded-full mt-24 font-bold text-lg hover:bg-emerald-400 active:scale-[0.98] transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {/* --- STEP 2: DETAILS --- */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h1 className="text-2xl font-bold mb-8">Report detail of incident</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">Location</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="SC 3 ที่ร้านยูบ้า"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#00FF85] outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">Incident Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 h-40 bg-white focus:ring-2 focus:ring-[#00FF85] outline-none transition-all resize-none placeholder:text-gray-300"
                  placeholder="Provide a brief description of the Incident"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 animate-shake">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#00FF85] text-black py-4 rounded-full mt-24 font-bold text-lg hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  กำลังส่งข้อมูล...
                </>
              ) : 'Submit'}
            </button>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
            <div className="w-40 h-40 bg-[#00FF85] rounded-full flex items-center justify-center mb-12">
              <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" className="w-20 h-20 animate-check">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center">Success</h1>
            <p className="text-gray-500 text-center mb-10">Your report has been successfully submitted.</p>

            <button
              onClick={() => router.push('/user/home')}
              className="w-full bg-[#00FF85] text-black py-4 rounded-full font-bold text-lg hover:bg-emerald-400 active:scale-[0.98] transition-all"
            >
              Done
            </button>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}

const BottomNav = () => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 pb-6 z-50">
    <div className="flex flex-col items-center text-gray-400 cursor-pointer hover:text-black transition-colors">
      <MapPin size={22} className="text-gray-400" />
      <span className="text-[10px] mt-1 font-medium">Location</span>
    </div>
    <div className="flex flex-col items-center text-[#00FF85] font-bold">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
        <PlusCircle size={24} className="text-black" />
      </div>
      <span className="text-[10px]">Report</span>
    </div>
    <div className="flex flex-col items-center text-gray-400 cursor-pointer hover:text-black transition-colors">
      <User size={22} className="text-gray-400" />
      <span className="text-[10px] mt-1 font-medium">My account</span>
    </div>
  </div>
);