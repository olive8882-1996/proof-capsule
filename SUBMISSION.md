# FilecoinTLDR Builder Challenge Submission Draft

## Project

Proof Capsule

## Short Description

Proof Capsule lets a user seal a short claim or memory into a Filecoin-backed capsule. The product experience centers on the proof: after sealing, the app shows the PieceCID, data set, provider, USDFC rail, PDP status, and retrieval route as the main reward.

## Challenge Fit

The challenge asks for a Filecoin-powered mini app with one clear mechanic. Proof Capsule keeps the mechanic intentionally small: **seal a claim, reveal its proof**. It avoids being a generic file upload app by making the Filecoin proof card the core product surface.

## Filecoin / Synapse Usage

- `scripts/seal-with-synapse.mjs` imports `Synapse` from `@filoz/synapse-sdk`.
- The script prepares storage payment with `synapse.storage.prepare`.
- It uploads capsule JSON with `synapse.storage.upload`.
- It downloads the payload back with `synapse.storage.download`.
- It saves proof JSON containing PieceCID, provider/data-set information, storage completion, and retrieval instructions.
- The frontend can ingest that proof JSON and display it as the final capsule state.

## Demo Flow

1. Open the app.
2. Review the sample claim in the composer.
3. Click **Seal capsule**.
4. Watch the timeline move from Draft to Synapse upload to Stored to PDP verified.
5. Inspect the proof card fields.
6. Select older capsules in the activity log.
7. Optionally run `bun run synapse:seal` with a funded Calibration account and paste the generated proof JSON into the app.

## What Is MVP

- One-screen composer.
- Proof timeline.
- Deterministic PieceCID-like demo proof generation.
- Recent capsule log.
- Real Synapse upload script.
- Proof JSON import.

## Stretch Ideas

- Wallet connection in the browser.
- Public proof pages by capsule ID.
- Encrypted reveal dates.
- Real PDP polling.
- Hosted proof gallery.

## Public Post Draft

I built Proof Capsule for the FilecoinTLDR Builder Challenge.

One clear mechanic: seal a claim, reveal its Filecoin proof.

The app turns a short claim/evidence payload into a capsule with PieceCID, provider, data set, USDFC rail, PDP status, and retrieval route visible in the UI.

Demo: https://olive8882-1996.github.io/proof-capsule/
Repo: https://github.com/olive8882-1996/proof-capsule

Public post: https://x.com/martin_moh53075/status/2066716856220791034
