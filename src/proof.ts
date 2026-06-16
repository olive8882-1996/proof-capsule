import type { CapsuleProof, Retention } from "./types";

const alphabet = "abcdef0123456789";

const digest = async (value: string) => {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const buildDemoProof = async (
  title: string,
  message: string,
  fileName: string,
  retention: Retention,
): Promise<CapsuleProof> => {
  const fingerprint = await digest(`${title}|${message}|${fileName}|${retention}|proof-capsule`);
  const short = fingerprint.slice(0, 26);
  const tail = Array.from({ length: 8 }, (_, index) => alphabet[(fingerprint.charCodeAt(index) + index) % alphabet.length]).join("");

  return {
    pieceCid: `bafkzcib${short}${tail}`,
    dataSet: `calibnet-ds-${Number.parseInt(fingerprint.slice(0, 4), 16) % 90}`,
    provider: `f410f${fingerprint.slice(4, 8)}-provider-${Number.parseInt(fingerprint.slice(8, 10), 16) % 30}`,
    usdfcRail: `rail-0x${fingerprint.slice(10, 16)}...${fingerprint.slice(58, 62)}`,
    retrievalUrl: `https://proof-capsule.local/retrieve/${fingerprint.slice(0, 8)}`,
    pdpEpoch: "first PDP proof scheduled",
    sealedAt: new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()),
  };
};

export const parseSynapseProof = (raw: string): CapsuleProof | null => {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.pieceCid || !parsed.provider) return null;
    return {
      pieceCid: String(parsed.pieceCid),
      dataSet: String(parsed.dataSet ?? parsed.dataSetId ?? "synapse-dataset"),
      provider: String(parsed.provider),
      usdfcRail: String(parsed.usdfcRail ?? parsed.rail ?? "synapse-payment-rail"),
      retrievalUrl: String(parsed.retrievalUrl ?? parsed.downloadUrl ?? "retrieval pending"),
      pdpEpoch: String(parsed.pdpEpoch ?? parsed.status ?? "stored, awaiting PDP cycle"),
      sealedAt: String(parsed.sealedAt ?? new Date().toISOString()),
    };
  } catch {
    return null;
  }
};
