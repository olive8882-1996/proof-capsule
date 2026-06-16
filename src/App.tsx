import {
  Archive,
  ArrowDownToLine,
  Check,
  ClipboardCheck,
  Clock3,
  DatabaseZap,
  ExternalLink,
  FileUp,
  KeyRound,
  Link2,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { emptyProof, seedCapsules } from "./data";
import { buildDemoProof, parseSynapseProof } from "./proof";
import type { Capsule, CapsuleStatus, Retention } from "./types";

const statusMeta: Record<CapsuleStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "statusDraft" },
  uploading: { label: "Uploading", className: "statusPending" },
  stored: { label: "Stored", className: "statusStored" },
  verified: { label: "Verified", className: "statusVerified" },
};

const timeline = [
  { key: "draft", label: "Draft", detail: "capsule payload prepared" },
  { key: "uploading", label: "Synapse upload", detail: "piece committed to Filecoin" },
  { key: "stored", label: "Stored", detail: "PieceCID and provider assigned" },
  { key: "verified", label: "PDP verified", detail: "proof is visible to the user" },
] as const;

const stepIndex: Record<CapsuleStatus, number> = {
  draft: 0,
  uploading: 1,
  stored: 2,
  verified: 3,
};

const makeCapsule = (title: string, message: string, fileName: string, retention: Retention): Capsule => ({
  id: `PC-${Math.floor(1200 + Math.random() * 700)}`,
  title,
  message,
  fileName,
  retention,
  status: "draft",
  mechanic: "Seal",
  proof: emptyProof,
});

function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brandMark">
          <Archive size={18} aria-hidden />
        </div>
        <div>
          <strong>Proof Capsule</strong>
          <span>Filecoin-powered claim sealing</span>
        </div>
      </div>
      <nav className="topActions" aria-label="Utility actions">
        <button className="ghostButton" type="button">
          <KeyRound size={16} aria-hidden />
          Calibration
        </button>
        <button className="darkButton" type="button">
          <ArrowDownToLine size={16} aria-hidden />
          Export proof
        </button>
      </nav>
    </header>
  );
}

function Composer({
  title,
  message,
  fileName,
  retention,
  isSealing,
  onTitle,
  onMessage,
  onFileName,
  onRetention,
  onSeal,
  onReset,
}: {
  title: string;
  message: string;
  fileName: string;
  retention: Retention;
  isSealing: boolean;
  onTitle: (value: string) => void;
  onMessage: (value: string) => void;
  onFileName: (value: string) => void;
  onRetention: (value: Retention) => void;
  onSeal: (event: FormEvent) => void;
  onReset: () => void;
}) {
  return (
    <section className="panel composer" aria-labelledby="composer-title">
      <div className="panelHeader">
        <div>
          <h1 id="composer-title">Seal a claim</h1>
          <p>One clear action: write evidence, store it, then reveal its Filecoin proof.</p>
        </div>
        <div className="miniBadge">
          <Sparkles size={14} aria-hidden />
          Cycle 1 MVP
        </div>
      </div>

      <form className="sealForm" onSubmit={onSeal}>
        <label>
          Claim title
          <input value={title} onChange={(event) => onTitle(event.target.value)} />
        </label>

        <label>
          Message
          <textarea value={message} onChange={(event) => onMessage(event.target.value)} rows={7} />
        </label>

        <label>
          Evidence file
          <div className="dropzone">
            <FileUp size={22} aria-hidden />
            <input
              aria-label="Evidence file name"
              value={fileName}
              onChange={(event) => onFileName(event.target.value)}
            />
            <span>Stored as capsule JSON through Synapse</span>
          </div>
        </label>

        <fieldset>
          <legend>Retention</legend>
          <div className="segmented">
            {(["7 days", "30 days", "90 days"] as Retention[]).map((option) => (
              <button
                className={retention === option ? "selected" : ""}
                key={option}
                onClick={() => onRetention(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="formActions">
          <button className="primaryButton" disabled={isSealing || title.trim().length < 3} type="submit">
            {isSealing ? <Loader2 className="spin" size={17} aria-hidden /> : <ShieldCheck size={17} aria-hidden />}
            {isSealing ? "Sealing capsule" : "Seal capsule"}
          </button>
          <button className="ghostButton" onClick={onReset} type="button">
            <RotateCcw size={16} aria-hidden />
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

function ProofCard({ capsule }: { capsule: Capsule }) {
  const activeIndex = stepIndex[capsule.status];

  return (
    <section className="panel proofPanel" aria-labelledby="proof-title">
      <div className="panelHeader compact">
        <div>
          <span className="eyelessLabel">Live proof card</span>
          <h2 id="proof-title">{capsule.title}</h2>
        </div>
        <span className={`statusPill ${statusMeta[capsule.status].className}`}>{statusMeta[capsule.status].label}</span>
      </div>

      <div className="capsulePreview">
        <div className="previewIcon">
          <DatabaseZap size={25} aria-hidden />
        </div>
        <p>{capsule.message}</p>
        <span>{capsule.fileName}</span>
      </div>

      <ol className="timeline" aria-label="Capsule proof timeline">
        {timeline.map((step, index) => (
          <li className={index <= activeIndex ? "complete" : ""} key={step.key}>
            <div className="dot">{index <= activeIndex ? <Check size={13} aria-hidden /> : index + 1}</div>
            <div>
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </div>
          </li>
        ))}
      </ol>

      <dl className="proofGrid">
        <div>
          <dt>PieceCID</dt>
          <dd>{capsule.proof.pieceCid}</dd>
        </div>
        <div>
          <dt>Data Set</dt>
          <dd>{capsule.proof.dataSet}</dd>
        </div>
        <div>
          <dt>Provider</dt>
          <dd>{capsule.proof.provider}</dd>
        </div>
        <div>
          <dt>USDFC rail</dt>
          <dd>{capsule.proof.usdfcRail}</dd>
        </div>
        <div>
          <dt>PDP status</dt>
          <dd>{capsule.proof.pdpEpoch}</dd>
        </div>
        <div>
          <dt>Retrieve</dt>
          <dd className="linkValue">
            <Link2 size={13} aria-hidden />
            {capsule.proof.retrievalUrl}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function SynapseImport({ onImport }: { onImport: (raw: string) => void }) {
  const [raw, setRaw] = useState("");

  return (
    <section className="synapseBox">
      <div>
        <ClipboardCheck size={17} aria-hidden />
        <strong>Real Synapse proof</strong>
        <span>Paste JSON from npm run synapse:seal</span>
      </div>
      <textarea
        aria-label="Synapse proof JSON"
        placeholder='{"pieceCid":"bafkzcib...","provider":"f410f...","dataSet":"calibnet-ds-1"}'
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
      />
      <button className="ghostButton" type="button" onClick={() => onImport(raw)}>
        Apply proof
      </button>
    </section>
  );
}

function ActivityLog({ capsules, selected, onSelect }: { capsules: Capsule[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <section className="activity" aria-labelledby="activity-title">
      <div className="activityHeader">
        <div>
          <h2 id="activity-title">Recent capsules</h2>
          <p>Every row is a tiny Filecoin proof story, not a generic upload.</p>
        </div>
        <button className="ghostButton" type="button">
          <ExternalLink size={16} aria-hidden />
          Submission log
        </button>
      </div>
      <div className="rows">
        {capsules.map((capsule) => (
          <button
            className={`row ${selected === capsule.id ? "active" : ""}`}
            key={capsule.id}
            onClick={() => onSelect(capsule.id)}
            type="button"
          >
            <span className="rowId">{capsule.id}</span>
            <span>
              <strong>{capsule.title}</strong>
              <small>{capsule.fileName}</small>
            </span>
            <span>{capsule.proof.provider}</span>
            <span>{capsule.mechanic}</span>
            <span className={`statusPill ${statusMeta[capsule.status].className}`}>{statusMeta[capsule.status].label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [title, setTitle] = useState("Hackathon proof of build");
  const [message, setMessage] = useState(
    "This capsule seals the product idea, demo artifact, and Filecoin retrieval proof into one judge-readable object.",
  );
  const [fileName, setFileName] = useState("proof-capsule-demo.json");
  const [retention, setRetention] = useState<Retention>("30 days");
  const [capsules, setCapsules] = useState<Capsule[]>(seedCapsules);
  const [selectedId, setSelectedId] = useState(seedCapsules[0].id);
  const [isSealing, setIsSealing] = useState(false);

  const selectedCapsule = useMemo(
    () => capsules.find((capsule) => capsule.id === selectedId) ?? capsules[0],
    [capsules, selectedId],
  );

  const updateSelected = (changes: Partial<Capsule>) => {
    setCapsules((current) => current.map((capsule) => (capsule.id === selectedId ? { ...capsule, ...changes } : capsule)));
  };

  const handleSeal = async (event: FormEvent) => {
    event.preventDefault();
    const capsule = makeCapsule(title.trim(), message.trim(), fileName.trim(), retention);
    setCapsules((current) => [capsule, ...current].slice(0, 5));
    setSelectedId(capsule.id);
    setIsSealing(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setCapsules((current) => current.map((item) => (item.id === capsule.id ? { ...item, status: "uploading" } : item)));

    const proof = await buildDemoProof(capsule.title, capsule.message, capsule.fileName, capsule.retention);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setCapsules((current) =>
      current.map((item) => (item.id === capsule.id ? { ...item, status: "stored", mechanic: "Retrieve", proof } : item)),
    );

    await new Promise((resolve) => setTimeout(resolve, 700));
    setCapsules((current) =>
      current.map((item) =>
        item.id === capsule.id
          ? { ...item, status: "verified", mechanic: "Verify", proof: { ...proof, pdpEpoch: "demo proof verified" } }
          : item,
      ),
    );
    setIsSealing(false);
  };

  const handleImport = (raw: string) => {
    const proof = parseSynapseProof(raw);
    if (!proof) return;
    updateSelected({ proof, status: "verified", mechanic: "Verify" });
  };

  return (
    <main>
      <Header />
      <div className="workspace">
        <Composer
          title={title}
          message={message}
          fileName={fileName}
          retention={retention}
          isSealing={isSealing}
          onTitle={setTitle}
          onMessage={setMessage}
          onFileName={setFileName}
          onRetention={setRetention}
          onSeal={handleSeal}
          onReset={() => {
            setTitle("Hackathon proof of build");
            setMessage("This capsule seals the product idea, demo artifact, and Filecoin retrieval proof into one judge-readable object.");
            setFileName("proof-capsule-demo.json");
            setRetention("30 days");
          }}
        />
        <div className="rightStack">
          <ProofCard capsule={selectedCapsule} />
          <SynapseImport onImport={handleImport} />
        </div>
      </div>
      <ActivityLog capsules={capsules} selected={selectedId} onSelect={setSelectedId} />
      <footer>
        <Clock3 size={15} aria-hidden />
        Built for FilecoinTLDR Builder Challenge Cycle 1. Demo mode mirrors the Synapse storage flow; real uploads use the included script.
      </footer>
    </main>
  );
}
