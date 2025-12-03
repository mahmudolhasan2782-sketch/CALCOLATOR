import React, { useState, useCallback } from 'react';
import Button from './Button';
import { ButtonVariant } from '../types';

const Calculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [lastCalculated, setLastCalculated] = useState<boolean>(false);

  const safeEval = (expression: string): number => {
    // Basic sanitization to prevent unsafe code execution
    // Allow numbers, operators, parentheses, and math functions
    const sanitized = expression.replace(/[^0-9+\-*/().\s^]/g, '');
    if (!sanitized) return 0;
    
    try {
      // Replace power operator
      const withPower = sanitized.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      return new Function('return ' + withPower)();
    } catch (e) {
      throw new Error("Invalid Expression");
    }
  };

  const appendToDisplay = useCallback((value: string) => {
    if (lastCalculated && !['+', '-', '*', '/', '^'].includes(value)) {
      setDisplayValue(value);
      setLastCalculated(false);
    } else {
      setDisplayValue(prev => prev + value);
      setLastCalculated(false);
    }
  }, [lastCalculated]);

  const clearDisplay = useCallback(() => {
    setDisplayValue('');
    setLastCalculated(false);
  }, []);

  const deleteLast = useCallback(() => {
    setDisplayValue(prev => prev.slice(0, -1));
  }, []);

  const calculateResult = useCallback(() => {
    try {
      if (!displayValue) return;
      const result = safeEval(displayValue);
      // Format number to avoid floating point precision issues (e.g. 0.1 + 0.2)
      const formattedResult = parseFloat(result.toPrecision(12)).toString();
      setDisplayValue(formattedResult);
      setLastCalculated(true);
    } catch (error) {
      setDisplayValue('Error');
      setLastCalculated(true);
    }
  }, [displayValue]);

  const handleScientific = useCallback((func: (val: number) => number) => {
    try {
      // Calculate current expression first to get a number to operate on
      const currentVal = displayValue ? safeEval(displayValue) : 0;
      const result = func(currentVal);
      const formattedResult = parseFloat(result.toPrecision(12)).toString();
      setDisplayValue(formattedResult);
      setLastCalculated(true);
    } catch (error) {
      setDisplayValue('Error');
    }
  }, [displayValue]);

  return (
    <div className="bg-white rounded-3xl shadow-calculator p-6 w-[360px] max-w-full">
      <div className="mb-6">
        <div className="w-full bg-gray-100 rounded-xl h-24 flex items-end justify-end p-4 overflow-hidden relative">
           <input 
            type="text" 
            value={displayValue}
            disabled
            className="w-full bg-transparent text-right text-4xl font-bold text-gray-800 outline-none placeholder-gray-300"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button label="(" onClick={() => appendToDisplay('(')} variant={ButtonVariant.OPERATOR} />
        <Button label=")" onClick={() => appendToDisplay(')')} variant={ButtonVariant.OPERATOR} />
        <Button label="C" onClick={clearDisplay} variant={ButtonVariant.DANGER} />
        <Button label="DEL" onClick={deleteLast} variant={ButtonVariant.DANGER} />

        {/* Row 2 - Scientific */}
        <Button label="sin" onClick={() => handleScientific(Math.sin)} variant={ButtonVariant.SCIENTIFIC} />
        <Button label="cos" onClick={() => handleScientific(Math.cos)} variant={ButtonVariant.SCIENTIFIC} />
        <Button label="tan" onClick={() => handleScientific(Math.tan)} variant={ButtonVariant.SCIENTIFIC} />
        <Button label="^" onClick={() => appendToDisplay('^')} variant={ButtonVariant.OPERATOR} />

        {/* Row 3 - Scientific & Operators */}
        <Button label="log" onClick={() => handleScientific(Math.log10)} variant={ButtonVariant.SCIENTIFIC} />
        <Button label="ln" onClick={() => handleScientific(Math.log)} variant={ButtonVariant.SCIENTIFIC} />
        <Button label="√" onClick={() => handleScientific(Math.sqrt)} variant={ButtonVariant.SCIENTIFIC} />
        <Button label="/" onClick={() => appendToDisplay('/')} variant={ButtonVariant.OPERATOR} />

        {/* Row 4 - Numbers */}
        <Button label="7" onClick={() => appendToDisplay('7')} />
        <Button label="8" onClick={() => appendToDisplay('8')} />
        <Button label="9" onClick={() => appendToDisplay('9')} />
        <Button label="*" onClick={() => appendToDisplay('*')} variant={ButtonVariant.OPERATOR} />

        {/* Row 5 - Numbers */}
        <Button label="4" onClick={() => appendToDisplay('4')} />
        <Button label="5" onClick={() => appendToDisplay('5')} />
        <Button label="6" onClick={() => appendToDisplay('6')} />
        <Button label="-" onClick={() => appendToDisplay('-')} variant={ButtonVariant.OPERATOR} />

        {/* Row 6 - Numbers */}
        <Button label="1" onClick={() => appendToDisplay('1')} />
        <Button label="2" onClick={() => appendToDisplay('2')} />
        <Button label="3" onClick={() => appendToDisplay('3')} />
        <Button label="+" onClick={() => appendToDisplay('+')} variant={ButtonVariant.OPERATOR} />

        {/* Row 7 - Zero & Equals */}
        <Button label="0" onClick={() => appendToDisplay('0')} />
        <Button label="." onClick={() => appendToDisplay('.')} />
        <Button 
          label="=" 
          onClick={calculateResult} 
          variant={ButtonVariant.EQUAL} 
          className="col-span-2 bg-gradient-to-r from-green-400 to-green-600" 
        />
      </div>
    </div>
  );
};

export default Calculator;