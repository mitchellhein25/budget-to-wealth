"use server";

import { getRequestList } from "../rest-methods/getRequest";
import { DateRange } from "@/app/components/DatePicker";
import { HoldingSnapshot } from "@/app/net-worth/components/HoldingSnapshot";
import { getQueryStringForDateRange } from "./queryHelpers";
import { deleteRequest } from "../rest-methods/deleteRequest";
import { HOLDING_SNAPSHOTS_ENDPOINT } from "./endpoints";

export async function getHoldingSnapshotsByDateRange(dateRange: DateRange) {
  return await getRequestList<HoldingSnapshot>(`${HOLDING_SNAPSHOTS_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`);
}

export async function deleteHoldingSnapshot(id: number) {
  return await deleteRequest<HoldingSnapshot>(HOLDING_SNAPSHOTS_ENDPOINT, id);
}
