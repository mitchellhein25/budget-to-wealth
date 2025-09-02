"use server";

import { DateRange } from "@/app/components";
import { HoldingSnapshot } from "@/app/net-worth/holding-snapshots/components";
import { deleteRequest, postRequest, putRequest, DateRangeResponse, HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT, HOLDING_SNAPSHOTS_ENDPOINT, getRequestList, getRequestSingle, getQueryStringForDateRange } from "..";

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

export async function createHoldingSnapshot(holdingSnapshot: HoldingSnapshot) {
  return await postRequest<HoldingSnapshot>(HOLDING_SNAPSHOTS_ENDPOINT, holdingSnapshot);
}

export async function updateHoldingSnapshot(id: string, holdingSnapshot: HoldingSnapshot) {
  return await putRequest<HoldingSnapshot>(HOLDING_SNAPSHOTS_ENDPOINT, id, holdingSnapshot);
}
