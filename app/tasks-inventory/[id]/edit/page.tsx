"use client";
import InventoryForm from "@/components/inventoryPage/InventoryForm";
import { MAX_PUBLISHER_ITEMS } from "@/constants/common";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { useRouter, useParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import cssClass from "./page.module.scss";
import { useTranslations } from 'next-intl';
export default function offerWallEditPage() {
 
  /**
   * STATES
   * */
  const [offerWallInfo, setOfferWallInfo] = useState(null);

  
  /**
   * HOOKS
   */
  const params = useParams();
  const { token } = useContext(BackendTokenContext);
  const t = useTranslations();

  /**
   * FUNCTIONS
   */
  const getOfferWallInfo = async () => {
    try {
      const rs = await backendService.getInventoryById(params?.id);
      console.log("🚀 ~ getOfferWallInfo ~ rs:", rs)
      setOfferWallInfo(rs);
    } catch (error) {
      console.log("🚀 ~ getOfferWallInfo ~ error:", error)
    }
  }
  const initData = useCallback(async () => {
    if (token) {
      getOfferWallInfo();  
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
      <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.adsEditPage}`}>
        <h1 className="text-2xl font-bold pt-4">{t('OFFER_WALL_EDIT_PAGE_TITLE') }</h1>
        <div className="main-page-container mt-4 mb-4">
          <InventoryForm offerWallInfo={offerWallInfo}/>
        </div>
      </div>
    );
  
}
