import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  ClipboardList,
  Database,
  Fingerprint,
  Globe2,
  Layers,
  Menu,
  Radio,
  Satellite,
  ShieldCheck,
  Signal,
  Smartphone,
  WifiOff,
  X,
} from "lucide-react";
import CommandCentre from "./CommandCentre";
import OfflineFlow from "./OfflineFlow";
import FieldReporting from "./FieldReporting";
import { initialReports, type FieldReport } from "./elpis";
import { loadReports, saveReports } from "./db";

const steps = [
  {
    name: "Receive",
    label: "An official signal.",
    description:
      "A connected device receives an alert from an authorized source. Provenance and validity travel with the information.",
    Icon: Satellite,
  },
  {
    name: "Store",
    label: "Saved before signal is lost.",
    description:
      "The alert and its metadata are held locally, available to read through a temporary connectivity gap.",
    Icon: Database,
  },
  {
    name: "Walk & forward",
    label: "People become the bridge.",
    description:
      "A person carries the stored packet. A nearby compatible device can receive it during an explicit local transfer.",
    Icon: Smartphone,
  },
  {
    name: "Report",
    label: "The ground has a voice.",
    description:
      "Field teams record location, time, source and observable conditions. New reports remain unverified until reviewed.",
    Icon: ClipboardList,
  },
  {
    name: "Sync",
    label: "A clearer picture returns.",
    description:
      "When connectivity returns, queued reports reach the command view for human review. Sync here is a local simulation.",
    Icon: Radio,
  },
];
const contourPaths = Array.from({ length: 30 }, (_, i) => {
  const x = 190 + i * 12;
  const y = 46 + i * 9;
  return `M ${x - 290} -30 C ${x - 160} ${y - 90}, ${x + 145} ${y - 150}, ${x + 116} ${y + 18} S ${x - 143} ${y + 79}, ${x - 112} ${y + 205} S ${x + 170} ${y + 241}, ${x + 100} 650`;
});
function TerrainScene({ active }: { active: number }) {
  return (
    <div
      className="terrain-scene"
      aria-label={`Illustrated store-and-forward terrain. Current stage: ${steps[active].name}`}
      role="img"
    >
      <svg viewBox="0 0 650 620" className="terrain-svg" aria-hidden="true">
        <defs>
          <radialGradient id="terrain-glow">
            <stop stopColor="#527856" stopOpacity=".22" />
            <stop offset="1" stopColor="#193523" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="map-grid"
            width="52"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M52 0H0V52"
              fill="none"
              stroke="#9fbaa0"
              strokeOpacity=".055"
            />
          </pattern>
        </defs>
        <rect width="650" height="620" fill="url(#map-grid)" />
        <ellipse
          cx="355"
          cy="315"
          rx="310"
          ry="310"
          fill="url(#terrain-glow)"
        />
        <g fill="none" stroke="#8aab74" strokeWidth=".8" opacity=".25">
          {contourPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path
          d="M510 -20C370 90 570 155 455 245S255 302 293 414 226 490 155 640"
          stroke="#5c9286"
          strokeOpacity=".15"
          strokeWidth="25"
          fill="none"
        />
        <path
          d="M510 -20C370 90 570 155 455 245S255 302 293 414 226 490 155 640"
          stroke="#7aa79d"
          strokeOpacity=".25"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M46 170L191 206 302 322 458 281 563 410"
          className="terrain-road"
        />
        <path d="M193 208L303 322 458 281" className="packet-route" />
        <circle cx="303" cy="322" r="91" className="signal-ring" />
        <circle cx="303" cy="322" r="65" className="signal-ring inner" />
        <g fill="#829882" fontFamily="monospace" fontSize="8" letterSpacing="2">
          <text x="55" y="112">
            30°07′ N
          </text>
          <text x="490" y="504">
            78°19′ E
          </text>
          <text x="365" y="438" transform="rotate(-58 365 438)">
            GANGA RIVER
          </text>
          <text x="105" y="424">
            UTTARAKHAND SECTOR
          </text>
          <text x="481" y="130">
            ELEV. 372 M
          </text>
        </g>
        <g fill="#c1d9a4">
          <circle cx="193" cy="208" r="5" />
          <circle cx="303" cy="322" r="6" />
          <circle cx="458" cy="281" r="5" />
        </g>
      </svg>
      <div className="map-corner top-left" />
      <div className="map-corner bottom-right" />
      <div className="terrain-label">
        <span className="status-dot" /> FIELD NETWORK{" "}
        <span>ILLUSTRATIVE VIEW</span>
      </div>
      <div className="scene-node gateway">
        <div className={`node-symbol ${active === 0 ? "lit" : ""}`}>
          <Satellite size={19} />
        </div>
        <span>
          CONNECTED NODE<small>Official alert received</small>
        </span>
      </div>
      <div className="scene-node carrier">
        <div className={`node-symbol ${active > 0 && active < 4 ? "lit" : ""}`}>
          <Smartphone size={22} />
        </div>
        <span>
          FIELD VOLUNTEER
          <small>
            <i /> No internet. Still moving.
          </small>
        </span>
      </div>
      <div className="scene-node command">
        <div className={`node-symbol ${active === 4 ? "lit" : ""}`}>
          <Radio size={20} />
        </div>
        <span>
          LOCAL NODE<small>Store → carry → forward</small>
        </span>
      </div>
      <div className="packet-card">
        <div>
          <span className="packet-icon">
            <ShieldCheck size={17} />
          </span>
          <span>
            ALERT PACKET <b>ELP / 026</b>
          </span>
          <span className="tiny-chip">DEMO</span>
        </div>
        <p>{steps[active].label}</p>
        <div className="packet-progress">
          {steps.map((step, index) => (
            <i key={step.name} className={index <= active ? "filled" : ""} />
          ))}
        </div>
        <small>
          PROVENANCE RETAINED <span>2.4 KB · SAMPLE</span>
        </small>
      </div>
      <div className="map-scale">
        <span />0 <span />
        500 m <span className="north-arrow">↑ N</span>
      </div>
    </div>
  );
}

function Landing({
  onCommand,
  onField,
}: {
  onCommand: () => void;
  onField: () => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero page-container" id="overview">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow">
            <span className="status-dot" /> BUILT FOR THE MOMENTS BETWEEN
            CONNECTIONS
          </div>
          <h1>
            When the
            <br />
            network fails,
            <br />
            <span>hope moves.</span>
          </h1>
          <p className="hero-description">
            Disaster information shouldn’t stop moving.
            <br />
            An offline-first bridge between official alerts,
            <br className="desktop-break" /> people on the ground, and the
            command centre.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#how-it-works">
              Explore the system <ArrowDownRight size={17} />
            </a>
            <button className="button button-secondary" onClick={onCommand}>
              Open Command Centre <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={15} />
            <span>
              Official information. Human intelligence. Resilient by design.
            </span>
          </div>
        </div>
        <TerrainScene active={active} />
        <div className="hero-bottom">
          <span>01 — RESILIENT BY DESIGN</span>
          <a href="#how-it-works">
            SCROLL TO EXPLORE <ArrowDown size={13} />
          </a>
          <span>SIH 2026 / STUDENT INNOVATION</span>
        </div>
      </section>
      <div className="principle-strip">
        <div className="page-container">
          <span>
            <WifiOff size={17} /> Offline-first, not offline-only
          </span>
          <span>
            <ShieldCheck size={17} /> Source-aware information
          </span>
          <span>
            <Smartphone size={17} /> Store. Walk. Forward.
          </span>
          <span>
            <Globe2 size={17} /> Ground to command
          </span>
        </div>
      </div>
      <section className="section page-container problem-section">
        <div>
          <span className="eyebrow">THE GAP WE ARE CLOSING</span>
          <h2>
            A lost connection shouldn’t
            <br />
            mean a lost <em>picture.</em>
          </h2>
        </div>
        <div>
          <p>
            Disasters disrupt the very networks we rely on. Official alerts can
            stop at the last connected device. Ground reports can stay trapped
            in the field.
          </p>
          <p className="bright-copy">
            ELPIS keeps information useful in the gap, and moving when a path
            opens.
          </p>
          <a href="#network" className="text-link">
            See what happens without signal <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section className="section how-section" id="how-it-works">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / THE INFORMATION LIFELINE</span>
              <h2>
                One signal. <em>Many ways forward.</em>
              </h2>
            </div>
            <p>
              No constant connection required.
              <br />
              No information without context.
            </p>
          </div>
          <div
            className="flow-tabs"
            role="tablist"
            aria-label="Information flow"
          >
            {steps.map((step, index) => (
              <button
                key={step.name}
                role="tab"
                id={`flow-tab-${index}`}
                aria-selected={active === index}
                aria-controls="flow-detail"
                tabIndex={active === index ? 0 : -1}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    const next =
                      (active + (event.key === "ArrowRight" ? 1 : 4)) % 5;
                    setActive(next);
                    document.getElementById(`flow-tab-${next}`)?.focus();
                  }
                }}
                onClick={() => setActive(index)}
                className={active === index ? "active" : ""}
              >
                <div>
                  <span className="mono">0{index + 1}</span>
                  <step.Icon size={22} />
                </div>
                <strong>{step.name}</strong>
                <ChevronRight className="flow-chevron" size={18} />
              </button>
            ))}
          </div>
          <div
            className="flow-detail"
            id="flow-detail"
            role="tabpanel"
            aria-labelledby={`flow-tab-${active}`}
          >
            <div>
              <span className="status-dot" />
              <strong>{steps[active].label}</strong>
            </div>
            <p>{steps[active].description}</p>
            <span className="mono">0{active + 1} / 05</span>
          </div>
        </div>
      </section>
      <section className="section page-container" id="network">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              02 / CONNECTIVITY IS TEMPORARY. INFORMATION ISN’T.
            </span>
            <h2>
              No network. <em>Still a way through.</em>
            </h2>
          </div>
          <span className="demo-label">
            <span /> INTERACTIVE SIMULATION
          </span>
        </div>
        <OfflineFlow />
      </section>
      <section
        className="section page-container command-teaser"
        id="ground-intelligence"
      >
        <div className="teaser-copy">
          <span className="eyebrow">
            03 / FROM THE GROUND TO THE BIG PICTURE
          </span>
          <h2>
            Less noise.
            <br />
            <em>More ground truth.</em>
          </h2>
          <p>
            Every report carries its location, time, source, priority and
            verification status. A shared operating picture, built for human
            decisions.
          </p>
          <div className="teaser-tags">
            <span>Flood</span>
            <span>Landslide</span>
            <span>Blocked road</span>
            <span>SOS</span>
            <span>Shelter</span>
            <span>Medical need</span>
          </div>
          <button className="button button-primary" onClick={onField}>
            Create a field report <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="report-preview">
          <div className="preview-top">
            <span className="eyebrow">
              <span className="status-dot" /> GROUND INTELLIGENCE
            </span>
            <span className="mono">SAMPLE RECORD</span>
          </div>
          <div className="preview-title">
            <span className="small-icon">
              <Layers size={22} />
            </span>
            <div>
              <h3>Flood at Triveni Ghat</h3>
              <p>Rishikesh, Uttarakhand</p>
            </div>
            <span className="priority-label high">HIGH</span>
          </div>
          <div className="preview-coordinate">
            30.103° N <span> / </span> 78.305° E<ArrowUpRight size={17} />
          </div>
          <dl>
            <div>
              <dt>SOURCE</dt>
              <dd>Field volunteer N-07</dd>
            </div>
            <div>
              <dt>RECORDED</dt>
              <dd>28 SEP 2026 · 08:42 IST</dd>
            </div>
            <div>
              <dt>VERIFICATION</dt>
              <dd>
                <span className="amber-dot" /> Corroborated · demo
              </dd>
            </div>
            <div>
              <dt>DELIVERY</dt>
              <dd>
                <Check size={13} /> Synced in simulation
              </dd>
            </div>
          </dl>
          <button onClick={onCommand}>
            Open the operating picture <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
      <section className="section architecture-section" id="architecture">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                04 / A RESILIENT INFORMATION LAYER
              </span>
              <h2>
                Built around the gap.
                <br />
                <em>Not dependent on a perfect network.</em>
              </h2>
            </div>
            <p>
              Preserve the source.
              <br />
              Keep the context.
              <br />
              Reconnect the picture.
            </p>
          </div>
          <div className="architecture-flow">
            {[
              {
                label: "Official alert",
                sub: "Authorized source",
                Icon: Satellite,
              },
              {
                label: "Alert processing",
                sub: "Validate & package",
                Icon: ShieldCheck,
              },
              {
                label: "Mobile nodes",
                sub: "Receive & carry",
                Icon: Smartphone,
              },
              {
                label: "Offline storage",
                sub: "Persist locally",
                Icon: Database,
              },
              { label: "P2P transfer", sub: "Proximity exchange", Icon: Radio },
              { label: "Sync server", sub: "On reconnection", Icon: Signal },
              { label: "GIS dashboard", sub: "Human review", Icon: Layers },
            ].map(({ label, sub, Icon }, index) => (
              <div className="architecture-node" key={label}>
                <span className="mono">0{index + 1}</span>
                <Icon size={24} />
                <strong>{label}</strong>
                <small>{sub}</small>
                {index < 6 && (
                  <ChevronRight className="architecture-arrow" size={14} />
                )}
              </div>
            ))}
          </div>
          <div className="architecture-note">
            <Fingerprint size={20} />
            <p>
              <strong>Trust travels with the packet.</strong> Source, timestamp,
              validity and verification state stay attached. The production
              design requires signed alerts and compatible device transports;
              this website simulates that flow.
            </p>
          </div>
        </div>
      </section>
      <section className="section page-container impact-section" id="impact">
        <div className="section-heading">
          <div>
            <span className="eyebrow">05 / DESIGNED FOR WHAT MATTERS</span>
            <h2>
              Continuity. Context. <em>Confidence.</em>
            </h2>
          </div>
          <span className="mono muted">PURPOSE, NOT PROMISES.</span>
        </div>
        <div className="impact-grid">
          {[
            {
              Icon: Radio,
              title: "Resilient information flow",
              text: "Keep critical context available through temporary network disruptions.",
            },
            {
              Icon: WifiOff,
              title: "Offline field reporting",
              text: "Record observations where they happen, not only where signal exists.",
            },
            {
              Icon: Globe2,
              title: "Faster ground awareness",
              text: "Bring queued field observations into view when connectivity returns.",
            },
            {
              Icon: Signal,
              title: "Low-bandwidth operation",
              text: "Prioritize compact, structured packets over bandwidth-heavy content.",
            },
            {
              Icon: Layers,
              title: "Structured disaster intelligence",
              text: "Turn scattered observations into locatable, reviewable records.",
            },
            {
              Icon: Fingerprint,
              title: "Auditable information",
              text: "Retain origin, time and review state instead of stripping away context.",
            },
          ].map(({ Icon, title, text }, index) => (
            <article key={title}>
              <div>
                <Icon size={23} />
                <span className="mono">0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="positioning page-container">
        <ShieldCheck size={27} />
        <div>
          <h3>A bridge. Not a replacement.</h3>
          <p>
            ELPIS complements NDMA/SACHET, IMD and CWC. It does not replace
            official warnings, issue unauthorized alerts, or make autonomous
            rescue decisions. No live government integration is connected to
            this prototype.
          </p>
        </div>
        <span className="eyebrow">
          HUMANS REMAIN
          <br />
          IN COMMAND.
        </span>
      </section>
      <section className="closing-section page-container">
        <span className="eyebrow">ELPIS / HOPE, CARRIED FORWARD</span>
        <h2>
          The signal may stop.
          <br />
          <em>The mission doesn’t.</em>
        </h2>
        <button className="button button-primary" onClick={onCommand}>
          Step inside the Command Centre <ArrowUpRight size={17} />
        </button>
        <p>
          “When the network fails, disaster information shouldn't stop moving.”
        </p>
        <p>Explore a simulated operation. No live emergency data.</p>
      </section>
    </main>
  );
}

function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [menu, setMenu] = useState(false);
  const [reports, setReports] = useState<FieldReport[]>(initialReports);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [notice, setNotice] = useState("");
  const [actualOnline, setActualOnline] = useState(navigator.onLine);
  const [offlineDemo, setOfflineDemo] = useState(false);
  const mutating = useRef(false);
  const online = actualOnline && !offlineDemo;
  const page =
    hash === "#command" ? "command" : hash === "#field" ? "field" : "landing";
  useEffect(() => {
    const change = () => {
      setHash(window.location.hash);
      setMenu(false);
    };
    const on = () => setActualOnline(true);
    const off = () => setActualOnline(false);
    window.addEventListener("hashchange", change);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    loadReports()
      .then(async (stored) => {
        const loaded = stored.length ? stored : initialReports;
        if (!stored.length) await saveReports(loaded);
        setReports(
          loaded.sort(
            (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
          ),
        );
        setReady(true);
      })
      .catch(() =>
        setStorageError(
          "Local storage is unavailable. Sample data is visible, but reports cannot be saved. Allow browser storage to enable field reporting.",
        ),
      );
    return () => {
      window.removeEventListener("hashchange", change);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  useEffect(() => {
    document.title = `${page === "command" ? "Command Centre" : page === "field" ? "Field Reporting" : "Resilient Disaster Communication"} | Project ELPIS`;
    if (page !== "landing") {
      document.getElementById("main-content")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (hash)
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
  }, [page, hash]);
  const navigate = (target: string) => {
    window.location.hash = target;
    setMenu(false);
  };
  const addReport = async (report: FieldReport) => {
    if (!ready) throw new Error("Storage unavailable");
    await saveReports([report]);
    setReports((current) => [report, ...current]);
  };
  const updateReports = async (kind: "sync" | "verify", id?: string) => {
    if (!ready || mutating.current || (kind === "sync" && !online)) return;
    mutating.current = true;
    const changed = reports
      .filter((report) =>
        kind === "sync" ? report.sync === "Stored locally" : report.id === id,
      )
      .map((report) => ({
        ...report,
        ...(kind === "sync"
          ? { sync: "Synced in simulation" as const }
          : { verification: "Verified in simulation" as const }),
      }));
    try {
      await saveReports(changed);
      setReports((current) =>
        current.map(
          (report) => changed.find((item) => item.id === report.id) ?? report,
        ),
      );
      setNotice(
        kind === "sync"
          ? `${changed.length} report${changed.length === 1 ? "" : "s"} synced in this local simulation. Nothing was sent to a server.`
          : "Human review recorded in simulation. This does not establish real-world verification.",
      );
    } catch {
      setNotice("Could not save the update. The local queue has not changed.");
    } finally {
      mutating.current = false;
    }
  };
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document
            .getElementById("main-content")
            ?.focus({ preventScroll: true });
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#overview" aria-label="ELPIS home">
            <span className="brand-mark">
              <Radio size={22} />
            </span>
            <span>
              ELPIS<span className="brand-sub">RESILIENCE IN MOTION</span>
            </span>
          </a>
          <nav aria-label="Main navigation" className={menu ? "open" : ""}>
            <a
              className={
                page === "landing" && (!hash || hash === "#overview")
                  ? "active"
                  : ""
              }
              href="#overview"
            >
              Overview
            </a>
            <a href="#how-it-works">How it works</a>
            <a href="#network">The network</a>
            <a href="#architecture">Architecture</a>
            <a href="#impact">Impact</a>
          </nav>
          <div className="header-actions">
            <button
              className={`command-nav ${page === "command" ? "active" : ""}`}
              onClick={() => navigate("command")}
            >
              <span className="status-dot" /> Command Centre{" "}
              <ArrowUpRight size={15} />
            </button>
            <button
              className="menu-button"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      {storageError && (
        <div className="global-notice" role="alert">
          {storageError}
        </div>
      )}
      {notice && page !== "landing" && (
        <div className="global-notice" role="status">
          {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="page-content" id={page !== "landing" ? "main-content" : undefined} tabIndex={-1}>
        {page === "landing" ? (
          <Landing
            onCommand={() => navigate("command")}
            onField={() => navigate("field")}
          />
        ) : page === "command" ? (
          <CommandCentre
            reports={reports}
            online={online}
            onToggleConnection={() => setOfflineDemo((value) => !value)}
            onSync={() => void updateReports("sync")}
            onReport={() => navigate("field")}
            onVerify={(id) => void updateReports("verify", id)}
          />
        ) : (
          <FieldReporting
            reports={reports}
            online={online}
            ready={ready}
            onSave={addReport}
            onCommand={() => navigate("command")}
          />
        )}
      </div>
      <footer className="site-footer page-container">
        <a href="#overview" className="footer-brand">
          ELPIS
          <span>
            Resilient Disaster Communication
            <br />& Ground Intelligence
          </span>
        </a>
        <p>
          SIH26206 · SMART INDIA HACKATHON 2026
          <br />
          <span>Student Innovation / Disaster Management</span>
        </p>
        <span className="footer-status">
          <span className="status-dot" /> RESEARCH PROTOTYPE
          <br />
          <small>Designed to support. Never to replace.</small>
        </span>
      </footer>
    </>
  );
}
export default App;
