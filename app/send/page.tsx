"use client";
import SendForm from "@/components/send/sendForm.component";
export default function SendPage() {
  /**
   * STATES
   * */

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold pt-4">SEND TON PAGE</h1>
      <div className="main-page-container mt-4"> 
        <SendForm/> 
      </div>
    </div>
  );
}
