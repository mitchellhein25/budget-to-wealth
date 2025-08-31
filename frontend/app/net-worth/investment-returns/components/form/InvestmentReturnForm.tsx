import React from 'react'
import { HoldingInvestmentReturnForm, HoldingInvestmentReturnFormData } from './holding-investment-return-form';
import { ManualInvestmentReturnForm, ManualInvestmentReturnFormData } from './manual-investment-return-form';
import { FormState } from '@/app/hooks/useForm';
import { INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '.';
import { ManualInvestmentReturn } from '../ManualInvestmentReturn';
import { HoldingInvestmentReturn } from '../HoldingInvestmentReturn';

interface InvestmentReturnFormProps {
  isManualActive: boolean;
  setIsManualActive: React.Dispatch<React.SetStateAction<boolean>>;
  manualInvestmentReturnFormState: FormState<ManualInvestmentReturn, ManualInvestmentReturnFormData>;
  holdingInvestmentReturnFormState: FormState<HoldingInvestmentReturn, HoldingInvestmentReturnFormData>;
}

export function InvestmentReturnForm({ 
  isManualActive, 
  setIsManualActive, 
  manualInvestmentReturnFormState, 
  holdingInvestmentReturnFormState }: InvestmentReturnFormProps) 
{
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          id={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-isManualInvestment`}
          name={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-isManualInvestment`}
          type="checkbox"
          className="checkbox"
          checked={isManualActive}
          onChange={(e) => setIsManualActive(e.target.checked)}
        />
        <label htmlFor={`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-isManualInvestment`}>Is Non-Holding Investment</label>
      </div>
      {isManualActive ? (
        <ManualInvestmentReturnForm formState={manualInvestmentReturnFormState} />
      ) : (
        <HoldingInvestmentReturnForm formState={holdingInvestmentReturnFormState} />
      )}
    </div>
  )
}


