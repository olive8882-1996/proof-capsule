import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { Synapse } from "@filoz/synapse-sdk";
import { privateKeyToAccount } from "viem/accounts";

const loadEnv = () => {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equals = trimmed.indexOf("=");
    if (equals < 1) continue;
    const key = trimmed.slice(0, equals).trim();
    const value = trimmed.slice(equals + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
};

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key}. Add it to .env before running this script.`);
  }
  return value;
};

loadEnv();

const privateKey = requireEnv("FILECOIN_PRIVATE_KEY");
const title = process.env.CAPSULE_TITLE ?? "Proof Capsule real Synapse seal";
const message =
  process.env.CAPSULE_MESSAGE ??
  "This payload was sealed by Proof Capsule for the FilecoinTLDR Builder Challenge demo.";
const retention = process.env.CAPSULE_RETENTION ?? "30 days";
const evidenceFile = process.env.CAPSULE_EVIDENCE_FILE ?? "synapse-proof.json";

const payload = {
  app: "Proof Capsule",
  challenge: "FilecoinTLDR Builder Challenge Cycle 1",
  title,
  message,
  evidenceFile,
  retention,
  sealedAt: new Date().toISOString(),
};

const encoded = new TextEncoder().encode(JSON.stringify(payload, null, 2));
const padding = encoded.byteLength < 127 ? "\n".repeat(127 - encoded.byteLength) : "";
const file = new TextEncoder().encode(`${JSON.stringify(payload, null, 2)}${padding}`);

console.log("Creating Synapse client on Filecoin Calibration...");
const synapse = await Synapse.create({
  account: privateKeyToAccount(privateKey),
  source: "proof-capsule",
});

console.log(`Preparing storage payment for ${file.byteLength} bytes...`);
const prep = await synapse.storage.prepare({
  dataSize: BigInt(file.byteLength),
});

if (prep.transaction) {
  const { hash } = await prep.transaction.execute();
  console.log(`Payment prepared: ${hash}`);
}

console.log("Uploading capsule payload through Synapse...");
const upload = await synapse.storage.upload(file);
const downloaded = await synapse.storage.download({ pieceCid: upload.pieceCid });
const decoded = new TextDecoder().decode(downloaded).trim();

if (!decoded.includes(payload.title)) {
  throw new Error("Downloaded payload did not match the capsule title.");
}

const firstCopy = upload.copies?.[0] ?? {};
const proof = {
  pieceCid: String(upload.pieceCid),
  size: Number(upload.size ?? file.byteLength),
  complete: Boolean(upload.complete),
  copies: upload.copies?.length ?? 0,
  provider: String(firstCopy.provider ?? firstCopy.providerId ?? "provider recorded by Synapse"),
  dataSet: String(firstCopy.dataSetId ?? firstCopy.dataSet ?? "dataset recorded by Synapse"),
  usdfcRail: String(firstCopy.railId ?? firstCopy.rail ?? "payment rail prepared by Synapse"),
  retrievalUrl: `Synapse download({ pieceCid: "${upload.pieceCid}" })`,
  pdpEpoch: upload.complete ? "stored; PDP proof cycle pending/active" : "partial storage; inspect failedAttempts",
  sealedAt: payload.sealedAt,
  failedAttempts: upload.failedAttempts ?? [],
};

mkdirSync("proofs", { recursive: true });
const outPath = join("proofs", `proof-${Date.now()}.json`);
writeFileSync(outPath, JSON.stringify(proof, null, 2));

console.log(JSON.stringify(proof, null, 2));
console.log(`Saved proof JSON to ${outPath}`);
