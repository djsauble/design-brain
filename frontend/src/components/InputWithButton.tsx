import React from 'react';
import { Button } from './Button';

interface InputWithButtonProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onButtonClick: () => void;
  placeholder?: string;
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  inputType?: 'input' | 'textarea';
  rows?: number;
}

export function InputWithButton({
  value,
  onChange,
  onButtonClick,
  placeholder,
  buttonText,
  buttonVariant,
  inputType = 'input',
  rows = 1,
}: InputWithButtonProps) {
  return (
    <div className="flex space-x-2">
      {inputType === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          className="flex-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="flex-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
      )}
      <Button onClick={onButtonClick} variant={buttonVariant}>
        {buttonText}
      </Button>
    </div>
  );
}