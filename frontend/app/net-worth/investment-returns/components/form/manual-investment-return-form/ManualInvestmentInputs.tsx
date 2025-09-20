import React from 'react'
import { convertDateToISOString } from '@/app/lib/utils';
import { InputFieldSetTemplate, Category } from '@/app/components'
import { RecurrenceFrequency } from '@/app/cashflow';
import { INVESTMENT_RETURN_ITEM_NAME, INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK, MANUAL_INVESTMENT_RETURN_ITEM_NAME, MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, ManualInvestmentReturnFormData } from '@/app/net-worth/investment-returns';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/holding-snapshots';
import { MANUAL_INVESTMENT_CATEGORIES_LINK } from '@/app/lib/constants/Constants';

interface ManualInvestmentInputsProps {
  editingFormData: Partial<ManualInvestmentReturnFormData>;
  onChange: React.ChangeEventHandler;
  manualCategories: Category[];
}

export function ManualInvestmentInputs({ editingFormData, onChange, manualCategories }: ManualInvestmentInputsProps) {
  const formId = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;
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
        label={`${MANUAL_INVESTMENT_RETURN_ITEM_NAME} Category`}
        isRequired={true}
        inputChild={
          <div className="flex items-center gap-2">
            <select
              id={`${formId}-manualInvestmentCategoryId`}
              name={`${formId}-manualInvestmentCategoryId`}
              value={editingFormData.manualInvestmentCategoryId || ""}
              onChange={onChange}
              className="select w-full"
            >
              <option value="" disabled>Pick a category</option>
              {manualCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Link
              href={`/${NET_WORTH_ITEM_NAME_LINK}/${INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK}/${MANUAL_INVESTMENT_CATEGORIES_LINK}`}
              className="btn btn-ghost btn-sm btn-circle"
              title={`Edit ${MANUAL_INVESTMENT_RETURN_ITEM_NAME} Categories`}
            >
              <Edit size={16} />
            </Link>
          </div>
        }
      />
      < InputFieldSetTemplate
        label="Return Date"
        isRequired={true}
        inputChild={
          < input
            id={`${formId}-manualInvestmentReturnDate`}
            name={`${formId}-manualInvestmentReturnDate`}
            type="date"
            value={
              editingFormData.manualInvestmentReturnDate
                ? convertDateToISOString(new Date(editingFormData.manualInvestmentReturnDate))
                : convertDateToISOString(new Date())
            }
            onChange={onChange}
            className="input w-full"
          />
        }
      />
      < InputFieldSetTemplate
        label="Percentage Return (%)"
        isRequired={true}
        inputChild={
          < input
            id={`${formId}-manualInvestmentPercentageReturn`}
            name={`${formId}-manualInvestmentPercentageReturn`}
            type="number"
            step="0.01"
            value={editingFormData.manualInvestmentPercentageReturn || ""}
            onChange={onChange}
            placeholder="00.00%"
            className="input w-full"
          />
        }
      />
      < InputFieldSetTemplate
        label="Recurrence"
        isRequired={false}
        inputChild={
          < select
            id={`${formId}-manualInvestmentRecurrenceFrequency`}
            name={`${formId}-manualInvestmentRecurrenceFrequency`}
            value={editingFormData.manualInvestmentRecurrenceFrequency || ""}
            onChange={onChange}
            className="select w-full"
          >
            <option value="">No recurrence</option>
            {
              Object.values(RecurrenceFrequency).map((f) => (
                <option key={f} value={f}>{f === RecurrenceFrequency.EVERY_2_WEEKS ? 'Every 2 Weeks' : f}</option>
              ))
            }
          </select >
        }
      />
      {
        editingFormData.manualInvestmentRecurrenceFrequency && (
          <InputFieldSetTemplate
            label="Recurrence End Date"
            isRequired={false}
            inputChild={
              <input
                id={`${formId}-manualInvestmentRecurrenceEndDate`}
                name={`${formId}-manualInvestmentRecurrenceEndDate`}
                type="date"
                value={editingFormData.manualInvestmentRecurrenceEndDate || ""}
                onChange={onChange}
                className="input w-full"
              />
            }
          />
        )
      }
    </>
  )
}
