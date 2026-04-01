'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {data: { session }} = await supabase.auth.getSession()
      if (session) {
        //if Already logged-in, kick them to home immediately 
        router.replace('/home')

      }
    };
    checkUser();
  }, [router]);
  return (
    <main className="flex items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold">Please Login to View Full App Features</h1>
    </main>
  )
}