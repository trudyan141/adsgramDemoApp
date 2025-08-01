"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from "react";
export default function TasksDetailPage() {
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
      router.push(`/tasks/${id}/edit`)
    } else {
      router.push("/tasks/create")
    }
  }, [])
  /**
   * RENDERS
   */
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold pt-4">Detail Tasks PAGE</h1>
    </div>
  );
}
