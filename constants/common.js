export const ADVERTISER_WHITELIST = ['0QDLmCeyf4tFZbtPn7eQqXr-tsDbH5XS3_PwV6Kx87q8SVCK']
export const PUBLISHER_WHITELIST = ['0QDLmCeyf4tFZbtPn7eQqXr-tsDbH5XS3_PwV6Kx87q8SVCK']
export const MAX_ADVERTISER_ITEMS = 1 // backend limit
export const MAX_PUBLISHER_ITEMS = 2 // max 2 inventories per publisher (3 types)
export const INVENTORY_TYPES = {
  banner: 'BNR',
  offerWall: 'OFW',
  offerWallChallenge: 'OWC',

}
export const AD_STATUS = {
  active: 'Active',
  inReview: 'InReview',
  rejected: 'Rejected',
}
export const INVENTORY_BANNERS_LOCATIONS = {
  top: 'Top',
  bottom: 'Bottom',
  middle: 'Middle'
}
export const INVENTORY_BANNERS_CONVERSIONS = {
  click: 'Click',
  join: 'Join',
  engage: 'Engage'
}
export const IMAGE_UPLOAD_SIZES = [
  {name: '64x64', width: 64, height: 64 },
  {name: '128x128', width: 128, height: 128 },
  {name: '256x256', width: 256, height: 256 },
  {name: '320x320', width: 320, height: 320 },
  {name: '512x512', width: 512, height: 512 },
]
 export const GITHUB_LINKS = {
  vanillaJS: 'https://github.com/DMTP-Protocol/sdk-sample-javascript',
  reactJS: 'https://github.com/DMTP-Protocol/sdk-sample-reactjs',
  nextAppRouter: 'https://github.com/DMTP-Protocol/sdk-sample-nextjs-approuter',
  nextPageRouter: 'https://github.com/DMTP-Protocol/sdk-sample-nextjs-pagerouter',
}
export const HELP_CONTACT_LINK = 'https://t.me/appsnetwork_report'

export const DASHBOARD_DATE_RANGE_OPTIONS = [
  {label: '30 days', value: 30},
  {label: '60 days', value: 60},
  {label: '90 days', value: 90},
  {label: '120 days', value: 120},
  {label: '2 years', value: 730},
]
export const DASHBOARD_DATE_RANGE = DASHBOARD_DATE_RANGE_OPTIONS[4].value

export const TASK_TYPES=[
  {label: 'TASK_TYPE_ONE_TIME', value: 'OneTime'},
  {label: 'TASK_TYPE_REPEATING', value: 'Repeating'},
]

// AdsGram Configuration
export const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname.includes('ngrok-free.app'));

// Block IDs for AdsGram
export const AdsGram = {
  // Production block IDs
  DeployBlockId: {
    taskBlockId: "13357",
    rewardBlockId: "13345",
    rewardBlockId2: "13355",
    interstitialBlockId: "int-13356"
  },
  
  // Localhost/Development block IDs
  LocalhostBlockId: {
    taskBlockId: "13362", // Replace with your localhost task block ID
    rewardBlockId: "13359",   // Replace with your localhost reward block ID
    rewardBlockId2: "13360",  // Replace with your localhost reward block ID 2
    interstitialBlockId: "int-13361" // Replace with your localhost interstitial block ID
  },
  
  // Get the appropriate block ID based on environment
  getBlockId: function(type) {
    const blockIds = this.isLocalhost() ? this.LocalhostBlockId : this.DeployBlockId;
    return blockIds[type];
  },
  
  // Check if running in localhost environment
  isLocalhost: function() {
    return isLocalhost;
  }
};