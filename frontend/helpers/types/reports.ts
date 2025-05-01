import { TApiResponse } from "./common";

export interface ReportResponse extends TApiResponse {
  reports: string[];
}
