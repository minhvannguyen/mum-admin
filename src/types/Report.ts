export type ReportStatus = "Pending" | "Solved";

export type ReportType = "song" | "playlist" | "comment" | "user";

export interface Report {
  id: number;
  targetType: ReportType;
  reason: string;
  status: ReportStatus;

  createdAt: string;

  reporterId: number;
  reporterEmail?: string;

  targetId: number; // id của object bị report (song, playlist...)
  targetName?: string;
}