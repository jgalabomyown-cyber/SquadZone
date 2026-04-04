'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../lib/supabaseClient';

const HomeCard: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div className={`bg-[#111] p-6 rounded-lg border border-[#333] shadow-xl ${className}`}>
    {title && (
      <h3 className="text-sm font-bold text-gray-500 mb-4 tracking-[0.2em] uppercase border-b border-[#222] pb-2">
        {title}
      </h3>
    )}
    {children}
  </div>
);

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
        <div className="space-y-6 pt-25 pl-5 pr-5">
          <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] p-8 rounded-lg border border-[#333]">
            <p>
              Please Login to View Full App Features
            </p>
            <div className="h-1 w-20 bg-orange-600 mt-4"></div>
          </div>
          
          <HomeCard title="Community Posts">
            <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-4 flex flex-col items-center justify-center border border-[#222] group cursor-pointer overflow-hidden">
                <div className="text-gray-600 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H208V157.51l-42.34-42.34a8,8,0,0,0-11.32,0L48,221.51ZM208,208H70.63l114-114L208,117.37V208ZM160,88a16,16,0,1,1-16-16A16,16,0,0,1,160,88Z"></path>
                  </svg>
                </div>
                <span className="text-[10px] mt-2 font-bold tracking-widest text-gray-700">NO MEDIA ATTACHED</span>
            </div>
            <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
                  <span className="text-white font-bold uppercase tracking-tighter">JESSEKID</span>
                </div>
                <div className="flex gap-4 font-bold text-[10px]">
                    <span className="hover:text-white cursor-pointer transition-colors">0 LIKES</span>
                    <span className="hover:text-white cursor-pointer transition-colors">COMMENTS</span>
                </div>
            </div>
          </HomeCard>
        </div>
  )
}