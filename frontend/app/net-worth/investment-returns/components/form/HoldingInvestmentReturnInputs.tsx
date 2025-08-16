import { InputFieldSetTemplate } from '@/app/components/form/InputFieldSetTemplate'
import React from 'react'
import { INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../../../holding-snapshots/components/constants'
import { convertDateToISOString } from '@/app/components/Utils'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { InvestmentReturnFormData } from './InvestmentReturnFormData'
import { HoldingSnapshot } from '../../../holding-snapshots/components'
import { Holding } from '../../../holding-snapshots/holdings/components'

interface HoldingInvestmentReturnInputsProps {
  editingFormData: InvestmentReturnFormData;
  onChange: React.ChangeEventHandler;
  startSnapshots: HoldingSnapshot[];
  holdings: Holding[];
}

export function HoldingInvestmentReturnInputs({
  editingFormData,
  onChange,
  startSnapshots,
  holdings,
}: HoldingInvestmentReturnInputsProps) {
  return (
    <>
      <InputFieldSetTemplate
        label="Start Snapshot Date"
        isRequired={true}
        inputChild={
          <input
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-startHoldingSnapshotDate`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-startHoldingSnapshotDate`}
            type="date"
            value={editingFormData.startHoldingSnapshotDate || convertDateToISOString(new Date())}
            onChange={onChange}
            className="input w-full"
          />
        }
      />
      <InputFieldSetTemplate
        label="Start Snapshot"
        isRequired={true}
        inputChild={
          <select
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-startHoldingSnapshotId`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-startHoldingSnapshotId`}
            value={editingFormData.startHoldingSnapshotId || ""}
            onChange={onChange}
            className="select w-full"
          >
            <option value="" disabled>Pick a snapshot</option>
            {startSnapshots.map((s) => (
              <option key={s.id} value={s.id}>{`${s.holding?.name ?? ''} ${s.holding?.institution ? `- ${s.holding?.institution}` : ''} - ${new Date(s.date).toLocaleDateString()} ($${(s.balance/100).toFixed(2)})`}</option>
            ))}
          </select>
        }
      />

      <div className="mt-2 font-semibold">End Snapshot</div>
      <InputFieldSetTemplate 
        label="Holding"
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotHoldingId`}
              name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotHoldingId`}
              value={editingFormData.endHoldingSnapshotHoldingId || ""}
              onChange={onChange}
              className="select flex-1"
            >
              <option value="" disabled>Pick a holding</option>
              {holdings.map((h) => (
                <option key={h.id} value={h.id}>{`${h.name} ${h.institution ? `- ${h.institution}` : ''} - ${h.holdingCategory?.name} (${h.type})`}</option>
              ))}
            </select>
            <Link href="/net-worth/holdings" className="btn btn-ghost btn-sm btn-circle" title="Edit Holdings">
              <Edit size={16} />
            </Link>
          </div>
        }
      />
      <InputFieldSetTemplate
        label="Date"
        isRequired={true}
        inputChild={
          <input
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotDate`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotDate`}
            type="date"
            value={editingFormData.endHoldingSnapshotDate || convertDateToISOString(new Date())}
            onChange={onChange}
            className="input w-full"
          />
        }
      />
      <InputFieldSetTemplate
        label="Balance"
        isRequired={true}
        inputChild={
          <input
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotBalance`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-endHoldingSnapshotBalance`}
            type="text"
            value={editingFormData.endHoldingSnapshotBalance || ""}
            onChange={onChange}
            placeholder="0.00"
            className="input w-full"
          />
        }
      />
      <InputFieldSetTemplate
        label="Total Contributions"
        isRequired={true}
        inputChild={
          <input
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-totalContributions`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-totalContributions`}
            type="text"
            value={editingFormData.totalContributions || ""}
            onChange={onChange}
            placeholder="0.00"
            className="input w-full"
          />
        }
      />
      <InputFieldSetTemplate
        label="Total Withdrawals"
        isRequired={true}
        inputChild={
          <input
            id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-totalWithdrawals`}
            name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-totalWithdrawals`}
            type="text"
            value={editingFormData.totalWithdrawals || ""}
            onChange={onChange}
            placeholder="0.00"
            className="input w-full"
          />
        }
      />
    </>
  )
}
