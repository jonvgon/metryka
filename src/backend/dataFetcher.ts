import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https';

var agent = new https.Agent({ family: 4 });

dotenv.config()

export const getAdAccountSpend = async (adAccount) => {
    return axios.get(`https://graph.facebook.com/v24.0/act_${adAccount}/insights`, {
        params: {
            "fields": 'spend',
            "access_token": process.env.META_READ_KEY
        },
        httpsAgent: agent
    }).then(response => {
        return response.data
    })
}

export const getMetaInsightsPerCampaign = async (adAccount) => {
    return axios.get(`https://graph.facebook.com/v24.0/act_${adAccount}/insights`, {
        params: {
            "fields": 'results,campaign_name',
            "access_token": process.env.META_READ_KEY,
            "level": 'campaign',
            "effective_status": ['ACTIVE','PAUSED']
        },
        httpsAgent: agent
    }).then(response => {
        return response.data
    })
}

export const getGoogleInsights = async (googleAccount) => {
    return axios.post(`https://googleads.googleapis.com/v22/customers/${googleAccount}/googleAds:searchStream`, {
        headers: {
            "Authorization": `Bearer ${process.env.GOOGLE_OAUTH_CLIENT_SECRET}`,
            "developer-token": process.env.GOOGLE_DEVELOPER_KEY,
        },
        params: {
            "query": "SELECT campaign.name FROM campaign WHERE segments.date DURING LAST_30_DAYS"
        },
        httpsAgent: agent
    }).then(response => {
        return response
    })
}