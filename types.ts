export enum ButtonVariant {
  DEFAULT = 'DEFAULT',
  OPERATOR = 'OPERATOR',
  SCIENTIFIC = 'SCIENTIFIC',
  EQUAL = 'EQUAL',
  DANGER = 'DANGER'
}

export interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
}
