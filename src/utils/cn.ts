import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function to combine tailwind classes with proper merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}