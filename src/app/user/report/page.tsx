"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Plus, User, ChevronLeft, PlusCircle, X } from 'lucide-react';
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
  const [imageFiles, setImageFiles] = useState<File[]>([]); // 👈 เก็บเป็น Array เพื่อรองรับหลายรูป
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

  // 👈 จัดการเมื่อมีการเลือกไฟล์เพิ่ม
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);
    }
    // reset value เพื่อให้เลือกไฟล์เดิมซ้ำได้ถ้าลบไปแล้ว
    e.target.value = '';
  };

  // 👈 ลบรูปออกจากรายการ
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!locationName.trim() || !description.trim()) {
      setError("กรุณากรอกข้อมูลสถานที่และรายละเอียดเหตุการณ์");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let rawToken = storeToken || Cookies.get('auth-token');
      if (!rawToken) throw new Error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      const activeToken = rawToken.replace('Bearer ', '').trim();

      // 🎯 กำหนดพิกัด (ใช้ค่าจาก Map หรือ Mock ถ้าเป็นบ้านลุงศรี)
      let finalLat = latFromMap;
      let finalLng = lngFromMap;

      if (locationName.trim() === "บ้านลุงศรี") {
        console.log("🏠 Detecting 'บ้านลุงศรี' - Using Mock Coordinates");
        finalLat = 14.0722; 
        finalLng = 100.6025;
      }

      // 1. ส่งข้อมูลรายงานหลัก (POST Report)
      const resData = await submitReport({
        title: locationName.trim(),
        description: description.trim(),
        urgency: 5,
        latitude: finalLat,
        longitude: finalLng,
        locationName: locationName.trim(),
        radius: 10
      }, activeToken);

      // ดึง report_id ออกมา (เช็คทุกลำดับชั้นที่ Backend อาจจะส่งมา)
      const reportId = resData?.report_id || resData?.data?.report_id || resData?.id || resData?.data?.id;
      
      if (!reportId) throw new Error("ไม่สามารถดึงหมายเลขรายงานจากเซิร์ฟเวอร์ได้");

      // 2. วนลูปยิง API รูปภาพทีละรูป (Sequential)
      // 🎯 แก้ไข: ให้เหลือลูปเดียว และส่ง lat/lng เข้าไปด้วย
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          console.log(`📤 Uploading image for report ${reportId}...`);
          await uploadReportEvidence(
            reportId, 
            file, 
            activeToken, 
            finalLat, // 👈 ส่งไปเพื่อให้ Backend ไม่อ่าน undefined
            finalLng  // 👈 ส่งไปเพื่อให้ Backend ไม่อ่าน undefined
          );
        }
      }

      // ส่งสำเร็จ ล้างสถานะและไปหน้าถัดไป
      setImageFiles([]);
      setStep(3); 
      
    } catch (err: any) {
      console.error("❌ Submission Error:", err);
      // แสดงข้อความ Error ที่อ่านรู้เรื่อง
      setError(err.message || "เกิดข้อผิดพลาดในการส่งรายงาน");
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

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-24 md:pb-0">
      <div className="max-w-md mx-auto px-6 pt-10 md:pt-20">

        <div className="flex items-center justify-between mb-8">
          {step === 2 && (
            <button 
              disabled={isSubmitting}
              onClick={() => setStep(1)} 
              className="hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          <div className="flex-1">
            <ProgressBar />
          </div>
        </div>

        {/* --- STEP 1: MULTIPLE PHOTOS --- */}
        {step === 1 && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-left w-full mb-8">
              Upload Photos of Incident Scene
            </h1>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple // 👈 อนุญาตให้เลือกหลายรูป
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 👈 ส่วนแสดงรูปภาพที่เลือกไว้ */}
            <div className="w-full grid grid-cols-3 gap-3 mb-6">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img 
                    src={URL.createObjectURL(file)} 
                    className="w-full h-full object-cover" 
                    alt={`preview-${index}`}
                  />
                  <button 
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* ปุ่มเพิ่มรูป */}
              <div
                onClick={() => openFilePicker()}
                className="aspect-square border-2 border-dashed border-purple-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-all bg-white"
              >
                <Plus className="text-purple-500" size={24} />
                <span className="text-[10px] text-purple-500 font-bold mt-1">Add More</span>
              </div>
            </div>

            <button
              onClick={() => openFilePicker(true)}
              className="w-full bg-gray-200 py-4 rounded-full flex items-center justify-center gap-3 font-medium text-black hover:bg-gray-300 active:scale-[0.98] transition-all"
            >
              <Camera size={22} className="text-black" />
              Open Camera & Take Photo
            </button>

            <div className="mt-16 w-full space-y-4">
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#00FF85] text-black py-4 rounded-full font-bold text-lg hover:bg-emerald-400 active:scale-[0.98] transition-all"
              >
                Continue
              </button>
              
              {/* 👈 ปุ่ม Back ด้านล่าง Continue */}
              <button
                onClick={() => router.back()}
                className="w-full text-gray-400 py-2 font-medium text-sm hover:text-gray-600 transition-all"
              >
                Back to Map
              </button>
            </div>
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
                  placeholder="e.g. SC 3 Building"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#00FF85] outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">Incident Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 h-40 bg-white focus:ring-2 focus:ring-[#00FF85] outline-none transition-all resize-none placeholder:text-gray-300"
                  placeholder="Provide a brief description of the incident"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <div className="mt-16 w-full space-y-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#00FF85] text-black py-4 rounded-full font-bold text-lg hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit'}
              </button>

              {/* 👈 ปุ่ม Back กลับไปหน้า Photo */}
              <button
                disabled={isSubmitting}
                onClick={() => setStep(1)}
                className="w-full text-gray-400 py-2 font-medium text-sm hover:text-gray-600 transition-all"
              >
                Back to Photos
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500 text-center">
            <div className="w-40 h-40 bg-[#00FF85] rounded-full flex items-center justify-center mb-12 shadow-lg shadow-[#00FF85]/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" className="w-20 h-20">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Success</h1>
            <p className="text-gray-500 mb-10">Your report has been successfully submitted.</p>

            <button
              onClick={() => router.push('/user/home')}
              className="w-full bg-[#00FF85] text-black py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all shadow-md"
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
    <div className="flex flex-col items-center text-gray-400">
      <MapPin size={22} />
      <span className="text-[10px] mt-1 font-medium">Location</span>
    </div>
    <div className="flex flex-col items-center text-[#00FF85] font-bold">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-1">
        <PlusCircle size={24} className="text-black" />
      </div>
      <span className="text-[10px]">Report</span>
    </div>
    <div className="flex flex-col items-center text-gray-400">
      <User size={22} />
      <span className="text-[10px] mt-1 font-medium">My account</span>
    </div>
  </div>
);