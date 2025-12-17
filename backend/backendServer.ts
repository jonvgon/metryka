import dotenv from "dotenv";
import { google } from "googleapis";
import express from "express";
import session from "express-session";
import crypto from "node:crypto";
import url, { fileURLToPath } from "node:url";
import dns from "node:dns";
import path from "node:path";
import {
  readJSONFileClinicList,
  modifyJSONFileClinicList,
  returnGoogleData,
  returnMetaSpendData,
  sumAllMetaConversions,
  deleteJSONFileClinicList,
  writeToRefreshTokensList,
} from "./dataHandler.ts";

dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

const scopes = [
  "https://www.googleapis.com/auth/adwords",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "lax", maxAge: 155520000 },
  })
);

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI
);

app.get("/api/auth", (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");
  (req.session as any).state = state;

  const authorizationUrl = oAuth2Client.generateAuthUrl({
    scope: scopes,
    state,
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(authorizationUrl);
});

app.get("/api/endAuth", async (req, res) => {
  const { query } = url.parse(req.url, true);
  const { code, state, error: errorQuery } = query as any;

  if (errorQuery) {
    console.log("Error vindo do Google:", errorQuery);
    return res.status(400).send("Erro retornado pelo Google");
  }

  if (!code) {
    return res.status(400).send("Code ausente na callback");
  }

  if (state !== (req.session as any).state) {
    console.log("Erro de state:", state, (req.session as any).state);
    return res.status(400).send("Erro de state");
  }

  try {
    const { tokens } = await oAuth2Client.getToken(query.code);

    oAuth2Client.setCredentials(tokens);

    const { token } = await oAuth2Client.getAccessToken();

    req.session.googleToken = token;

    writeToRefreshTokensList(token, tokens.refresh_token);

    res.redirect("https://metryka-dev.insitemarketing.digital");
  } catch (err: any) {
    console.error("Erro ao trocar code por token:");

    console.error("type:", err?.constructor?.name);
    console.error("message:", err?.message);
    console.error("code:", err?.code);
    console.error("errno:", err?.errno);
    console.error("syscall:", err?.syscall);
    console.error("address:", err?.address);
    console.error("port:", err?.port);

    console.error("status:", err?.response?.status);
    console.error("data:", err?.response?.data);

    console.error("cause:", err?.cause);
    console.error("raw error object:");
    console.dir(err, { depth: null });

    return res.status(500).send("Erro na troca de code por token");
  }
});

app.get("/api/google/totalData", async (req, res) => {
  const googleRequestedData = returnGoogleData(
    req.query.accountId as string,
    req.session.googleToken as string,
    req.query.startDate as string,
    req.query.endDate as string
  );
  res.send(await googleRequestedData);
});

app.get("/api/clinics", async (req, res) => {
  const clinicIds = await readJSONFileClinicList(req.query.clinicName);
  res.send(clinicIds);
});

app.post("/api/clinics", async (req, res) => {
  const response = await modifyJSONFileClinicList(req.body);
  if (response == 409) {
    res.status(409).send({ message: "Clínica já existe!" });
  } else {
    res.status(204).send({ message: "Clínica adicionada com sucesso!" });
  }
});

app.delete("/api/clinics", (req, res) => {
  deleteJSONFileClinicList(req.query.clinicName);
});

app.get("/api/meta/accountSpend", async (req, res) => {
  const metaRequestedData = returnMetaSpendData(
    req.query.accountId as string,
    req.query.startDate as string,
    req.query.endDate as string
  );
  res.send(await metaRequestedData);
});

app.get("/api/meta/conversions", async (req, res) => {
  const metaConversionsRequestedData = sumAllMetaConversions(
    req.query.accountId as string,
    req.query.startDate as string,
    req.query.endDate as string
  );
  res.send(await metaConversionsRequestedData);
});

app.get("/api/auth/status", (req, res) => {
  if (req.session.googleToken) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
});

app.listen(4000, () => {
  console.log("Rodando na porta 4000");
});
