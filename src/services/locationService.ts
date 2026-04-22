const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchActiveIncidentPoints = async () => {
  try {
    const res = await fetch(`${API_URL}/api/reports/active-map`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // ถ้าระบบต้องการ Token ให้ใส่เพิ่มตรง Authorization
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      // 🛠️ แปลงข้อมูลจาก Backend (Flat) ให้เป็นรูปแบบที่ต้องการ (Nested Location)
      const formattedData = result.data.map((item: any) => ({
        report_id: item.id || item.report_id, // รองรับชื่อ id ทั้งสองแบบ
        report_title: item.title || item.report_title,
        report_description: item.description || item.report_description,
        report_status: item.status || item.report_status,
        urgency_score: item.urgency_score,
        location: {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        },
        image_url: item.image_url || item.file_url,
        radius: item.radius || 50.0, // ค่า default ถ้า back ไม่ได้ส่งมา
        created_at: item.created_at,
      }));

      return {
        success: true,
        count: formattedData.length,
        data: formattedData,
      };
    }

    return result;
  } catch (error) {
    console.error("❌ Error fetching active-map:", error);
    return { success: false, data: [], message: "Failed to load map data" };
  }
};