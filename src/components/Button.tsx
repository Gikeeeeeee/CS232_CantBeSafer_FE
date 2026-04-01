import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading, className, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      style={{ 
        backgroundColor: '#05DF72',
        height: '40px',
        width: '310px', // ตาม Figma
        borderRadius: '10px'
      }}
      className={`flex items-center justify-center text-[#000000] font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;