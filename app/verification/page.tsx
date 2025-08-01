"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useContext } from "react";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import { message } from "antd";
export default function VerificationPage() {
  /**
   * STATES
   * */

  /**
   * HOOKS
   */
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, setToken } = useContext(BackendTokenContext);
  /**
   * FUNCTIONS
   */
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const code = searchParams.get('code');
    const user_id = searchParams.get('userId');
    if(!code || !user_id){  
      router.push('/');
      return;
    }
  }, [])
  /**
   * RENDERS
   */
  return (
   <div style={{height: "100vh"}}></div>
  );
}
