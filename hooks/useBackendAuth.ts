"use client";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { useIsConnectionRestored, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { notification } from 'antd';
import { useCallback, useContext, useEffect, useRef } from "react";
const localStorageKey = 'sdk_dmtp';
const payloadTTLMS = 1000 * 60 * 20;

export function useBackendAuth() {
    const { setToken } = useContext(BackendTokenContext);
    const isConnectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const interval = useRef<ReturnType<typeof setInterval> | undefined>();
      const [api, contextHolder] = notification.useNotification();
    const authenticate = useCallback(async () => {
        try {
            if (!isConnectionRestored || !setToken) {
                return;
            }

            clearInterval(interval.current);

            if (!wallet) {
                // localStorage.removeItem(localStorageKey);
                // setToken(null);
                const refreshPayload = async () => {
                    tonConnectUI.setConnectRequestParameters({ state: 'loading' });

                    const {payload} = await backendService.generatePayload();
                    console.log("🚀 ~ refreshPayload ~ value:", payload)
                    if (!payload) {
                        tonConnectUI.setConnectRequestParameters(null);
                    } else {
                        tonConnectUI.setConnectRequestParameters({
                            state: "ready",
                            value: { tonProof: payload },
                        });
                    }
                }

                refreshPayload();
                setInterval(refreshPayload, payloadTTLMS);
                return;
            }

            //const token = localStorage.getItem(localStorageKey);
            let stringStore:any = localStorage?.getItem('sdk_dmtp');
            let sdk_dmtp:any = JSON.parse(stringStore);

            const { access_token } = sdk_dmtp?.auth || {};
            const token = access_token;
            if (token) {
                setToken(token);
                return;
            }
            const walletAddress = wallet?.account?.address;
            const network = wallet?.account?.chain;
            const tonProof: any = wallet?.connectItems?.tonProof;
            const proof = tonProof?.proof;
            const walletStateInit = wallet?.account?.walletStateInit;  
            if (proof && walletAddress) {
                const params = {
                    address: walletAddress,
                    network: network,
                    proof: {
                        ...proof,
                        state_init: walletStateInit
                    },
                }
                const result = await backendService.checkProof(params);
                if (result) {
                    console.log("🚀 ~ backendService.checkProof ~ result:", result)
                    if (!sdk_dmtp) {
                        const wallet_hash_encode = encodeURIComponent(result.wallet_hash);
                        sdk_dmtp = {
                            auth: {
                                access_token: result.access_token,
                                refresh_token: result.refresh_token,
                                wallet_hash: wallet_hash_encode
                            }
                        }
                    } else { 
                        sdk_dmtp.auth.access_token = result.access_token;
                        sdk_dmtp.auth.access_token = result.refresh_token;
                        const wallet_hash_encode = encodeURIComponent(result.wallet_hash);
                        sdk_dmtp.auth.wallet_hash = wallet_hash_encode
                    
                    }
                    console.log("🚀 ~ authenticate ~ sdk_dmtp:", sdk_dmtp)
                    localStorage.setItem('sdk_dmtp', JSON.stringify(sdk_dmtp));
                    setToken(result.access_token);
                    //localStorage.setItem(localStorageKey, result);
                } else {
                    alert('Please try another wallet');
                    tonConnectUI.disconnect();
                }
                
            } else {
                alert('Please try another wallet');
                tonConnectUI.disconnect();
            }
        } catch (error :any) {
            console.log("🚀 ~ authenticate ~ error:", error)
            notification.error({
                message: 'Error',
                description: error?.response?.data?.message || error?.message || error,
                placement: 'topRight',
            })
            tonConnectUI.disconnect();
        }
    },[wallet,tonConnectUI, isConnectionRestored, setToken])
         
    useEffect( () => {
      authenticate();
    }, [authenticate])
  return { contextHolder }
  
}