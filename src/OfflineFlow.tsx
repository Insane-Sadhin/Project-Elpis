import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  Database,
  Footprints,
  HardDrive,
  Network,
  Package,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Server,
  ShieldCheck,
  Smartphone,
  Wifi,
  WifiOff,
} from "lucide-react";
import "./offline.css";

const stages = [
  {
    name: "Connected",
    title: "Receive while a route is available.",
    description:
      "The connected gateway holds an official-alert example. A field volunteer receives a copy before moving beyond coverage.",
    event: "Example packet available at gateway; field copy received.",
    nodes: [
      "Online · example ready",
      "Online · copy received",
      "Online · standing by",
    ],
    packet: 17,
    height: 0,
    location: "Gateway / received copy",
    transport: "Connected route available",
  },
  {
    name: "Offline",
    title: "A lost connection is not a lost message.",
    description:
      "The field device loses its internet route. The received example stays on the device; nothing is sent to the server.",
    event: "Field route lost. No server delivery attempted.",
    nodes: [
      "Online · out of reach",
      "Offline · copy retained",
      "Online · no field route",
    ],
    packet: 50,
    height: 0,
    location: "Field device / offline",
    transport: "Field connection unavailable",
  },
  {
    name: "Stored",
    title: "Store locally. Carry physically.",
    description:
      "The volunteer carries the device through the coverage gap. Carrying moves the device, not data between devices. The packet remains in the simulated local queue.",
    event: "Packet queued locally; device physically carried.",
    nodes: [
      "Online · out of reach",
      "Offline · packet queued",
      "Online · awaiting route",
    ],
    packet: 50,
    height: 175,
    location: "Field device / local queue",
    transport: "Physical carry · no radio transfer",
  },
  {
    name: "Device Transfer",
    title: "Forward only when devices can meet.",
    description:
      "Near the gateway, a compatible proximity transport could forward the stored copy. This animation models that handoff; it does not access Bluetooth or Wi-Fi Direct.",
    event: "Proximity handoff to gateway simulated.",
    nodes: [
      "Nearby · receiving copy",
      "Nearby · forwarding copy",
      "Online · awaiting uplink",
    ],
    packet: 33,
    height: 75,
    location: "Field → gateway / handoff",
    transport: "Compatible proximity link · simulated",
  },
  {
    name: "Reconnected",
    title: "A route back to the server returns.",
    description:
      "The gateway now has a usable uplink. The forwarded packet is ready for simulated delivery to the command server; this is not yet a sync acknowledgement.",
    event: "Gateway uplink restored; server delivery simulated.",
    nodes: [
      "Online · sending copy",
      "Local · copy retained",
      "Online · receiving copy",
    ],
    packet: 67,
    height: 0,
    location: "Gateway → server / delivery",
    transport: "Gateway uplink · simulated",
  },
  {
    name: "Synced",
    title: "One packet. A completed example journey.",
    description:
      "The command server acknowledges the example packet in this simulation. No external server was contacted and no real alert was delivered.",
    event: "Simulated server acknowledgement received.",
    nodes: [
      "Online · acknowledged",
      "Local · copy retained",
      "Online · example synced",
    ],
    packet: 83,
    height: 0,
    location: "Command server / acknowledged",
    transport: "Simulation complete · no external traffic",
  },
] as const;

const devices = [
  { name: "Connected gateway", short: "GATEWAY / 01", Icon: Radio },
  { name: "Field volunteer", short: "FIELD / 02", Icon: Smartphone },
  { name: "Command server", short: "COMMAND / 03", Icon: Server },
];

export default function OfflineFlow() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stage = stages[step];
  const last = step === stages.length - 1;

  useEffect(() => {
    if (!playing || last) return;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      setStep(next);
      if (next === stages.length - 1) setPlaying(false);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [playing, step, last]);

  function selectStage(index: number) {
    setPlaying(false);
    setStep(index);
  }

  return (
    <div className={`offline-flow offline-flow--${step}`}>
      <div className="of-topbar">
        <span className="of-label">
          <Network size={14} aria-hidden="true" /> STORE-AND-FORWARD LAB
        </span>
        <span className="of-simulation">
          <i /> IN-BROWSER SIMULATION
        </span>
      </div>

      <div
        className="of-stage-selector"
        role="group"
        aria-label="Simulation stages"
      >
        {stages.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={
              index === step ? "is-current" : index < step ? "is-complete" : ""
            }
            aria-pressed={index === step}
            onClick={() => selectStage(index)}
          >
            <span className="of-stage-number">
              {index < step ? (
                <Check size={12} aria-hidden="true" />
              ) : (
                `0${index + 1}`
              )}
            </span>
            {item.name}
          </button>
        ))}
      </div>

      <div
        className="of-diagram"
        role="img"
        aria-label={`${stage.name}. ${stage.transport}. Packet location: ${stage.location}. ${devices.map((device, index) => `${device.name}: ${stage.nodes[index]}`).join(". ")}`}
      >
        <div className="of-diagram-grid" aria-hidden="true" />
        <div className="of-transport" aria-hidden="true">
          {step === 1 ? (
            <WifiOff size={13} />
          ) : step === 2 ? (
            <Footprints size={13} />
          ) : step === 3 ? (
            <Radio size={13} />
          ) : (
            <Wifi size={13} />
          )}
          {stage.transport}
        </div>
        <div className="of-route of-route--local" aria-hidden="true" />
        <div className="of-route of-route--uplink" aria-hidden="true" />
        <div
          className="of-packet"
          style={
            {
              "--packet-x": `${stage.packet}%`,
              "--packet-y": `${stage.height}px`,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          {last ? <Check size={16} /> : <Package size={16} />}
        </div>
        <div className="of-devices" aria-hidden="true">
          {devices.map(({ name, short, Icon }, index) => (
            <div className={`of-device of-device--${index}`} key={name}>
              <span className="of-device-code">{short}</span>
              <div className="of-device-icon">
                <Icon size={30} strokeWidth={1.4} />
                <span className="of-device-dot" />
              </div>
              <strong>{name}</strong>
              <span className="of-device-status">{stage.nodes[index]}</span>
            </div>
          ))}
        </div>
        <span className="of-packet-caption">
          <Package size={12} aria-hidden="true" /> ELP-0241{" "}
          <span>· {stage.location}</span>
        </span>
      </div>

      <div className="of-lower">
        <div className="of-narrative">
          <div className="of-description" aria-live="polite" aria-atomic="true">
            <span className="of-label">
              0{step + 1} / 06 · {stage.name.toUpperCase()}
            </span>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
          </div>
          <div className="of-controls">
            <button
              type="button"
              className="button button-primary"
              disabled={last}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              {playing ? "Pause" : "Play simulation"}
            </button>
            <button
              type="button"
              className="button button-secondary"
              disabled={last}
              onClick={() => selectStage(step + 1)}
            >
              Step forward <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="of-reset"
              onClick={() => selectStage(0)}
            >
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </button>
          </div>
          <p className="of-timing">
            {last
              ? "Sequence complete. Reset or choose any stage to explore again."
              : playing
                ? "Advancing every 3 seconds. Pauses automatically at Synced."
                : "Explore at your own pace, or play the six-stage sequence."}
          </p>
        </div>
        <aside
          className="of-packet-details"
          aria-label="Example packet metadata"
        >
          <span className="of-label">
            <Database size={13} aria-hidden="true" /> PACKET MANIFEST
          </span>
          <dl>
            <div>
              <dt>ID</dt>
              <dd>ELP-0241</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>Official alert example</dd>
            </div>
            <div>
              <dt>
                <ShieldCheck size={12} aria-hidden="true" /> Verification
              </dt>
              <dd>Signature check simulated</dd>
            </div>
            <div>
              <dt>TTL</dt>
              <dd>24 hours · illustrative, not a live timer</dd>
            </div>
            <div>
              <dt>
                <HardDrive size={12} aria-hidden="true" /> Local storage
              </dt>
              <dd>Simulated queue · resets on reload</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="of-log" aria-label="Simulation event log">
        <span className="of-label">EVENT LOG</span>
        <ol>
          {stages.slice(Math.max(0, step - 2), step + 1).map((item, index) => (
            <li key={item.name}>
              <span>0{Math.max(0, step - 2) + index + 1}</span>
              <span>{item.event}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="of-disclaimer">
        <Radio size={15} aria-hidden="true" />
        <span>
          Proximity transfer needs compatible devices, transport, permissions
          and range—not an unlimited mesh. Local retention across temporary gaps
          is conceptual here; this demo performs no networking, persistent
          packet storage or cryptographic verification.
        </span>
      </p>
    </div>
  );
}
