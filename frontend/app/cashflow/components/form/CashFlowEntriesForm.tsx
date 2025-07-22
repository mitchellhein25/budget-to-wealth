import React, { ChangeEventHandler, useState } from 'react'
import FormTemplate from '../../../components/form/FormTemplate';
import UpdateCreateButton from '../../../components/buttons/UpdateCreateButton';
import ResetButton from '../../../components/buttons/ResetButton';
import { CashFlowType } from '../CashFlowType';
import CashFlowEntriesInputs from './CashFlowEntriesInputs';
import { CashFlowEntryFormData } from './CashFlowEntryFormData';
import { FormState } from '@/app/hooks/useForm';
import { CashFlowEntry } from '../CashFlowEntry';

export default function CashFlowEntriesForm({formState, cashFlowType} : {formState: FormState<CashFlowEntry, CashFlowEntryFormData>, cashFlowType: CashFlowType}) {
  
  const [isLoading, setIsLoading] = useState(false);
  const formHeader: string = formState.editingFormData?.id ? `Edit ${cashFlowType} Entry` : `New ${cashFlowType} Entry`;

  const inputs: React.ReactElement = 
    <CashFlowEntriesInputs
      cashFlowType={cashFlowType}
      editingFormData={formState.editingFormData}
      onChange={formState.onChange}
      setIsLoading={setIsLoading}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={formState.editingFormData?.id != null} 
          isDisabled={isLoading || formState.isSubmitting}
        />
        <ResetButton 
          onClick={formState.onReset}
          isHidden={true}
        />
      </>
    )

  return (
    <FormTemplate
      formId={`${cashFlowType.toLowerCase()}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}
