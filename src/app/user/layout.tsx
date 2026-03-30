// src/app/user/profile/layout.tsx
import React from 'react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="profile-container">
      {/* คุณสามารถใส่ Sidebar หรือ Header เฉพาะหน้านี้ตรงนี้ได้ */}
      {children} 
    </section>
  );
}