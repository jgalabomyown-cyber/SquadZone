"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function Header() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <Navbar />;
}