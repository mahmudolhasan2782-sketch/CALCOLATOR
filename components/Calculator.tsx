import React, { useState, useCallback, useEffect } from 'react';
import Button from './Button';
import { ButtonVariant } from '../types';

type Mode = 'SCI' | 'PROG';
type AngleMode = 'DEG' | 'RAD';
type Base = 'HEX' | 'DEC' | 'OCT' | 'BIN';

const Calculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [lastCalculated, setLastCalculated] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('SCI');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [base, setBase] = useState<Base>('DEC');
  const [memory, setMemory] = useState<number>(0);

  // --- Core Logic ---

  const safeEval = useCallback((expression: string): number => {
    let sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)') // Basic sqrt handling
      .replace(/√(\d+)/g, 'Math.sqrt($1)');

    // Handle Trig Functions based on Angle Mode
    if (angleMode === 'DEG') {
      sanitized = sanitized.replace(/sin\(([^)]+)\)/g, 'Math.sin($1 * Math.PI / 180)');
      sanitized = sanitized.replace(/cos\(([^)]+)\)/g, 'Math.cos($1 * Math.PI / 180)');
      sanitized = sanitized.replace(/tan\(([^)]+)\)/g, 'Math.tan($1 * Math.PI / 180)');
    } else {
      sanitized = sanitized.replace(/sin\(/g, 'Math.sin(');
      sanitized = sanitized.replace(/cos\(/g, 'Math.cos(');
      sanitized = sanitized.replace(/tan\(/g, 'Math.tan(');
    }
    
    // Logarithms
    sanitized = sanitized.replace(/log\(/g, 'Math.log10(');
    sanitized = sanitized.replace(/ln\(/g, 'Math.log(');

    try {
      // eslint-disable-next-line no-new-func
      return new Function('return ' + sanitized)();
    } catch (e) {
      throw new Error("Invalid");
    }
  }, [angleMode]);

  // --- Event Handlers ---

  const calculateResult = useCallback(() => {
    try {
      if (!displayValue) return;
      
      let finalVal = 0;

      if (mode === 'PROG') {
         // Programmer mode evaluation (Bitwise)
         // We need to parse the base first
         // This is a simplified evaluator for demo purposes
         // Real programmer calcs usually convert everything to decimal, op, then back
         const sanitized = displayValue
            .replace(/AND/g, '&')
            .replace(/OR/g, '|')
            .replace(/XOR/g, '^')
            .replace(/NOT/g, '~');
         
         // eslint-disable-next-line no-new-func
         finalVal = new Function('return ' + sanitized)();
      } else {
         finalVal = safeEval(displayValue);
      }

      // Format
      let formatted = '';
      if (mode === 'PROG') {
         // Truncate to integer for programmer mode
         finalVal = Math.floor(finalVal);
         if (base === 'HEX') formatted = finalVal.toString(16).toUpperCase();
         else if (base === 'OCT') formatted = finalVal.toString(8);
         else if (base === 'BIN') formatted = finalVal.toString(2);
         else formatted = finalVal.toString(10);
      } else {
         formatted = parseFloat(finalVal.toPrecision(12)).toString();
      }

      setDisplayValue(formatted);
      setResultPreview('');
      setLastCalculated(true);
    } catch (error) {
      setDisplayValue('Error');
      setLastCalculated(true);
    }
  }, [displayValue, mode, base, safeEval]);

  const appendToDisplay = useCallback((value: string) => {
    if (lastCalculated) {
      // If result was just shown, if operator append, else replace
      if (['+', '-', '×', '÷', '^', 'AND', 'OR', 'XOR'].includes(value)) {
        setDisplayValue(prev => prev + value);
      } else {
        setDisplayValue(value);
      }
      setLastCalculated(false);
    } else {
      setDisplayValue(prev => prev + value);
    }
  }, [lastCalculated]);

  const clearDisplay = () => {
    setDisplayValue('');
    setResultPreview('');
    setLastCalculated(false);
  };

  const deleteLast = () => {
    if (displayValue === 'Error') {
      clearDisplay();
    } else {
      setDisplayValue(prev => prev.slice(0, -1));
    }
  };

  // Live preview for Scientific Mode
  useEffect(() => {
    if (mode === 'SCI' && displayValue && !lastCalculated) {
      try {
        const res = safeEval(displayValue);
        if (!isNaN(res) && isFinite(res)) {
          setResultPreview(parseFloat(res.toPrecision(8)).toString());
        } else {
          setResultPreview('');
        }
      } catch {
        setResultPreview('');
      }
    }
  }, [displayValue, mode, safeEval, lastCalculated]);

  // --- Scientific Operations ---

  const handleFunc = (funcName: string) => {
    if (lastCalculated) {
      setDisplayValue(`${funcName}(${displayValue})`);
      setLastCalculated(false);
    } else {
      appendToDisplay(`${funcName}(`);
    }
  };

  const factorial = () => {
    try {
      const val = parseInt(safeEval(displayValue).toString());
      if (val < 0) throw new Error();
      let res = 1;
      for (let i = 2; i <= val; i++) res *= i;
      setDisplayValue(res.toString());
      setLastCalculated(true);
    } catch {
      setDisplayValue('Error');
    }
  };

  // --- Memory Operations ---
  const handleMemory = (op: 'MC' | 'MR' | 'M+' | 'M-') => {
    try {
      const current = displayValue ? parseFloat(displayValue) : 0;
      switch(op) {
        case 'MC': setMemory(0); break;
        case 'MR': 
          if(lastCalculated) setDisplayValue(memory.toString());
          else appendToDisplay(memory.toString()); 
          break;
        case 'M+': setMemory(prev => prev + current); setLastCalculated(true); break;
        case 'M-': setMemory(prev => prev - current); setLastCalculated(true); break;
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-gray-800 rounded-[2rem] shadow-calculator p-4 sm:p-6 w-full max-w-lg border-4 border-gray-700">
      
      {/* Mode Switchers */}
      <div className="flex justify-between items-center mb-4 bg-gray-900 rounded-xl p-1">
        <div className="flex space-x-1">
          <button 
            onClick={() => setMode('SCI')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'SCI' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            SCIENTIFIC
          </button>
          <button 
            onClick={() => setMode('PROG')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'PROG' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            PROGRAMMER
          </button>
        </div>
        
        {/* Angle Toggle (Only for Sci) */}
        {mode === 'SCI' && (
          <button 
            onClick={() => setAngleMode(prev => prev === 'DEG' ? 'RAD' : 'DEG')}
            className="px-3 py-1 bg-gray-700 text-xs font-mono text-cyan-400 rounded border border-gray-600"
          >
            {angleMode}
          </button>
        )}
      </div>

      {/* Programmer Base Switcher */}
      {mode === 'PROG' && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['HEX', 'DEC', 'OCT', 'BIN'] as Base[]).map((b) => (
            <button 
              key={b}
              onClick={() => { setBase(b); setDisplayValue(''); }}
              className={`text-xs font-bold py-1 rounded ${base === b ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* Display Screen */}
      <div className="mb-6 relative group">
        <div className="w-full bg-[#c8e6c9] rounded-xl h-28 flex flex-col items-end justify-between p-4 shadow-inner border-2 border-[#a5d6a7]">
           {/* Memory Indicator */}
           <div className="w-full flex justify-between text-xs font-bold text-teal-800 opacity-60">
             <span>{memory !== 0 ? 'M' : ''}</span>
             <span className="tracking-widest">{mode} MODE</span>
           </div>

           {/* Input Expression */}
           <input 
            type="text" 
            value={displayValue}
            disabled
            className="w-full bg-transparent text-right text-3xl font-mono text-gray-900 outline-none placeholder-gray-400/50"
            placeholder="0"
          />
          
          {/* Live Preview (Sci Mode Only) */}
          {mode === 'SCI' && resultPreview && (
            <div className="text-gray-500 text-lg font-semibold animate-pulse">
              = {resultPreview}
            </div>
          )}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        
        {/* Row 1: Memory & Clear */}
        <Button label="MC" onClick={() => handleMemory('MC')} variant={ButtonVariant.MEMORY} />
        <Button label="MR" onClick={() => handleMemory('MR')} variant={ButtonVariant.MEMORY} />
        <Button label="M+" onClick={() => handleMemory('M+')} variant={ButtonVariant.MEMORY} />
        <Button label="M-" onClick={() => handleMemory('M-')} variant={ButtonVariant.MEMORY} />
        <Button label="AC" onClick={clearDisplay} variant={ButtonVariant.DANGER} />

        {/* SCIENTIFIC MODE KEYS */}
        {mode === 'SCI' && (
          <>
            {/* Row 2 */}
            <Button label="sin" onClick={() => handleFunc('sin')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="cos" onClick={() => handleFunc('cos')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="tan" onClick={() => handleFunc('tan')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="(" onClick={() => appendToDisplay('(')} variant={ButtonVariant.FUNCTION} />
            <Button label=")" onClick={() => appendToDisplay(')')} variant={ButtonVariant.FUNCTION} />

            {/* Row 3 */}
            <Button label="ln" onClick={() => handleFunc('ln')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="log" onClick={() => handleFunc('log')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="1/x" onClick={() => { appendToDisplay('^(-1)'); calculateResult(); }} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="x²" onClick={() => appendToDisplay('^2')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="√" onClick={() => handleFunc('√')} variant={ButtonVariant.SCIENTIFIC} />

            {/* Row 4 */}
            <Button label="xʸ" onClick={() => appendToDisplay('^')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="π" onClick={() => appendToDisplay('π')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="e" onClick={() => appendToDisplay('e')} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="x!" onClick={factorial} variant={ButtonVariant.SCIENTIFIC} />
            <Button label="÷" onClick={() => appendToDisplay('÷')} variant={ButtonVariant.OPERATOR} />

            {/* Row 5 - Numbers */}
            <Button label="7" onClick={() => appendToDisplay('7')} />
            <Button label="8" onClick={() => appendToDisplay('8')} />
            <Button label="9" onClick={() => appendToDisplay('9')} />
            <Button label="DEL" onClick={deleteLast} variant={ButtonVariant.DANGER} />
            <Button label="×" onClick={() => appendToDisplay('×')} variant={ButtonVariant.OPERATOR} />

            {/* Row 6 - Numbers */}
            <Button label="4" onClick={() => appendToDisplay('4')} />
            <Button label="5" onClick={() => appendToDisplay('5')} />
            <Button label="6" onClick={() => appendToDisplay('6')} />
            <Button label="%" onClick={() => appendToDisplay('/100')} variant={ButtonVariant.FUNCTION} />
            <Button label="-" onClick={() => appendToDisplay('-')} variant={ButtonVariant.OPERATOR} />

            {/* Row 7 - Numbers */}
            <Button label="1" onClick={() => appendToDisplay('1')} />
            <Button label="2" onClick={() => appendToDisplay('2')} />
            <Button label="3" onClick={() => appendToDisplay('3')} />
            <Button label="." onClick={() => appendToDisplay('.')} />
            <Button label="+" onClick={() => appendToDisplay('+')} variant={ButtonVariant.OPERATOR} />

            {/* Row 8 - Zero & Equals */}
            <Button label="RND" onClick={() => setDisplayValue(Math.random().toFixed(4))} variant={ButtonVariant.FUNCTION} />
            <Button label="0" onClick={() => appendToDisplay('0')} className="col-span-2" />
            <Button label="=" onClick={calculateResult} variant={ButtonVariant.EQUAL} className="col-span-2" />
          </>
        )}

        {/* PROGRAMMER MODE KEYS */}
        {mode === 'PROG' && (
          <>
            {/* Hex Keys Row */}
            <Button label="A" onClick={() => appendToDisplay('A')} disabled={base !== 'HEX'} variant={ButtonVariant.FUNCTION} />
            <Button label="B" onClick={() => appendToDisplay('B')} disabled={base !== 'HEX'} variant={ButtonVariant.FUNCTION} />
            <Button label="C" onClick={() => appendToDisplay('C')} disabled={base !== 'HEX'} variant={ButtonVariant.FUNCTION} />
            <Button label="D" onClick={() => appendToDisplay('D')} disabled={base !== 'HEX'} variant={ButtonVariant.FUNCTION} />
            <Button label="E" onClick={() => appendToDisplay('E')} disabled={base !== 'HEX'} variant={ButtonVariant.FUNCTION} />

             {/* Logic Row */}
            <Button label="F" onClick={() => appendToDisplay('F')} disabled={base !== 'HEX'} variant={ButtonVariant.FUNCTION} />
            <Button label="AND" onClick={() => appendToDisplay(' AND ')} variant={ButtonVariant.LOGIC} />
            <Button label="OR" onClick={() => appendToDisplay(' OR ')} variant={ButtonVariant.LOGIC} />
            <Button label="XOR" onClick={() => appendToDisplay(' XOR ')} variant={ButtonVariant.LOGIC} />
            <Button label="NOT" onClick={() => appendToDisplay(' NOT ')} variant={ButtonVariant.LOGIC} />

            {/* Numbers Row 7-9 */}
            <Button label="7" onClick={() => appendToDisplay('7')} disabled={base === 'BIN'} />
            <Button label="8" onClick={() => appendToDisplay('8')} disabled={base === 'BIN' || base === 'OCT'} />
            <Button label="9" onClick={() => appendToDisplay('9')} disabled={base === 'BIN' || base === 'OCT'} />
            <Button label="DEL" onClick={deleteLast} variant={ButtonVariant.DANGER} />
            <Button label="÷" onClick={() => appendToDisplay('÷')} variant={ButtonVariant.OPERATOR} />

            {/* Numbers Row 4-6 */}
            <Button label="4" onClick={() => appendToDisplay('4')} disabled={base === 'BIN'} />
            <Button label="5" onClick={() => appendToDisplay('5')} disabled={base === 'BIN'} />
            <Button label="6" onClick={() => appendToDisplay('6')} disabled={base === 'BIN'} />
            <Button label="(" onClick={() => appendToDisplay('(')} variant={ButtonVariant.FUNCTION} />
            <Button label="×" onClick={() => appendToDisplay('×')} variant={ButtonVariant.OPERATOR} />

            {/* Numbers Row 1-3 */}
            <Button label="1" onClick={() => appendToDisplay('1')} />
            <Button label="2" onClick={() => appendToDisplay('2')} disabled={base === 'BIN'} />
            <Button label="3" onClick={() => appendToDisplay('3')} disabled={base === 'BIN'} />
            <Button label=")" onClick={() => appendToDisplay(')')} variant={ButtonVariant.FUNCTION} />
            <Button label="-" onClick={() => appendToDisplay('-')} variant={ButtonVariant.OPERATOR} />

            {/* Zero & Equal */}
            <Button label="0" onClick={() => appendToDisplay('0')} className="col-span-2" />
            <Button label="." onClick={() => appendToDisplay('.')} disabled={true} /> {/* Dec only typically */}
            <Button label="=" onClick={calculateResult} variant={ButtonVariant.EQUAL} className="col-span-1" />
            <Button label="+" onClick={() => appendToDisplay('+')} variant={ButtonVariant.OPERATOR} />
          </>
        )}
      </div>
    </div>
  );
};

export default Calculator;