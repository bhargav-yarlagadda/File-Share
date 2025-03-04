"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const router = useRouter()
    const {isLoaded,isSignedIn} = useUser() 
    if(!isLoaded){
      return <Loader/>
    }
    useEffect(()=>{
      
            if(isLoaded && !isSignedIn){
                return router.push("/sign-up")
            }
        
    },[isLoaded,isSignedIn])
  return (
   <div>
        {
            children
        }
   </div>
  );
}
