"use client";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import { useBackendAuth } from "@/hooks/useBackendAuth";
import useUserProfile from "@/hooks/useUserProfile";
import { toCurrency } from "@/utils/common";
import { MenuOutlined } from '@ant-design/icons';
import { THEME, TonConnectButton, useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Button, Drawer, message } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import cssClass from "./header.module.scss";
import Profile from './profile.component';
import LangDropdown from "./lang-dropdown.component";
import ProfileCompletionModal from "../profile-completion-modal/profile-completion-modal.component";
import EmailVerificationSuccess from "../email-verification/email-verification-success.component";
import EmailVerificationFailed from "../email-verification/email-verification-failed.component";
import { useTranslations } from 'next-intl';
import axios from 'axios';
import backendService from "@/services/backend/backend.service";
import {errorMessage} from "@/utils/common";
import {HELP_CONTACT_LINK} from "@/constants/common";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const EXTERNAL_LINK = process.env.NEXT_PUBLIC_EXTERNAL_URL || '#';
const MainHeader = () => {
  /**
   * STATES
   */
    const [isPublisher, setIsPublisher] = useState<boolean>(false);
    const [isAdvertiser, setIsAdvertiser] = useState<boolean>(false);
    const [visibleDrawer, setVisibleDrawer] = useState(false);
    const [userProfile, setUserProfile] = useState<any>({});
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [isVerificationSuccessVisible, setIsVerificationSuccessVisible] = useState(false);
    const [isVerificationFailedVisible, setIsVerificationFailedVisible] = useState(false);
  /**
   * HOOKS
   */
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const wallet = useTonWallet();
    const userFriendlyAddress = useTonAddress();
    const [tonConnectUI, setTonConnectUIOptions] = useTonConnectUI();
    setTonConnectUIOptions({
        uiPreferences: {
            theme: THEME.LIGHT
        }
    });
    useBackendAuth();
    const { token, setToken } = useContext(BackendTokenContext);
    const {
    refetch, // call API again
    data: userProfileData,
    error: userProfileError,
    isLoading: isUserProfileLoading,
    } = useUserProfile(token);
    const [loading, setLoading] = useState(false);
  /**
   * 
   * FUNCTIONS
   */
    const backHome = () => {
        router.push("/")
    }
    const checkUserRole = useCallback(() => {
        if (!userFriendlyAddress) {
            setIsPublisher(false);
            setIsAdvertiser(false);
            return;
        }
        setIsPublisher(true);
        setIsAdvertiser(true);
        // if (PUBLISHER_WHITELIST.includes(userFriendlyAddress)) {
        //     setIsPublisher(true);
        // }
        // if (ADVERTISER_WHITELIST.includes(userFriendlyAddress)) {
        //     setIsAdvertiser(true);
        // } 
    }, [userFriendlyAddress]);
        const initToken = useCallback(() => {
            let stringStore:any = localStorage?.getItem('sdk_dmtp');
            let sdk_dmtp:any = JSON.parse(stringStore);
                const { access_token } = sdk_dmtp?.auth || {};
                const token:any = access_token || null;
            if (token) {
                if (typeof setToken === 'function') {
                    setToken(token);
                }
                return;
            } else { 
                //backHome();
            }
        },[]);

        const initData = useCallback(() => {
        initToken();
        }, [initToken]);
        const showDrawer = () => {
        setVisibleDrawer(true);
        };

        const onClose = () => {
        setVisibleDrawer(false);
        };
        const updateUserProfile = useCallback( () => {
            try {
                if (userProfileData) {
                    const profileData = {
                        ...userProfileData,
                        email: userProfileData.email || ''
                    };
                    setUserProfile(profileData);
                } else { 
                    setUserProfile({});
                }
            } catch (error) {
                console.log("🚀 ~ updateUserProfile ~ error:", error);
            }
        }, [userProfileData]);
    const handleProfileSubmit = async (values: { email: string; projectName: string }) => {
        try {
            setLoading(true);
            let params = {
                email: values.email,
                project: values.projectName
            }
            const result = await backendService.postProfileComplete(params);
            // update profile
            refetch();
            updateUserProfile();
            message.success(t('MESSAGE_PROFILE_UPDATE_SUCCESS'));
           
        } catch (error : any) {
            console.log("🚀 ~ handleProfileSubmit ~ error:", error)
            message.error(errorMessage(error));
        }finally{
            setLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('sdk_dmtp');
        if (typeof setToken === 'function') {
            setToken(null);
        }
        tonConnectUI.disconnect();
        router.push('/');
    };
    const handleModalClose = () => {
        if (userProfile.status === 'Inactive') {
            logout();
        }
        setIsProfileModalVisible(false);
    };

    const verifyEmail = async ({code, user_id} : {code: string, user_id: string}) => {
        try {
            let params = {
                code: code,
                user_id: user_id
            }
            const response = await backendService.postProfileVerify(params);
            setIsVerificationSuccessVisible(true);
            // if (response && response.id) {
            //     // Update profile first
            //     const profileResult = await refetch();
            //     if (profileResult?.data) {
            //         setUserProfile({
            //             ...profileResult.data,
            //             email: profileResult.data.email || ''
            //         });
            //     }
            //     setIsVerificationSuccessVisible(true);
            // } else {
            //     setIsVerificationFailedVisible(true);
            // }
        } catch (error : any) {
            console.error('Email verification failed:', error);
            setIsVerificationFailedVisible(true);
            message.error(t(errorMessage(error)));
        }
    };

    const handleResendVerification = async () => {
        try {
            const user_id = searchParams.get('userId');
            if (user_id) {
                let params = {
                    user_id: user_id
                }
                const response = await backendService.postResendVerification(params);                
                message.success(t('MESSAGE_VERIFICATION_RESENT_SUCCESS'));
            }
        } catch (error) {
            console.error('Failed to resend verification:', error);
            message.error(t(errorMessage(error)));
        }
    };

    const handleContactSupport = () => {
        window.open(HELP_CONTACT_LINK, '_blank');
    };

    const closeSuccessModal =  () => {
        if (pathname === '/verification') {
            router.push('/');
        }
        setTimeout(() => {
            setIsVerificationSuccessVisible(false);
        },100);
    };
   
    const closeFailedModal = () => {
     
        if (pathname === '/verification') {
            router.push('/');           
        }
        setTimeout(() => {
            setIsVerificationFailedVisible(false);
        }, 800);
    };
    const checkVerifyEmail = useCallback(async ({code, user_id}: {code: string, user_id: string}) => {
       
        try {
            if(pathname !== '/verification'){ 
                return;
            }
            
            if (!isVerifyingEmail) {
                setIsVerifyingEmail(true);
                await verifyEmail({code, user_id});
                setIsVerifyingEmail(false);
            }
        } catch (error) {
            console.error('Failed to resend verification:', error);
            setIsVerifyingEmail(false);
        }
    },[pathname, isVerifyingEmail, verifyEmail]);

    const checkVerifyEmailUser = () => {
        const code = searchParams.get('code');
        const user_id = searchParams.get('userId');
        if(code && user_id && pathname === '/verification'){
            checkVerifyEmail({code, user_id});
        }
    };
    const checkUserEmail = () => {
        if(userProfile?.id && userProfile?.status === 'Inactive' && pathname !== '/verification') {
            setIsProfileModalVisible(true);
        }
    };
    useEffect(() => {
        checkVerifyEmailUser();
    },[]);
    useEffect(() => {
        checkUserEmail();
    },[userProfile]);
    
  /**
   * USE EFFECTS
   */
    useEffect(() => {
        initData();
    }, [initData]);
    
    useEffect(() => {
        checkUserRole();
    }, [checkUserRole]);

    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange(
        walletAndwalletInfo => {
            // update state/reactive variables to show updates in the ui
            if (!walletAndwalletInfo) {
                localStorage.removeItem('sdk_dmtp');
                    if (typeof setToken === 'function') {
                    setToken(null);
                    }
                router.push('/');
            }
        } 
);
    }, [tonConnectUI]);

    useEffect(() => {
        if (userProfileData) {
            updateUserProfile();
        }
   }, [updateUserProfile]);
   

  /**
   * RENDERS
   */
    const navigationLinks = (type: string) => {
        return (
            <div className={`${type === 'drawer' ? '' : 'hidden sm:flex'} items-center navigation-links`} >
                {token && <div className={`${type === 'drawer' ? 'mb-2' : 'ml-8'} flex items-center`}> 
                    <Link href="/dashboard" className={`link text-inherit ${pathname === '/dashboard' ? 'active text-blue-500' : ''}`}><span className="hover:text-blue-500">{ t('MAIN_HEADER_NAV_LABEL_DASHBOARD') }</span></Link>
                </div>}
                { token &&  <div className={`${type === 'drawer' ? 'mb-2' : 'ml-8'} flex items-center`}> 
                    <Link href="/tasks-campaign" className={`link text-inherit ${pathname.includes('/tasks-campaign') ? 'active text-blue-500' : ''}`}><span className="hover:text-blue-500">{ t('MAIN_HEADER_NAV_LABEL_ADS') }</span></Link>
                </div>}
                {token &&  <div className={`${type === 'drawer' ? 'mb-2' : 'ml-8'} flex items-center`}> 
                    <Link href="/tasks-inventory" className={`link text-inherit ${pathname.includes('/tasks-inventory') ? 'active text-blue-500' : ''}`}><span className="hover:text-blue-500">{ t('MAIN_HEADER_NAV_LABEL_OFFERWALL') }</span></Link>
                </div>}
                {token &&  <div className={`${type === 'drawer' ? 'mb-2' : 'ml-8'} flex items-center`}> 
                    <Link href="/snippets" className={`link text-inherit ${pathname.includes('/snippets') ? 'active text-blue-500' : ''}`}><span className="hover:text-blue-500">{ t('MAIN_HEADER_NAV_LABEL_SNIPPETS') }</span></Link>
                </div>}
                <div className={`${type === 'drawer' ? 'mb-2' : 'ml-8'}   flex items-center`}> 
                    <a href={EXTERNAL_LINK} target="_blank" className={`link`}><span>{ t('MAIN_HEADER_NAV_LABEL_INSTRUCTION') }</span></a>
                </div>
            </div>
        )
    }
  return (
    <>
    <header className={`${cssClass.mainLayoutHeader}`}>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 ">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                  <div className="left-content flex items-center"> 
                    <div className="sm:hidden flex items-center">
                        <Button className="mr-4" icon={<MenuOutlined />} onClick={showDrawer} />
                    </div>
                    <Link href="/" className="flex items-center">
                        <img src="/images/logo-icon.png" className="h-9 sm:h-10" alt="Apps network Logo" />
                        <span className="text-pretty line-clamp-3 leading-[1.1] tracking-tight max-w-[18ch] lg:max-w-[24ch] lg:text-lg/tight font-semibold ms-3 text-dark">Apps Network</span>
                    </Link>
                    {navigationLinks('')}          
                </div>
                <div className="flex items-center lg:order-2 right-content">
                    {token && <div className="mr-3 hidden sm:flex">
                        <span className="bg-green-100 font-bold text-green-800 text-sm rounded-xl me-2 px-2.5 py-0.5   ">{toCurrency(userProfile?.point || 0, 0)} pts</span>
                    </div>
                    }
                    
                    <TonConnectButton  />
                    <span className="ml-2"> <LangDropdown /> </span>
                    {  token &&
                    <span className="ml-4"> <Profile userProfile={userProfile} /> </span>
                    }
                </div>
               
            </div>
        </nav>
        <Drawer
            title={<div className="flex items-center justify-between">
                <div>SDK-Apps network</div>
                {token && <div> <span className="bg-green-100 font-bold text-green-800 text-sm rounded-xl me-2 px-2.5 py-0.5   ">{toCurrency(userProfile?.point || 0, 0)} pts</span></div>}
            </div>}
        placement="left"
        onClose={onClose}
        visible={visibleDrawer}
        >
            {navigationLinks('drawer')}
        </Drawer>
    </header>
    <ProfileCompletionModal 
        email={userProfile?.email}
        isVisible={isProfileModalVisible}
        onClose={handleModalClose}
        onSubmit={handleProfileSubmit}
        loading={loading}
    />
    <EmailVerificationSuccess 
        isVisible={isVerificationSuccessVisible}
        onClose={closeSuccessModal}
    />
    <EmailVerificationFailed 
        isVisible={isVerificationFailedVisible}
        onClose={closeFailedModal}
        onResend={handleResendVerification}
        onContactSupport={handleContactSupport}
    />
    </>
  )
}
export default MainHeader;