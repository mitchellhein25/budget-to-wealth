import React from 'react'
import { FormState } from '@/app/hooks';
import { HoldingInvestmentReturnForm, HoldingInvestmentReturnFormData, ManualInvestmentReturnForm, ManualInvestmentReturnFormData, INVESTMENT_RETURN_ITEM_NAME_FORM_ID, ManualInvestmentReturn, HoldingInvestmentReturn } from '@/app/net-worth/investment-returns';

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


