import React, { ChangeEventHandler } from 'react'
import FormTemplate from '../../../../FormTemplate';
import UpdateCreateButton from '../../../../buttons/UpdateCreateButton';
import ResetButton from '../../../../buttons/ResetButton';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';
import IncomeEntriesInputs from './IncomeEntriesInputs';

interface IncomeEntriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingIncomeEntry: CashFlowEntry | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
}

export default function IncomeEntriesForm(props : IncomeEntriesFormProps) {

  const formHeader: string = props.editingIncomeEntry?.id ? "Edit Income Entry" : "New Income Entry";

  const inputs: React.ReactElement = 
    <IncomeEntriesInputs
      editingIncomeEntry={props.editingIncomeEntry}
      onChange={props.onChange}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton isUpdateState={props.editingIncomeEntry?.id != null} />
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
