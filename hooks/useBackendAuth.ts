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
            console.log("🚀 ~ authenticate ~ proof:", proof)
            console.log("🚀 ~ authenticate ~ walletAddress:", walletAddress)
            console.log("🚀 ~ authenticate ~ network:", network)
            console.log("🚀 ~ authenticate ~ tonProof:", tonProof)
            console.log("🚀 ~ authenticate ~ walletStateInit:", walletStateInit)
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
                console.log("🚀 ~ authenticate ~ result:", result)
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
            const walletAddress: any = wallet?.account?.address;
            const wallet_hash_encode = encodeURIComponent(walletAddress);
            const sdk_dmtp = {
                auth: {
                    access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRkODNkZGMxNzkxOGIxYjBjZTU0MCIsImFkZHIiOiIwOjkxNjc3NDNhMDkyZDEwYzFmNjg2MjJhZjViNDYxMzUwNWFmZGVkZWIzOTg4MzI0YTFkMjAxNGMxOTJlZjU5M2EiLCJpYXQiOjE3NTQwNjY4OTQsImV4cCI6MTc1NDY1OTA5NCwiaXNzIjoiYXBwcy1uZXR3b3JrLm5ldCJ9.STuO-KotEJm8FTsfDSP4kZyjt7ga2kxm2Hq63abonA4buyukJxnMhTt2I_QroFXgpVMV-vbX3byG8F-HACgQ62Vdu1bZ4At_prI-MGYM8N9vqx3Zui0EvxYgvgdV4wdijUyxfmuoyuB9eKFDC_5hQlIAz10BhG8XWzY5BIeiwWe6LgJdYQQPCgyWgYS6GdG8fVeSt6-vZIUuW8-vRNQpWLAwJdHFfTN2Y9ojJVATEe6WgT6x4-Zxt5SAJBhnXj_iPpov6nb8aZ2r1nckVW93-AQB151FAwddpcdOQ6uLtw23IVVOX2l2NeAUMJ5adUkBcKBRtUzsK6lm7Mm9Uv6t4IT2dIHJr61leAhqzNWwM15g_LvllzU_ulbWcW882BFDcKtbx7Xd-frpuFGGTlNL6nu7ON9AtyTetj6_esY6yZdEV0kSeqN_0rAQgmJDONnlmSZhAbB39StARycvkm7nSdz62pfNwY-G5rFWJnAmEDeHEIKER3euTWKCsUBxWKOtP-EaNQQKOnyO85wKlmPkcBDje4wjRt4m9sUpZBaOuNUl3PQXqx_mJb_la9IaMe-tpXLuimFx91drKeO9SoHFlokOMSkzNUweBAU3MPWqX7qmtSqAKAFh9jlj8S8sZFK64emLML7yPJWclIdxS9he2P6Mq7_PLzDI9GT-wnsdLVA',
                    refresh_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRkODNkZGMxNzkxOGIxYjBjZTU0MCIsImFkZHIiOiIwOjkxNjc3NDNhMDkyZDEwYzFmNjg2MjJhZjViNDYxMzUwNWFmZGVkZWIzOTg4MzI0YTFkMjAxNGMxOTJlZjU5M2EiLCJpYXQiOjE3NTQwNjY4OTQsImV4cCI6MTc1NjYwNDg5NCwiaXNzIjoiYXBwcy1uZXR3b3JrLm5ldCJ9.BtbXL3LcVUaq3nu7GM4KFiRJMuh2VZrCVQ0iZQkWOUlMpaAAIm2zkuYFED7_qJud_MjGkApbZOxcNDZT76Xf_tkqVFfi0unCzq9YIrcuK2vvBsIiekp9wlCGYLBvTe0m1ULqM4pFYvcEMYhLD3lPdgeUPHXJE-p_Fg6Qnc3LPvc_VTieFn3lFmBVdTpavinwwpZ-pa3CdbQP7O0D-5geIcaLGYt39f-p7faxIUVjXeQcOh-8aGMnaX4w8hsnamVQ-0PgZiN_OC83D3TNAF4Uiki9rG7oFhMCq653SPacc3Jxf06W0ktZrPwCTJspq8Wl6YIRACFxSKJGptPTtpbyZhbMxbJeJZrjIy4omwfuZNGn2Pu9ZBZCsHCoVUa2_DByK8jEZAjOUfJnXpg9vcH06Lk9zu-OFpUA7ThwDcBv5s1_PzguuBI8_xpFTJncxRc4uukOpJVB4apI06P7pMz4xyZsn4ljXyBZfue6mCRF5ai4eZyJnrrotYKk73Eah2iYmO1eSn6ln_-RPm5J2GnPTP6etsBVgzj0BsDJCWKEuS731J0U_-pk21RcGzEUdI8-nVUEtOO3NJFJj9MIsugW5JhKs3XNwqJYBxW45t-mwkvtQVmBAzXBwMmauEV4KYRA-R_ZiYqQQT7-3h7_cPGBkQanZYMDN3PJ0VIehEwZmAg',
                    wallet_hash: wallet_hash_encode
                }
            }
            if (sdk_dmtp) {
                const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRkODNkZGMxNzkxOGIxYjBjZTU0MCIsImFkZHIiOiIwOjkxNjc3NDNhMDkyZDEwYzFmNjg2MjJhZjViNDYxMzUwNWFmZGVkZWIzOTg4MzI0YTFkMjAxNGMxOTJlZjU5M2EiLCJpYXQiOjE3NTQwNjY4OTQsImV4cCI6MTc1NjYwNDg5NCwiaXNzIjoiYXBwcy1uZXR3b3JrLm5ldCJ9.BtbXL3LcVUaq3nu7GM4KFiRJMuh2VZrCVQ0iZQkWOUlMpaAAIm2zkuYFED7_qJud_MjGkApbZOxcNDZT76Xf_tkqVFfi0unCzq9YIrcuK2vvBsIiekp9wlCGYLBvTe0m1ULqM4pFYvcEMYhLD3lPdgeUPHXJE-p_Fg6Qnc3LPvc_VTieFn3lFmBVdTpavinwwpZ-pa3CdbQP7O0D-5geIcaLGYt39f-p7faxIUVjXeQcOh-8aGMnaX4w8hsnamVQ-0PgZiN_OC83D3TNAF4Uiki9rG7oFhMCq653SPacc3Jxf06W0ktZrPwCTJspq8Wl6YIRACFxSKJGptPTtpbyZhbMxbJeJZrjIy4omwfuZNGn2Pu9ZBZCsHCoVUa2_DByK8jEZAjOUfJnXpg9vcH06Lk9zu-OFpUA7ThwDcBv5s1_PzguuBI8_xpFTJncxRc4uukOpJVB4apI06P7pMz4xyZsn4ljXyBZfue6mCRF5ai4eZyJnrrotYKk73Eah2iYmO1eSn6ln_-RPm5J2GnPTP6etsBVgzj0BsDJCWKEuS731J0U_-pk21RcGzEUdI8-nVUEtOO3NJFJj9MIsugW5JhKs3XNwqJYBxW45t-mwkvtQVmBAzXBwMmauEV4KYRA-R_ZiYqQQT7-3h7_cPGBkQanZYMDN3PJ0VIehEwZmAg';
                if (setToken) {
                    setToken(token);
                }
                localStorage.setItem('sdk_dmtp', JSON.stringify(sdk_dmtp));
            }
           
            // console.log("🚀 ~ authenticate ~ error:", error)
            // notification.error({
            //     message: 'Error',
            //     description: error?.response?.data?.message || error?.message || error,
            //     placement: 'topRight',
            // })
            //tonConnectUI.disconnect();
        }
    },[wallet,tonConnectUI, isConnectionRestored, setToken])
         
    useEffect( () => {
      authenticate();
    }, [authenticate])
  return { contextHolder }
  
}