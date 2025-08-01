"use client";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useState } from "react";
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
  /**
   * HOOKS
   */
  const manifestUrl = NEXT_PUBLIC_SDK_DOMAIN_URL === 'https://adsgram-demo-app.vercel.app' ? 'https://adsgram-demo-app.vercel.app/tonconnect-manifest-dev.json' : 'https://adsgram-demo-app.vercel.app/tonconnect-manifest-prod.json';
 
  /**
   * 
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
      <TonConnectUIProvider manifestUrl={manifestUrl}>
      <div className="main-header"> 
        <MainHeader/>
    </div>
    <div className="main-container">
        {children}
    </div> 
      <HelpButton/>
      </TonConnectUIProvider>
      </BackendTokenContext.Provider>
  )
}
export default MainLayout;
  