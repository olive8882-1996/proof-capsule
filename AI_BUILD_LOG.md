# AI Build Log

## Prompt Context

The source article described the FilecoinTLDR Builder Challenge as a mini hackathon for building a small app where Filecoin is part of the product experience. It recommended using AI tooling to brainstorm, plan, build, debug, and prepare the submission. The challenge statement emphasized:

- Build a Filecoin-powered mini app.
- Use one clear mechanic.
- Use the Synapse SDK.
- Avoid a generic upload app.
- Submit a working demo, repository, Filecoin explanation, AI build log, and public post.

## Idea Selection

Chosen idea: **Proof Capsule**.

Reasoning:

- It is small enough for a fast hackathon build.
- The Filecoin proof is visible and meaningful to the user.
- The mechanic is understandable in seconds.
- It can demo without a complex backend.
- The real Synapse path can remain secure in a local script.

## Build Plan

1. Create a focused React/Vite app.
2. Build a two-column interface: capsule composer and proof card.
3. Make the Seal button drive a visible status timeline.
4. Generate deterministic demo proof fields in the browser.
5. Add an import path for real Synapse proof JSON.
6. Add a Node script that uses `@filoz/synapse-sdk` for real upload/download.
7. Prepare submission copy and demo flow.

## Implementation Notes

- Frontend uses React local state only.
- The UI avoids generic file manager patterns.
- The Synapse SDK is used from `scripts/seal-with-synapse.mjs`, not from the browser bundle, so private keys are not exposed.
- Demo mode is explicit and mirrors the expected Synapse flow.

## Remaining Manual Steps

- Add a funded Filecoin Calibration private key to `.env`.
- Run `bun run synapse:seal`.
- Paste the generated proof JSON into the app.
- Deploy the app.
- Push the repository.
- Post the public X announcement.
