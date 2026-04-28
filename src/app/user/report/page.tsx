"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Camera, MapPin, Plus, User, ChevronLeft, PlusCircle, X, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { submitReport, uploadReportEvidence } from "@/services/reportService";
import Cookies from 'js-cookie';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

function ReportContent() {
  const { token: storeToken } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map States
  const [viewport, setViewport] = useState({
    latitude: 14.0722,
    longitude: 100.6025,
    zoom: 15
  });
  const [marker, setMarker] = useState({
    latitude: 14.0722,
    longitude: 100.6025
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setViewport(prev => ({ ...prev, latitude, longitude }));
        setMarker({ latitude, longitude });
      });
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!locationName.trim() || !description.trim()) {
      setError("Please fill in location and description");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const rawToken = storeToken || Cookies.get('auth-token');
      if (!rawToken) throw new Error("Session expired");
      const activeToken = rawToken.replace('Bearer ', '').trim();

      const resData = await submitReport({
        title: locationName.trim(),
        description: description.trim(),
        urgency: 5,
        latitude: marker.latitude,
        longitude: marker.longitude,
        locationName: locationName.trim(),
        radius: 10
      }, activeToken);

      const reportId = resData?.report_id || resData?.data?.report_id || resData?.id;
      if (!reportId) throw new Error("Failed to get report ID");

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          await uploadReportEvidence(reportId, file, activeToken, marker.latitude, marker.longitude);
        }
      }
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-md mx-auto px-6 pt-10">
        
        {step < 3 && (
          <div className="flex items-center gap-4 mb-8">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-2 bg-white rounded-full shadow-sm">
                <ChevronLeft size={24} />
              </button>
            )}
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${step === 1 ? 50 : 100}%` }}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-2xl font-bold text-slate-900">Evidence Photos</h1>
            
            <div className="grid grid-cols-3 gap-3">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                  <button 
                    onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors"
              >
                <Plus className="text-slate-400" size={24} />
                <span className="text-[10px] font-bold text-slate-400 mt-1">ADD</span>
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

            <button 
              onClick={() => {
                fileInputRef.current?.setAttribute('capture', 'environment');
                fileInputRef.current?.click();
              }}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg active:scale-95 transition-all"
            >
              <Camera size={22} />
              Take a Photo
            </button>

            <button 
              onClick={() => setStep(2)}
              disabled={imageFiles.length === 0}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 disabled:opacity-50 active:scale-95 transition-all"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h1 className="text-2xl font-bold text-slate-900">Incident Details</h1>

            <div className="space-y-4">
              <div className="h-48 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
                <Map
                  {...viewport}
                  onMove={evt => setViewport(evt.viewState)}
                  onClick={evt => setMarker({ latitude: evt.lngLat.lat, longitude: evt.lngLat.lng })}
                  mapStyle={`https://maps.geo.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/maps/v0/maps/${process.env.NEXT_PUBLIC_AWS_MAP_NAME}/style-descriptor?key=${process.env.NEXT_PUBLIC_AWS_MAP_API_KEY}`}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Marker latitude={marker.latitude} longitude={marker.longitude} color="#10b981" />
                </Map>
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold border border-slate-100 shadow-sm">
                  TAP TO PIN LOCATION
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Location Name</label>
                  <input 
                    type="text" 
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="e.g. SC3 Building Entrance"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 h-28 resize-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Describe what's happening..."
                  />
                </div>
              </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 italic">⚠️ {error}</div>}

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70"
            >
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Submit Report"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-200">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Success!</h1>
            <p className="text-slate-500 mb-10 max-w-[200px]">Thank you. Your report has been dispatched to officials.</p>
            <button 
              onClick={() => router.push('/user/home')}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}