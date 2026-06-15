import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  const classes = inputs.filter(Boolean).map(String);
  return classes.join(" ");
}
