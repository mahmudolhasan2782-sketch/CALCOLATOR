export enum ButtonVariant {
  DEFAULT = 'DEFAULT',       // Numbers
  OPERATOR = 'OPERATOR',     // Basic Math (+ - * /)
  SCIENTIFIC = 'SCIENTIFIC', // Trig, Log, Roots
  EQUAL = 'EQUAL',           // Calculate
  DANGER = 'DANGER',         // Clear/Delete
  MEMORY = 'MEMORY',         // M+, M-, MR
  LOGIC = 'LOGIC',           // AND, OR, XOR, HEX
  FUNCTION = 'FUNCTION'      // Alt functions
}

export interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}