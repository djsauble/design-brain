import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md transition-colors";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}