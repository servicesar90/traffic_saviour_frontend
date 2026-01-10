// const base_url = 'http://localhost:2000';
// const base_url="http://192.168.1.64:2000";

const base_url="https://api.webservices.press";

// const base_url="http://192.168.1.3:2000";
// const base_url = "https://app.clockerly.io"
// const base_url= "https://app.clockerly.io";


export const signupApi = `${base_url}/auth/signup`;

export const logInApi = `${base_url}/auth/login`;

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


export const cryptoPayment = `${base_url}/api/v2/payment`
