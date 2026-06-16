import type { Capsule } from "./types";

export const seedCapsules: Capsule[] = [
  {
    id: "PC-1048",
    title: "Launch promise",
    message: "The team shipped the first Filecoin proof demo before the submission window closed.",
    fileName: "launch-note.md",
    retention: "30 days",
    status: "verified",
    mechanic: "Verify",
    proof: {
      pieceCid: "bafkzcibcjxw7h4q6r3mvwqj2ypnyxev7u5f6s5ncb3gq",
      dataSet: "calibnet-ds-42",
      provider: "f410f7z6-provider-18",
      usdfcRail: "rail-0x81...92c",
      retrievalUrl: "https://proof-capsule.local/retrieve/PC-1048",
      pdpEpoch: "verified 18 min ago",
      sealedAt: "2026-06-16 10:24",
    },
  },
  {
    id: "PC-1047",
    title: "Design snapshot",
    message: "A signed copy of the capsule UI state for the hackathon demo.",
    fileName: "screen-proof.json",
    retention: "7 days",
    status: "stored",
    mechanic: "Retrieve",
    proof: {
      pieceCid: "bafkzcibbdpra2pqscfnozqpuoaclhznh3kdc3q3pum9v",
      dataSet: "calibnet-ds-41",
      provider: "f410f2y9-provider-07",
      usdfcRail: "rail-0x2a...d10",
      retrievalUrl: "https://proof-capsule.local/retrieve/PC-1047",
      pdpEpoch: "next proof in 9 min",
      sealedAt: "2026-06-16 09:58",
    },
  },
  {
    id: "PC-1046",
    title: "Private beta evidence",
    message: "A short beta tester quote and the artifact it references.",
    fileName: "beta-evidence.txt",
    retention: "90 days",
    status: "uploading",
    mechanic: "Seal",
    proof: {
      pieceCid: "pending",
      dataSet: "matching provider",
      provider: "selecting",
      usdfcRail: "opening",
      retrievalUrl: "not ready",
      pdpEpoch: "waiting for first proof",
      sealedAt: "2026-06-16 09:43",
    },
  },
];

export const emptyProof = seedCapsules[2].proof;
