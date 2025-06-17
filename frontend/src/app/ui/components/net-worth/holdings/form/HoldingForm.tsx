import React, { ChangeEventHandler } from 'react'
import FormTemplate from '../../../form/FormTemplate';
import UpdateCreateButton from '../../../buttons/UpdateCreateButton';
import ResetButton from '../../../buttons/ResetButton';
import { HoldingFormData } from './HoldingFormData';
import HoldingInputs from './HoldingInputs';

interface HoldingFormProps {
  handleSubmit: (formData: FormData) => void;
  editingFormData: Partial<HoldingFormData>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
}

export default function HoldingForm(props : HoldingFormProps) {

  const formHeader: string = props.editingFormData?.id ? `Edit Holding` : `New Holding`;

  const inputs: React.ReactElement = 
    <HoldingInputs
      editingFormData={props.editingFormData}
      onChange={props.onChange}
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
      formId="holding-form"
    />
  )
}
