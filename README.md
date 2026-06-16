# Proof Capsule

Proof Capsule is a Filecoin-powered mini app for the FilecoinTLDR Builder Challenge Cycle 1.

The one clear mechanic is: **seal a claim, reveal its proof**.

A user writes a short claim, adds evidence metadata, clicks **Seal capsule**, and gets a visible proof card containing a PieceCID, provider, data set, USDFC payment rail, PDP status, and retrieval route. Filecoin is part of the product experience instead of hidden background storage.

## Why It Fits The Challenge

- Product concept: a lightweight evidence capsule for memories, public promises, launch notes, and demo artifacts.
- Clear mechanic: one button turns a claim into a verifiable Filecoin proof card.
- Filecoin primitive: Synapse SDK storage upload/download, PieceCID, provider copies, payment preparation, and PDP proof language.
- MVP scope: no generic file manager, no complex account system, no broad dashboard.
- Demo flow: compose a capsule, seal it, watch the timeline advance, inspect the PieceCID, then paste a real Synapse proof JSON if available.

## Run The App

```bash
bun install
bun run dev
```

Open the local URL printed by Vite.

## Real Synapse Upload

The browser app runs a deterministic demo mode so judges can test the mechanic without a funded wallet. The real Filecoin path is included as a Node script that uses the official Synapse SDK.

Create `.env`:

```bash
FILECOIN_PRIVATE_KEY=0x...
CAPSULE_TITLE="Proof Capsule real seal"
CAPSULE_MESSAGE="This payload is stored through Synapse for the demo."
CAPSULE_RETENTION="30 days"
CAPSULE_EVIDENCE_FILE="demo.json"
```

Then run:

```bash
bun run synapse:seal
```

The script:

1. Creates a Synapse client on Filecoin Calibration.
2. Prepares storage payment for the payload size.
3. Uploads the capsule JSON.
4. Downloads it back by PieceCID.
5. Writes `proofs/proof-*.json`.

Paste that JSON into the **Real Synapse proof** box in the app to update the live proof card.

## Submission Checklist

- Live demo URL: https://olive8882-1996.github.io/proof-capsule/
- Repository URL: https://github.com/olive8882-1996/proof-capsule
- Explanation of Filecoin usage: see `SUBMISSION.md`.
- AI build log: see `AI_BUILD_LOG.md`.
- Public X post: pending user approval/account posting.

## Notes

Never put `FILECOIN_PRIVATE_KEY` in the frontend. The included real upload path is a local script so secrets stay outside the browser bundle.
