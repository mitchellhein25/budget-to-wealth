"use server";

import { getRequestList, getRequestSingle } from "../rest-methods/getRequest";
import { DateRange } from "@/app/components/DatePicker";
import { HoldingSnapshot } from "@/app/net-worth/components/HoldingSnapshot";
import { getQueryStringForDateRange } from "./queryHelpers";
import { deleteRequest } from "../rest-methods/deleteRequest";
import { HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT, HOLDING_SNAPSHOTS_ENDPOINT } from "./endpoints";
export type DateRangeResponse = { startDate?: string; endDate?: string };

export async function getHoldingSnapshotsByDateRange(dateRange: DateRange) {
  return await getRequestList<HoldingSnapshot>(`${HOLDING_SNAPSHOTS_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`);
}

export async function getLatestHoldingSnapshots() {
  return await getRequestList<HoldingSnapshot>(`${HOLDING_SNAPSHOTS_ENDPOINT}?latestOnly=true`);
}

export async function deleteHoldingSnapshot(id: number) {
  return await deleteRequest<HoldingSnapshot>(HOLDING_SNAPSHOTS_ENDPOINT, id);
}

export async function getHoldingSnapshotsDateRange() {
  return await getRequestSingle<DateRangeResponse>(HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT);
}
