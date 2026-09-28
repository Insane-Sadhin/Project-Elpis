import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ClipboardList,
  HeartPulse,
  House,
  MapPin,
  Mountain,
  ShieldCheck,
  Siren,
  Waves,
  WifiOff,
  Route,
} from "lucide-react";
import {
  reportKinds,
  timeLabel,
  type FieldReport,
  type ReportKind,
} from "./elpis";

const kindIcons = {
  Flood: Waves,
  Landslide: Mountain,
  "Blocked Road": Route,
  SOS: Siren,
  Shelter: House,
  "Medical Need": HeartPulse,
};

export default function FieldReporting({
  reports,
  online,
  ready,
  onSave,
  onCommand,
}: {
  reports: FieldReport[];
  online: boolean;
  ready: boolean;
  onSave: (report: FieldReport) => Promise<void>;
  onCommand: () => void;
}) {
  const [kind, setKind] = useState<ReportKind>("Flood");
  const [priority, setPriority] = useState<FieldReport["priority"]>("High");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("30.103");
  const [longitude, setLongitude] = useState("78.305");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is unavailable. Enter coordinates manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(5));
        setLongitude(position.coords.longitude.toFixed(5));
        setLocating(false);
        setStatus(
          "Device coordinates captured. Check the location description before saving.",
        );
      },
      () => {
        setLocating(false);
        setStatus(
          "Location could not be obtained. You can still enter coordinates manually.",
        );
      },
      { timeout: 10000 },
    );
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!location.trim() || !source.trim() || !notes.trim()) {
      setStatus("Complete the location, source and observation.");
      return;
    }
    setSaving(true);
    setStatus("");
    setSaved("");
    const report: FieldReport = {
      id: `ELP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      kind,
      priority,
      location: location.trim(),
      coordinates: [Number(latitude), Number(longitude)],
      source: source.trim(),
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
      verification: "Unverified",
      sync: "Stored locally",
    };
    try {
      await onSave(report);
      setSaved(report.id);
      setNotes("");
    } catch {
      setStatus(
        "Report was not saved. Browser storage may be unavailable or full. Your input has been kept.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="field-page page-container">
      <button className="text-button back-button" onClick={onCommand}>
        <ArrowLeft size={15} /> Command Centre
      </button>
      <div className="page-heading">
        <div>
          <span className="eyebrow">FIELD OPERATIONS / NEW OBSERVATION</span>
          <h1>
            Every observation
            <br />
            <span>fills a blind spot.</span>
          </h1>
          <p>
            Capture what you see. Keep it on this device. Share when a
            connection returns.
          </p>
        </div>
        <span className="status-pill">
          <WifiOff size={14} />{" "}
          {online
            ? "Local-first reporting"
            : "Offline · local storage available"}
        </span>
      </div>
      <div className="field-grid">
        <form onSubmit={submit} className="field-form panel">
          <div className="panel-heading">
            <span className="eyebrow">01 / CLASSIFY THE OBSERVATION</span>
            <ClipboardList size={18} />
          </div>
          <div className="kind-grid">
            {reportKinds.map((item) => {
              const Icon = kindIcons[item];
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={kind === item}
                  className={`kind-option ${kind === item ? "selected" : ""}`}
                  onClick={() => {
                    setKind(item);
                    if (item === "SOS") setPriority("Critical");
                  }}
                >
                  <Icon size={21} />
                  <span>{item}</span>
                  {kind === item && <Check size={12} />}
                </button>
              );
            })}
          </div>
          {kind === "SOS" && (
            <p className="safety-note">
              This prototype does not contact emergency services. For immediate
              danger, use an available official emergency channel or call 112 in
              India.
            </p>
          )}
          <div className="panel-heading form-section">
            <span className="eyebrow">02 / ADD GROUND CONTEXT</span>
            <span className="mono">* Required</span>
          </div>
          <label>
            Location description *
            <input
              required
              maxLength={140}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Village, landmark or road segment"
            />
          </label>
          <div className="coordinate-row">
            <label>
              Latitude *
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </label>
            <label>
              Longitude *
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="button button-secondary"
              disabled={locating}
              onClick={captureLocation}
            >
              <MapPin size={16} />
              {locating ? "Locating…" : "Use GPS"}
            </button>
          </div>
          <p className="input-hint">
            Coordinates start at the demo area, Rishikesh. Enter the
            observation’s actual location or use GPS.
          </p>
          <div className="form-row">
            <label>
              Reported by *
              <input
                required
                maxLength={80}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Volunteer name or node ID"
              />
            </label>
            <label>
              Priority
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as FieldReport["priority"])
                }
              >
                <option>Normal</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
          </div>
          <label>
            What did you observe? *
            <textarea
              required
              maxLength={1200}
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the situation. Include observable details, not assumptions."
            />
          </label>
          <div className="form-footer">
            <span>
              <ShieldCheck size={15} /> Saved as unverified · time recorded
              automatically
            </span>
            <button
              className="button button-primary"
              disabled={!ready || saving}
              type="submit"
            >
              {saving ? "Saving locally…" : "Save field report"}
              <ArrowUpRight size={17} />
            </button>
          </div>
          {status && (
            <p className="safety-note" role="status">
              {status}
            </p>
          )}
          {saved && (
            <div className="success-note" role="status">
              <Check size={18} />
              <div>
                <strong>{saved} saved on this device.</strong>
                <p>
                  Queued for simulated sync. No information has been sent to
                  emergency services.
                </p>
                <button
                  type="button"
                  className="text-button"
                  onClick={onCommand}
                >
                  View in Command Centre <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          )}
        </form>
        <aside className="field-aside">
          <div className="panel local-first-note">
            <div className="small-icon">
              <WifiOff size={24} />
            </div>
            <h2>
              No signal.
              <br />
              Not a dead end.
            </h2>
            <p>
              Reports are saved in this browser’s IndexedDB before anything
              else. Losing connectivity does not erase your observation.
            </p>
            <div className="note-line">
              <span className="status-dot" /> LOCAL STORAGE → SYNC QUEUE
            </div>
            <p className="input-hint">
              Keep this device and browser data intact. Clearing site data
              removes locally stored reports. Sync and device transfer are
              simulated in this prototype.
            </p>
          </div>
          <div className="recent-reports">
            <div className="panel-heading">
              <span className="eyebrow">RECENT GROUND REPORTS</span>
              <span className="mono">{reports.length}</span>
            </div>
            {reports.slice(0, 4).map((report) => (
              <article key={report.id}>
                <div>
                  <strong>{report.kind}</strong>
                  <span
                    className={`priority-label ${report.priority.toLowerCase()}`}
                  >
                    {report.priority}
                  </span>
                </div>
                <p>{report.location}</p>
                <small>
                  {timeLabel(report.timestamp)} · {report.source}
                </small>
                <span className="report-state">
                  {report.verification} / {report.sync}
                </span>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
