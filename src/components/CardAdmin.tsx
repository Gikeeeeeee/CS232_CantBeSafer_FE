import React from 'react';

interface CardAdminProps {
  locationTitle: string;
  description: string;
  status: string;
}

const CardAdmin: React.FC<CardAdminProps> = ({ locationTitle, description, status }) => {
  return (
    <div className="relative w-full h-full">

      {/* Info Card (ล่าง) */}
      <div className="fixed bottom-4 left-4 right-20 bg-white rounded-[15px] p-6 shadow-2xl border border-gray-100 z-40">
        <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">Location : {locationTitle}</h2>
        <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Description:</span></p>
        <p className="text-sm text-gray-700 mb-3">{description}</p>
        <p className="text-sm"><span className="font-semibold">Status :</span> {status}</p>
      </div>
    </div>
  );
};

export default CardAdmin;