import React, { ChangeEventHandler } from 'react'
import FormTemplate from '../../FormTemplate';
import UpdateCreateButton from '../../buttons/UpdateCreateButton';
import ResetButton from '../../buttons/ResetButton';
import { CashFlowEntryFormData } from './CashFlowEntryFormData';
import CashFlowEntriesInputs from './CashFlowEntriesInputs';
import { CashFlowType } from '@/app/lib/models/CashFlow/CashFlowType';

interface CashFlowEntriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingFormData: Partial<CashFlowEntryFormData>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
  cashFlowType: CashFlowType;
}

export default function CashFlowEntriesForm(props : CashFlowEntriesFormProps) {

  const formHeader: string = props.editingFormData?.id ? `Edit ${props.cashFlowType} Entry` : `New ${props.cashFlowType} Entry`;

  const inputs: React.ReactElement = 
    <CashFlowEntriesInputs
      editingFormData={props.editingFormData}
      onChange={props.onChange}
      cashFlowType={props.cashFlowType}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={props.editingFormData?.id != null} 
          isDisabled={props.isLoading || props.isSubmitting}
        />
        <ResetButton 
          onClick={props.onReset}
          isHidden={true}
        />
      </>
    )

  return (
    <FormTemplate
      handleSubmit={props.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      infoMessage={props.infoMessage}
      errorMessage={props.errorMessage}
    />
  )
}
