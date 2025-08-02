"use client";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useState, useEffect } from "react";
import MainHeader from "./header.component";
import HelpButton from "./help-button.component";
const NEXT_PUBLIC_SDK_DOMAIN_URL = process.env.NEXT_PUBLIC_SDK_DOMAIN_URL || '';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  /**
   * STATES
   */
  const [token, setToken] = useState<string | null>(null);
  const [manifestUrl, setManifestUrl] = useState('');
  
  /**
   * HOOKS
   */
  useEffect(() => {
    // Check if we're running on the ngrok URL
    const isNgrokLocalhost = typeof window !== 'undefined' && 
      window.location.hostname.includes('ngrok-free.app');
    console.log('isNgrokLocalhost', isNgrokLocalhost);
    if (isNgrokLocalhost) {
      // Use the ngrok manifest
      setManifestUrl(`https://unlikely-glorious-man.ngrok-free.app/tonconnect-manifest-localhost.json`);
    } else if (NEXT_PUBLIC_SDK_DOMAIN_URL === 'https://adsgram-demo-app.vercel.app') {
      // Use dev manifest
      setManifestUrl('https://adsgram-demo-app.vercel.app/tonconnect-manifest-dev.json');
    } else {
      // Use prod manifest
      setManifestUrl('https://adsgram-demo-app.vercel.app/tonconnect-manifest-prod.json');
    }
  }, []);
 
  /**
   * FUNCTIONS
   */
  /**
   * USE EFFECTS
   */
 
  /**
   * RENDERS
   */
  return (
      <BackendTokenContext.Provider value={{token, setToken}}>
      {manifestUrl && (
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <div className="main-header"> 
            <MainHeader/>
          </div>
          <div className="main-container">
            {children}
          </div> 
          <HelpButton/>
        </TonConnectUIProvider>
      )}
      </BackendTokenContext.Provider>
  )
}
export default MainLayout;
  