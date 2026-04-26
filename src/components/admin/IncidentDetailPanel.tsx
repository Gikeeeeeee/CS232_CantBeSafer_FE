// src/components/admin/IncidentDetailPanel.tsx
"use client";

import React, { useState } from 'react';
import { X, MapPin, Clock, AlertCircle, Shield, Loader2, Send, Hammer } from 'lucide-react';

interface IncidentDetailPanelProps {
  report: any;
  onClose: () => void;
  onUpdateStatus: (reportId: number, status: string, urgencyScore: number) => Promise<boolean>;
  onUpdateSuccess: () => void;
}

export default function IncidentDetailPanel({ report, onClose, onUpdateStatus, onUpdateSuccess }: IncidentDetailPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  if (!report) return null;

  // ตรวจสอบสถานะต่างๆ
  const isReported = report.status === 'reported';
  const isInProgress = report.status === 'in_progress';
  const isResolved = report.status === 'resolved';

  const handleSubmit = async () => {
    if (selectedScore === null) return;
    setIsUpdating(true);
    const success = await onUpdateStatus(report.id, 'in_progress', selectedScore);
    if (success) {
      onUpdateSuccess();
    }
    setIsUpdating(false);
  };

  const urgencyOptions = [
    { label: 'Normal', score: 1, color: 'bg-amber-400', hover: 'hover:bg-amber-500' },
    { label: 'Urgent', score: 2, color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
    { label: 'Emergency', score: 3, color: 'bg-red-600', hover: 'hover:bg-red-700' },
  ];

  return (
    <div className="absolute right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[100] border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300 font-sans">

      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Case Investigation</h2>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">ID: {report.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Current Status & Urgency Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isResolved ? 'bg-emerald-100 text-emerald-600' :
              isInProgress ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
            }`}>
            STATUS: {report.status.toUpperCase()}
          </span>

          {/* 🎯 แสดงระดับความรุนแรงเฉพาะค่า 1, 2, 3 */}
          {[1, 2, 3].includes(report.severity) && (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${report.severity === 3 ? 'bg-red-100 text-red-600' :
                report.severity === 2 ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'
              }`}>
              {report.severity === 3 ? 'EMERGENCY' :
                report.severity === 2 ? 'URGENT' : 'NORMAL'}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">{report.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {report.description || "No description provided."}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><MapPin size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
              <p className="text-sm text-slate-700 font-medium">{report.address}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{report.lat.toFixed(4)}, {report.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>

        {/* Evidence Image */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Evidence Photo</p>
          <div className="aspect-video w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            {report.image_url || report.evidence_url ? (
              <img src={report.image_url || report.evidence_url} alt="Evidence" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <AlertCircle size={24} />
                <span className="text-[10px] font-bold uppercase">No Image Attached</span>
              </div>
            )}
          </div>
        </div>

        {/* 🎯 [NEW] Urgency Selection - แสดงเฉพาะตอนที่เป็น reported เท่านั้น */}
        {isReported && (
          <div className="pt-4 border-t border-slate-100 animate-in fade-in duration-500">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Select Urgency Level</p>
            <div className="grid grid-cols-3 gap-2">
              {urgencyOptions.map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => setSelectedScore(opt.score)}
                  className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all gap-1 ${selectedScore === opt.score
                      ? `border-slate-900 shadow-md ${opt.color} text-white`
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600'
                    }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        {isReported ? (
          // ปุ่มสำหรับเคสใหม่
          <button
            onClick={handleSubmit}
            disabled={isUpdating || selectedScore === null}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {isUpdating ? "PROCESSING..." : "SUBMIT & START PROCESS"}
          </button>
        ) : isInProgress ? (
          // ปุ่มสำหรับเคสที่กำลังทำ
          <div className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm border border-blue-100 flex items-center justify-center gap-2">
            <Hammer size={18} className="animate-bounce" />
            กำลังดำเนินการแก้ไข
          </div>
        ) : (
          // เคสที่เสร็จแล้ว
          <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm border border-emerald-100 flex items-center justify-center gap-2">
            <Shield size={18} />
            แก้ไขเรียบร้อยแล้ว
          </div>
        )}
      </div>

    </div>
  );
}