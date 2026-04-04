"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VisitorTracker() {
  useEffect(() => {
const trackVisitor = async () => {
  const lastTracked = localStorage.getItem("sz_last_track");
  const now = Date.now();

  // 1. Check if 5 minutes (300,000ms) has passed since the last log
  if (lastTracked && now - parseInt(lastTracked) < 300000) {
    return; // Stop here, don't even call Supabase
  }

  try {
    const geoRes = await fetch("https://ipapi.co/json/");
    const geoData = await geoRes.json();

    const { error } = await supabase.from("visitor_logs").insert([{
      ip_address: geoData.ip,
      city: geoData.city,
      country: geoData.country_name,
      page_path: window.location.pathname
    }]);

    // 2. If successful, save the current time to LocalStorage
    if (!error) {
      localStorage.setItem("sz_last_track", now.toString());
    }
  } catch (error) {
    console.error("Tracking error:", error);
  }
};

    trackVisitor();
  }, []);

  return null; // This component doesn't render anything UI-wise
}