"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from "react";
export default function InventoryDetailPage() {
  /**
   * STATES
   * */

  /**
   * HOOKS
   */
  const router = useRouter();
  const { id } = useParams()
  /**
   * FUNCTIONS
   */
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    if (id) {
      router.push(`/inventory/${id}/edit`)
    } else {
      router.push("/inventory/create")
    }
  }, [])
  /**
   * RENDERS
   */
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold pt-4">INVENTORY DETAIL PAGE</h1>
    </div>
  );
}
