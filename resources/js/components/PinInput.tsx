import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Input } from '@/components/ui/input';

interface PinInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function PinInput({ value, onChange, disabled }: PinInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.padEnd(4, '').split('').slice(0, 4);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (index: number, digit: string) => {
        if (!/^\d?$/.test(digit)) return;

        const newDigits = [...digits];
        newDigits[index] = digit;
        const newValue = newDigits.join('').replace(/\s/g, '');
        onChange(newValue);

        if (digit && index < 3) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        onChange(pasted);
        focusInput(Math.min(pasted.length, 3));
    };

    return (
        <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((index) => (
                <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[index]?.trim() || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className="h-14 w-14 text-center text-2xl font-bold"
                    autoFocus={index === 0}
                />
            ))}
        </div>
    );
}
