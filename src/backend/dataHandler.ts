import { getMetaInsightsPerCampaign, getAdAccountSpend, getGoogleInsights } from "./dataFetcher.ts";

export const sumAllConversions = async () => {
    let sum = 0;
    const campaignData = await getMetaInsightsPerCampaign(201060786265666)
    const conversionSum = campaignData.data.map(obj => {
        return sum += obj.results[0].values[0].value;
    })

    return conversionSum
}

console.log(await getGoogleInsights(5063918962));