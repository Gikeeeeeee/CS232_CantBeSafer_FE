import React from 'react';

interface CardUserProps {
  locationTitle: string;
  description: string;
  status: string;
  onClose?: () => void;
}

const CardUser: React.FC<CardUserProps> = ({ locationTitle, description, status, onClose }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-[20px] p-6 animate-slide-up">
      {/* Handle สำหรับดึง (Visual only) */}
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
      
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">Location : {locationTitle}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="space-y-3 mb-8">
        <div>
          <p className="text-sm font-semibold text-gray-500">Description:</p>
          <p className="text-base text-gray-700">{description}</p>
        </div>
        <div>
          <p className="text-base text-gray-700">
            <span className="font-semibold text-gray-500">Status :</span> {status}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default CardUser;