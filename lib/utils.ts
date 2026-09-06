import { ClassValue, clsx, twMerge } from "cn";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
