export type CapsuleStatus = "draft" | "uploading" | "stored" | "verified";

export type Retention = "7 days" | "30 days" | "90 days";

export type CapsuleProof = {
  pieceCid: string;
  dataSet: string;
  provider: string;
  usdfcRail: string;
  retrievalUrl: string;
  pdpEpoch: string;
  sealedAt: string;
};

export type Capsule = {
  id: string;
  title: string;
  message: string;
  fileName: string;
  retention: Retention;
  status: CapsuleStatus;
  mechanic: "Seal" | "Retrieve" | "Verify";
  proof: CapsuleProof;
};
