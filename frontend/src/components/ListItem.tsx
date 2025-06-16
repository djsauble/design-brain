import React from 'react';

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <li className={`mb-2 whitespace-pre-wrap ${className}`}>
      {children}
    </li>
  );
}