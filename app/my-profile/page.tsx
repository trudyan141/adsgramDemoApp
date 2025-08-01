"use client";

import ProfileInfo from "@/components/myProfile/ProfileInfo";
import cssClass from "./page.module.scss";
import { useTranslations } from 'next-intl';
export default function MyProfilePage() {
 
    const t = useTranslations();
    /**
     * USE EFFECTS
     */

    /**
     * RENDERS
     */
    return (
      <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.myProfilePage}`}>
        <h1 className="text-2xl font-bold pt-4">{t('MY_PROFILE_PAGE_TITLE')}</h1>
        <div className="main-page-container mt-4 mb-4">
          <ProfileInfo/>
        </div>
      </div>
    );
  
}
