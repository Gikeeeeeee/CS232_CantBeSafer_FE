"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";

const AdminMapView = dynamic(() => import("@/components/AdminMapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
      <p className="text-gray-500">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

type Step = "detail" | "confirm" | "approved";

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [step, setStep] = useState<Step>("detail");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const API_REPORTS_URL = "http://localhost:5000/api/reports";

  const statusMap: Record<string, { status: string; urgency_score: number }> = {
    Normal: { status: "in_progress", urgency_score: 1 },
    Urgent: { status: "in_progress", urgency_score: 2 },
    Emergency: { status: "in_progress", urgency_score: 3 },
  };

  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(`${API_REPORTS_URL}/admin-active-map`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      const result = await res.json();

      if (result && result.success && Array.isArray(result.data)) {
        setReports(result.data);
        setMapKey((prev) => prev + 1);
      } else if (Array.isArray(result)) {
        setReports(result);
        setMapKey((prev) => prev + 1);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setReports([]);
    }
  }, [API_REPORTS_URL]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleMarkerClick = (report: any) => {
    console.log("Full report data:", JSON.stringify(report));
    setSelectedReport(report);
    setSelectedStatus("");
    setStep(report.report_status === "reported" ? "detail" : "approved");
    setIsOpen(false);
  };

  const handleClose = () => {
    setSelectedReport(null);
    setSelectedStatus("");
    setStep("detail");
    setIsOpen(false);
  };

  const handleApprove = async () => {
    if (!selectedReport || !selectedStatus) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const mapped = statusMap[selectedStatus];

      const res = await fetch(`${API_REPORTS_URL}/incidents/${selectedReport.report_id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: mapped.status,
          urgency_score: mapped.urgency_score,
        }),
      });

      if (res.ok) {
        alert("อัปเดตสถานะสำเร็จ!");
        await fetchReports();
        handleClose();
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">

      <div className="absolute inset-0 z-0">
        <AdminMapView
          key={mapKey}
          reports={reports}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {selectedReport && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl p-5 mx-2 mb-2">

          <button onClick={handleClose} className="absolute top-4 right-4 text-red-500 text-xl font-bold">✕</button>

          {step === "detail" && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-black">Location : {selectedReport.report_title || "ไม่ระบุ"}</h2>
              <p className="text-base text-black">Description: {selectedReport.report_description || "ไม่มีรายละเอียด"}</p>

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
                {selectedReport.evidence_url ? (
                  <img src={selectedReport.evidence_url} alt="report" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-gray-400 text-sm">ไม่มีรูปภาพ</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setStep("confirm")}
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
              <p className="text-base text-black"><span className="font-semibold">Location:</span> {selectedReport.report_title}</p>
              <p className="text-base text-black"><span className="font-semibold">Description:</span> {selectedReport.report_description || "ไม่มีรายละเอียด"}</p>
              <p className="text-base text-black mb-2"><span className="font-semibold">Status:</span> {selectedStatus}</p>

              <div className="flex gap-3">
                <button onClick={() => setStep("detail")} className="flex-1 bg-gray-400 text-white font-bold py-2.5 rounded-full">
                  Back
                </button>
                <button onClick={handleApprove} disabled={isLoading} className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-full">
                  {isLoading ? "Saving..." : "Confirm"}
                </button>
              </div>
            </div>
          )}

          {step === "approved" && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-black">Location : {selectedReport.report_title}</h2>
              <p className="text-base text-black">Description: {selectedReport.report_description || "ไม่มีรายละเอียด"}</p>
              <p className="text-base">
                <span className="font-semibold text-black">Status : </span>
                <span className="text-blue-500 font-semibold">{selectedReport.report_status}</span>
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}