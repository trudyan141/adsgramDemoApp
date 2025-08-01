"use client";
import InventoryForm from "@/components/inventoryPage/InventoryForm";
import { MAX_PUBLISHER_ITEMS } from "@/constants/common";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import cssClass from "./page.module.scss";
import { useTranslations } from 'next-intl';
export default function InventoryCreatePage() {
 
  /**
   * STATES
   * */
  const [total, setTotal] = useState(0);
  
  /**
   * HOOKS
   */
  const router = useRouter();
  const { token } = useContext(BackendTokenContext);
  const t = useTranslations();
  /**
   * FUNCTIONS
   */
  const initData = useCallback(async () => {
    if (token) {
        const rs = await backendService.getInventories();
        setTotal(rs?.total || 0);
      }
  }, [token]);
  /**
   * USE EFFECTS
   */
    useEffect(() => {
      initData();
    }, [initData]);
    useEffect(() => {
      // if (total >= MAX_PUBLISHER_ITEMS) { 
      //   router.push("/tasks-inventory")
      // }
    }, [total]);
    /**
     * RENDERS
     */
    return (
      <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.inventoryCreatePage}`}>
        <h1 className="text-2xl font-bold pt-4">{t('OFFER_WALL_CREATE_PAGE_TITLE') }</h1>
        <div className="main-page-container mt-4 mb-4">
          <InventoryForm/>
        </div>
      </div>
    );
  
}
