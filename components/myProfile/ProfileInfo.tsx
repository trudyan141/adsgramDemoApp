import { BackendTokenContext } from "@/hooks/backendTokenContext";
import useUserProfile from "@/hooks/useUserProfile";
import { toCurrency } from "@/utils/common";
import { Card } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslations } from 'next-intl';

export default function ProfileInfo({ ...props }: any) {
   /**
   * STATES
   * */
  const [userProfile, setUserProfile] = useState<any>({});
  const { token, setToken } = useContext(BackendTokenContext);
  const {
    data: userProfileData,
    error: userProfileError,
    isLoading: isUserProfileLoading,
    } = useUserProfile(token);
  /**
   * HOOKS
   */
  const router = useRouter();
  const t = useTranslations();
    /**
   * FUNCTIONS
   */
  const initData = useCallback(async () => {
    try {
        if (userProfileData) {
          setUserProfile(userProfileData);
        } else { 
          setUserProfile({});
        }
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error)
      
    }
  }, [userProfileData]);
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    initData();
   }, [initData]);
  /**
   * FUNCTIONS
   */
  
  return (
    <div className="profile-info">
      <Card title={t("MY_PROFILE_PAGE_CARD_TITLE")}>
        <div className="mb-6">
          <h3 className="font-bold mb-2">{t('MY_PROFILE_PAGE_LABEL_EMAIL')}:</h3>
          <div className="p-3 bg-gray-100 rounded-lg w-full">
            {userProfile?.email || '-'}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">{t('MY_PROFILE_PAGE_LABEL_PROJECT_NAME')}:</h3>
          <div className="p-3 bg-gray-100 rounded-lg w-full">
            {userProfile?.projects?.[0] || '-'}
          </div>
        </div>

        <p className="mb-2"><strong style={{width: "120px", display: "inline-block" }}>{t('MY_PROFILE_PAGE_LABEL_WALLET_ADDRESS')}</strong>: {userProfile?.wallet_address}</p>
        <p><strong style={{width: "120px", display: "inline-block" }}>{t('MY_PROFILE_PAGE_LABEL_POINTS')}</strong>: <span className="font-bold text-green-500 text-xl"> {toCurrency(userProfile?.point || 0,0)} pts</span></p>

      </Card>
    </div>
  );
}
