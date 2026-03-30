'use client';
import React from 'react';

// ประกาศ Component โดยใช้ React.FC เพื่อให้ TypeScript ช่วยเช็คความถูกต้อง
const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Hello World</h1>
      <p>ยินดีด้วย! React + TypeScript ของคุณทำงานแล้ว</p>
    </div>
  );
};

export default App;