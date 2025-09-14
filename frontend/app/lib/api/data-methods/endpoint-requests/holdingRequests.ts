import { Holding } from "@/app/net-worth/holding-snapshots/holdings";
import { deleteRequest, getRequestList, HOLDINGS_ENDPOINT } from "@/app/lib/api";

export async function getAllHoldings() {
  return await getRequestList<Holding>(HOLDINGS_ENDPOINT);
}

export async function deleteHolding(id: number) {
  return await deleteRequest<Holding>(HOLDINGS_ENDPOINT, id);
}