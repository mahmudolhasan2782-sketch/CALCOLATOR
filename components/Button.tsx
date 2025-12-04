import React from 'react';
import { ButtonVariant, CalculatorButtonProps } from '../types';

const Button: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = ButtonVariant.DEFAULT,
  className = '',
  disabled = false
}) => {
  
  const getBaseStyles = () => {
    return "relative overflow-hidden p-3 sm:p-4 text-lg sm:text-xl font-bold rounded-2xl cursor-pointer transition-all duration-150 shadow-sm active:scale-95 select-none flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-1";
  };

  const getVariantStyles = (variant: ButtonVariant) => {
    if (disabled) return "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none";

    switch (variant) {
      case ButtonVariant.OPERATOR:
        return "bg-amber-400 text-white border-amber-600 hover:bg-amber-500 hover:shadow-amber-200";
      case ButtonVariant.SCIENTIFIC:
        return "bg-indigo-500 text-white border-indigo-700 hover:bg-indigo-600 hover:shadow-indigo-200 text-base";
      case ButtonVariant.EQUAL:
        return "bg-emerald-500 text-white border-emerald-700 hover:bg-emerald-600 hover:shadow-emerald-200";
      case ButtonVariant.DANGER:
        return "bg-rose-500 text-white border-rose-700 hover:bg-rose-600 hover:shadow-rose-200";
      case ButtonVariant.MEMORY:
        return "bg-teal-600 text-white border-teal-800 hover:bg-teal-700 text-base";
      case ButtonVariant.LOGIC:
        return "bg-purple-600 text-white border-purple-800 hover:bg-purple-700 text-base";
      case ButtonVariant.FUNCTION:
        return "bg-slate-600 text-white border-slate-800 hover:bg-slate-700 text-base";
      case ButtonVariant.DEFAULT:
      default:
        return "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
    }
  };

  return (
    <button 
      className={`${getBaseStyles()} ${getVariantStyles(variant)} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;