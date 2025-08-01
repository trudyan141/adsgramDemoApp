"use client";

import AdsForm from "@/components/adsPage/adsForm";
import { MAX_ADVERTISER_ITEMS } from "@/constants/common";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import cssClass from "./page.module.scss";
import { useTranslations } from 'next-intl';
export default function TasksEditPage() {
 
   /**
   * STATES
   * */
  const [adsInfo, setAdsInfo] = useState(null);
  
  /**
   * HOOKS
   */
  const router = useRouter();
  const params = useParams();
  const { token } = useContext(BackendTokenContext);
  const t = useTranslations();
  /**
   * FUNCTIONS
   */
  const getAdsInfo = async () => {
    try {
      const adsId = params.id;
      const rs = await backendService.getAdsById(adsId);
      console.log("🚀 ~ getAdsInfo ~ rs:", rs)
      setAdsInfo(rs);
    } catch (error) {
      console.log("🚀 ~ getAdsInfo ~ error:", error)
    }
  };
  const initData = useCallback(async () => {
    if (token) {
       getAdsInfo();
      }
  }, [token]);
  /**
   * USE EFFECTS
   */
    useEffect(() => {
      initData();
    }, [initData]);
  
    /**
     * RENDERS
     */
    return (
      <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.tasksEditPage}`}>
        <h1 className="text-2xl font-bold">{t('ADS_EDIT_PAGE_TITLE')}</h1>
        <div className="main-page-container mt-4 mb-4">
          <AdsForm adsInfo={adsInfo} onReload={initData}/>
        </div>
      </div>
    );
  
}
