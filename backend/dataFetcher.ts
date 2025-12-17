import axios from "axios";
import dotenv from "dotenv";
import https from "https";
import path from "node:path";
import { fileURLToPath } from "node:url";

var agent = new https.Agent({ family: 4 });

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

export const getAdAccountSpend = async (
  adAccount: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v24.0/act_${adAccount}/insights`,
      {
        params: {
          fields: "spend",
          access_token: process.env.META_READ_KEY,
          time_range: { since: startDate, until: endDate },
        },
        httpsAgent: agent,
      }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("ERRO DO META ADS:");
      console.log(JSON.stringify(err.response?.data, null, 2));
    } else {
      console.error(err);
    }
  }
};

export const getMetaInsightsPerCampaign = async (
  adAccount: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v24.0/act_${adAccount}/insights`,
      {
        params: {
          fields: "results,campaign_name",
          access_token: process.env.META_READ_KEY,
          level: "campaign",
          effective_status: ["ACTIVE", "PAUSED"],
          time_range: { since: startDate, until: endDate },
        },
        httpsAgent: agent,
      }
    );

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("ERRO DA META no DataFetcher");
      console.log(JSON.stringify(err.response?.data, null, 2));
    }
  }
};

export const getGoogleInsights = async (
  googleAccount: string,
  accessToken: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await axios.post(
      `https://googleads.googleapis.com/v22/customers/${googleAccount}/googleAds:searchStream`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "developer-token": process.env.GOOGLE_DEVELOPER_KEY,
          "login-customer-id": process.env.GOOGLE_ADS_CUSTOMER_ID,
        },
        params: {
          query: `SELECT metrics.all_conversions, metrics.cost_micros FROM customer WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'`,
        },
        httpsAgent: agent,
      }
    );

    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.log("ERRO DO GOOGLE ADS:");
      console.log(JSON.stringify(err.response?.data, null, 2));
    } else {
      console.error(err);
    }

    // throw err;
  }
};

export const getUserInfo = async (access_token: string) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    console.log(
      "Erro do dataFetcher! " + JSON.stringify(err.response?.data, null, 2)
    );
  }
};
