import { get } from 'http';
import http from './http';
const URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || ''
const URLs = {
  getSignMessage: `${URL}/auth/sign-message`,
  postSignMessage: `${URL}/auth/token`,
  postAds: `${URL}/tasks`,
  getAds: `${URL}/tasks`,
  getAdsById: (id) =>`${URL}/tasks/${id}`,
  patchAdsById: (id) =>`${URL}/tasks/${id}`,
  postAdsUpload: `${URL}/tasks/upload`,
  postDeleteAd: (id) => `${URL}/tasks/${id}`,
  postInventories: `${URL}/inventories`,
  getInventories: `${URL}/inventories`,
  postDeleteInventory: (id) => `${URL}/inventories/${id}`,
  getInventoryById: (id) => `${URL}/inventories/${id}`,
  patchInventoryById: (id) => `${URL}/inventories/${id}`,
  getProfile: `${URL}/profile/me`,
  updateDisplayStatus: (id) => `${URL}/tasks/${id}/display`,
  getAdsByAdmin: `${URL}/admin/tasks`,
  updateAdsStatusByAdmin: (id) => `${URL}/admin/tasks/${id}/review`,
  postProfileComplete: `${URL}/profile/complete`,
  postProfileVerify: `${URL}/profile/verify`,
  postResendVerification: `${URL}/profile/resend-to-verify`,
  getAdStats: `${URL}/stats/advertiser`,
  getPublisherStats: `${URL}/stats/publisher`,
  getAdChart: `${URL}/stats/advertiser/chart`,
  getPublisherChart: `${URL}/stats/publisher/chart`,
  getAdminDashboard: `${URL}/admin/stats/chart`,
  getUsersByAdmin: `${URL}/admin/users`,
  getAllTimeUsersByAdmin: `${URL}/admin/stats/all-time`,
  checkTitleUnique: `${URL}/ads/check-title`,
  updateBotToken: (id) => `${URL}/tasks/${id}/bot-token`,
  deleteBotToken: (id) => `${URL}/tasks/${id}/bot-token`,
};

const generatePayload = async () => {
  try {
    const result = await getSignMessage();
    return result;
  }catch(error){
    console.log(error,'error=>generatePayload');
    throw error
  }
}
const checkProof = async (params) => {

  try {
    let result = await postSignMessage(params);
    return result;
  } catch (error) {
    console.log(error, 'error=>checkProof');
    throw error
  }
}
const getSignMessage = async () => {
  try{
    let result = await http.get(URLs.getSignMessage);
    return result?.data;
  }catch(error){
    console.log(error,'error=>getSignMessage');
    throw error
  }
};

const postSignMessage = async (params) => {
  try{
    let result = await http.post(URLs.postSignMessage, params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>postSignMessage');
    throw error
  }
};
const postAds = async (params) => {
  try{
    let result = await http.post(URLs.postAds, params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>postAds');
    throw error
  }
};
const postAdsUpload = async (params) => {
  const { file } = params;
  const formData = new FormData();
    formData.append('image', file)
  try {
    const response = await http.post(URLs.postAdsUpload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data || response;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
const postDeleteAd = async (ad_id) => {
  try {
    let result = await http.delete(URLs.postDeleteAd(ad_id));
    return result?.data;
  } catch (error) {
    console.log(error,'error=>postDeleteAds');
    throw error
  }
 
}
const getAds = async (params) => {
  try{
    let result = await http.get(URLs.getAds,{params: params});
    return result?.data;
  }catch(error){
    console.log(error,'error=>getAds');
    throw error
  }
};
const getAdsById = async (id) => {
  try{
    let result = await http.get(URLs.getAdsById(id));
    console.log("🚀 ~ getAdsById ~ result:", result)
    return result?.data;
  }catch(error){
    console.log(error,'error=>getAdsById');
    throw error
  }
};
const patchAdsById = async (id,params) => {
  try{
    let result = await http.patch(URLs.patchAdsById(id),params);
    console.log("🚀 ~ patchAdsById ~ result:", result)
    return result?.data;
  }catch(error){
    console.log(error,'error=>patchAdsById');
    throw error
  }
};

const postInventories = async (params) => {
  try{
    let result = await http.post(URLs.postInventories, params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>postAds');
    throw error
  }
};
const postDeleteInventory = async (inventory_id) => {
  try {
    let result = await http.delete(URLs.postDeleteInventory(inventory_id));
    return result?.data;
  } catch (error) {
    console.log(error,'error=>postDeleteInventory');
    throw error
  }
 
}
const getInventories = async (params) => {
  try{
    let result = await http.get(URLs.getInventories,{params: params});
    return result?.data;
  }catch(error){
    console.log(error,'error=>getInventories');
    throw error
  }
};
const getInventoryById = async (id) => {
  try{
    let result = await http.get(URLs.getInventoryById(id));
    return result?.data;
  }catch(error){
    console.log(error,'error=>getInventoryById');
    throw error
  }
};
const patchInventoryById = async (id, params) => {
  try{
    let result = await http.patch(URLs.patchInventoryById(id), params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>patchInventoryById');
    throw error
  }
};
const getProfile = async () => {
  try{
    let result = await http.get(URLs.getProfile);
    return result?.data;
  }catch(error){
    console.log(error,'error=>getProfile');
    throw error
  }
}

const updateDisplayStatus = async (id,params) => {
  try{
    let result = await http.post(URLs.updateDisplayStatus(id),params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>updateDisplayStatus');
    throw error
  }
};

const getAdsByAdmin = async (params) => {
  try{
     // Filter out empty or null values from params
     const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null)
    );
    let result = await http.get(URLs.getAdsByAdmin,{params: filteredParams});
    return result?.data;
  }catch(error){
    console.log(error,'error=>getAdsByAdmin');
    throw error
  }
}; 
const updateAdsStatusByAdmin = async (id,params) => {
  try{
    let result = await http.post(URLs.updateAdsStatusByAdmin(id),params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>updateAdsStatusByAdmin');
    throw error
  }
};
const postProfileComplete = async (params) => {
  try{
    let result = await http.post(URLs.postProfileComplete, params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>postProfileComplete');
    throw error
  }
};
const postProfileVerify = async (params) => {
  try{
    let result = await http.post(URLs.postProfileVerify, params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>postProfileVerify');
    throw error
  }
};
const postResendVerification = async (params) => {
  try{
    let result = await http.post(URLs.postResendVerification, params);
    return result?.data;
  }catch(error){
    console.log(error,'error=>postResendVerification');
    throw error
  }
};
const getAdStats = async (params) => {
  try{
    let result = await http.get(URLs.getAdStats, {params});
    return result?.data;
  }catch(error){
    console.log(error,'error=>getAdStats');
    throw error
  }
};
const getPublisherStats = async (params) => {
  try{
    let result = await http.get(URLs.getPublisherStats, {params});
    return result?.data;
  }catch(error){
    console.log(error,'error=>getPublisherStats');
    throw error
  }
};
const getAdChart = async (params) => {
  try{
    let result = await http.get(URLs.getAdChart, {
      params
    });
    return result?.data;
  }catch(error){
    console.log(error,'error=>getAdChart');
    throw error
  }
};
const getPublisherChart = async (params) => {
  try{
    let result = await http.get(URLs.getPublisherChart, {
      params
    });
    return result?.data;
  }catch(error){
    console.log(error,'error=>getPublisherChart');
    throw error
  }
};
const getAdminDashboard = async (params) => {
  try{
    let result = await http.get(URLs.getAdminDashboard,{params});
    return result?.data;
  }catch(error){
    console.log(error,'error=>getAdminDashboard');
    throw error
  }
};
const getUsersByAdmin = async (params) => {
  console.log("🚀 ~ getUsersByAdmin ~ params:", params)
  try{
    let result = await http.get(URLs.getUsersByAdmin,{params: params});
    return result?.data;
  }catch(error){
    console.log(error,'error=>getUsersByAdmin');
    throw error
  }
};
const getAllTimeUsersByAdmin = async () => {
  try{
    let result = await http.get(URLs.getAllTimeUsersByAdmin);
    return result?.data;
  }catch(error){
    console.log(error,'error=>getAllTimeUsersByAdmin');
    throw error
  }
};
const checkTitleUnique = async (title) => {
  try {
    const result = await http.get(URL.checkTitleUnique,{params:{title}})
    return result?.data;
  } catch (error) {
    console.log("🚀 ~ checkTitleUnique ~ error:", error)
    throw error;
  }
}
const updateBotToken = async (id,params) => {
  try{
    let result = await http.patch(URLs.updateBotToken(id),params);
    console.log("🚀 ~ updateBotToken ~ result:", result)
    return result?.data;
  }catch(error){
    console.log(error,'error=>updateBotToken');
    throw error
  }
};
const deleteBotToken = async (id) => {
  try{
    let result = await http.delete(URLs.deleteBotToken(id));
    return result?.data;
  }catch(error){
    console.log(error,'error=>deleteBotToken');
    throw error
  }
}
export default {
  generatePayload,
  checkProof,
  getSignMessage,
  postSignMessage,
  postAds,
  getAds,
  getAdsById,
  patchAdsById,
  postAdsUpload,
  postDeleteAd,
  postInventories,
  getInventories,
  getInventoryById,
  patchInventoryById,
  postDeleteInventory,
  getProfile,
  updateDisplayStatus,

  updateAdsStatusByAdmin,
  getAdsByAdmin,

  postProfileComplete,
  postProfileVerify,
  postResendVerification,
  getAdStats,
  getPublisherStats,
  getAdChart,
  getPublisherChart,
  getAdminDashboard,
  getUsersByAdmin,
  getAllTimeUsersByAdmin,
  checkTitleUnique,
  updateBotToken,
  deleteBotToken
};
