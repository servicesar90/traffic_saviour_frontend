
const base_url=import.meta.env.VITE_SERVER_URL;



export const signupApi = `${base_url}/auth/signup`;

export const logInApi = `${base_url}/auth/login`;

export const impersonateLoginApi = `${base_url}/admin/auth/impersonate/login`;

export const googleLoginApi = `${base_url}/auth/authgoogle`;

export const getProfileApi = `${base_url}/profile/getProfile`;

export const createCampaignApi = `${base_url}/api/v2/campaign`;

export const campdata = `${base_url}/api/v2/analytics/campdata`;

export const getAllCampaign = `${base_url}/api/v2/campaign/all2`;

export const getAllCampNames = `${base_url}/api/v2/campaign/campnames`;

export const clicksbycampaign = `${base_url}/api/v2/campaign/clicksbycamp`;

export const signOutApi = `${base_url}/auth/signout`;  

export const ipClicks = `${base_url}/api/v2/analytics/ipclicks`;

export const forgotPassword = `${base_url}/auth/forgot-password`;

export const updatePassword = `${base_url}/auth/reset-password`;

export const updateCampaignStatus = `${base_url}/api/v2/campaign`


export const addUrlCampData = `${base_url}/api/v2/analyticsCamp`;

export const getAllAnalyticsCamp=`${base_url}/api/v2/webanalytics`;

export const blacklistIpApi = `${base_url}/api/v2/blacklisted-ip`;

export const javascriptIntegrationCheckApi = `${base_url}/api/v2/trafficfilter/check`;


export const cryptoPayment = `${base_url}/api/v2/payment`;

export const paypalCreateOrder = `${base_url}/api/v2/payment/create-order`;
export const paypalCaptureOrder = `${base_url}/api/v2/payment/capture-order`; 

export const getPlans = `${base_url}/api/v2/utils/plans`

export const verifyOtpApi = `${base_url}/auth/verify-registration`;

export const resendOtpApi = `${base_url}/auth/resend-otp`;

export const getSubscription = `${base_url}/auth/v2/plan/subscription`;

export const getUpdatedPlan = `${base_url}/api/v2/plan/subscription`;


