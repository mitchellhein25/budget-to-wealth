import React, { ChangeEventHandler } from 'react'
import FormTemplate from '../../../components/form/FormTemplate';
import UpdateCreateButton from '../../../components/buttons/UpdateCreateButton';
import ResetButton from '../../../components/buttons/ResetButton';
import { HoldingSnapshotFormData } from './HoldingSnapshotFormData';
import HoldingSnapshotInputs from './HoldingSnapshotInputs';

interface HoldingSnapshotFormProps {
  handleSubmit: (formData: FormData) => void;
  editingFormData: Partial<HoldingSnapshotFormData>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
}

export default function HoldingSnapshotForm(props : HoldingSnapshotFormProps) {

  const formHeader: string = props.editingFormData?.id ? `Edit Holding Snapshot` : `New Holding Snapshot`;

  const inputs: React.ReactElement = 
    <HoldingSnapshotInputs
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
      formId="holding-snapshot-form"
    />
  )
}
