export type ReportKind =
  "Flood" | "Landslide" | "Blocked Road" | "SOS" | "Shelter" | "Medical Need";
export type FieldReport = {
  id: string;
  kind: ReportKind;
  location: string;
  coordinates: [number, number];
  timestamp: string;
  source: string;
  priority: "Critical" | "High" | "Normal";
  verification: "Unverified" | "Corroborated" | "Verified in simulation";
  sync: "Stored locally" | "Synced in simulation";
  notes: string;
};
export const reportKinds: ReportKind[] = [
  "Flood",
  "Landslide",
  "Blocked Road",
  "SOS",
  "Shelter",
  "Medical Need",
];
export const initialReports: FieldReport[] = [
  {
    id: "ELP-1042",
    kind: "Flood",
    location: "Rishikesh · Triveni Ghat",
    coordinates: [30.103, 78.305],
    timestamp: "2026-09-28T08:42:00+05:30",
    source: "Field volunteer N-07",
    priority: "High",
    verification: "Corroborated",
    sync: "Synced in simulation",
    notes:
      "Water over the lower access steps. Pedestrian access reported blocked.",
  },
  {
    id: "ELP-1041",
    kind: "Blocked Road",
    location: "Shivpuri · NH-7",
    coordinates: [30.135, 78.384],
    timestamp: "2026-09-28T08:38:00+05:30",
    source: "Field volunteer N-03",
    priority: "High",
    verification: "Unverified",
    sync: "Stored locally",
    notes:
      "Debris across one lane. Needs on-site confirmation by the local authority.",
  },
  {
    id: "ELP-1040",
    kind: "SOS",
    location: "Tapovan · Riverside lane",
    coordinates: [30.126, 78.323],
    timestamp: "2026-09-28T08:35:00+05:30",
    source: "Community node N-12",
    priority: "Critical",
    verification: "Unverified",
    sync: "Synced in simulation",
    notes:
      "Three people report being isolated by rising water. Request awaiting operator review.",
  },
  {
    id: "ELP-1039",
    kind: "Shelter",
    location: "Muni Ki Reti · Community hall",
    coordinates: [30.115, 78.311],
    timestamp: "2026-09-28T08:31:00+05:30",
    source: "Shelter coordinator N-02",
    priority: "Normal",
    verification: "Verified in simulation",
    sync: "Synced in simulation",
    notes:
      "Community hall reported open. Availability must be checked with the coordinator.",
  },
  {
    id: "ELP-1038",
    kind: "Medical Need",
    location: "Rishikesh · Barrage road",
    coordinates: [30.078, 78.287],
    timestamp: "2026-09-28T08:29:00+05:30",
    source: "Field volunteer N-09",
    priority: "High",
    verification: "Unverified",
    sync: "Stored locally",
    notes:
      "Resident requests access to prescribed medication. No medical decision automated.",
  },
  {
    id: "ELP-1037",
    kind: "Landslide",
    location: "Byasi · Hill road",
    coordinates: [30.075, 78.423],
    timestamp: "2026-09-28T08:24:00+05:30",
    source: "Community node N-05",
    priority: "High",
    verification: "Corroborated",
    sync: "Synced in simulation",
    notes:
      "Small slope failure reported near the road bend. Extent not confirmed.",
  },
];
export function timeLabel(timestamp: string) {
  return (
    new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }) + " IST"
  );
}
