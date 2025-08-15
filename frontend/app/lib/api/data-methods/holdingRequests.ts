import { Holding } from "@/app/net-worth/holding-snapshots/holdings/components";
import { deleteRequest, getRequestList } from "../rest-methods";
import { HOLDINGS_ENDPOINT } from "./";

export async function getAllHoldings() {
  return await getRequestList<Holding>(HOLDINGS_ENDPOINT);
}

export async function deleteHolding(id: number) {
  return await deleteRequest<Holding>(HOLDINGS_ENDPOINT, id);
}