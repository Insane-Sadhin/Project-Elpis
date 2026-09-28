import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Cross,
  Droplets,
  Eye,
  FileText,
  House,
  Layers,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Radio,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  Siren,
  Wifi,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  reportKinds,
  timeLabel,
  type FieldReport,
  type ReportKind,
} from "./elpis";
import "./command.css";

type Props = {
  reports: FieldReport[];
  online: boolean;
  onToggleConnection: () => void;
  onSync: () => void;
  onReport: () => void;
  onVerify: (id: string) => void;
};
type Layer = "reports" | "shelters" | "hospitals";
const kindIcons: Record<ReportKind, LucideIcon> = {
  Flood: Droplets,
  Landslide: Mountain,
  "Blocked Road": Route,
  SOS: Siren,
  Shelter: House,
  "Medical Need": Cross,
};
const facilities = [
  {
    id: "hospital-1",
    name: "AIIMS area · example medical point",
    kind: "hospitals" as const,
    x: 16,
    y: 79,
    detail:
      "Illustrative medical resource only. Operational status, access and capacity are not verified.",
  },
  {
    id: "hospital-2",
    name: "Town centre · example medical point",
    kind: "hospitals" as const,
    x: 27,
    y: 56,
    detail:
      "Illustrative medical resource only. Contact local services to confirm care availability.",
  },
  {
    id: "shelter-1",
    name: "Tapovan · example assembly point",
    kind: "shelters" as const,
    x: 43,
    y: 37,
    detail:
      "Illustrative assembly point, not an approved evacuation destination. Safe access must be confirmed by authorities.",
  },
];
const projectPoint = ([lat, lon]: [number, number]) => ({
  x: ((lon - 78.266) / 0.174) * 100,
  y: ((30.15 - lat) / 0.093) * 100,
});
const inExtent = (report: FieldReport) => {
  const { x, y } = projectPoint(report.coordinates);
  return x >= 0 && x <= 100 && y >= 0 && y <= 100;
};

function Terrain() {
  return (
    <svg
      className="cc-terrain"
      viewBox="0 0 1000 650"
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustrative map of the Rishikesh area, Uttarakhand. Not for navigation."
    >
      <defs>
        <pattern
          id="cc-grid"
          width="100"
          height="65"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 100 0 L 0 0 0 65"
            fill="none"
            stroke="#b6c3a5"
            strokeOpacity=".07"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="cc-city"
          width="26"
          height="25"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-22)"
        >
          <rect
            x="5"
            y="5"
            width="15"
            height="12"
            rx="1"
            fill="#9fba91"
            opacity=".075"
          />
        </pattern>
      </defs>
      <rect width="1000" height="650" fill="#14251d" />
      <path
        d="M0 0H1000V650H570C710 500 604 350 449 311C359 225 441 110 0 160Z"
        fill="#1b2d20"
      />
      <g fill="none" stroke="#728361" strokeWidth="1" opacity=".22">
        <path d="M-50 95C141-44 360 56 410 121S474 223 614 185S804 18 1030 90M-50 113C135-22 334 71 384 137S476 249 630 209S813 43 1030 112M-50 132C129 0 308 87 358 154S478 275 646 233S822 68 1030 134M-50 152C123 22 282 103 332 171S480 301 662 257S831 93 1030 156M-50 172C117 44 256 119 306 188S482 327 678 281S840 118 1030 178" />
        <path d="M1000 280C858 206 679 345 695 420S816 551 699 690M1020 307C878 233 707 351 722 427S844 558 727 697M1040 334C898 260 735 357 749 434S872 565 755 704M1060 361C918 287 763 363 776 441S900 572 783 711M1080 388C938 314 791 369 803 448S928 579 811 718M1100 415C958 341 819 375 830 455S956 586 839 725" />
        <path d="M-40 465C107 386 260 478 281 555S373 669 503 637M-40 488C102 413 237 492 256 569S359 693 496 662M-40 511C97 440 214 506 231 583S345 717 489 687M-40 534C92 467 191 520 206 597S331 741 482 712" />
      </g>
      <path
        d="M57 286L177 223L298 262L360 353L305 506L180 562L68 467Z"
        fill="url(#cc-city)"
      />
      <path
        d="M1090 42C909 61 825 102 715 133S566 108 496 195S430 299 348 329S357 419 290 466S339 570 234 720"
        fill="none"
        stroke="#395b4c"
        strokeWidth="47"
      />
      <path
        d="M1090 42C909 61 825 102 715 133S566 108 496 195S430 299 348 329S357 419 290 466S339 570 234 720"
        fill="none"
        stroke="#233f36"
        strokeWidth="36"
      />
      <path
        d="M1090 42C909 61 825 102 715 133S566 108 496 195S430 299 348 329S357 419 290 466S339 570 234 720"
        fill="none"
        stroke="#648d7c"
        strokeOpacity=".35"
        strokeWidth="1"
        strokeDasharray="5 8"
      />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M158 690L226 546L213 440L264 343L310 265L400 217L464 143L609 87L747 96L859 130L1000 100"
          stroke="#14211a"
          strokeWidth="11"
        />
        <path
          d="M158 690L226 546L213 440L264 343L310 265L400 217L464 143L609 87L747 96L859 130L1000 100"
          stroke="#b8b99a"
          strokeOpacity=".66"
          strokeWidth="3"
        />
        <path
          d="M0 375L149 361L264 343L358 355L421 343L533 389L589 438L734 457L867 532L1005 570M57 516L169 451L213 440M310 265L194 257L118 284M400 217L460 286L493 366M533 389L570 303L642 281"
          stroke="#819176"
          strokeOpacity=".5"
          strokeWidth="2"
        />
        <path
          d="M269 338L357 310M357 215L431 261"
          stroke="#bdc8a7"
          strokeWidth="3"
        />
      </g>
      <rect width="1000" height="650" fill="url(#cc-grid)" />
      <g fill="#9bad94" fontFamily="monospace" fontSize="11" letterSpacing="2">
        <text x="91" y="331">
          RISHIKESH
        </text>
        <text x="293" y="202">
          TAPOVAN
        </text>
        <text x="666" y="64">
          SHIVPURI
        </text>
        <text x="833" y="581">
          BYASI
        </text>
        <text x="675" y="351" opacity=".5" fontSize="14" letterSpacing="5">
          RAJAJI FOREST
        </text>
        <text x="528" y="194" fill="#91b3a5" transform="rotate(-28 528 194)">
          GANGA
        </text>
        <text x="126" y="584" fontSize="9">
          VIRBHADRA
        </text>
      </g>
      <g transform="translate(573 80)">
        <rect
          width="37"
          height="21"
          rx="4"
          fill="#29392b"
          stroke="#7b8869"
          strokeOpacity=".5"
        />
        <text
          x="18.5"
          y="14"
          textAnchor="middle"
          fill="#bbc7a4"
          fontFamily="monospace"
          fontSize="10"
        >
          NH 7
        </text>
      </g>
    </svg>
  );
}

export default function CommandCentre({
  reports,
  online,
  onToggleConnection,
  onSync,
  onReport,
  onVerify,
}: Props) {
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("All reports");
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    reports: true,
    shelters: true,
    hospitals: true,
  });
  const [zoom, setZoom] = useState(1);
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const selected =
    reports.find((report) => report.id === selectedId) ?? reports[0];
  const facility = facilities.find((item) => item.id === facilityId);
  const pending = reports.filter(
    (report) => report.sync === "Stored locally",
  ).length;
  const sos = reports.filter((report) => report.kind === "SOS").length;
  const verified = reports.filter(
    (report) => report.verification === "Verified in simulation",
  ).length;
  const filtered = useMemo(
    () =>
      reports.filter(
        (report) =>
          (kind === "All reports" || report.kind === kind) &&
          `${report.id} ${report.location} ${report.source} ${report.notes}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [reports, kind, search],
  );
  const recent = useMemo(
    () =>
      [...reports]
        .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
        .slice(0, 4),
    [reports],
  );
  const outside = reports.filter((report) => !inExtent(report)).length;
  const selectReport = (id: string) => {
    setSelectedId(id);
    setFacilityId(null);
  };

  return (
    <main className="cc-page">
      <div className="cc-simulation">
        <span>
          <Radio size={13} /> SIMULATION WORKSPACE
        </span>
        <p>
          Illustrative scenario and local demo data. No live government feed,
          peer network or emergency dispatch.
        </p>
      </div>
      <header className="cc-heading">
        <div>
          <div className="cc-eyebrow">ELPIS / OPERATIONS</div>
          <h1>
            Command centre<span>.</span>
          </h1>
          <p>A shared picture. A better-informed response.</p>
        </div>
        <div className="cc-heading-actions">
          <button
            className={`cc-connection ${online ? "is-online" : ""}`}
            onClick={onToggleConnection}
            title="Toggle simulated connectivity"
          >
            {online ? <Wifi size={15} /> : <WifiOff size={15} />}{" "}
            {online ? "Demo online" : "Demo offline"}
            <span>Switch</span>
          </button>
          <button className="button button-primary" onClick={onReport}>
            <Plus size={16} /> New field report
          </button>
        </div>
      </header>
      <section className="cc-summary" aria-label="Scenario overview">
        <div>
          <span className="cc-eyebrow">FIELD REPORTS</span>
          <strong>
            {String(reports.length).padStart(2, "0")}
            <FileText size={18} />
          </strong>
          <small>Community observations</small>
        </div>
        <div className="cc-summary-sos">
          <span className="cc-eyebrow">SOS REQUESTS</span>
          <strong>
            {String(sos).padStart(2, "0")}
            <Siren size={19} />
          </strong>
          <small>Human review required</small>
        </div>
        <div>
          <span className="cc-eyebrow">LOCALLY QUEUED</span>
          <strong>
            {String(pending).padStart(2, "0")}
            <RefreshCw size={18} />
          </strong>
          <small>
            {online ? "Ready for simulated sync" : "Retained while offline"}
          </small>
        </div>
        <div>
          <span className="cc-eyebrow">REVIEWED IN DEMO</span>
          <strong>
            {String(verified).padStart(2, "0")}
            <ShieldCheck size={19} />
          </strong>
          <small>Not authority verification</small>
        </div>
      </section>
      <aside className="cc-advisory">
        <div className="cc-advisory-icon">
          <AlertTriangle size={19} />
        </div>
        <div>
          <div className="cc-advisory-title">
            <strong>Flood advisory</strong>
            <span>ACTIVE EXAMPLE · NOT AN OFFICIAL ALERT</span>
          </div>
          <p>
            Example only: avoid low-lying riverbanks and follow local authority
            guidance. This is not a live or authenticated warning.
          </p>
        </div>
        <a href="https://sachet.ndma.gov.in/" target="_blank" rel="noreferrer">
          Official SACHET portal
          <ArrowUpRight size={15} />
        </a>
      </aside>
      <section className="cc-workspace" aria-label="Incident workspace">
        <aside className="cc-reports-panel">
          <div className="cc-panel-title">
            <h2>Field reports</h2>
            <span className="cc-count">{reports.length}</span>
          </div>
          <div className="cc-report-filters">
            <label className="cc-search">
              <Search size={15} />
              <input
                aria-label="Search field reports"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search location or report…"
              />
            </label>
            <select
              aria-label="Filter by report type"
              value={kind}
              onChange={(event) => setKind(event.target.value)}
            >
              <option>All reports</option>
              {reportKinds.map((item) => (
                <option key={item} value={item}>
                  {item} (
                  {reports.filter((report) => report.kind === item).length})
                </option>
              ))}
            </select>
          </div>
          <div className="cc-report-list" aria-label="Matching field reports">
            {filtered.map((report) => {
              const Icon = kindIcons[report.kind];
              return (
                <button
                  key={report.id}
                  className={`cc-report-row ${selected?.id === report.id && !facility ? "is-selected" : ""} ${report.kind === "SOS" ? "is-sos" : ""}`}
                  onClick={() => selectReport(report.id)}
                  aria-pressed={selected?.id === report.id && !facility}
                >
                  <span className="cc-report-top">
                    <span className="cc-report-kind">
                      <Icon size={14} />
                      {report.kind}
                    </span>
                    <span
                      className={`cc-priority cc-priority-${report.priority.toLowerCase()}`}
                    >
                      {report.priority}
                    </span>
                  </span>
                  <strong>{report.location}</strong>
                  <span className="cc-report-meta">
                    {report.id}
                    <span>{timeLabel(report.timestamp)}</span>
                  </span>
                  <span className="cc-report-state">
                    <span
                      className={`cc-state-dot ${report.verification === "Unverified" ? "is-unverified" : ""}`}
                    />
                    {report.verification === "Verified in simulation"
                      ? "Reviewed in demo"
                      : report.verification}
                    {report.sync === "Stored locally" && (
                      <RefreshCw size={11} aria-label="Stored locally" />
                    )}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="cc-empty">
                <Search size={22} />
                <strong>No matching reports</strong>
                <p>Try another location or report type.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setKind("All reports");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <div className="cc-list-footer">
            {filtered.length} of {reports.length} reports · all simulated
          </div>
        </aside>
        <div className="cc-map-panel">
          <div className="cc-map-heading">
            <div>
              <MapPin size={14} />
              <strong>Rishikesh, Uttarakhand</strong>
            </div>
            <span>INDIA / DEMO SECTOR 04</span>
          </div>
          <div
            className="cc-map"
            aria-label="Interactive illustrative incident map"
          >
            <div
              className="cc-map-content"
              style={{ transform: `scale(${zoom})` }}
            >
              <Terrain />
              {reports
                .filter(
                  (report) =>
                    inExtent(report) &&
                    (report.kind === "Shelter"
                      ? layers.shelters
                      : layers.reports),
                )
                .map((report) => {
                  const point = projectPoint(report.coordinates);
                  const Icon = kindIcons[report.kind];
                  return (
                    <button
                      key={report.id}
                      className={`cc-marker ${report.kind === "SOS" ? "cc-marker-sos" : ""} ${report.kind === "Shelter" ? "cc-marker-resource" : ""} ${selected?.id === report.id && !facility ? "is-selected" : ""}`}
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                      }}
                      aria-label={`${report.kind}: ${report.location}. ${report.priority} priority.`}
                      aria-pressed={selected?.id === report.id && !facility}
                      onClick={() => selectReport(report.id)}
                      title={`${report.id} · ${report.kind}`}
                    >
                      <Icon size={16} />
                      {report.kind === "SOS" && (
                        <span className="cc-marker-label">SOS</span>
                      )}
                    </button>
                  );
                })}
              {facilities
                .filter((item) => layers[item.kind])
                .map((item) => {
                  const Icon = item.kind === "hospitals" ? Cross : House;
                  return (
                    <button
                      key={item.id}
                      className={`cc-marker cc-marker-resource ${facilityId === item.id ? "is-selected" : ""}`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                      }}
                      onClick={() => setFacilityId(item.id)}
                      aria-label={item.name}
                      aria-pressed={facilityId === item.id}
                      title={item.name}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
            </div>
            <div className="cc-layer-controls" aria-label="Map layers">
              <span>
                <Layers size={13} />
                LAYERS
              </span>
              {(["reports", "shelters", "hospitals"] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() =>
                    setLayers((current) => ({
                      ...current,
                      [layer]: !current[layer],
                    }))
                  }
                  aria-pressed={layers[layer]}
                >
                  <span
                    className={`cc-layer-check ${layers[layer] ? "is-checked" : ""}`}
                  >
                    {layers[layer] && <Check size={11} />}
                  </span>
                  {layer}
                </button>
              ))}
            </div>
            <div className="cc-map-compass" aria-label="North">
              N<span>↑</span>
            </div>
            <div className="cc-map-zoom">
              <button
                aria-label="Zoom in map"
                disabled={zoom >= 1.8}
                onClick={() =>
                  setZoom((value) => Math.min(1.8, +(value + 0.2).toFixed(1)))
                }
              >
                <Plus size={18} />
              </button>
              <button
                aria-label="Zoom out map"
                disabled={zoom <= 1}
                onClick={() =>
                  setZoom((value) => Math.max(1, +(value - 0.2).toFixed(1)))
                }
              >
                <Minus size={18} />
              </button>
              <button
                className="cc-zoom-reset"
                aria-label="Reset map zoom"
                onClick={() => setZoom(1)}
              >
                {Math.round(zoom * 100)}%
              </button>
            </div>
            <div className="cc-map-disclaimer">
              <Eye size={12} />
              ILLUSTRATIVE · NOT FOR NAVIGATION
            </div>
          </div>
          <div className="cc-map-footer">
            <span>
              <i className="cc-legend-report" />
              Field report
            </span>
            <span>
              <i className="cc-legend-sos" />
              SOS
            </span>
            <span>
              <i className="cc-legend-resource" />
              Resource
            </span>
            <span className="cc-map-extent">
              {outside
                ? `${outside} outside map extent`
                : "No external map tiles"}
            </span>
          </div>
        </div>
        <aside
          className="cc-inspector"
          aria-label="Selected item details"
          aria-live="polite"
        >
          <div className="cc-panel-title">
            <h2>{facility ? "Resource details" : "Report details"}</h2>
            <Eye size={15} />
          </div>
          {facility ? (
            <div className="cc-inspector-body">
              <span className="cc-eyebrow">EXAMPLE RESOURCE</span>
              <h3>{facility.name}</h3>
              <p className="cc-notes">{facility.detail}</p>
              <div className="cc-review-note">
                <AlertTriangle size={15} />
                Do not use this illustrative map for routing or evacuation.
              </div>
              <button
                className="cc-review-button"
                onClick={() => setFacilityId(null)}
              >
                <X size={14} />
                Close resource
              </button>
            </div>
          ) : selected ? (
            <div className="cc-inspector-body">
              <div className="cc-detail-id">
                <span className="cc-eyebrow">{selected.id}</span>
                <span
                  className={`cc-priority cc-priority-${selected.priority.toLowerCase()}`}
                >
                  {selected.priority} priority
                </span>
              </div>
              <h3>{selected.kind}</h3>
              <p className="cc-detail-location">
                <MapPin size={14} />
                {selected.location}
              </p>
              <dl className="cc-detail-fields">
                <div>
                  <dt>Coordinates</dt>
                  <dd>
                    {Math.abs(selected.coordinates[0]).toFixed(4)}°{" "}
                    {selected.coordinates[0] < 0 ? "S" : "N"}
                    <br />
                    {Math.abs(selected.coordinates[1]).toFixed(4)}°{" "}
                    {selected.coordinates[1] < 0 ? "W" : "E"}
                    {!inExtent(selected) && (
                      <small>Outside illustrative map extent</small>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Reported</dt>
                  <dd>
                    {timeLabel(selected.timestamp)}
                    <small>
                      {new Date(selected.timestamp).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "Asia/Kolkata",
                        },
                      )}
                    </small>
                  </dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{selected.source}</dd>
                </div>
                <div>
                  <dt>Verification</dt>
                  <dd
                    className={
                      selected.verification === "Unverified"
                        ? "cc-text-amber"
                        : "cc-text-sage"
                    }
                  >
                    {selected.verification}
                  </dd>
                </div>
                <div>
                  <dt>Sync status</dt>
                  <dd>{selected.sync}</dd>
                </div>
              </dl>
              <div className="cc-notes-heading">FIELD NOTES</div>
              <p className="cc-notes">{selected.notes}</p>
              <button
                className="cc-review-button"
                onClick={() => onVerify(selected.id)}
                disabled={selected.verification === "Verified in simulation"}
              >
                <ShieldCheck size={15} />
                {selected.verification === "Verified in simulation"
                  ? "Reviewed in simulation"
                  : "Mark reviewed in simulation"}
              </button>
              <p className="cc-review-note">
                <Eye size={13} />
                Human-review demo only. Does not verify ground truth, issue an
                alert or dispatch responders.
              </p>
            </div>
          ) : (
            <div className="cc-empty">
              <MapPin size={24} />
              <strong>No report selected</strong>
              <p>Submit a field report to begin.</p>
              <button onClick={onReport}>New field report</button>
            </div>
          )}
        </aside>
      </section>
      <section className="cc-bottom">
        <div className="cc-timeline">
          <div className="cc-panel-title">
            <h2>
              <Clock3 size={15} />
              Event timeline
            </h2>
            <span className="cc-eyebrow">LATEST REPORTS / IST</span>
          </div>
          <div className="cc-events">
            {recent.map((report) => (
              <button
                key={report.id}
                className="cc-event"
                onClick={() => selectReport(report.id)}
              >
                <span
                  className={`cc-event-dot ${report.kind === "SOS" ? "is-sos" : ""}`}
                />
                <time dateTime={report.timestamp}>
                  {timeLabel(report.timestamp)}
                </time>
                <strong>{report.kind} reported</strong>
                <span>{report.location}</span>
                <small>
                  {report.verification} <ChevronRight size={11} />
                </small>
              </button>
            ))}
            {recent.length === 0 && (
              <p className="cc-no-events">
                No events yet. New reports will appear here.
              </p>
            )}
          </div>
        </div>
        <div className="cc-network">
          <div className="cc-panel-title">
            <h2>
              <Radio size={15} />
              Connectivity
            </h2>
            <span className="cc-eyebrow">DEMO SNAPSHOT</span>
          </div>
          <div className="cc-device-counts">
            <div>
              <i className="cc-state-dot" />
              <strong>08</strong>
              <span>online devices</span>
            </div>
            <div>
              <i className="cc-state-dot is-offline" />
              <strong>04</strong>
              <span>offline devices</span>
            </div>
          </div>
          <p>
            Illustrative devices, not discovered peers. This device is{" "}
            <strong>{online ? "demo online" : "demo offline"}</strong>.
          </p>
          <div className="cc-sync-row">
            <span>
              <strong>{pending}</strong> reports queued locally
            </span>
            <button onClick={onSync} disabled={!online || !pending}>
              <RefreshCw size={13} />
              Simulate sync
            </button>
          </div>
          <small>
            {!online
              ? "Offline mode: local reports stay on this device."
              : pending
                ? "Sync updates demo status only; no network transfer."
                : "All reports marked synced in simulation."}
          </small>
        </div>
      </section>
      <footer className="cc-footer">
        <span>
          <ShieldCheck size={13} />
          Information support. Human judgement. Always.
        </span>
        <p>
          Complements NDMA / SACHET, IMD and CWC guidance — never replaces it.
          For real emergencies, call <a href="tel:112">112</a>.
        </p>
      </footer>
    </main>
  );
}
