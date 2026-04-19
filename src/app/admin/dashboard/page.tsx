"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const AdminMapView = dynamic(() => import("@/components/AdminMapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
      <p className="text-gray-500">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

const mockReports = [
  { id: 1, lat: 14.0700, lng: 100.6050, location: "SC3 Road", description: "เส้นไฟฟ้าขาด", image: null, status: "Unset" },
  { id: 2, lat: 14.0720, lng: 100.6080, location: "โรงอาหาร", description: "น้ำท่วมบริเวณทางเข้า", image: null, status: "Unset" },
  { id: 3, lat: 14.0680, lng: 100.6030, location: "หอสมุด", description: "ไฟดับทั้งชั้น 2", image: null, status: "Unset" },
  { id: 4, lat: 14.0710, lng: 100.6060, location: "SC3 Road .... .... ....", description: "อุบัติเหตุรถชน", image: null, status: "Resolved" },
];

type Report = typeof mockReports[0];
type Step = "detail" | "confirm" | "approved";

export default function DashboardPage() {
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [step, setStep] = useState<Step>("detail");
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report);
    setSelectedStatus("");
    setStep(report.status === "Unset" ? "detail" : "approved");
    setIsOpen(false);
  };

  const handleClose = () => {
    setSelectedReport(null);
    setSelectedStatus("");
    setStep("detail");
    setIsOpen(false);
  };

  const handleAdd = () => {
    if (!selectedStatus) return;
    setStep("confirm");
  };

  const handleApprove = () => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, status: selectedStatus } : r
      )
    );
    handleClose();
  };

  const handleDeny = () => {
    if (!selectedReport) return;
    setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    handleClose();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">

      <div className="absolute inset-0 z-0">
        <AdminMapView
          reports={reports}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {selectedReport && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl p-5 mx-2 mb-2">

          <button onClick={handleClose} className="absolute top-4 right-4 text-red-500 text-xl font-bold">✕</button>

          {step === "detail" && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-black">Location : {selectedReport.location}</h2>
              <p className="text-base text-black">Description: {selectedReport.description}</p>

              <div className="flex items-center gap-3">
                <span className="text-base text-black">Status :</span>
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="border rounded-lg px-3 py-1.5 text-base text-black w-40 flex items-center justify-between gap-2 bg-white"
                  >
                    <span>{selectedStatus || "Select option"}</span>
                    <span className="text-gray-400">▾</span>
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                      {["Normal", "Urgent", "Emergency"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedStatus(option);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-base text-black hover:bg-gray-100"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full h-32 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                {selectedReport.image ? (
                  <img src={selectedReport.image} alt="report" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-gray-400 text-sm">ไม่มีรูปภาพ</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleAdd}
                  disabled={!selectedStatus}
                  className="bg-green-500 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-2.5 px-10 rounded-full transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-black text-center mb-1">ยืนยันที่จะเพิ่มระดับ ...</h2>
              <p className="text-base text-black"><span className="font-semibold">Location:</span> {selectedReport.location}</p>
              <p className="text-base text-black"><span className="font-semibold">Description:</span> {selectedReport.description}</p>
              <p className="text-base text-black mb-2"><span className="font-semibold">Status:</span> {selectedStatus}</p>

              <div className="flex gap-3">
                <button onClick={handleDeny} className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-full">
                  Deny
                </button>
                <button onClick={handleApprove} className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-full">
                  Approve
                </button>
              </div>
            </div>
          )}

          {step === "approved" && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-black">Location : {selectedReport.location}</h2>
              <p className="text-base text-black">Description: {selectedReport.description}</p>
              <p className="text-base">
                <span className="font-semibold text-black">Status : </span>
                <span className="text-blue-500 font-semibold">{selectedReport.status}</span>
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}