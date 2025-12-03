import React from 'react';
import { ButtonVariant, CalculatorButtonProps } from '../types';

const Button: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = ButtonVariant.DEFAULT,
  className = ''
}) => {
  
  const getBaseStyles = () => {
    return "p-4 text-lg font-semibold rounded-xl cursor-pointer transition-all duration-200 shadow-btn hover:-translate-y-1 hover:shadow-btn-hover active:translate-y-[1px] active:shadow-btn-active select-none flex items-center justify-center";
  };

  const getVariantStyles = (variant: ButtonVariant) => {
    switch (variant) {
      case ButtonVariant.OPERATOR:
        return "bg-orange-400 text-white hover:bg-orange-500";
      case ButtonVariant.SCIENTIFIC:
        return "bg-blue-400 text-white hover:bg-blue-500";
      case ButtonVariant.EQUAL:
        return "bg-green-500 text-white hover:bg-green-600";
      case ButtonVariant.DANGER:
        return "bg-red-100 text-red-600 hover:bg-red-200";
      case ButtonVariant.DEFAULT:
      default:
        return "bg-white text-gray-700 hover:bg-gray-50";
    }
  };

  return (
    <button 
      className={`${getBaseStyles()} ${getVariantStyles(variant)} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;