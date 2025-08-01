"use client";

import AdsForm from "@/components/adsPage/adsForm";
import { MAX_ADVERTISER_ITEMS } from "@/constants/common";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import cssClass from "./page.module.scss";
import { useTranslations } from 'next-intl';
export default function TasksCreatePage() {
 
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
        const rs = await backendService.getAds();
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
      // if (total >= MAX_ADVERTISER_ITEMS) { 
      //   router.push("/tasks-campaign")
      // }
    }, [total]);
    
    /**
     * RENDERS
     */
    return (
      <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.tasksCreatePage}`}>
        <h1 className="text-2xl font-bold pt-4">{t('ADS_CREATE_PAGE_TITLE')}</h1>
        <div className="main-page-container mt-4 mb-4">
          <AdsForm onReload={initData} />
        </div>
      </div>
    );
  
}
