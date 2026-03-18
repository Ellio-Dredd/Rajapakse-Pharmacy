import * as React from 'react';
import { Input } from './input';

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    // Extract only the digits after +94
    const getPhoneDigits = (phoneValue: string) => {
      if (!phoneValue) return '';
      // Remove +94 prefix if it exists
      const cleaned = phoneValue.replace(/^\+94/, '');
      // Return only digits
      return cleaned.replace(/\D/g, '');
    };

    const displayValue = getPhoneDigits(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      // Only allow digits, max 9 digits for Sri Lankan mobile numbers
      const digits = input.replace(/\D/g, '').slice(0, 9);
      
      // Call onChange with full number including +94 prefix
      if (onChange) {
        onChange(digits ? `+94${digits}` : '');
      }
    };

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          +94
        </div>
        <Input
          ref={ref}
          type="tel"
          className={className}
          value={displayValue}
          onChange={handleChange}
          placeholder="771234567"
          maxLength={9}
          style={{ paddingLeft: '3rem' }}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
