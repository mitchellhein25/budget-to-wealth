import React, { useState } from 'react'
import { FormState } from '@/app/hooks';
import { UpdateCreateButton, ResetButton } from '@/app/components/buttons';
import { FormTemplate } from '@/app/components/form';
import { HOLDING_SNAPSHOT_ITEM_NAME, HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID, HoldingSnapshot, HoldingSnapshotInputs, HoldingSnapshotFormData } from '../';

export function HoldingSnapshotForm(
  {formState} : {formState: FormState<HoldingSnapshot, HoldingSnapshotFormData>}
) {
  const [isLoading, setIsLoading] = useState(false);
  const formHeader: string = formState.editingFormData?.id ? `Edit ${HOLDING_SNAPSHOT_ITEM_NAME}` : `New ${HOLDING_SNAPSHOT_ITEM_NAME}`;

  const inputs: React.ReactElement = 
    <HoldingSnapshotInputs
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
      formId={`${HOLDING_SNAPSHOT_ITEM_NAME_FORM_ID}-form`}
      handleSubmit={formState.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      message={formState.message}
    />
  )
}
