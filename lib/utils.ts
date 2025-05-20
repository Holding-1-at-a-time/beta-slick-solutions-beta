import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get image URL with fallback
export function getImageUrl(path: string, fallback = "/placeholder.png") {
  try {
    // Try to require the image
    return path
  } catch (e) {
    // If the image doesn't exist, return the fallback
    return fallback
  }
}
