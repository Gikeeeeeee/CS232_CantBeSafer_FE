"use client";

import React, { useState } from 'react';
import { Camera, MapPin, PlusCircle, User, ChevronLeft, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [imageSelected, setImageSelected] = useState(false);

  // --- UI Components ---

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-8">
      <div 
        className="bg-green-500 h-full transition-all duration-300" 
        style={{ width: `${((step - 1) / 2) * 100}%` }}
      />
    </div>
  );

  const BottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 pb-6">
      <div className="flex flex-col items-center text-gray-400">
        <MapPin size={24} />
        <span className="text-xs">Location</span>
      </div>
      <div className="flex flex-col items-center text-black font-bold">
        <PlusCircle size={24} />
        <span className="text-xs">Report</span>
      </div>
      <div className="flex flex-col items-center text-gray-400">
        <User size={24} />
        <span className="text-xs">My account</span>
      </div>
    </div>
  );

  const SideNav = () => (
    <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-full flex-col py-8 px-4 gap-8 items-center border border-gray-100">
      <div className="flex flex-col items-center text-gray-400 group cursor-pointer">
        <User size={28} />
        <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Account</span>
      </div>
      <div className="flex flex-col items-center text-black font-bold">
        <PlusCircle size={32} />
        <span className="text-[10px] mt-1">Report</span>
      </div>
      <div className="flex flex-col items-center text-gray-400 group cursor-pointer">
        <MapPin size={28} />
        <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Location</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-24 md:pb-0">
      {/* Container สำหรับจัดกลางหน้าจอ */}
      <div className="max-w-md mx-auto px-6 pt-10 md:pt-20">
        
        {/* Header Section */}
        {step === 2 && (
          <button onClick={() => setStep(1)} className="mb-4">
            <ChevronLeft size={32} />
          </button>
        )}
        
        {step <= 3 && <ProgressBar />}

        {/* --- STEP 1: UPLOAD PHOTO --- */}
        {step === 1 && (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-left mb-12">
              Upload a Photo of Scene of the incident
            </h1>

            <div 
              onClick={() => setImageSelected(true)}
              className={`w-full aspect-[4/3] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors
                ${imageSelected ? 'border-green-500 bg-green-50' : 'border-purple-400 bg-transparent'}`}
            >
              <div className="bg-white px-6 py-2 rounded-lg shadow-sm text-sm font-medium mb-4">
                Select a photo
              </div>
              <span className="text-gray-400 text-sm">
                {imageSelected ? "Image_Selected.jpg" : "Not Selected"}
              </span>
            </div>

            <div className="my-8 text-gray-400">or</div>

            <button className="w-full bg-gray-200 py-4 rounded-full flex items-center justify-center gap-3 font-medium active:scale-95 transition-transform">
              <Camera size={24} />
              Open Camera & Take Photo
            </button>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-green-500 text-white py-4 rounded-full mt-12 font-bold text-lg hover:bg-green-400 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* --- STEP 2: DETAILS --- */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-10 text-left">Report detail of incident</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-4">Location</label>
                <div className="flex items-center justify-between w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-500 italic">
                  <span>Location name</span>
                  <ChevronRight size={20} className="md:block hidden" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Incident Description</label>
                <textarea 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 h-48 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Provide a brief description of the Incident"
                />
              </div>
            </div>

            <button 
              onClick={() => setStep(3)}
              className="w-full bg-green-500 text-white py-4 rounded-full mt-12 font-bold text-lg hover:bg-green-400 transition-colors"
            >
              Submit
            </button>
          </div>
        )}

       {/* --- STEP 3: SUCCESS --- */}
        {step === 3 && (
        <div className="flex flex-col items-center justify-between min-h-[70vh]">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* วงกลมสีเขียวสด และ Checkmark สีเข้ม (เกือบดำ) ตามรูป */}
            <div className="w-64 h-64 bg-[#00E676] rounded-full flex items-center justify-center mb-10">
                <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#1A202C" // สีเข้มตามรูป
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-40 h-40"
                >
                <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            
            {/* หัวข้อ Success ไม่เอียง และตัวหนาปกติ */}
            <h1 className="text-3xl font-bold text-black mb-4">Success</h1>
            </div>

            {/* ปุ่ม Done อยู่ด้านล่าง */}
            <button 
            onClick={() => setStep(1)}
            className="w-full bg-[#00E676] text-white py-4 rounded-full font-bold text-lg active:scale-95 transition-transform mb-8"
            >
            Done
            </button>
        </div>
        )}

      {/* Navigation Bars */}
      <BottomNav />
      <SideNav />
      </div>
    </div>
  );
}