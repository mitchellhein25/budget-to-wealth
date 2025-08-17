import React from 'react'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { InputFieldSetTemplate } from '@/app/components/form/InputFieldSetTemplate'
import { convertDateToISOString } from '@/app/components/Utils'
import { Holding, HOLDING_ITEM_NAME_LOWERCASE_PLURAL } from '../../../../holding-snapshots/holdings/components'
import { HoldingSnapshot, NET_WORTH_ITEM_NAME_LINK } from '../../../../holding-snapshots/components'
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../'
import { HoldingInvestmentReturnFormData } from '.'

interface HoldingInvestmentReturnInputsProps {
  editingFormData: HoldingInvestmentReturnFormData;
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
  const formId = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
  return (
    <>
      <input
        id={`${formId}-id`}
        name={`${formId}-id`}
        readOnly
        type="text"
        value={editingFormData?.id ?? ''}
        hidden={true}
      />
      <InputFieldSetTemplate
        label="Start Snapshot Date"
        isRequired={true}
        inputChild={
          <input
            id={`${formId}-startHoldingSnapshotDate`}
            name={`${formId}-startHoldingSnapshotDate`}
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
            id={`${formId}-startHoldingSnapshotId`}
            name={`${formId}-startHoldingSnapshotId`}
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
              id={`${formId}-endHoldingSnapshotHoldingId`}
              name={`${formId}-endHoldingSnapshotHoldingId`}
              value={editingFormData.endHoldingSnapshotHoldingId || ""}
              onChange={onChange}
              className="select flex-1"
            >
              <option value="" disabled>Pick a holding</option>
              {holdings.map((h) => (
                <option key={h.id} value={h.id}>{`${h.name} ${h.institution ? `- ${h.institution}` : ''} - ${h.holdingCategory?.name} (${h.type})`}</option>
              ))}
            </select>
            <Link href={`/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_ITEM_NAME_LOWERCASE_PLURAL}`} className="btn btn-ghost btn-sm btn-circle" title="Edit Holdings">
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
            id={`${formId}-endHoldingSnapshotDate`}
            name={`${formId}-endHoldingSnapshotDate`}
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
            id={`${formId}-endHoldingSnapshotBalance`}
            name={`${formId}-endHoldingSnapshotBalance`}
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
            id={`${formId}-totalContributions`}
            name={`${formId}-totalContributions`}
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
            id={`${formId}-totalWithdrawals`}
            name={`${formId}-totalWithdrawals`}
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
