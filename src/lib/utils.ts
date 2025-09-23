import api from "@/components/Global/axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchCurrentUser() {
  const res = await api.get("/api/auth/me", {withCredentials: true});
  if (res.status !== 200) {
    return null;
  }

  return await res.data;
}
