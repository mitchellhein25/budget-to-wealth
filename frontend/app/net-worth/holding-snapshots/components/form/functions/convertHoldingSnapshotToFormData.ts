import { HoldingSnapshot } from "../..";

export const convertHoldingSnapshotToFormData = (holdingSnapshot: HoldingSnapshot) => ({
  id: holdingSnapshot.id?.toString(),
  holdingId: holdingSnapshot.holdingId,
  date: new Date(holdingSnapshot.date),
  balance: (holdingSnapshot.balance / 100).toFixed(2),
});