"use server";

import { getRequestList, getRequestSingle } from "../rest-methods/getRequest";
import { DateRange } from "@/app/components/DatePicker";
import { HoldingSnapshot } from "@/app/net-worth/holding-snapshots/components/HoldingSnapshot";
import { getQueryStringForDateRange } from "./queryHelpers";
import { deleteRequest } from "../rest-methods/deleteRequest";
import { DateRangeResponse, HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT, HOLDING_SNAPSHOTS_ENDPOINT } from "./";
import { postRequest } from "../rest-methods/postRequest";
import { putRequest } from "../rest-methods/putRequest";

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
