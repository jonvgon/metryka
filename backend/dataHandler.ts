import {
  getMetaInsightsPerCampaign,
  getAdAccountSpend,
  getGoogleInsights,
} from "./dataFetcher.ts";
import fs from "node:fs";
import { promisify } from "util";
import path from "path";

import { fileURLToPath } from "url";

import StreamValues from "stream-json/streamers/StreamValues.js";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sumAllMetaConversions = async (
  accountId: string,
  startDate: string,
  endDate: string
) => {
  const campaignData = await getMetaInsightsPerCampaign(
    accountId,
    startDate,
    endDate
  );

  const campaignDataFiltered = campaignData.data.filter((obj) => {
    if (obj.results) {
      return obj?.results?.[0]?.indicator.includes("conversation");
    } else {
      return false;
    }
  });

  console.dir(campaignDataFiltered, { depth: null });

  const conversionSum = campaignDataFiltered.reduce(
    (acc, cur) => acc + parseInt(cur.results?.[0].values?.[0]?.value),
    0
  );

  if (conversionSum) {
    return conversionSum;
  } else {
    return 0;
  }
};

export const readJSONFileClinicList = async (clinicName: string) => {
  try {
    let selectedClinicId;
    const filePath = path.join(__dirname, "clinicList.json");
    const fileStream = fs
      .createReadStream(filePath, {
        encoding: "utf8",
      })
      .pipe(StreamValues.withParser());

    for await (const data of fileStream) {
      selectedClinicId = data.value.clinics.filter(
        (obj: any) => obj.name.toUpperCase() == clinicName.toUpperCase()
      );
    }
    return {
      GoogleAdsId: selectedClinicId[0].Google_Ads_id,
      MetaAdsId: selectedClinicId[0].Meta_Ads_id,
    };
  } catch (err) {
    console.log("Erro do dataHandler!", err);
  }
};

export const modifyJSONFileClinicList = async (clinicData: {
  name: string;
  metaAdsId: string | null;
  googleAdsId: string | null;
}) => {
  const filePath = path.join(__dirname, "clinicList.json");
  let clinics: Array<{
    name: string;
    Google_Ads_id: string | null;
    Meta_Ads_id: string | null;
  }>;

  const fileContent = await readFileAsync(filePath, "utf8");

  const json = JSON.parse(fileContent);

  const existingClinic = json.clinics.findIndex((obj) => {
    return obj.name.toUpperCase() == clinicData.name.toUpperCase();
  });

  if (existingClinic !== -1) {
    return 409;
  } else {
    json.clinics.push({
      name: clinicData.name,
      Google_Ads_id: clinicData.googleAdsId,
      Meta_Ads_id: clinicData.metaAdsId,
    });

    fs.writeFile(
      filePath,
      JSON.stringify(json, null, 2),
      "utf8",
      (err: string) => {
        if (err) {
          console.error("Erro ao escrever o arquivo: ", err);
        } else {
          console.log("Clínica adicionada com sucesso!");
        }
      }
    );
  }
};

export const deleteJSONFileClinicList = async (clinicName: string) => {
  const filePath = path.join(__dirname, "clinicList.json");
  let clinics: Array<{
    name: string;
    Google_Ads_id: string | null;
    Meta_Ads_id: string | null;
  }>;

  const fileContent = await readFileAsync(filePath, "utf8");

  const json = JSON.parse(fileContent);

  const clinicToDelete = json.clinics.findIndex((obj) => {
    return obj.name.toUpperCase() == clinicName.toUpperCase();
  });

  json.clinics.splice(clinicToDelete, 1);

  fs.writeFile(
    filePath,
    JSON.stringify(json, null, 2),
    "utf8",
    (err: string) => {
      if (err) {
        console.error("Erro ao deletar a clínica: ", err);
      } else {
        console.log("Clínica deletada com sucesso!");
      }
    }
  );
};

export const returnMetaSpendData = async (
  accountId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const spendData = await getAdAccountSpend(accountId, startDate, endDate);

    console.dir(spendData + " " + spendData.data.length, { depth: null });

    if (spendData.data.length > 0) {
      return spendData.data[0].spend;
    } else {
      return 0;
    }
  } catch (err) {
    console.log("Erro no dataHandler! ", err);
  }
};

export const returnGoogleData = async (
  accountId: string,
  googleToken: string,
  startDate: string,
  endDate: string
) => {
  const googleData = await getGoogleInsights(
    accountId,
    googleToken,
    startDate,
    endDate
  );

  return googleData[0].results[0].metrics;
};
