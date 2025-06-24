/**
 * Generic interface for dropdown/select option items
 * Used across the application for consistent select component data structure
 */
export interface SelectOption {
  id: number;
  name: string;
  value?: string; // Optional value field for cases like stored notes
} 